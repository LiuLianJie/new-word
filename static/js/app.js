
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

var BootstrapModal = React.createClass({
  // The following two methods are the only places we need to
  // integrate Bootstrap or jQuery with the components lifecycle methods.
  componentDidMount: function() {
    // When the component is added, turn it into a modal
    $(React.findDOMNode(this))
      .modal({backdrop: 'static', keyboard: false, show: false});
  },
  componentWillUnmount: function() {
    $(React.findDOMNode(this)).off('hidden', this.handleHidden);
  },
  close: function() {
    $(React.findDOMNode(this)).modal('hide');
  },
  open: function() {
    $(React.findDOMNode(this)).modal('show');
  },
  render: function() {
    var confirmButton = null;
    var cancelButton = null;

    return (
      <div className="modal fade">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="close"
                onClick={this.handleCancel}>
                &times;
              </button>
              <h3>{this.props.title}</h3>
            </div>
            <div className="modal-body">
              {this.props.children}
            </div>
            <div className="modal-footer">
              {cancelButton}
              {confirmButton}
            </div>
          </div>
        </div>
      </div>
    );
  },
  handleCancel: function() {
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  },
  handleConfirm: function() {
    if (this.props.onConfirm) {
      this.props.onConfirm();
    }
  }
});

var NavSearchBar = React.createClass({
    getInitialState: function(){
        return {
            wordDetail:{}
        }
    },
    searchHandle: function(){
        this.refs.modal.open();

        var mainpage = this.props.mainpage;
        var search = React.findDOMNode(this.refs.searchInput).value;
        if(!search){
            alert('不能为空');
            return;
        }

        $.ajax({
            url:'/LookUpWord',
            type:'get',
            data:{word:search},
            dataType:'json',
            success:function(data){
                var res = JSON.parse(data);
                var resd = JSON.parse(res.d);
                console.log(resd);
                this.setState({wordDetail:resd.data});
            }.bind(this)
        });

    },
    handleCancel: function() {
        this.refs.modal.close();
    },
    addHandle: function(){
        console.log('addHandle');
        var mainpage = this.props.mainpage;
        
        $.ajax({
            url:'/addWord',
            type:'get',
            data:{word:this.state.wordDetail.content,sentence:'sss'},
            dataType:'json',
            success:function(data){
                var res = JSON.parse(data);
                console.log(JSON.parse(res.d)[0]);
                var newwords = mainpage.state.wordlist.concat(JSON.parse(res.d));
                mainpage.setState({wordlist:newwords});
                this.refs.modal.close();
            }.bind(this)
        });
    },
    soundHandle: function(){
        console.log('soundHandle');
        var wordSound = React.findDOMNode(this.refs.wordSound);
        wordSound.play();
    },
    render: function(){
        var modal = null;
        modal = (
          <BootstrapModal
            ref="modal"
            confirm="OK"
            cancel="Cancel"
            onCancel={this.handleCancel}
            onConfirm={this.closeModal}
            title={this.state.wordDetail.content}>
              <audio ref="wordSound" src={this.state.wordDetail.us_audio}></audio>
              <button type="button" className="btn btn-default btn-xs" aria-label="Left Align" onClick={this.addHandle}>
                  <span className="glyphicon glyphicon-plus-sign" aria-hidden="true"></span>
              </button>

              <p>[{this.state.wordDetail.pronunciation}]</p>
              <button type="button" className="btn btn-default btn-xs" aria-label="Left Align" onClick={this.soundHandle}>
                  <span className="glyphicon glyphicon-volume-up" aria-hidden="true"></span>
              </button>
              <p>{this.state.wordDetail.definition}</p>
          </BootstrapModal>
        );
        return (
            <form className="navbar-form navbar-right" >
                <div className="form-group">
                    <input ref="searchInput" type="text" className="form-control" placeholder="搜索单词"/>
                </div>
                <button type="button" className="btn btn-default" onClick={this.searchHandle}>搜索</button>
                {modal}
            </form>
        );
    },
    openModal: function() {
        this.refs.modal.open();
    },
    closeModal: function() {
        this.refs.modal.close();
    }
});

var NavHeader = React.createClass({
    logout: function(){
        $.ajax({
            url:'/logout',
            type:'get',
            dataType:'json',
            success:function(data){
                var res = JSON.parse(data);
                if(res.s){
                    this.props.mainpage.props.router.navigate("login",{trigger:true});
                }else{
                    alert(res['m']);
                }
            }.bind(this)
        });

        router.navigate("",{trigger: true});
    },
    render: function(){
        return (
            <nav className="navbar navbar-inverse">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <a className="navbar-brand" href="#">
                            smallfish words
                        </a>
                        <NavSearchBar mainpage={this.props.mainpage}/>
                        <button type="button" className="btn btn-default navbar-btn navbar-right pull-right" onClick={this.logout}>退出</button>
                    </div>
                </div>
            </nav>
        );
    }
});

var WordItem = React.createClass({
    render: function(){
        return(
            <div>
                <h2>{this.props.word}</h2>
                <p>{this.props.sentence}</p>
                <hr/>
            </div>
        );
    }
})

var WordList = React.createClass({
    render: function(){
        var wordlistNode = null;
        var wordlist = this.props.wordlist;
        if(wordlist!=null || wordlist.length >0){
            wordlistNode = wordlist.map(function(word){
                return (
                    <WordItem word={word.word} sentence={word.sentence}/>
                )
            });
        }else{
            wordlistNode = function(){ return( <div>loading...</div> )}
        }

        return(
            <div className="col-md-8 col-md-offset-2">
                {wordlistNode}
            </div>
        );
    }
});

var MainPage = React.createClass({
    getInitialState: function(){
        return {
            wordlist:[]
        };
    },
    componentDidMount: function(){
        $.ajax({
            url:'/words',
            type:'get',
            dataType:'json',
            success:function(data){
                var res = JSON.parse(data);
                console.log(res);
                if(res.s){
                    this.setState({wordlist:res.d});
                }else{
                    alert(res['m']);
                }
            }.bind(this)
        });
    },
    render: function(){
        return (
            <div>
                <NavHeader mainpage={this} />
                <WordList wordlist={this.state.wordlist}/>
            </div>
        );
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