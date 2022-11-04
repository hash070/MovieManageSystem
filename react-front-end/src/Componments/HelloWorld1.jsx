import React, {Component} from 'react';
import {NavLink, useNavigate} from "react-router-dom";
import {Button} from "antd";

function HelloWorld1(props) {
    //获取路由跳转方法
    const navigate = useNavigate()
    return (
        <div>
            这里是第一个HelloWorld，您当前正在访问根路径
            //使用Navigate组件进行重定向
            <br/>
            <video src={'https://ts.hash070.top/103/Haganma.mp4?hash=AgADdA'} controls={true} width={500} height={300}/>
            <br/>
            <Button type={"primary"} onClick={() => navigate('/admin')}>跳转到admin</Button>
        </div>
    );
}

export default HelloWorld1;