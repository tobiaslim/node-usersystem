
var express = require('express')
var app = express();
var assert = require('assert')
var bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://mongo-wtf/'
var port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/register', function(request, response){
    let firstName = request.body.firstName;
    let lastName = request.body.lastName;
    let email = request.body.email;
    let password = request.body.password;

    MongoClient.connect(url,{ useNewUrlParser: true }, function(err, client) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        let user = {
          firstName: firstName,
          lastName: lastName,
          password: password,
          email:email
        }
        dbName = "heroku_4sc2flcb";
        const db = client.db(dbName);
        db.collection("user").insertOne(user, function(err,res){
          if(err){
            response.status(500).json({"error":"Something went wrong"});
          }
          else{
            response.status(201).json({"message":"User created"});
          }
        })
        client.close();
      });

});

app.get('/users',function(request, response){
  MongoClient.connect(url,{ useNewUrlParser: true }, function(err, client) {
    assert.equal(null, err);
    dbName = "heroku_4sc2flcb";
    const db = client.db(dbName);
    db.collection("user").find({}).toArray(function(error,results){
      console.log(results);
      response.status(200).json(results);
    });

    client.close();
  });
});

app.listen(port);