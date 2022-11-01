import {Button, Checkbox, Form, Input, Col, Row} from 'antd';
import axios from 'axios';
import {React, Fragment, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import '../../styles/Login.css';
import {LockOutlined, UserOutlined, CheckCircleOutlined} from '@ant-design/icons';
import {errorMSG, getFormData, successMSG} from "../../Utils/CommonFuncs.js";

//注册表单
const RegisterForm = () => {
    //路由跳转方法
    const navigate = useNavigate();

    //绑定验证码数据到code_val中
    let [code_val, setCodeVal] = useState('')

    //绑定邮箱数据到email_val中
    let [email_val, setEmailVal] = useState('')


    //返回到登录界面方法
    let backToLogin = () => {
        navigate('/admin/login');
    }

    //发送验证码的方法
    let sendVerifyCode = () => {

        //对邮箱进行正则校验
        let check_email = new RegExp('[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?')
        if (!check_email.test(email_val)) {//如果邮箱没有通过校验
            console.log('邮箱检查未通过', check_email.test(email_val))
            errorMSG('请输入正确的邮箱')
            return
        } else {
            console.log('邮箱检查通过', check_email.test(email_val))
            successMSG('邮箱检查通过')
        }
        //构造请求体
        let req_body = new FormData()
        req_body.append('email', email_val)


        //请求接口，发送验证码
        console.log('发送的请求体是', req_body)
        axios.post('/api/user/code', req_body).then(res => {
            console.log('返回结果：', res.data)

            if (res.data.success) {
                successMSG('发送成功，请到邮箱中查收')
            } else {
                errorMSG('邮件发送失败')
            }
        })
        .catch((err) => {
            console.log('错误信息', err)
            errorMSG(err.message + '\n请检查网络连接')
        })
    }

    const onFinish = (values) => {
        console.log('发送请求数据:', values);

        //如果两次输入的密码不一致，则提示要求重新输入并结束本方法回调。
        if (values.password1 !== values.password2) {
            errorMSG('两次输入的密码不一致，请重新输入')
            return
        }

        //创建请求体
        //注意，发送请求时，一定要用FormData对象来发送请求
        let req_body = getFormData({
            email: values.email,
            nickname: values.nickname,
            password: values.password1,
            code: values.code,
        })

        console.log('发送的请求体:', req_body)

        axios.post('/api/user/register', req_body)
            .then(res => {
                console.log('服务端返回数据', res.data);

                if (res.data.success) {//如果注册成功
                    successMSG('注册成功，请登录')
                    //TODO: 跳转到登录页面
                    navigate('/admin/login');
                } else {
                    errorMSG('注册失败：' + res.data.errorMsg)
                }

            })
            .catch((err) => {
                console.log('错误信息',err)
                errorMSG(err.message+'\n请检查网络连接')
            })
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className='login-wrap'>
            <div>
                <div className='form-header'>
                    <h4 className='column'>账户注册</h4>
                </div>
                <br/>
                <br/>
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{remember: true}}
                    onFinish={onFinish}>
                    {/*AntD邮箱前端校验*/}
                    <Form.Item
                        name="email"
                        onChange={(e) => {
                            console.log('邮箱数值更新', e.target.value)
                            setEmailVal(e.target.value)
                        }}
                        rules={[{
                            required: true,
                            pattern: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/,
                            message: '请输入正确的邮箱!'
                        }]}>
                        <Input prefix={<UserOutlined className="site-form-item-icon"/>}
                               placeholder="邮箱"/>
                    </Form.Item>
                    <Form.Item
                        name="nickname"
                        rules={[{required: true, message: '请输入您的昵称!'}]}>
                        <Input prefix={<UserOutlined className="site-form-item-icon"/>}
                               placeholder="昵称"/>
                    </Form.Item>
                    <Form.Item
                        name="password1"
                        rules={[{required: true, message: '请输入您的密码!'}]}>
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon"/>}
                            type="password"
                            placeholder="密码"
                        />
                    </Form.Item>
                    <Form.Item
                        name="password2"
                        rules={[{required: true, message: '请输入您的密码!'}]}>
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon"/>}
                            type="password"
                            placeholder="确认密码"
                        />
                    </Form.Item>

                    <div>
                        <Row gutter={10}>
                            <Col span={16}>
                                <Form.Item
                                    name="code"
                                    rules={[{required: true, message: '请输入您的验证码!'}]}>
                                    <Input
                                        prefix={<CheckCircleOutlined className="site-form-item-icon"/>}
                                        onChange={(e) => {
                                            console.log('验证码输入值更新', e.target.value)
                                            setCodeVal(e.target.value)
                                        }}
                                        placeholder="邮箱验证码"/>
                                </Form.Item>
                            </Col>
                            <Col span={8}><Button onClick={sendVerifyCode}>
                                发送验证码
                            </Button></Col>
                        </Row>
                    </div>
                    <br/>
                    <Form.Item className='regButton'>
                        <Button type="primary" onClick={backToLogin} style={{marginRight: '50px'}}>
                            返回登录
                        </Button>

                        <Button type="primary" htmlType="submit" className="login-form-button">
                            注册
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default RegisterForm;
