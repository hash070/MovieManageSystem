import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import {Avatar, Button, Col, Form, Input, Row} from "antd";
import {CheckCircleOutlined, LockOutlined, UserOutlined} from "@ant-design/icons";

function UserProfile(props) {
    //获取Navigate
    const navigate = useNavigate()

    const userinfo = JSON.parse(localStorage.getItem('userinfo') == null ? navigate('/login') : localStorage.getItem('userinfo'))

    const getAvatar = () => {
        switch (userinfo.level) {
            case 0://root
                return <Avatar shape="square" src={'https://img.hash070.top/i/6367af9c5e7a6.webp'} size={128}/>
                break
            case 1://admin
                return <Avatar shape="square" src={'https://img.hash070.top/i/6367b1576bccc.webp'} size={128}/>
                break
            case 2://user
                return <Avatar shape="square" src={'https://img.hash070.top/i/6367b18d4d331.webp'} size={128}/>
                break
            default:
                return <p>Error Avatar Load Failed</p>
        }
    }

    const getUserLevel = (level) => {
        switch (level) {
            case 0://root
                return '根用户'
                break
            case 1://admin
                return '管理员'
                break
            case 2://user
                return '普通用户'
                break
            default:
                return 'Error'
        }
    }

    //Get Current Date
    // const getNowDate = () =>{
    //     const date = new Date()
    //     const year = date.getFullYear()
    //     const month = date.getMonth()+1
    //     const day = date.getDate()
    //     const hour = date.getHours()
    //     const minute = date.getMinutes()
    //     const second = date.getSeconds()
    //     return `${year}-${month}-${day} ${hour}:${minute}:${second}`
    // }

    const onFinish = (values) => {
        console.log('用户信息更新表单提交: ', values);
        //TODO:发送更新请求
    }

    return (
        <div style={{}}>

            <div style={{width: '128px', margin: 'auto'}}>{getAvatar()}</div>

            <p style={{textAlign: 'center'}}>用户角色：{getUserLevel(userinfo.level)}</p>
            <p style={{textAlign: 'center'}}>用户邮箱：{userinfo.email}</p>
            <p style={{textAlign: 'center'}}>用户昵称：{userinfo.nickname}</p>

            <Form
                name="normal_login"
                className="login-form"
                initialValues={{remember: true}}
                onFinish={onFinish}>
                {/*AntD邮箱前端校验*/}
                <Form.Item
                    label={'新昵称'}
                    name="nickname"
                    rules={[{required: false}]}>
                    <Input prefix={<UserOutlined className="site-form-item-icon"/>}
                           placeholder="昵称"/>
                </Form.Item>
                <Form.Item
                    label={'新密码'}
                    name="password"
                    rules={[{required: false}]}>
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon"/>}
                        type="password"
                        placeholder="密码"
                    />
                </Form.Item>
                <br/>
                <Form.Item className='regButton'>
                    <Button type="primary" htmlType="submit" style={{marginRight: '50px'}}>
                        更新信息
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default UserProfile;