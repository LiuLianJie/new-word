var path = require('path');
var express = require('express');
var app = express();
var db = require('mongoskin').db('mongodb://localhost:27017/new-word');


app.set('port',process.env.PORT || 3001);
app.set('views',__dirname + '/static');
app.engine('.html',require('ejs').__express);
app.set('view engine','html');
app.use(express.static(path.join(__dirname,'static')));


app.get('/',function(req,res){
	res.render('index');
});

app.get('/login',function(req,res){
	db.collection('user').find({username:req.query.username,password:req.query.password}).toArray(function(err,result){
		if(err) throw err;
		if(result == null || result.length ==0){
			var result = {'s':0,'m':'username or password is wrong'};
			res.json(JSON.stringify(result));
		}else{
			var result = {'s':1,'m':''};
			res.json(JSON.stringify(result));
		}
	});
});

app.listen(app.get('port'),function(){
	console.log('server listening on port '+ app.get('port'));
});