const { TouchBarSlider } = require('electron');
const sqlite3 = require('sqlite3');

class DBManagement {
    #SQLiteObj

    constructor () {
        this.#SQLiteObj = new sqlite3.Database('./tasks.db', err=> {
            if (err) {
                console.log("Could not connect to database", err);
            }else {
                console.log("connected to database");
            }
        });
        this.makeSureTableIsPresent();
    }

    async makeSureTableIsPresent () {
        const query = `
            CREATE TABLE IF NOT EXISTS TASKS (
                taskID INTEGER PRIMARY KEY AUTOINCREMENT,
                taskTitle TEXT NOT NULL,
                taskTime TEXT NOT NULL,
                taskStatus INTEGER DEFAULT 0
            )
        `;
        try {
            await this.#SQLiteObj.run(query, [], err=>{
                if (err) {
                    console.log(`error when trying to make sure database table is present ${err}`);
                }else {
                    console.log("created table for database");
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    getTask(taskID){
        const query = `SELECt * FROM TASKS WHERE taskID=?`;
        this.#SQLiteObj.run(query, [taskID], (err, row)=>  {
            if (err) {
                console.log(`Error occured when getting Task info for item ID ${taskID}, ${err}`);
            }else {
                return row;
            }
        })
        return false;
    }

    insertTask (taskObj) {
        const query = `INSERT INTO TASKS (taskTitle, taskTime) VALUES (?, ?)`;
        this.#SQLiteObj.run(query, [taskObj.getTitle(), taskObj.getTime()], err=> {
            if (err) {
                console.log(`could not insert task info into database, ${err}`);
            }else {
                console.log("succesfully inserted task into database");
                return true;
            }
            return false;
        })
    }

    updateTaskInfo(taskID, taskNewTitle, taskNewTime) {
        const query = `UPDATE TASKS SET taskTitle=?, taskTime=? WHERE taskID=?)`;
        this.#SQLiteObj.run(query, [taskNewTitle, taskNewTime, taskID], err=> {
            if (err) {
                console.log(`could not insert task info into database, ${err}`);
            }else {
                console.log("succesfully updated task info in database.");
                return true;
            }
            return false;
        })
    }

    deleteTask(taskID) {
        const query = `DELETE FROM TASKS WHERE taskID=?)`;
        this.#SQLiteObj.run(query, [taskID], err=> {
            if (err) {
                console.log(`could not delete task from database, ${err}`);
            }else {
                console.log("succesfully deleted task from database.");
                return true;
            }
            return false;
        })
    }
}

module.exports= {DBManagement}