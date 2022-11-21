import React, {useEffect} from 'react';
import {Outlet, useNavigate} from "react-router-dom";
import {Button} from "antd";
import {ArrowLeftOutlined} from "@ant-design/icons";
import '../../styles/HomePage.css'
import {headerJSMovement} from "../../Utils/CommonFuncs.js";


function BlogIndex(props) {
    const navigate = useNavigate()

    //网页头部JS动态效果加载Hooks
    useEffect(() => {
        headerJSMovement()
    }, [])
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