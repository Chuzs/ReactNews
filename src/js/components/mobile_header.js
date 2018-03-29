import React from 'react';
import {Row, Col} from 'antd';
import {
    Menu,
    Icon,
    Tabs,
    message,
    Form,
    Input,
    Button,
    CheckBox,
    Modal
} from 'antd';
import {BrowserRouter as Router, Route,Link} from 'react-router-dom';

const FormItem = Form.Item;
const SubMenu = Menu.SubMenu;
const TabPane = Tabs.TabPane;
const MenuItemGroup = Menu.ItemGroup;
class MobileHeader extends React.Component {
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
    setModalVisible(value)
    {
        this.setState({modalVisible: value});
    };
    /**
     * 
     * 
     * @param {any} e 
     * @memberof MobileHeader
     */
    handleClick(e) {
        if (e.key = "register") {
            this.setState({current: 'register'});
            this.setModalVisible(true);
        } else {
            {
                this.setState({current: e.key});
            }
        }
    };
    handleSubmit(e)
    {
        //页面开始向 API 进行提交数据
        e.preventDefault();
        var myFetchOptions = {
            method: 'GET'
        };
        var formData= this.props.form.getFieldsValue();
        console.log(formData);
        fetch("http://newsapi.gugujiankong.com/Handler.ashx?action=" + this.state.action
        + "&username="+formData.userName+"&password="+formData.password
        +"&r_userName=" + formData.r_userName + "&r_password="
        + formData.r_password + "&r_confirmPassword="
        + formData.r_confirmPassword, myFetchOptions)
        .then(response => response.json())
        .then(json => {
            this.setState({userNickName: json.NickUserName, userid: json.UserId});
        });
        if (this.state.action=="login") {
            this.setState({hasLogined:true});
        }
        message.success("请求成功！");
        this.setModalVisible(false);
    };

    login(){
        this.setModalVisible(true);
    };

    callback(key) {
        if (key == 1) {
            this.setState({action: 'login'});
        } else if (key == 2) {
            this.setState({action: 'register'});
        }
    };
	render() {
        let {getFieldDecorator} = this.props.form;
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
        const userShow = this.state.hasLogined ?
            <Router>
                <Link to={`/usercenter`}>
                    <Icon type="inbox"/>
                </Link>
            </Router>
            :
			<Icon type="setting" onClick={this.login.bind(this)}/>
		return (
			<div id="mobileheader">
				<header>
					<img src="./src/images/logo.png" alt="logo"/>
					<span>ReactNews</span>
                    {userShow}
				</header>
				<Modal title="用户中心" wrapClassName="vertical-center-modal" visible={this.state.modalVisible} onCancel= {()=>this.setModalVisible(false)} onOk={() => this.setModalVisible(false)} okText = "关闭">
					<Tabs type="card" onChange={this.callback.bind(this)}>
                        <TabPane tab="登录" key="1">
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
                                <Button type="primary" htmlType="submit">登录</Button>

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
								<Button type="primary" htmlType="submit" >注册</Button>
							</Form>
						</TabPane>
					</Tabs>
				</Modal>
			</div>
		);
	};
}
export default MobileHeader = Form.create({})(MobileHeader);