const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const routes = express.Router()
const tasks = require("./src/routes/tasks")


const app = express()
app.use(cors())
app.use(routes)
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

const PORT = 3000

routes.get("/", (req, res) => {
    res.status(200).send("Hey this is my task manager API")
})

routes.use("/tasks", tasks)

app.listen(PORT, (error) => {
    if (!error)
        console.log("Server is Running and App is Live on Port :", PORT);
    else
        console.log("Error:", err
        );
})