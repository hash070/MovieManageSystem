import {Button, Checkbox, Form, Input, Col, Row} from 'antd';
import axios from 'axios';
import {React, Fragment} from 'react';
import {useNavigate} from 'react-router-dom';
import '../styles/Login.css';
import {LockOutlined, UserOutlined, CheckCircleOutlined} from '@ant-design/icons';


const ResetPWDForm = () => {
    const navigate = useNavigate();
    let backToLogin = () => {
        navigate('/admin/login');
    }

    const onFinish = (values) => {
        console.log('Success:', values);

        axios.post('/api/resetPassword', values)
            .then(res => {
                console.log("重置密码");
                console.log(res.data);
                navigate('/');
            })
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className='login-wrap'>
            <div>
                <div className='form-header'>
                    <h4 className='column'>密码重置</h4>
                </div>
                <br/>
                <br/>
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{remember: true}}
                    onFinish={onFinish}>
                    <Form.Item
                        name="username"
                        rules={[{required: true, message: '请输入您的用户名!'}]}>
                        <Input prefix={<UserOutlined className="site-form-item-icon"/>}
                               placeholder="用户名"/>
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
                                <Input
                                    prefix={<CheckCircleOutlined className="site-form-item-icon"/>}
                                    placeholder="邮箱验证码"/>
                            </Col>
                            <Col span={8}><Button>发送验证码</Button></Col>
                        </Row>
                    </div>
                    <br/>
                    <Form.Item className='regButton'>
                        <Button type="primary" onClick={backToLogin} style={{marginRight: '50px'}}>
                            返回登录
                        </Button>

                        <Button type="primary" htmlType="submit" className="login-form-button">
                            重置密码
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default ResetPWDForm;
