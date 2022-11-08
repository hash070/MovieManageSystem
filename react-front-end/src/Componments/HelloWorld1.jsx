import React, {Component} from 'react';
import {NavLink, useNavigate} from "react-router-dom";
import {Button} from "antd";

function HelloWorld1(props) {
    //获取路由跳转方法
    const navigate = useNavigate()
    return (
        <div>
            您当前正在访问根路径
            <br/>
            <Button type={"primary"} onClick={() => navigate('/admin')}>跳转到admin</Button>
            <br/>

            <p style={{width:'100%',textAlign:'center',marginTop:'10vh'}}>只因哥视频播放测试</p>
            <video style={{width:'100%',marginTop:'10vh'}}   src={'https://ts.hash070.top/103/Haganma.mp4?hash=AgADdA'} controls={true}/>
        </div>
    );
}

export default HelloWorld1;