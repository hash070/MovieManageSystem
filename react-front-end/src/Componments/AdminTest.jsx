import React, {Component} from 'react';
import {Button} from "antd";
import {redirect, useNavigate} from "react-router-dom";


function AdminTest(props) {
    let navigate = useNavigate();
    return (
        <div>
            管理员测试界面1，当前正在访问/adminTest路径
            <Button type={"primary"} onClick={()=>{
                console.log('按钮点击事件')
                navigate('/admin')
                // return redirect('/') //redirect NOT Working, I don't know why
            }}>点击跳转</Button>
        </div>
    );
}

export default AdminTest;