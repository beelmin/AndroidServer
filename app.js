var express = require('express');
var bodyParser = require("body-parser");
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:admin@cluster0-bkyd9.mongodb.net/test?retryWrites=true&w=majority";


var app = express();

const port=process.env.PORT || 3000
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res,next) {

	const instance = new MongoClient(uri, { useNewUrlParser: true });
	instance.connect((err, client) => {
	  if (err){
	  	console.log('failed to connect')
	  	console.log(err)
	  } 
	  else {
	    console.log('connected')
	    const collection = client.db("android_baza").collection("korisnici").find({}).toArray(function(err, result) {
		    if (err) throw err;
		    
		    instance.close();
		    res.send(result);
		    
		  });
	    
	  }
	 });
	
});

app.post('/', function(req, res, next) {
	if(req.body.authentication){
		
  		const instance = new MongoClient(uri, { useNewUrlParser: true });
		instance.connect((err, client) => {
		  if (err){
		  	console.log('failed to connect')
		  	console.log(err)
		  } 
		  else {
		    
		    var query = { "username": req.body.username};
		    console.log(query)
		    const collection = client.db("android_baza").collection("korisnici");
		    collection.find(query).toArray(function(err, result) {
			    if (err) throw err;
			    
			    if(result.length == 0){
			    	response = {success: false}
			    }
			    else{
			    	response = {success: true}
			    }
			    res.send(response);
			    
			  });
		    		 
		    instance.close()
		        
		  }
		 });

		

	}

});




app.listen(port, function () {
  console.log('Example app listening on port 3000!');
});
