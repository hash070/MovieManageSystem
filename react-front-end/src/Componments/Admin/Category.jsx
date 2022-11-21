import React, {useEffect, useState} from 'react';
import {Button, Input, List, Modal, Skeleton} from "antd";
import {errorMSG, successMSG} from "../../Utils/CommonFuncs.js";
import axios from "axios";


let item_temp

function Category(props) {
    //输入框数据双向数据流绑定
    let [input_val, setInputVal] = useState('')

    //提交新分类的方法
    const onSubmit = () => {
        console.log('提交的数据是', input_val)
        if (input_val === '') {//先判断输入数据是否为空
            errorMSG('请在输入框中输入内容')
            return
        }
        //启动加载状态
        setInitLoading(true)
        //构造请求体
        let req_body = new FormData()
        req_body.append('typeName', input_val)
        //发送请求
        axios.post('/api/type/add', req_body)
            .then((res) => {
                console.log('返回结果', res.data)
                if (!res.data.success) {//检查是否成功
                    //如果失败，则做出提示，然后直接返回
                    errorMSG('添加失败：' + res.data.errorMsg)
                    return
                }
                //如果成功，则做出提示，然后清空输入框
                successMSG('添加成功')
                setInputVal('')


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
    }

    //列表初始时加载状态设置
    const [initLoading, setInitLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [list, setList] = useState([]);

    //列表项目删除方法
    const deleteItem = (id) => {
        console.log('删除的ID是', id)
        //启动加载状态
        setInitLoading(true)
        //构造请求体
        let req_body = new FormData()
        req_body.append('id', id)
        //发送请求
        axios.post('/api/type/delete', req_body)
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
        axios.post('/api/type/getAll')
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
        item_temp = item
        setUpdateVal(item_temp.name)//设置对话框中的输入框的值
        setIsModalOpen(true);
    };

    const handleOk = () => {
        //启动加载状态
        setInitLoading(true)
        //构造请求体
        let req_body = new FormData()
        req_body.append('id', item_temp.id)
        req_body.append('typeName', update_val)
        //发送请求
        axios.post('/api/type/update', req_body)
            .then((res) => {
                console.log('返回结果', res.data)
                if (!res.data.success) {//检查是否成功
                    //如果失败，则做出提示，然后直接返回
                    errorMSG('更新失败：' + res.data.errorMsg)
                    return
                }
                //如果成功，则做出提示，然后清空输入框
                successMSG('更新成功')
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


        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    //对话框中的输入框数据双向绑定
    let [update_val, setUpdateVal] = useState('')

    return (
        <div>
            {/*头部输入框*/}
            <Input.Group compact>
                <Input
                    style={{
                        width: 'calc(100% - 90px)',
                    }}//给右边的按钮留出空间
                    placeholder="请输入要添加的分类名称"
                    //数据双向绑定
                    value={input_val}
                    onChange={(e) => {
                        console.log('输入框值更新', e.target.value)
                        setInputVal(e.target.value)
                    }}
                    onPressEnter={onSubmit}//按下回车键时，添加分类
                />
                <Button
                    type="primary"
                    onClick={onSubmit}
                >添加分类</Button>
            </Input.Group>
            {/*中间列表*/}
            <List
                loading={initLoading}
                itemLayout="horizontal"
                dataSource={list}
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
                                    deleteItem(item.id)
                                }}
                            >删除</Button>,
                        ]}
                    >
                        <Skeleton title={false} loading={item.loading} active>
                            <List.Item.Meta
                                title={<a style={{maxWidth: '90%', wordBreak: 'break-all'}}>{item.name}</a>}
                                //description="分类描述"
                            />
                        </Skeleton>
                    </List.Item>
                )}
            />
            {/*弹出输入框*/}
            <Modal title="更新电影标签"
                   open={isModalOpen}
                   onOk={handleOk}
                   onCancel={handleCancel}
                   cancelText={'取消'}
                   okText={'确认'}
                   maskClosable={true}//点击遮罩层后是否关闭
            >
                <Input.Group compact>
                    <p>输入新的标签</p>
                    <Input
                        style={{
                            width: 'calc(100%)',
                        }}
                        //数据流双向绑定
                        value={update_val}
                        onChange={(e) => {
                            console.log('输入框值更新', e.target.value)
                            setUpdateVal(e.target.value)
                        }}
                        onPressEnter={handleOk}
                    />
                </Input.Group>
            </Modal>
        </div>
    );
}

export default Category;