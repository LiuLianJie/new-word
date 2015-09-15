var AppRouter = Backbone.Router.extend({
	routes:{
		'':'index',
		'login':'login'
	},
	index: function(){
		console.log('index');
	},
	login: function(){
		console.log('login');
	}
});