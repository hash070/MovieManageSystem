import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {Avatar, Button, Divider, List, Skeleton} from "antd";
import '../styles/HomePage.css'
import axios from "axios";
import {convertTypeObjToAntDList, errorMSG, getFormData, headerJSMovement, infoMSG} from "../Utils/CommonFuncs.js";
import {ReloadOutlined} from "@ant-design/icons";

// import '../Utils/IndexHeader.js'
function IndexPage(props) {
    //获取路由跳转方法
    const navigate = useNavigate()

    //分类列表数据
    const [type_list_data, setTypeListData] = useState([{
        title:
            '暂无分类'
    }])

    //文章列表数据
    const [blog_list_data, setBlogListData] = useState([])
    //视频列表数据
    const [video_list_data, setVideoListData] = useState([])

    //列表加载动画状态，分别是类型列表、视频列表和文章列表
    const [initLoading1, setInitLoading1] = useState(true);
    const [initLoading2, setInitLoading2] = useState(true);
    const [initLoading3, setInitLoading3] = useState(true);
    //绑定Hooks函数，控制列表是否重新加载
    const [loading, setLoading] = useState(false)

    //分类按钮点击事件处理

    const onTypeBtnClicked = (item) => {
        console.log('点击的分类ID为：', item.id)
        //发送请求获取该ID下的所有影片并加载到影片列表中
        //构建请求体
        let req_body = getFormData({
            typeId: item.id
        })
        //开启电影列表的加载状态
        setInitLoading2(true)
        axios.post('/api/movie/getByType', req_body)
            .then((res) => {
                console.log('返回结果', res.data)
                if (!res.data.success) {//检查是否成功
                    //如果失败，则做出提示，然后直接返回
                    errorMSG('获取分类列表失败：' + res.data.errorMsg)
                    setVideoListData([])
                    return
                }
                let data_recv = res.data.data
                if (data_recv.length === 0) {
                    infoMSG('该分类下暂无影片')
                }
                //设置数据
                setVideoListData(data_recv)
            })
            .catch((err) => {
                console.log('错误信息', err)
                errorMSG(err.message + '请检查网络连接')
            })
            .finally(() => {
                //关闭加载状态
                setInitLoading2(false)
            })
    }

    //网页头部JS动态效果加载Hooks
    useEffect(() => {
        headerJSMovement()
    }, [])

    //获取分类、视频与文章数据列表Hooks函数
    useEffect(() => {
        //启动列表加载动画
        setInitLoading1(true)
        setInitLoading2(true)
        setInitLoading3(true)
        //获取所有分类列表
        console.log('开始获取分类列表')
        axios.post('/api/type/getAll')
            .then((res) => {
                console.log('返回结果', res.data)
                if (!res.data.success) {//检查是否成功
                    //如果失败，则做出提示
                    errorMSG('获取分类列表失败：' + res.data.errorMsg)
                    //设置分类列表为空
                    setTypeListData([])
                    return
                }
                //转换数据，适配AntD List
                let data_recv = convertTypeObjToAntDList(res.data.data)
                //设置数据
                setTypeListData(data_recv)
            })
            .catch((e) => {
                //捕获异常
                errorMSG('网络错误，请检查网络连接', e.message)
            })
            .finally(() => {
                //最终关闭加载状态
                setInitLoading1(false)
            })
        console.log('开始获取文章列表')
        //获取所有公开影片列表
        axios.post('/api/movie/getAllPublic')
            .then((res) => {
                console.log('返回结果', res.data)
                if (!res.data.success) {//检查是否成功
                    //如果失败，则做出提示，然后直接返回
                    errorMSG('获取分类列表失败：' + res.data.errorMsg)
                    setVideoListData([])
                    return
                }
                let data_recv = res.data.data
                //设置数据
                setVideoListData(data_recv)
            })
            .catch((err) => {
                console.log('错误信息', err)
                errorMSG(err.message + '请检查网络连接')
            })
            .finally(() => {
                //关闭加载状态
                setInitLoading2(false)
            })
        //获取所有公开文章列表
        axios.post('/api/blog/getAllPublicBlogs')
            .then((res) => {
                console.log('返回结果', res.data)
                if (!res.data.success) {//检查是否成功
                    //如果失败，则做出提示，然后直接返回
                    errorMSG('获取分类列表失败：' + res.data.errorMsg)
                    setBlogListData([])
                    return
                }
                let data_recv = res.data.data
                //设置文章列表数据
                setBlogListData(data_recv)
            })
            .catch((err) => {
                console.log('错误信息', err)
                errorMSG(err.message + '请检查网络连接')
            })
            .finally(() => {
                //关闭加载状态
                setInitLoading3(false)
            })
    }, [loading])


    return (
        <div>
            <header>
                <div><img src="/imgs/1.png"/></div>
                <div><img src="/imgs/2.png"/></div>
                <div><img src="/imgs/3.png"/></div>
                <div><img src="/imgs/4.png"/></div>
                <div><img src="/imgs/5.png"/></div>
                <div><img src="/imgs/6.png"/></div>
                <Button
                    style={{
                        position: "absolute",
                        left: '0px',
                        margin: '20px',
                    }}
                    onClick={() => {
                        setLoading(!loading)
                    }}
                    shape='circle'
                    icon={<ReloadOutlined/>}
                    type={'primary'}
                />
                <Button

                    style={{
                        position: "absolute",
                        right: '0px',
                        margin: '20px'
                    }}
                    onClick={() => navigate('/admin')}
                    type={'primary'}
                >管理后台</Button>
            </header>
            <div>
                <Divider>影片分类</Divider>
                {/*电影分裂列表*/}
                <List
                    loading={initLoading1}
                    grid={{
                        gutter: 0,
                        xs: 3,
                        sm: 5,
                        md: 7,
                        lg: 9,
                        xl: 11,
                        xxl: 13
                    }}
                    style={{marginLeft: '40px'}}
                    dataSource={type_list_data}
                    renderItem={(item) => (
                        <List.Item>
                            <Button
                                style={{
                                    backgroundColor: "#f4f5f6",
                                    borderRadius: "10px",
                                    borderColor: '#fff'
                                }}
                                type="default"
                                shape="default"
                                onClick={() => onTypeBtnClicked(item)}
                            >
                                {item.title}
                            </Button>
                        </List.Item>
                    )}
                />
                <Divider>网站视频</Divider>
                <List
                    loading={initLoading2}
                    itemLayout="horizontal"
                    dataSource={video_list_data}
                    renderItem={(item) => (
                        <List.Item>
                            <Skeleton avatar title={false} loading={item.loading} active>
                                <List.Item.Meta
                                    avatar={<Avatar src={'/api/movie/getFile?url=' + item.pic}
                                                    shape='square'
                                                    size={80}
                                    />}
                                    title={<a onClick={() => {
                                        console.log('视频列表点击事件', item.id)
                                        navigate('/movie/' + item.id)
                                    }} style={{maxWidth: '70%', wordBreak: 'break-all'}}>{item.name}</a>}
                                    description={<div
                                        style={{maxWidth: '70%', wordBreak: 'break-all'}}>{item.des}</div>}

                                />
                                <div style={{
                                    position: "absolute",
                                    right: '0px',
                                    marginRight: '50px'
                                }}>作者：{item.uploader}</div>
                            </Skeleton>
                        </List.Item>
                    )}
                />
                <Divider>网站文章</Divider>
                {/*文章列表*/}
                <List
                    loading={initLoading3}
                    itemLayout="horizontal"
                    dataSource={blog_list_data}
                    renderItem={(item) => (
                        <List.Item>
                            <Skeleton avatar title={false} loading={item.loading} active>
                                <List.Item.Meta
                                    avatar={<Avatar src={'https://img.hash070.top/i/63677e3963348.webp'}/>}
                                    title={<a
                                        onClick={() => {
                                            console.log('文章列表点击事件', item.id)
                                            navigate('/blog/' + item.id)
                                        }}
                                        style={{maxWidth: '70%', wordBreak: 'break-all'}}>{item.title}</a>}
                                    description={<div
                                        style={{maxWidth: '70%', wordBreak: 'break-all'}}>{item.des}</div>}
                                />
                                <div style={{
                                    position: "absolute",
                                    right: '0px',
                                    marginRight: '50px'
                                }}>作者：{item.author}</div>
                            </Skeleton>
                        </List.Item>
                    )}
                />
            </div>

            {/*<p style={{width:'100%',textAlign:'center',marginTop:'10vh'}}>只因哥视频播放测试</p>*/}
            {/*<video style={{width:'100%',marginTop:'10vh'}}   src={'https://ts.hash070.top/103/Haganma.mp4?hash=AgADdA'} controls={true}/>*/}
        </div>
    );
}

export default IndexPage;