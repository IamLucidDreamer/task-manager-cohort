const taskRoutes = require('express').Router();
let lastTaskId = 0;
const validator = require('../helpers/validator');
const bodyParser = require('body-parser');

const taskData = { "tasks": [] };

taskRoutes.use(bodyParser.urlencoded({ extended: false }));
taskRoutes.use(bodyParser.json());


taskRoutes.get('/:id', (req, res) => {
    let taskIdPassed = req.params.id;
    let result = taskData.tasks.filter(val => val.id == taskIdPassed);
    if (result.length === 0) {
        res.status(404).send({ error: "Task not found", status: 404 });
    }
    else {
        res.status(200).send({ data: result, status: 200 });
    }
});

taskRoutes.post('/create', (req, res) => {
    let taskDetails = req.body;
    taskDetails.id = lastTaskId;
    lastTaskId++;
    const date = new Date();
    taskDetails.creationDate = date.toString();
    if (validator.validateTaskInfo(taskDetails).status) {
        taskData.tasks.push(taskDetails);
        res.status(200);
        res.json(validator.validateTaskInfo(taskDetails));
    } else {
        res.status(400);
        res.json(validator.validateTaskInfo(taskDetails))
    }
});

taskRoutes.get('/get-all', (req, res) => {
    let getTasks = taskData.tasks;
    let completion_flag = true;
    if (req.query.completion != undefined && (req.query.completion == "true" || req.query.completion == "false")) {
        if (req.query.completion == "true") {
            completion_flag = true;
        }
        else {
            completion_flag = false;
        }
        getTasks = getTasks.filter(task => task.completion_flag == completion_flag);
    }
    if (req.query.sortByCreationDate != undefined && req.query.sortByCreationDate == "true") {
        getTasks = getTasks.sort(function (a, b) {
            const date1 = new Date(a.creationDate);
            const date2 = new Date(b.creationDate);
            return date2 - date1;
        });
    }
    res.status(200).send({ data: getTasks, status: 200 });
});


taskRoutes.get('/get-all/priority/:level', (req, res) => {
    let taskPriorityPassed = String(req.params.level);
    if (!validator.isPriority(taskPriorityPassed)) {
        res.status(400).send({ error: "Invalid Priority Type", status: 400 })
    }
    else {
        let result = taskData.tasks.filter(val => val.priority == taskPriorityPassed);
        res.status(200).send({ data: result, status: 200 });
    }

})


taskRoutes.put('/update/:id', (req, res) => {
    let taskDetails = req.body;
    const taskIdPassed = req.params.id;
    if (!validator.isInt(taskIdPassed)) {
        res.status(400).send({ error: "Task Id should be number", status: 400 });
    }
    else if (validator.validateTaskInfo(taskDetails).status) {
        let result = taskData.tasks.filter(val => val.id == taskIdPassed);
        if (result.length === 0) {
            res.status(404).send({ error: "Task not found", status: 404 });
        }
        else {
            for (let task of taskData.tasks) {
                if (task.id == taskIdPassed) {
                    task.title = taskDetails.title;
                    task.description = taskDetails.description;
                    task.completion_flag = taskDetails.completion_flag;
                    task.priority = taskDetails.priority;
                    break;
                }
            }
            res.status(200).send({ message: "Task updated successfully", status: 200 });
        }
    }
    else {
        res.status(400).json({ error: validator.validateTaskInfo(taskDetails), status: 400 })
    }
});

taskRoutes.delete('/delete/:id', (req, res) => {
    const taskIdPassed = req.params.id;
    if (!validator.isInt(taskIdPassed)) {
        res.status(400).send({ error: "Task Id should be number", status: 400 });
    }
    else {
        let result = taskData.tasks.filter(val => val.id == taskIdPassed);
        if (Object.keys(result).length === 0) {
            res.status(404).send({ error: "Task not found", status: 404 });
        }
        else {
            let tasks = taskData.tasks;
            tasks = tasks.filter(task => task.id != taskIdPassed);
            taskData.tasks = tasks;
            res.status(200).send({ message: "Task deleted successfully", status: 200 });
        }
    }
});

module.exports = taskRoutes;