var express = require('express');
var ejs = require('ejs');
var path = require('path');
var mongoose = require('mongoose');



var app = express();
app.set('port',process.env.PORT || 3001);
app.set('views',__dirname + '/static');
app.engine('.html',ejs.__express);
app.set('view engine','html');
app.use(express.static(path.join(__dirname,'static')));

var db = mongoose.createConnection('mongodb://127.0.0.1:27017/NodeJS');
db.on('error',function(error){
	console.log(error);
});

var mongooseSchema = new mongoose.Schema({
    username : {type : String, default : '匿名用户'},
    title    : {type : String},
    content  : {type : String},
    time     : {type : Date, default: Date.now},
    age      : {type : Number}
});
var mongooseModel = db.model('mongoose', mongooseSchema);

app.get('/',function(req,res){
	res.render('index');
});

app.get('/login',function(req,res){
	console.log(req.query);
	var doc = {username : 'emtity_demo_username', title : 'emtity_demo_title', content : 'emtity_demo_content'};
	var mongooseEntity = new mongooseModel(doc);
	mongooseEntity.save(function(error) {
	    if(error) {
	        console.log(error);
	    } else {
	        console.log('saved OK!');
	    }
	    // 关闭数据库链接
	    db.close();
	});
	res.json({'s':1});
});

app.listen(app.get('port'),function(){
	console.log('server listening on port '+ app.get('port'));
});