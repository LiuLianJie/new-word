
var LoginForm = React.createClass({
	getInitialState: function(){
		return {
			username:'ss',
			password:'ss'
		};
	},
	loginhandle: function(){
		var username = React.findDOMNode(this.refs.usernameInput).value;
		var password = React.findDOMNode(this.refs.passwordInput).value;
		var router = this.props.router;
		
		if(!username){
    		alert('用户名不能为空');
    		return;
    	}
    	
    	if(!password){
    		alert('密码不能为空');
    		return;
    	}
		
		$.ajax({
			url:'/login',
			type:'get',
			data:{username:username,password:md5(password)},
			dataType:'json',
			success:function(data){
				console.log(data);
				var res = JSON.parse(data);
				if(res.s){
					router.navigate("",{trigger: true});
				}else{
					alert(res['m']);
				}
			}
		});
	},
	goRegisterHandle: function(){
		var router = this.props.router;
		router.navigate("register",{trigger: true});
	},
	render: function(){
		var username = this.state.username;
		var password = this.state.password;
		return (
			<form className="form-signin">
		        <h2 className="form-signin-heading">请登录</h2>
		        <label for="inputEmail" className="sr-only">请输入邮箱</label>
		        <input ref="usernameInput" type="text" id="inputEmail" className="form-control" placeholder="请输入邮箱"/>
		        <label for="inputPassword" className="sr-only">请输入密码</label>
		        <input ref="passwordInput" type="password" id="inputPassword" className="form-control" placeholder="请输入密码"/>

		        <button className="btn btn-lg btn-primary btn-block" type="button" onClick={this.loginhandle}>登入</button>
		    	<button className="btn btn-lg btn-default btn-block" type="button" onClick={this.goRegisterHandle}>注册</button>
		    </form>
		);
	}
});
/*
React.render(
	<LoginForm />,
	document.getElementById('container')
);
*/
var MainPage = React.createClass({
    render: function(){
        return <div>MainPage</div>;
    }
});

var RegisterForm = React.createClass({
    registerHandle: function(){
    	var username = React.findDOMNode(this.refs.usernameInput).value;
    	var password = React.findDOMNode(this.refs.passwordInput).value;
    	var rePassword = React.findDOMNode(this.refs.rePasswordInput).value;

    	if(!username){
    		alert('用户名不能为空');
    		return;
    	}

    	if(!password){
    		alert('密码不能为空');
    		return;
    	}

    	if(rePassword!==password){
    		alert('两次输入的密码不一致');
    		return;
    	}	

    	$.ajax({
			url:'/register',
			type:'get',
			data:{username:username,password:md5(password)},
			dataType:'json',
			success:function(data){
				var res = JSON.parse(data);
				console.log(Boolean(res.s));

				if(res.s){
					router.navigate("",{trigger: true});
				}else{
					alert(res['m']);
				}
			}
		});
    },
    goLoginHandle: function(){
    	var router = this.props.router;
    	router.navigate('login',{trigger:true});
    },
    render: function(){
        return (
        	<form className="form-register">
		        <h2 className="form-register-heading">请注册</h2>
		        <label for="inputEmail" className="sr-only">请输入邮箱</label>
		        <input ref="usernameInput" type="text" id="inputEmail" className="form-control" placeholder="请输入邮箱"/>
		        <label for="inputPassword" className="sr-only">请输入密码</label>
		        <input ref="passwordInput" type="password" id="inputPassword" className="form-control" placeholder="请输入密码"/>
		        <label for="inputPassword" className="sr-only">重新输入密码</label>
		        <input ref="rePasswordInput" type="password" id="reInputPassword" className="form-control" placeholder="重新输入密码"/>

		        <button className="btn btn-lg btn-primary btn-block" type="button" onClick={this.registerHandle}>注册</button>
		    	<button className="btn btn-lg btn-default btn-block" type="button" onClick={this.goLoginHandle}>登录</button>
		    </form>
        )
    }
});

var InterfaceComponent = React.createClass({
    componentWillMount : function(){
        this.callback = (function(){
            this.forceUpdate();
        }).bind(this);
        this.props.router.on("route", this.callback);
    },
    componentWillUnmount : function(){
        this.props.router.off('route',this.callback);
    },
    render: function(){
    	var router = this.props.router;
        if (router.current == "index") {
            return <MainPage router={router}/>;
        }
        if (router.current == "login") {
            return <LoginForm router={router}/>;
        }
        if (router.current == "register") {
            return <RegisterForm router={router}/>;
        }
        return <div/>
    }
});

var Router = Backbone.Router.extend({
    routes :{
        "" : "index",
        "login" : "login",
        "register": "register"
    },
    index:function(){
        console.log('index');
        this.current = "index";
    },
    login:function(){
        console.log('login');
        this.current = "login";
    },
    register: function(){
    	console.log('register');
        this.current = "register";
    }
});

var router = new Router();

React.render(
    <InterfaceComponent router={router} />,
    document.body
);

Backbone.history.start();