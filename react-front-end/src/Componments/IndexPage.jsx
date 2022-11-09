import React, {Component, useEffect} from 'react';
import {NavLink, useNavigate} from "react-router-dom";
import {Button, List} from "antd";
import '../styles/HomePage.css'
// import '../Utils/IndexHeader.js'

const data = [
    {
        title: "分类1"
    },
    {
        title: "Title 2"
    },
    {
        title: "Title 3"
    },
    {
        title: "Title 4"
    },
    {
        title: "Title 5"
    },
    {
        title: "Title 6"
    },
    {
        title: "Title 1"
    },
    {
        title: "Title 2"
    },
    {
        title: "Title 3"
    },
    {
        title: "Title 4"
    },
    {
        title: "Title 5"
    },
    {
        title: "Title 6"
    },
    {
        title: "Title 1"
    },
    {
        title: "Title 2"
    },
    {
        title: "Title 3"
    },
    {
        title: "Title 4"
    },
    {
        title: "Title 5"
    },
    {
        title: "Title 6"
    },
    {
        title: "Title 1"
    },
    {
        title: "Title 2"
    },
    {
        title: "Title 3"
    },
    {
        title: "Title 4"
    },
    {
        title: "Title 5"
    },
    {
        title: "Title 6"
    },
    {
        title: "Title 1"
    },
    {
        title: "Title 2"
    },
    {
        title: "Title 3"
    },
    {
        title: "Title 4"
    },
    {
        title: "Title 5"
    },
    {
        title: "Title 6"
    }
];

function IndexPage(props) {
    //获取路由跳转方法
    const navigate = useNavigate()

    //网页HeaderJS加载Hooks
    useEffect(()=>{
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

    return (
        <div>

            <header>
                <div><img src="/imgs/1.png" /></div>
                <div><img src="/imgs/2.png" /></div>
                <div><img src="/imgs/3.png" /></div>
                <div><img src="/imgs/4.png" /></div>
                <div><img src="/imgs/5.png" /></div>
                <div><img src="/imgs/6.png" /></div>
                <Button
                    style={{
                        position:"absolute",
                        right:'0px',
                        borderRadius:'10px',
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
                        sm: 6,
                        md: 8,
                        lg: 10,
                        xl: 12,
                        xxl: 14
                    }}
                    style={{marginLeft:'40px'}}
                    dataSource={data}
                    renderItem={(item) => (
                        <List.Item>
                            <Button
                                style={{backgroundColor: "#f4f5f6",
                                borderRadius: "10px",
                                }}
                                type="default"
                                shape="default">
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