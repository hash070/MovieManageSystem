import React, {Component, useEffect, useState} from 'react';
import {NavLink, useNavigate} from "react-router-dom";
import {Avatar, Button, Divider, List, Skeleton} from "antd";
import '../styles/HomePage.css'
import axios from "axios";
import {convertTypeObjToAntDList, errorMSG} from "../Utils/CommonFuncs.js";

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
    const [blog_list_data,setBlogListData] = useState([])
    //视频列表数据
    const [video_list_data,setVideoListData] = useState([])

    //列表加载动画状态
    const [initLoading, setInitLoading] = useState(true);
    //绑定Hooks函数，控制列表是否重新加载
    const [loading, setLoading] = useState(false)

    //分类按钮点击事件处理

    const onTypeBtnClicked = (item) => {
        console.log('点击的分类ID为：', item.id)
    }

    //网页HeaderJS加载Hooks
    useEffect(() => {
        var startX = 0;
        let blurValue;
        const images = document.querySelectorAll("header>div>img");

        document.querySelector("header").addEventListener("mousemove", (e) => {
            let offsetX = e.clientX - startX + 482;
            let percentage = offsetX / window.outerWidth;
            let offset = 15 * percentage;
            let blur = 20;

            for (let [index, image] of images.entries()) {
                offset *= 1.3;
                blurValue =
                    Math.pow(index / images.length - percentage, 2) * blur;
                image.style.setProperty("--offset", `${offset}px`);
                image.style.setProperty("--blur", `${blurValue}px`);
            }
        });
        document.querySelector("header").addEventListener("mouseover", (e) => {
            startX = e.clientX;
            for (let [index, image] of images.entries()) {
                image.style.transition = "none";
            }
        });

        document.querySelector("header").addEventListener("mouseout", () => {
            let offsetX = 482;
            let blur = 20;
            let percentage = offsetX / window.outerWidth;
            let offset = 15 * percentage;
            for (let [index, image] of images.entries()) {
                offset *= 1.3;
                blurValue = Math.pow(index / images.length - percentage, 2) * blur;
                image.style.setProperty("--offset", `${offset}px`);
                image.style.setProperty("--blur", `${blurValue}px`);
                image.style.transition = "all .3s ease";
            }
        });
        window.addEventListener("load", () => {
            let offsetX = 482;
            let blur = 20;
            let percentage = offsetX / window.outerWidth;
            let offset = 15 * percentage;
            for (let [index, image] of images.entries()) {
                offset *= 1.3;
                blurValue = Math.pow(index / images.length - percentage, 2) * blur;
                image.style.setProperty("--offset", `${offset}px`);
                image.style.setProperty("--blur", `${blurValue}px`);
            }
        });
    })

    //获取分类、视频与文章数据列表Hooks函数
    useEffect(() => {
        console.log('开始获取分类列表')
        axios.post('/api/type/getAll')
            .then((res) => {
                console.log('返回结果', res.data)
                if (!res.data.success) {//检查是否成功
                    //如果失败，则做出提示，然后直接返回
                    errorMSG('获取分类列表失败：' + res.data.errorMsg)
                    return
                }
                //转换数据，适配AntD List
                let data_recv = convertTypeObjToAntDList(res.data.data)
                //设置数据
                setTypeListData(data_recv)
            })
        console.log('开始获取文章列表')
        //发送请求
        axios.post('/api/blog/getAll')
            .then((res) => {
                console.log('返回结果', res.data)
                if (!res.data.success) {//检查是否成功
                    //如果失败，则做出提示，然后直接返回
                    errorMSG('获取分类列表失败：' + res.data.errorMsg)
                    setInitLoading(false)
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
                setInitLoading(false)
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
                        right: '0px',
                        borderRadius: '10px',
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
                    loading={initLoading}
                    itemLayout="horizontal"
                    dataSource={video_list_data}
                    renderItem={(item) => (
                        <List.Item>
                            <Skeleton avatar title={false} loading={item.loading} active>
                                <List.Item.Meta
                                    avatar={<Avatar src={'https://img.hash070.top/i/63677e3963348.webp'}/>}
                                    title={<a style={{maxWidth: '90%', wordBreak: 'break-all'}}>{item.title}</a>}
                                    description={<div style={{maxWidth: '90%', wordBreak: 'break-all'}}>{item.des}</div>}
                                />
                                <div>作者：{item.author}</div>
                            </Skeleton>
                        </List.Item>
                    )}
                />
                <Divider>网站文章</Divider>
                {/*文章列表*/}
                <List
                    loading={initLoading}
                    itemLayout="horizontal"
                    dataSource={blog_list_data}
                    renderItem={(item) => (
                        <List.Item>
                            <Skeleton avatar title={false} loading={item.loading} active>
                                <List.Item.Meta
                                    avatar={<Avatar src={'https://img.hash070.top/i/63677e3963348.webp'}/>}
                                    title={<a style={{maxWidth: '70%', wordBreak: 'break-all'}}>{item.title}</a>}
                                    description={<div style={{maxWidth: '70%', wordBreak: 'break-all'}}>{item.des}</div>}
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