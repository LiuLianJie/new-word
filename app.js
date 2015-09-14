var express = require('express');
var ejs = require('ejs');
var path = require('path');

var app = express();
app.set('port',process.env.PORT || 3001);
app.set('views',__dirname + '/static');
app.engine('.html',ejs.__express);
app.set('view engine','html');
app.use(express.static(path.join(__dirname,'static')));

app.get('/',function(req,res){
	res.render('index');
});

app.listen(app.get('port'),function(){
	console.log('server listening on port '+ app.get('port'));
});