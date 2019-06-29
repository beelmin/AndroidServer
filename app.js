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
		    
		    var query = { "username": req.body.username, "password": req.body.password};
		    console.log(query)
		    const collection = client.db("android_baza").collection("korisnici");
		    collection.find(query).toArray(function(err, result) {
			    if (err) throw err;
			    
			    if(result.length == 0){
			    	response = {success: false}
			    	res.send(response);
			    }
			    else{


			    	const instance2 = new MongoClient(uri, { useNewUrlParser: true });
						instance2.connect((err, client) => {
						  if (err){
						  	console.log('failed to connect')
						  	console.log(err)
						  } 
					  		else {
				    
				    		const collection2 = client.db("android_baza").collection("korisnici");

		  					var query = { "username": req.body.username };
		  					var newvalues = { $set: {online: true} };
			    	
							collection2.updateOne(query,newvalues, function(err, result) {
						
								if (err) throw(err)
						

								if(result){
									response = {success: true}
								}else{
									response = {success : false}
								}
					
								res.send(response);

					
							});
					     
				    		instance2.close()
				        
				  		}
				 		});

			    }
			    
			    
			  });
		    		 
		    instance.close()
		        
		  }
		 });
	}else if(req.body.logout){
		const instance2 = new MongoClient(uri, { useNewUrlParser: true });
		instance2.connect((err, client) => {
		if (err){
			console.log('failed to connect')
			console.log(err)
		} 
		else {
				    
		const collection2 = client.db("android_baza").collection("korisnici");

		var query = { "username": req.body.username };
		var newvalues = { $set: {online: false} };
			    	
		collection2.updateOne(query,newvalues, function(err, result) {
						
			if (err) throw(err)
						
			if(result){
				response = {success: true}
			}else{
				response = {success : false}
			}
					
			res.send(response);

					
		});
					     
		instance2.close()
				        
		}
		});
		
	
	}

});

app.get('/chat', function (req, res,next) {

		const instance = new MongoClient(uri, { useNewUrlParser: true });
		instance.connect((err, client) => {
		  if (err){
			console.log('failed to connect')
			console.log(err)
		  } 
		  else {
		    console.log('connected')
		    const collection = client.db("android_baza").collection(req.query.kolekcija).find({}).toArray(function(err, result) {
			    if (err) throw err;

			    instance.close();
			    res.send(result);

			  });

		  }
		 });
	
});


app.post('/chat', function(req, res, next) {
	
	if(req.body.saveMess){
		
		var newMessage = {
			
			sender: req.body.sender,
			message : req.body.message,
			time : req.body.time
	  };
		
	const instance = new MongoClient(uri, { useNewUrlParser: true });
	instance.connect((err, client) => {
	  if (err){
		console.log('failed to connect')
		console.log(err)
	  } 
	  else {
	    console.log('connected')
	    const collection = client.db("android_baza").collection(req.body.collectionName)
	    collection.insertOne(newMessage);
	    instance.close()

	  }
	 });
		
	res.send({success: true});
		
	}
  	   
});




app.listen(port, function () {
  console.log('Example app listening on port 3000!');
});
