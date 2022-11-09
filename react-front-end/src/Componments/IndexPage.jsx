import React, {Component, useEffect, useState} from 'react';
import {NavLink, useNavigate} from "react-router-dom";
import {Button, List} from "antd";
import '../styles/HomePage.css'
import axios from "axios";
import {convertTypeObjToAntDList, errorMSG} from "../Utils/CommonFuncs.js";

// import '../Utils/IndexHeader.js'
function IndexPage(props) {
    //获取路由跳转方法
    const navigate = useNavigate()

    //列表数据
    const [list_data, setListData] = useState([{
        title:
            '暂无分类'
    }])

    const [loading, setLoading] = useState(false)

    //分类按钮点击事件处理

    const onTypeBtnClicked = (item) => {
        console.log('点击的分类ID为：',item.id)
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

    //获取分裂列表Hooks
    useEffect(() => {
        console.log('开始获取所有分类')
        //发送请求
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
                setListData(data_recv)
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
            <br/>
            <br/>
            <div>
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
                    dataSource={list_data}
                    renderItem={(item) => (
                        <List.Item>
                            <Button
                                style={{
                                    backgroundColor: "#f4f5f6",
                                    borderRadius: "10px",
                                }}
                                type="default"
                                shape="default"
                                onClick={()=>onTypeBtnClicked(item)}
                            >
                                {item.title}
                            </Button>
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