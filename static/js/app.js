var LoginForm = React.createClass({
	render: function(){
		return (
			<form className="form-signin">
		        <h2 className="form-signin-heading">请登录</h2>
		        <label for="inputEmail" className="sr-only">请输入邮箱</label>
		        <input type="email" id="inputEmail" className="form-control" placeholder="请输入邮箱" />
		        <label for="inputPassword" className="sr-only">请输入密码</label>
		        <input type="password" id="inputPassword" className="form-control" placeholder="请输入密码" />

		        <button className="btn btn-lg btn-primary btn-block" type="submit">登入</button>
		    </form>
		);
	}
});

React.render(
	<LoginForm />,
	document.getElementById('container')
);