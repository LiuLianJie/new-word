var path = require('path');
var http = require('http');
var request = require('request');
var express = require('express');
var session = require('express-session');
var app = express();
var db = require('mongoskin').db('mongodb://localhost:27017/new-word');


app.set('port',process.env.PORT || 3001);
app.set('views',__dirname + '/static');
app.engine('.html',require('ejs').__express);
app.set('view engine','html');
app.use(express.static(path.join(__dirname,'static')));
app.use(session({
	secret: '12345',
	name: 'new-word',
	cookie: {maxAge: 80000},
	resave: false,
	saveUninitialized: true
}));

app.get('/',function(req,res){
	res.render('index');
});

app.get('/login',function(req,res){
	var username = req.query.username;
	var password = req.query.password;
	var connDoc = {
		username:username,
		password:password
	};
	db.collection('user').find(connDoc).toArray(function(err,result){
		if(err) throw err;
		if(result == null || result.length ==0){
			var result = {'s':0,'m':'username or password is wrong'};
			res.json(JSON.stringify(result));
		}else{
			req.session.userid = username;
			var result = {'s':1,'m':''};
			res.json(JSON.stringify(result));
		}
	});
});

app.get('/register',function(req,res){
	var username = req.query.username;
	var password = req.query.password;
	var connDoc = {
		username:username,
		password:password
	};
	db.collection('user').find(connDoc).toArray(function(err,result){
		if(err) throw err;
		if(result == null || result.length == 0){
			var userDoc = {
				username:username,
				password:password,
				ctime:new Date()
			}
			db.collection('user').insert(userDoc,function(err,result){
				if(err) throw err;
				var data = {s:1,m:'success',d:JSON.stringify(result)};
				res.json(JSON.stringify(data));
			});
		}else{
			var data = {s:0,m:'username exist',d:''};
			res.json(JSON.stringify(data));
		}
	});
	
});

app.get('/words',function(req,res){
	db.collection('words').find().toArray(function(err,result){
		if(err) throw err;
		if(result == null || result.length == 0){
			var data = {s:0,m:'list is empty',d:''};
			res.json(JSON.stringify(data));
		}else{
			var data = {s:1,m:'success',d:result};
			res.json(JSON.stringify(data));
		}
	});
});

app.get('/LookUpWord',function(req,res){
	var word = req.query.word;
	request('https://api.shanbay.com/bdc/search/?word='+word, function (error, response, body) {
		if (!error && response.statusCode == 200) {
	 		var data = {s:1,m:'success',d:body};
			res.json(JSON.stringify(data));
		}
	});
});

app.listen(app.get('port'),function(){
	console.log('server listening on port '+ app.get('port'));
});