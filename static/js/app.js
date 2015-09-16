'use strict';

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
		$.ajax({
			url:'/login',
			type:'get',
			data:{username:username,password:password},
			dataType:'json',
			success:function(data){
				console.log(data);
				var res = JSON.parse(data);
				if(res.s){
					alert('登录');
				}else{
					alert(res['m']);
				}
			}
		});
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
		    </form>
		);
	}
});

React.render(
	<LoginForm />,
	document.getElementById('container')
);