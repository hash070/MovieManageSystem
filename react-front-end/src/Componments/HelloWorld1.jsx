import React, {Component} from 'react';
import {NavLink} from "react-router-dom";

class HelloWorld1 extends Component {
    render() {
        return (
            <div>
                这里是第一个HelloWorld，您当前正在访问根路径
                //使用Navigate组件进行重定向
                <br/>
                <NavLink to={'/admin'} >跳转到管理后台</NavLink>
            </div>
        );
    }
}

export default HelloWorld1;