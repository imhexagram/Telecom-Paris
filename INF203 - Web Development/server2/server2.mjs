//const express = require("express");
//const morgan = require("morgan");
//const fs = require('fs');
import express from 'express';
import morgan from "morgan";
import fs from "fs";
const port = process.argv[2];
const app  = express();

var db = fs.readFileSync("db.json");
var db_array = JSON.parse(db);

app.use(express.json());
app.listen(port, () => console.log('Example app listening on port'+ port));

app.get('/', (req, res) => res.send('Hi'));

app.get('/kill', function (req, res) {
  res.send("The server will stop now");
  process.exit(0);
  });


app.get('/clean',  (req, res) => {
  db = fs.readFileSync("db.json");
  db_array = JSON.parse(db);
  res.type("text/plain");
  res.send("db.json reloaded");
});

app.get('/papercount', (req, res) => {
  res.type("text/plain");
  res.send((new Number(db_array.length)).toString());
  });

app.get('/authoredby/:name', (req, res)=>{
  var author = req.params.name;
  var count = 0;
  for (const val of db_array){
    if (val.authors.join(" ").includes(author)){count++}
  }
  res.type("text/plain");
  res.send((new Number(count)).toString());
})

app.get('/papersdesc/:name', (req, res)=>{
  var array_descriptor=[];
  var author = req.params.name;
  for (const val of db_array){
    if (val.authors.join(" ").includes(author)){
      array_descriptor.push(val);
    }
  }
  res.type("application/json");
  res.send(JSON.stringify(array_descriptor));
})

app.get('/titles/:name', (req, res)=>{
  var array_title=[];
  var author = req.params.name;
  for (const val of db_array){
    if (val.authors.join(" ").includes(author)){
      array_title.push(val.title);
    }
  }
  res.type("application/json");
  res.send(JSON.stringify(array_title));
})

app.get('/pubref/:key', (req, res)=>{
  var key_id = req.params.key;
  var descriptor={};
  for (const val of db_array){
    if (val.key==key_id){
      descriptor = val;
    }
  }
  if (descriptor!={}){
    res.type("application/json");
    res.send(JSON.stringify(descriptor));
  }
  else {
    res.sendStatus(404);
  }
})

app.delete('/pubref/:key', (req, res)=>{
  var key_id = req.params.key;
  var index = undefined;
  for (var i in db_array){
    if (db_array[i].key==key_id){
      var index=i;
    }
  }
  if (index!=undefined){
    db_array.splice(index, 1)
    res.type("application/json");
    res.send(JSON.stringify(db_array));
  }
  else {
    res.sendStatus(404);
  }
})

app.post('/pubref',(req,res)=>{
  const newPub = req.body;
  newPub.key = 'imaginary';
  db_array.push(newPub);
  res.send("New publication added")
})

app.put('/pubref/:key',(req,res)=>{
  var key = req.params.key;
  var idx = db_array.findIndex((elem)=>elem.key===key);
  if(idx!=-1){
    var newData=req.body;
    db_array[idx]={...db_array[idx],...newData};
    res.type("application/json");
    res.send("${key} updated");
  }else{
    res.sendStatus(404);
  }
})