import React, {useEffect, useState} from 'react';
import 'antd/dist/antd.css';
import '../../styles/AdminPanel.css';
import {
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import {Breadcrumb, Layout, Menu} from 'antd';
import {Outlet, useNavigate} from "react-router-dom";
import axios from "axios";
import {errorMSG, getFormData} from "../../Utils/CommonFuncs.js";

const {Header, Content, Footer, Sider} = Layout;

// 菜单对象构造方法，生成菜单对象
function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}

/*
    let [menu_items, setMenuItems] = useState([
        getItem('测试', '1', <PieChartOutlined/>),
        getItem('Option', '2', <DesktopOutlined/>),
        getItem('User', 'sub1', <UserOutlined/>, [
            getItem('Tom', '3'),
            getItem('Bill', '4'),
            getItem('Alex', '5'),
        ]),
        getItem('Team', 'sub2', <TeamOutlined/>, [
            getItem('Team1', '6'),
            getItem('Team2', '8')]),
        getItem('Files', '9', <FileOutlined/>),
    ])
*/

// 定义菜单修改Flag，确保菜单更新不会重复进行
let menu_flag = false

const App = () => {
    //获取路由跳转方法
    const navigate = useNavigate()

    // 创建菜单对象
    let [menu_items, setMenuItems] = useState([
        getItem('', '1'),
    ])

    // 不同权限时的菜单
    // root菜单 权限等级:0
    let root_user_menu = [
        getItem('用户管理', '10010', <PieChartOutlined/>),
        getItem('文章管理', '10011', <DesktopOutlined/>),
        getItem('影片管理', 'sub1', <UserOutlined/>, [
            getItem('Tom', '10012'),
            getItem('Bill', '10013'),
            getItem('Alex', '10014'),
        ]),
        getItem('Team', 'sub2', <TeamOutlined/>, [
            getItem('Team1', '10015'),
            getItem('Team2', '10016')]),
        getItem('Files', '10017', <FileOutlined/>),
    ]
    // 管理员菜单 权限等级:1
    let admin_user_menu = [
        getItem('用户管理', '10010', <PieChartOutlined/>),
        getItem('文章管理', '10011', <DesktopOutlined/>),
        getItem('影片管理', 'sub1', <UserOutlined/>, [
            getItem('Tom', '10012'),
            getItem('Bill', '10013'),
            getItem('Alex', '10014'),
        ]),
        getItem('Team', 'sub2', <TeamOutlined/>, [
            getItem('Team1', '10015'),
            getItem('Team2', '10016')]),
        getItem('Files', '10017', <FileOutlined/>),
    ]
    // 普通用户菜单 权限等级:2
    let user_menu = [
        getItem('用户管理', '10010', <PieChartOutlined/>),
        getItem('文章管理', '10011', <DesktopOutlined/>),
        getItem('影片管理', 'sub1', <UserOutlined/>, [
            getItem('Tom', '10012'),
            getItem('Bill', '10013'),
            getItem('Alex', '10014'),
        ]),
        getItem('Team', 'sub2', <TeamOutlined/>, [
            getItem('Team1', '10015'),
            getItem('Team2', '10016')]),
        getItem('Files', '10017', <FileOutlined/>),
    ]

    // 菜单栏跳转方法
    const onBarClicked = (e) => {
        console.log('点击菜单', e)
        navigate('/admin/adminTest')
    }

    // 跳转到主界面的方法
    const backToLogin = (msg) => {
        //删除存储的token
        localStorage.removeItem('token')
        errorMSG('请先登录')
        navigate('/login')
    }


    // 在此之前需要使用useRef这个hooks
    const flag = React.useRef(null)
    // 模拟组件更新生命周期，该方法在组件更新时只会执行一次
    React.useEffect(() => {
        if (!flag.current) {
            flag.current = true
        } else {
            console.log("组件被更新了")
            // 检查与验证用户权限
            console.log('开始检查用户权限')

            // 如果本地Token为Null，则直接返回
            if (localStorage.getItem('token') === null) {
                console.log('无Token，直接跳转到登录界面')
                backToLogin()
                return
            }

            let req_body = getFormData({
                token: localStorage.getItem('token')
            })

            axios.post('/api/user/checkToken', req_body)
                .then(res => {
                    console.log('收到服务端返回信息', res.data)

                    let is_token_valid = res.data.success
                    let user_level = res.data.data
                    let err_msg = res.data.errorMSG

                    if (!is_token_valid) {//用户Token不合法，或者未登录
                        backToLogin()//则直接跳转回去
                        return
                    }

                    //在执行菜单更新操作前，检查之前是否更新过
                    if (menu_flag) {//默认为false，如果为true，则表明菜单已经更新过了
                        console.log('菜单已是最新')
                        return;
                    } else {//如果为false，则标明菜单还从未更新过
                        console.log('菜单即将更新')
                        menu_flag = true
                    }

                    //菜单更新操作
                    switch (user_level) {
                        case 0:
                            console.log('root用户Token')
                            break
                        case 1:
                            console.log('管理员Token')
                            break
                        case 2:
                            console.log('普通用户Token')
                            setMenuItems(user_menu)
                            break
                    }

                })
        }
    })

    const [collapsed, setCollapsed] = useState(false);
    return (
        <Layout
            style={{
                minHeight: '100vh',
            }}
        >
            <Sider collapsible
                   collapsed={collapsed}
                   onCollapse={(value) => setCollapsed(value)}
                   theme='light'
            >
                <div className="logo">电影管理后台</div>
                <Menu
                    theme="light"
                    defaultSelectedKeys={['1']}
                    mode="inline"
                    items={menu_items}
                    //点击监听事件
                    onClick={onBarClicked}
                />
            </Sider>
            <Layout className="site-layout">
                <Header
                    className="site-layout-background"
                    style={{
                        padding: 0,
                    }}
                />
                <Content
                    style={{
                        margin: '0 16px',
                    }}
                >
                    <Breadcrumb
                        style={{
                            margin: '16px 0',
                        }}
                    >
                        {/*<Breadcrumb.Item>User</Breadcrumb.Item>*/}
                        {/*<Breadcrumb.Item>Bill</Breadcrumb.Item>*/}
                    </Breadcrumb>
                    <div
                        className="site-layout-background"
                        style={{
                            padding: 24,
                            minHeight: 360,
                        }}
                    >
                        <Outlet/>
                    </div>
                </Content>
                <Footer
                    style={{
                        textAlign: 'center',
                    }}
                >
                    hash070 ©2022
                </Footer>
            </Layout>
        </Layout>
    );
};
export default App;