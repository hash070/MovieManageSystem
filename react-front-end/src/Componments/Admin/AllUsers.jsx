import React, {useEffect, useState} from 'react';
import {Button, Col, Dropdown, Form, Input, List, Modal, Radio, Row, Skeleton, Space} from "antd";
import {errorMSG, getItem, getUserLevel, simulateMouseClick, successMSG} from "../../Utils/CommonFuncs.js";
import axios from "axios";
import {
    DesktopOutlined,
    DownOutlined,
    LockOutlined, LogoutOutlined,
    MailOutlined,
    PlusOutlined,
    UserOutlined,
    VideoCameraOutlined
} from "@ant-design/icons";


let item_temp
let email_temp
let pwd_temp

const inputStyle = {
    width: '100%',
    margin: '10px',
}

const gridTextStyle = {
    fontWeight: 'bold',
    padding: '8px 0',
    textAlign: 'center',
};

function AllUsers(props) {

    //列表初始时加载状态设置
    const [initLoading, setInitLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [list, setList] = useState([]);

    //弹出框标题
    const [modalTitle, setModalTitle] = useState('')

    //表单输入框 数据绑定
    const [user_nick_name, setUserNickName] = useState('')
    const [user_email, setUserEmail] = useState('')
    const [user_password, setUserPassword] = useState('')

    //对话框标题
    const modalAddUserTitleStr = '添加新用户'
    const modalEditUserTitleStr = '修改用户信息'


    //删除用户的方法
    const deleteUserByEmail = (email) => {
        console.log('删除的用户的Email是', email)
        //启动加载状态
        setInitLoading(true)
        //构造请求体
        let req_body = new FormData()
        req_body.append('email', email)
        //发送请求
        axios.post('/api/user/deleteByRoot', req_body)
            .then((res) => {
                console.log('返回结果', res.data)
                if (!res.data.success) {//检查是否成功
                    //如果失败，则做出提示，然后直接返回
                    errorMSG('删除失败：' + res.data.errorMsg)
                    return
                }
                //如果成功，则做出提示，然后清空输入框
                successMSG('删除成功')
            })
            .catch((err) => {
                console.log('错误信息', err)
                errorMSG(err.message + '请检查网络连接')
            })
            .finally(() => {
                //变更Loading，要求重新加载列表数据
                setLoading(!loading)
            })
    }

    useEffect(() => {//数据加载函数
        //发送请求
        axios.post('/api/user/getAll')
            .then((res) => {
                console.log('返回结果', res.data)
                if (!res.data.success) {//检查是否成功
                    //如果失败，则做出提示，然后直接返回
                    errorMSG('获取分类列表失败：' + res.data.errorMsg)
                    return
                }
                let data_recv = res.data.data
                //设置数据
                setList(data_recv)
                //关闭加载状态
                setInitLoading(false)
            })
    }, [loading]);//绑定loading变量，只有当loading变化时，重新加载

    //对话框显示状态
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = (item) => {//打开对话框
        if (item === null) {//如果是添加新用户
            setModalTitle(modalAddUserTitleStr)
            setIsModalOpen(true)
        } else {//如果是修改用户信息
            setModalTitle(modalEditUserTitleStr)
            item_temp = item
            // setUpdateVal(item_temp.name)//设置对话框中的输入框的值
            console.log('修改用户信息', item_temp)

            setUserNickName(item_temp.nickname)
            setUserEmail(item_temp.email + '(不可修改)')
            email_temp = item_temp.email
            pwd_temp = item_temp.password
            // setUserPassword(item_temp.password)//不显示密码
            setUserPermission(item_temp.level)
            setIsModalOpen(true);
        }
    };

    //对话框确认按钮点击事件
    const handleOk = () => {
        console.log('表单提交事件')
        console.log('用户昵称', user_nick_name)
        console.log('用户邮箱', user_email)
        console.log('用户密码', user_password)
        console.log('用户权限', getUserLevel(user_permission_val))

        let api_url = ''
        let add_user_api_url = '/api/user/addByRoot'
        let edit_user_api_url = '/api/user/updateByRoot'

        //通过标题判断对话框类型
        if (modalTitle === modalAddUserTitleStr) {//添加新用户
            api_url = add_user_api_url
        } else if (modalTitle === modalEditUserTitleStr) {//修改用户信息
            api_url = edit_user_api_url
        }

        console.log('操作API：', api_url)

        //开始构建请求体
        let req_body = new FormData()
        req_body.append('nickname', user_nick_name)
        req_body.append('email', email_temp)
        if (user_password !== '') {//如果密码不为空，则添加密码
            console.log('密码不为空')
            req_body.append('password', user_password)
        }else {//如果密码为空，则使用原密码
            console.log('密码为空')
            req_body.append('password', pwd_temp)
        }
        req_body.append('level', user_permission_val.toString())
        //打印请求体中的值
        console.log('提交请求')
        for (let key of req_body.keys()) {
            console.log(key, req_body.get(key))
        }
        //发送请求

        //启动加载状态
        setInitLoading(true)

        axios.post(api_url, req_body)
            .then((res) => {
                console.log('返回结果', res.data)
                if (!res.data.success) {//检查是否成功
                    //如果失败，则做出提示，然后直接返回
                    errorMSG('操作失败：' + res.data.errorMsg)
                    return
                }
                //如果成功，则做出提示，然后清空输入框
                successMSG('操作成功')
                //清空输入框
                setUserNickName('')
                setUserEmail('')
                setUserPassword('')
                setUserPermission(2)
                //关闭对话框
                setIsModalOpen(false)
            })
            .catch((err) => {
                console.log('错误信息', err)
                errorMSG(err.message + '请检查网络连接')
            })
            .finally(() => {
                //关闭加载状态
                setInitLoading(false)
                //变更Loading，要求重新加载列表数据
                setLoading(!loading)
            })


    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    let [user_permission_val, setUserPermission] = useState(2)


    const onRadioChange = (e) => {
        console.log(e.target.value)
        setUserPermission(e.target.value)
    }

    return (
        <div>
            <Button
                type={"primary"}
                icon={<PlusOutlined/>}
                onClick={e => {
                    setModalTitle('添加新用户')
                    showModal(null)
                }}
            >添加用户</Button>
            {/*用户列表*/}
            <List
                loading={initLoading}
                itemLayout="horizontal"
                dataSource={list}
                header={
                    <Row gutter={16}>
                        <Col span={6}>
                            <div style={gridTextStyle}>用户昵称</div>
                        </Col>
                        <Col span={6}>
                            <div style={gridTextStyle}>用户邮箱</div>
                        </Col>
                        <Col span={6}>
                            <div style={gridTextStyle}>用户权限</div>
                        </Col>
                        <Col span={6}>
                            <div style={gridTextStyle}>操作</div>
                        </Col>
                    </Row>
                }
                renderItem={(item) => (
                    <List.Item
                        actions={[
                            <Button
                                key="list-loadmore-edit"
                                type={"primary"}
                                onClick={() => {
                                    showModal(item)
                                }}
                            >编辑</Button>,
                            <Button
                                key="list-loadmore-delete"
                                type={"primary"} danger
                                onClick={(msg) => {
                                    deleteUserByEmail(item.email)
                                }}
                            >删除</Button>,
                        ]}
                    >
                        <Row style={{width: '100%'}} gutter={16}>
                            <Col span={8}>
                                <div style={gridTextStyle}>{item.nickname}</div>
                            </Col>
                            <Col span={8}>
                                <div style={gridTextStyle}>{item.email}</div>
                            </Col>
                            <Col span={8}>
                                <div style={gridTextStyle}>{getUserLevel(item.level)}</div>
                            </Col>
                        </Row>
                    </List.Item>
                )}
            />
            {/*弹出输入框*/}
            <Modal title={modalTitle}
                   open={isModalOpen}
                   onOk={handleOk}
                   onCancel={handleCancel}
                   cancelText={'取消'}
                   okText={'确认'}
                   maskClosable={false}//点击遮罩层后是否关闭
                // destroyOnClose={true}//关闭时销毁 Modal 里的子元素
            >
                <Input.Group compact>
                    <Input
                        //受控Input
                        value={user_nick_name}
                        onChange={e => {
                            setUserNickName(e.target.value)
                        }}
                        style={inputStyle}
                        prefix={<UserOutlined className="site-form-item-icon"/>}
                        placeholder="用户昵称"/>
                    <Input
                        //TODO:受控Input 不受控制。。。
                        // 受控Input
                        value={user_email}
                        style={inputStyle}
                        onChange={e => {
                            console.log('邮箱', e.target.value)
                            setUserEmail(e.target.value)
                        }}
                        prefix={<MailOutlined className="site-form-item-icon"/>}
                        placeholder="用户邮箱"/>
                    <Input
                        //受控Input
                        value={user_password}
                        style={inputStyle}
                        onChange={e => {
                            setUserPassword(e.target.value)
                        }}
                        prefix={<LockOutlined className="site-form-item-icon"/>}
                        type="password"
                        placeholder="用户密码"
                    />
                    <span style={{marginLeft: '20px', marginTop: '15px'}}>用户权限：</span>
                    <Radio.Group
                        style={{marginLeft: '20px', marginTop: '10px'}}
                        onChange={onRadioChange}
                        value={user_permission_val}
                        optionType={'button'}
                        buttonStyle={'solid'}
                        defaultValue={user_permission_val}
                    >
                        <Radio value={2}>普通用户</Radio>
                        <Radio value={1}>管理员用户</Radio>
                        <Radio value={0}>根用户</Radio>
                    </Radio.Group>
                </Input.Group>
            </Modal>
        </div>
    );
}

export default AllUsers;