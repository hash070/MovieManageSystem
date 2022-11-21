import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import {Avatar, Button, Form, Input} from "antd";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import axios from "axios";
import {errorMSG, getUserLevel, successMSG} from "../../Utils/CommonFuncs.js";

function UserProfile(props) {
    //获取Navigate
    const navigate = useNavigate()

    const userinfo = JSON.parse(localStorage.getItem('userinfo') == null ? navigate('/login') : localStorage.getItem('userinfo'))

    let [user_email, setUserEmail] = useState(userinfo.email)
    let [user_nickname, setUserNickName] = useState(userinfo.nickname)
    let [user_level, setUserLevel] = useState(userinfo.level)

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

        // 构建请求体
        let req_body = new FormData()
        if (values.nickname !== '' && values.nickname !== undefined) {
            console.log('昵称不为空')
            req_body.append('nickname', values.nickname)
        }

        if (values.password !== '' && values.password !== undefined) {
            console.log('密码不为空')
            req_body.append('password', values.password)
        }

        //log all form data

        for (let key of req_body.keys()) {
            console.log(key, req_body.get(key))
        }

        // 发送请求
        axios.post('/api/user/update', req_body)
            .then(res => {
                if (res.data.success) {
                    console.log('用户信息更新成功')
                    successMSG('用户信息更新成功')
                    //清空表单
                } else {
                    console.log('用户信息更新失败')
                    errorMSG('用户信息更新失败')
                }
            })
            .catch(err => {
                console.log(err)
                errorMSG('用户信息更新失败', '请检查网络连接')
            })
            .finally(() => {
                axios.post('/api/user/checkToken')
                    .then(res => {
                        console.log('收到服务端返回信息', res.data)
                        //保存用户信息JSON到本地存储
                        localStorage.setItem('userinfo', JSON.stringify(res.data.data))
                        console.log('用户信息已保存', JSON.parse(localStorage.getItem('userinfo')))
                        //更新用户信息
                        setUserNickName(res.data.data.nickname)
                        setUserLevel(res.data.data.level)
                        setUserEmail(res.data.data.email)
                    })
            })
    }

    return (
        <div style={{}}>

            <div style={{width: '128px', margin: 'auto'}}>{getAvatar()}</div>

            <p style={{textAlign: 'center'}}>用户角色：{getUserLevel(user_level)}</p>
            <p style={{textAlign: 'center'}}>用户邮箱：{user_email}</p>
            <p style={{textAlign: 'center'}}>用户昵称：{user_nickname}</p>

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
                    <Button

                        type="primary"
                        htmlType="submit"
                        style={{width: '100px', margin: 'auto'}}>
                        更新信息
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default UserProfile;