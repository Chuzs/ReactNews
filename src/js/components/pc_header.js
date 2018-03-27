import React from 'react';
import {Row, Col} from 'antd';
import {Menu, Icon, Tabs, message, Form, Input, Button, Checkbox, Modal,Tooltip} from 'antd';
import {BrowserRouter as Router, Route,Link} from 'react-router-dom';
const FormItem = Form.Item;
const SubMenu = Menu.SubMenu;
const TabPane = Tabs.TabPane;
const MenuItemGroup = Menu.ItemGroup;

class PCHeader extends React.Component {
	constructor() {
		super();
		this.state = {
			current: 'top',
			modalVisible: false,
			action: 'login',
			hasLogined: false,
			userNickName: '',
			userid: 0
		};
	};
	componentWillMount(){
		if (localStorage.userid != '') {
			this.setState({hasLogined:true});
			this.setState({userNickName:localStorage.userNickName,userid:localStorage.userid});
		}
	};
	setModalVisible(value){
		this.setState({ modalVisible: value });
	};
	handleClick(e){
		if(e.key === "register"){
			this.setState({current: 'register'});
			this.setModalVisible(true);
		}else {
			this.setState({current: e.key});
		}
	};
  handleSubmit(e) {
		//页面开始向 API 进行提交数据
		e.preventDefault();
		let myFetchOptions = {
				method: 'GET'
		};
		//获取页面表单数据
		let formData= this.props.form.getFieldsValue();
		//向API提交数据
		fetch("http://newsapi.gugujiankong.com/Handler.ashx?action=" + this.state.action
		+ "&username=" + formData.userName + "&password=" + formData.password
		+ "&r_userName=" + formData.r_userName + "&r_password="+ formData.r_password 
		+ "&r_confirmPassword="+ formData.r_confirmPassword, myFetchOptions)
		.then(response => response.json())
		.then(json => {
			// console.log(json);
			this.setState({userNickName: json.NickUserName, userid: json.UserId});
			localStorage.userid= json.UserId;
			localStorage.userNickName = json.NickUserName;
		});
		if (this.state.action=="login") {
			this.setState({hasLogined:true});
		}
			message.success("请求成功！");
			this.setModalVisible(false);
    };
    callback(key) {
			if (key == 1) {
				this.setState({action: 'login'});
			} else if (key == 2) {
				this.setState({action: 'register'});
			}
	};
	logout(){
		localStorage.userid= '';
		localStorage.userNickName = '';
		this.setState({hasLogined:false});
	};
	render() {
       const { getFieldDecorator } = this.props.form;
	    // const { autoCompleteResult } = this.state;

	    const formItemLayout = {
	      labelCol: {
	        xs: { span: 24 },
	        sm: { span: 6 },
	      },
	      wrapperCol: {
	        xs: { span: 24 },
	        sm: { span: 14 },
	      },
	    };
		const userShow = this.state.hasLogined
			? <Menu.Item key="logout" class="register">
				<Router>
					<div>
						<Button type="primary" htmltype="button">{this.state.userNickName}</Button>
						&nbsp;&nbsp;
					
						<Link to="/user">
							<Button type="dashed" htmlType="button">个人中心</Button>
						</Link>
						&nbsp;&nbsp;
						<Link to="/">
							<Button type="ghost" htmlType="button" onClick={this.logout.bind(this)}>退出</Button>
						</Link>
					</div>
				</Router>
			</Menu.Item>
			: <Menu.Item key="register" class="register">
				<Icon type="appstore"/>注册/登录
			</Menu.Item>
 		return (
			<header>
				<Row>
					<Col span={2}> </Col>

					<Col span={4}>
						<a herf="/" class="logo">
							<img src="./src/images/logo.png" alt="logo"/>
							<span>ReactNews</span>
						</a>
					</Col>
					<Col span={16}>
						<Menu mode="horizontal" selectedKeys={[this.state.current]} onClick={this.handleClick.bind(this)}>
							<Menu.Item key="top">
								<Icon type="appstore"/>头条
							</Menu.Item>
							<Menu.Item key="shehui">
								<Icon type="appstore"/>社会
							</Menu.Item>
							<Menu.Item key="guonei">
								<Icon type="appstore"/>国内
							</Menu.Item>
							<Menu.Item key="guoji">
								<Icon type="appstore"/>国际
							</Menu.Item>
							<Menu.Item key="yule">
								<Icon type="appstore"/>娱乐
							</Menu.Item>
							<Menu.Item key="tiyu">
								<Icon type="appstore"/>体育
							</Menu.Item>
							<Menu.Item key="keji">
								<Icon type="appstore"/>科技
							</Menu.Item>
							{userShow}
						</Menu>
						<Modal title="用户中心" wrapClassName="vertical-center-modal" visible={this.state.modalVisible} onCancel={()=>this.setModalVisible(false)
						} onOk={() => this.setModalVisible(false)} okText = "关闭">
							<Tabs type="card" onChange={this.callback.bind(this)}>
								<TabPane tab="登录" key="1" >
									<Form onSubmit={this.handleSubmit.bind(this)}>
										<FormItem label="账户" {...formItemLayout}>
											{getFieldDecorator('userName', {
            									rules: [{ required: true, message: 'Please input your username!' }],
          									})(
            									<Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Username" />
          									)}
										</FormItem>
										<FormItem label="密码" {...formItemLayout}>
											{getFieldDecorator('password', {
									            rules: [{ required: true, message: 'Please input your Password!' }],
									          })(
									            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />
									          )}
										</FormItem>
										<Row>
											<Col span={6}> </Col>
											<Col span={4}>
												<Button type="primary" htmlType="submit">登录</Button>
											</Col>
										</Row>
										
									</Form>
								</TabPane>
								<TabPane tab="注册" key="2">
									<Form onSubmit={this.handleSubmit.bind(this)}>
										  <FormItem {...formItemLayout} label="账户" hasFeedback>
								          {getFieldDecorator('r_username', {
								            rules: [{ required: true, message: 'Please input your nickname!', whitespace: true }],
								          })(
								            <Input type="text" />
								          )}
								        </FormItem>
										 <FormItem
								          {...formItemLayout}
								          label="密码"
								          hasFeedback
								        >
								          {getFieldDecorator('r_password', {
								            rules: [{
								              required: true, message: 'Please input your password!',
								            }, {
								              validator: this.checkConfirm,
								            }],
								          })(
								            <Input type="password" />
								          )}
								        </FormItem>
								        <FormItem
								          {...formItemLayout}
								          label="确认密码"
								          hasFeedback
								        >
								          {getFieldDecorator('r_comfirmPassword', {
								            rules: [{
								              required: true, message: 'Please confirm your password!',
								            }, {
								              validator: this.checkPassword,
								            }],
								          })(
								            <Input type="password" onBlur={this.handleConfirmBlur} />
								          )}
								        </FormItem>
								        <Row>
											<Col span={6}> </Col>
											<Col span={4}>
												<Button type="primary" htmlType="submit">注册</Button>
											</Col>
										</Row>
									</Form>
								</TabPane>
							</Tabs>
						</Modal>
					</Col>
					

				</Row>
			</header>



		);
	};
}
export default PCHeader = Form.create()(PCHeader);