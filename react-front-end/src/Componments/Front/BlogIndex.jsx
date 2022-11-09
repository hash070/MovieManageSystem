import React, {useEffect} from 'react';
import {Outlet, useNavigate} from "react-router-dom";
import {Button} from "antd";
import {ArrowLeftOutlined, ReloadOutlined} from "@ant-design/icons";
import '../../styles/HomePage.css'


function BlogIndex(props) {
    const navigate = useNavigate()

    //网页头部JS动态效果加载Hooks
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
    return (
        <div>
            {/*<div*/}
            {/*    style={{*/}
            {/*        position: 'absolute',*/}
            {/*        top: '0',*/}
            {/*        zIndex: '1002',*/}
            {/*        display: 'flex',*/}
            {/*        alignItems: 'center',*/}
            {/*        justifyContent: 'space-between',*/}
            {/*        padding: '0 24px',*/}
            {/*        maxWidth: '2560px',*/}
            {/*        width: '100%',*/}
            {/*        height: '64px',*/}
            {/*    }}*/}
            {/*>*/}
            {/*    <Button*/}
            {/*        className='radius-btn'*/}
            {/*        style={{*/}
            {/*            position: "absolute",*/}
            {/*            left: '0px',*/}
            {/*            top: '0px',*/}
            {/*            margin: '20px',*/}
            {/*        }}*/}
            {/*        icon={<ArrowLeftOutlined/>}*/}
            {/*        type={'primary'}*/}
            {/*        onClick={() => {*/}
            {/*            navigate('/')*/}
            {/*        }}*/}
            {/*    >返回首页</Button>*/}
            {/*</div>*/}

            <header>
                <div><img src="/imgs/1.png"/></div>
                <div><img src="/imgs/2.png"/></div>
                <div><img src="/imgs/3.png"/></div>
                <div><img src="/imgs/4.png"/></div>
                <div><img src="/imgs/5.png"/></div>
                <div><img src="/imgs/6.png"/></div>
                <Button
                    className='radius-btn'
                    style={{
                        position: "absolute",
                        left: '0px',
                        top: '0px',
                        margin: '20px',
                    }}
                    icon={<ArrowLeftOutlined/>}
                    type={'primary'}
                    onClick={() => {
                        navigate('/')
                    }}
                >返回首页</Button>
                <Button
                    className='radius-btn'
                    style={{
                        position: "absolute",
                        right: '0px',
                        margin: '20px'
                    }}
                    onClick={() => navigate('/admin')}
                    type={'primary'}
                >管理后台</Button>
            </header>

            {/*文章容器*/}
            <div
                style={{
                    padding: 24,
                    minHeight: 360,
                    paddingTop: '64px',
                    maxWidth: '800px',
                    width: '100%',
                    left: 0,
                    right: 0,
                    margin: 'auto'
                }}
            >
                <Outlet/>
            </div>
        </div>
    );
}

export default BlogIndex;