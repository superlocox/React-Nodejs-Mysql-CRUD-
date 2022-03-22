

const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { validateToken } = require("./AuthMiddleware");
const { sign } = require("jsonwebtoken");

app.use(cors());
app.use(express.json());

app.listen(3001, () => {
    console.log(`Server is starting on port 3001}`);
});

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "password",
  database: "react_crud"
});

app.post('/addtask', (req,res) =>{
  const task = req.body.task;
  const user_id = req.body.user_id;
  db.query('INSERT INTO tasks (task,id_user) VALUES (?,?)',[task,user_id],(err, result)=>{
    if(err){
      console.log(err)
    }else{
      res.send('Task Added');
    }
  });

});

app.post('/getTodos', (req,res) =>{

  const user_id = req.body.user_id;
  console.log(user_id);
  db.query('SELECT * FROM tasks where id_user=?',[user_id],(err, result)=>{
    if(err){
      console.log(err)
    }else{
      console.log(result);
      res.send(result);
    }
  });

});

app.delete("/deletetask/:id", (req,res)=>{

      const id = req.params;
      db.query('DELETE FROM tasks WHERE id=?',[id],(err, result)=>{
        if(err){
          console.log(err)
        }else{
          console.log(result);
          res.send(result);
        }
      });

      // res.json('Se borro');

});

app.put("/edittask", (req,res)=>{

  const id = req.body.id;
  const task = req.body.task;
  db.query('UPDATE tasks SET  task=? WHERE id=?',[task,id],(err, result)=>{
    if(err){
      console.log(err)
    }else{
      console.log(result);
      res.send(result);
    }
  });

  // res.json('Se borro');

});

app.post("/registration", async (req, res) => {
  const { username, password } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    db.query('INSERT INTO users (user,password) VALUES (?,?)',[username,hash],(err, result)=>{
      if(err){
        console.log(err)
      }else{
        res.send('Task Added');
      }
    });
  });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM users where user=?',username,(err,result)=>{
    if(err){
      console.log('No existe usuario');
    }else{
      console.log(result[0].password);
      bcrypt.compare(password, result[0].password).then(async (match) => {
        if (!match) res.json({ error: "Wrong Username And Password Combination" });
    
        const accessToken = sign(
          { username: result[0].username, id: result[0].id },
          "importantsecret"
        );
        res.json({ token: accessToken, username: result[0].user, id: result[0].id });
      });
    }
  });

});

app.get("/auth", validateToken, (req, res) => {
  res.json(req.user);
});

  
  
  