import React from 'react';
import {useNavigate} from "react-router-dom";
import {Avatar} from "antd";

function UserProfile(props) {
    //获取Navigate
    const navigate = useNavigate()

    const userinfo = JSON.parse(localStorage.getItem('userinfo')==null?navigate('/login'):localStorage.getItem('userinfo'))

    const getAvatar = () =>{
        switch (userinfo.level){
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

    const getUserLevel = (level) =>{
        switch (level){
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

    return (
        <div>
            <p>用户邮箱：{userinfo.email}</p>
            <p>用户昵称：{userinfo.nickname}</p>
            <p>用户角色：{getUserLevel(userinfo.level)}</p>

            <div style={{}}>{getAvatar()}</div>
        </div>
    );
}

export default UserProfile;