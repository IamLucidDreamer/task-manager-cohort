class validator {
    static validateTaskInfo(taskInfo) {
      if(taskInfo.hasOwnProperty("title") &&
      taskInfo.hasOwnProperty("description") &&
      taskInfo.hasOwnProperty("completion_flag") &&
      taskInfo.hasOwnProperty("priority")) {
        if(typeof taskInfo.completion_flag === 'boolean' && 
        this.isNonEmptyString(taskInfo.title) && 
        this.isNonEmptyString(taskInfo.description) &&
        this.isPriority(taskInfo.priority) ){
          return {
            "status": true,
            "message": "Task has been added"
          };
        }
        else{
            return {
                "status": false,
                "message": "Ensure Task Completion Status is Boolean, Title and Description are not empty and Priority is one of [Low,Medium,High]"
              }
        }
        }
        return {
          "status": false,
          "message": "Ensure Task has Title, Description, Completion Status and Priority"
        }
    }
    static isNonEmptyString(str) {
        return (str && str.length !== 0 );
    }
    static isPriority(str){
        const priorities = ["Low","Medium","High"];
        return (str && priorities.includes(str));   
    }
    static isInt(value) {
      return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value))
    }
  }
  
  module.exports = validator;