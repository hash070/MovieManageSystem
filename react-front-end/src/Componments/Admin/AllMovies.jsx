import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {errorMSG, successMSG} from "../../Utils/CommonFuncs.js";
import {Avatar, Button, List, Skeleton} from "antd";

function AllMovies(props) {
    // 获取Navigate
    const navigate = useNavigate()
    //输入框数据双向数据流绑定
    let [input_val, setInputVal] = useState('')
    // 跳转到编辑页面，并传递文章参数
    const goToEdit = (item) => {
        navigate(`/admin/blog/new`,
            {
                state: {
                    id: item.id,
                    des: item.des,
                    title: item.title,
                    article: item.article,
                    author: item.author,
                    uploadTime: item.uploadTime,
                    views: item.views,
                    isNews: item.isNews,
                }
            })
    }

    //列表初始时加载状态设置
    const [initLoading, setInitLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [list, setList] = useState([]);

    //博客删除方法
    const deleteItem = (id) => {
        console.log('删除的影片ID是', id)
        //启动加载状态
        setInitLoading(true)
        //构造请求体
        let req_body = new FormData()
        req_body.append('movieId', id)
        //发送请求
        axios.post('/api/movie/delete', req_body)
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
        axios.post('/api/movie/getAll')
            .then((res) => {
                console.log('返回结果', res.data)
                if (!res.data.success) {//检查是否成功
                    //如果失败，则做出提示，然后直接返回
                    errorMSG('获取分类列表失败：' + res.data.errorMsg)
                    setInitLoading(false)
                    setList([])
                    return
                }
                let data_recv = res.data.data
                //设置数据
                setList(data_recv)
            })
            .catch((err) => {
                console.log('错误信息', err)
                errorMSG(err.message + '请检查网络连接')
            })
            .finally(() => {
                //关闭加载状态
                setInitLoading(false)
            })
    }, [loading]);//绑定loading变量，只有当loading变化时，重新加载

    return (
        <div>
            <List
                loading={initLoading}
                itemLayout="horizontal"
                dataSource={list}
                renderItem={(item) => (
                    <List.Item
                        style={{height: '300px'}}
                        actions={[
                            <Button
                                key="list-loadmore-edit"
                                type={"primary"}
                                onClick={() => {
                                    goToEdit(item)
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
                        <Skeleton avatar title={false} loading={item.loading} active>
                            <List.Item.Meta
                                size={{
                                    xs: 24,
                                    sm: 32,
                                    md: 40,
                                    lg: 64,
                                    xl: 80,
                                    xxl: 100,
                                }}
                                avatar={<Avatar src={'https://movie.hash070.top/api'+item.pic}/>}
                                title={<a style={{maxWidth: '90%', wordBreak: 'break-all'}}>{item.name}</a>}
                                description={<div style={{maxWidth: '90%', wordBreak: 'break-all'}}>{item.des}</div>}
                            />
                            <video
                                src={'https://movie.hash070.top/api'+item.file}
                                style={{width: '50%'}}
                            />
                            <div>作者：{item.uploader}</div>
                        </Skeleton>
                    </List.Item>
                )}
            />
        </div>
    );
}

export default AllMovies;