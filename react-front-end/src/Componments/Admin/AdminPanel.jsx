import React, {useState} from 'react';
import '../../styles/AdminPanel.css';
import {DesktopOutlined, LogoutOutlined, UserOutlined, VideoCameraOutlined,} from '@ant-design/icons';
import {Breadcrumb, Layout, Menu, Modal} from 'antd';
import {Outlet, useNavigate} from "react-router-dom";
import axios from "axios";
import {errorMSG, getFormData, getItem, successMSG} from "../../Utils/CommonFuncs.js";
import Cookies from "universal-cookie/es6";

const {Header, Content, Footer, Sider} = Layout;


const AdminPanel = () => {
    //获取路由跳转方法
    const navigate = useNavigate()
    //Cookie操作方法
    const cookies = new Cookies();

    //对话框显示状态
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOk = () => {
        logout()
    }

    const handleCancel = () => {
        setIsModalOpen(false)
    }

    //Token失效时的动作
    const backToLogin = (msg) => {
        //删除存储在Cookie中的token
        cookies.remove('token')
        errorMSG('请先登录', msg)
        navigate('/login')
    }

    // 定义菜单修改Flag，确保菜单更新不会重复进行
    let [menu_flag, setMenu_flag] = React.useState(false);

    // 创建菜单对象
    let [menu_items, setMenuItems] = useState([
        getItem('', '1'),
    ])

    // 设置当前选中菜单项
    // let [current_selected_menu_key, setCurrentSelectedMenuKey] = useState('11')

    // 退出登录方法
    const logout = () => {
        console.log('退出登录')
        //清除Cookie中的userinfo
        cookies.remove('userinfo')

        //构建请求体，放入token
        let req_body = getFormData({
            token: cookies.get('token')
        })
        //发送请求
        axios.post('/api/user/logout', req_body)
            .then(res => {
                if (res.data.success) {
                    successMSG('您已退出登录')
                }
            })
            .catch(err => {
                console.log(err)
                errorMSG('请检查网络连接')
            })
            .finally(() => {
                //删除存储在Cookie中的token
                cookies.remove('token')
                //跳转到登录页面
                navigate('/login')
            })

    }

    // 不同权限时的菜单
    // root菜单 权限等级:0
    let root_user_menu = [
        // getItem('影片管理', 'sub1', <VideoCameraOutlined/>, [
        //     getItem('影片上传', '11'),
        //     getItem('所有影片', '12'),//站内所有影片
        //     getItem('分类管理', '13'),
        // ]),
        getItem('文章管理', 'sub2', <DesktopOutlined/>, [
            getItem('写文章', '21'),
            getItem('所有文章', '22'),//站内所有文章
        ]),
        getItem('用户管理', 'sub3', <UserOutlined/>, [
            getItem('个人资料', '31'),
            getItem('所有用户', '32'),//站内所有用户
        ]),
        getItem('返回首页', '77', <LogoutOutlined rotate={180}/>),
        getItem('退出登录', '88',
            <LogoutOutlined rotate={180} style={{color: 'red'}}/>),
    ]
    // 管理员菜单 权限等级:1 不能管理用户
    let admin_user_menu = [
        // getItem('影片管理', 'sub1', <VideoCameraOutlined/>, [
        //     getItem('影片上传', '11'),
        //     getItem('所有影片', '12'),//站内所有影片
        //     getItem('分类管理', '13'),
        // ]),
        getItem('文章管理', 'sub2', <DesktopOutlined/>, [
            getItem('写文章', '21'),
            getItem('所有文章', '22'),//站内所有文章
        ]),
        getItem('用户管理', 'sub3', <UserOutlined/>, [
            getItem('个人资料', '31'),
        ]),
        getItem('返回首页', '77', <LogoutOutlined rotate={180}/>),
        getItem('退出登录', '88',
            <LogoutOutlined rotate={180} style={{color: 'red'}}/>),
    ]
    // 普通用户菜单 权限等级:2
    let user_menu = [
        // getItem('影片管理', 'sub1', <VideoCameraOutlined/>, [
        //     getItem('影片上传', '11'),
        //     getItem('所有影片', '12'),//自己的影片
        // ]),
        getItem('文章管理', 'sub2', <DesktopOutlined/>, [
            getItem('写文章', '21'),
            getItem('所有文章', '22'),//自己的文章
        ]),
        getItem('用户管理', 'sub3', <UserOutlined/>, [
            getItem('个人资料', '31'),
        ]),
        getItem('返回首页', '77', <LogoutOutlined rotate={180}/>),
        getItem('退出登录', '88',
            <LogoutOutlined rotate={180} style={{color: 'red'}}/>),
    ]

    /*
    key规则：
       User    Sub    Chi
    10 1|2|3  1|2|3  1|2|3
     */


    // 菜单栏跳转方法
    const onBarClicked = (e) => {
        console.log('点击菜单', e.key)
        switch (parseInt(e.key)) {
            case 11:// 影片管理 影片上传
                navigate('/admin/movie/upload')
                break
            case 12:// 影片管理 所有影片
                navigate('/admin/movie/all')
                break
            case 13:// 影片管理 分类管理
                navigate('/admin/movie/category')
                break
            case 21:// 文章管理 写文章
                navigate('/admin/blog/new')
                break
            case 22:// 文章管理 所有文章
                navigate('/admin/blog/all')
                break
            case 31:// 用户管理 个人资料
                navigate('/admin/user/profile')
                break
            case 32:// 用户管理 所有用户
                navigate('/admin/user/all')
                break
            case 88://退出登录
                setIsModalOpen(true)
                break
            case 77://返回首页
                navigate('/')
                break
        }
    }

    // 模拟组件更新生命周期，该方法在组件更新时只会执行一次
    React.useEffect(() => {
        console.log("组件被更新了")

        //在执行菜单更新操作前，检查之前是否更新过
        // TODO:可能会导致页面未加载的BUG
        if (menu_flag) {//默认为false，如果为true，则表明菜单已经更新过了
            console.log('菜单已是最新')
            return;
        } else {//如果为false，则标明菜单还从未更新过
            console.log('菜单即将更新')
        }

        // 检查与验证用户权限
        console.log('开始检查用户token有效性')

        //不需要在请求体中发送数据，服务端会直接检查Header中的Cookie
        axios.post('/api/user/checkToken')
            .then(res => {
                console.log('收到服务端返回信息', res.data)
                let err_msg = res.data.errorMSG
                let is_token_valid = res.data.success
                if (!is_token_valid) {//用户Token不合法，或者未登录
                    backToLogin(err_msg)//则直接跳转回去
                    return
                }

                //保存用户信息JSON到本地存储
                localStorage.setItem('userinfo', JSON.stringify(res.data.data))
                console.log('用户信息已保存', JSON.parse(localStorage.getItem('userinfo')))

                let user_level = res.data.data.level

                console.log('token有效性', is_token_valid)
                console.log('用户权限等级', user_level)

                //菜单更新操作
                switch (user_level) {
                    case 0:
                        console.log('加载root用户菜单')
                        setMenuItems(root_user_menu)
                        break
                    case 1:
                        console.log('加载admin用户菜单')
                        setMenuItems(admin_user_menu)
                        break
                    case 2:
                        console.log('加载普通用户菜单')
                        setMenuItems(user_menu)
                        break
                }
                //确保菜单只更新一次
                setMenu_flag(true);

            })
            .catch((err) => {
                console.log('error', err)
                errorMSG('网络错误，请检查网络连接')
            })

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
                <div className="logo">博客管理后台</div>
                <Menu
                    theme="light"
                    defaultSelectedKeys={['1']}
                    mode="inline"
                    defaultOpenKeys={['sub1', 'sub2', 'sub3']}
                    items={menu_items}
                    //点击监听事件
                    onClick={onBarClicked}
                    // //TODO:设置当前选中
                    // selectedKeys={[current_selected_menu_key]}
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
            {/*弹出输入框*/}
            <Modal title="确定退出登录？"
                   open={isModalOpen}
                   onOk={handleOk}
                   onCancel={handleCancel}
                   cancelText={'取消'}
                   okText={'确认'}
                   maskClosable={true}//点击遮罩层后是否关闭
            >
                <p>确定退出？</p>
            </Modal>
        </Layout>
    );
};
export default AdminPanel;