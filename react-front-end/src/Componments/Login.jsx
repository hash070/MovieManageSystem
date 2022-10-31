import {Button, Checkbox, Form, Input, Col, Row, message} from 'antd';
import axios from 'axios';
import {React, Fragment} from 'react';
import {Link, Navigate, NavLink, useNavigate} from 'react-router-dom';
import '../styles/Login.css';
import {LockOutlined, UserOutlined, CheckCircleOutlined} from '@ant-design/icons';


const LoginForm = () => {
    const navigate = useNavigate();

    //登录表单提交方法
    const onFinish = (values) => {
        console.log('发送登录请求体:', values);

        axios.post('/api/user/login', values)
            .then(res => {
                console.log('收到服务端返回信息', res.data);

                console.log('res.data类型为', typeof res.data)

                //获取登录后的返回信息
                let success = res.data.success
                let error_message = res.data.errorMsg
                let token = res.data.data

                console.log('错误信息', error_message)

                //如果登录成功，则弹出登录成功的提示框，然后将Token放到本地
                if (success) {
                   successMSG('登录成功')
                    //TODO: 将Token放到本地Storage
                    console.log('存放收到的Token')

                    //TODO: 跳转到后台管理界面
                    console.log('跳转到管理员界面')


                } else {//如果登录失败，则弹出提示
                    console.log('登录失败')
                    errorMSG( '登录失败：'+error_message)
                }

            }).finally(() => {
            // console.log('',localStorage.getItem("token") === null);
            // navigate('/home');
            console.log('登录成功2')
        })
    };

    //失败提示信息回调函数
    const errorMSG = (msg) => {
        message.error(msg);
    };

    //成功提示信息回调函数
    const successMSG = (msg) => {
        message.success(msg);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    let onRegisterClick = () => {
        navigate('/admin/register');
    }

    let onLoginClick = () => {
        // localStorage.setItem("token", "logined")
    }

    return (
        <div className='login-wrap'>
            <div>
                <div className='form-header'>
                    <h4 className='column'>登录</h4>
                    {/*使用Link来实现简单跳转*/}
                    <Link to='/admin/reset'>密码重置</Link>
                </div>
                <br/>
                <br/>
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{remember: true}}
                    onFinish={onFinish}>
                    <Form.Item
                        name="email"
                        rules={[{required: true, message: '请输入您的邮箱!'}]}>
                        <Input prefix={<UserOutlined className="site-form-item-icon"/>}
                               placeholder="邮箱"/>
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{required: true, message: '请输入您的密码!'}]}>
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon"/>}
                            type="password"
                            placeholder="密码"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>记住我</Checkbox>
                        </Form.Item>
                    </Form.Item>

                    <Form.Item>

                        <Row>
                            <Col span={6}>
                                <Button type="primary"
                                        htmlType="submit"
                                        className="login-form-button"
                                        onClick={onLoginClick}>
                                    登录
                                </Button>
                            </Col>
                            <Col span={6}></Col>
                            <Col span={6}></Col>
                            <Col span={6}>
                                <Button type="primary"
                                        onClick={onRegisterClick}>注册</Button>
                            </Col>
                        </Row>
                        {/*<a href="/register">注册</a>*/}
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default LoginForm;
