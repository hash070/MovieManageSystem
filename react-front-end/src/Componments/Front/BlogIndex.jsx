import React from 'react';
import {Outlet, useNavigate} from "react-router-dom";
import {Button} from "antd";
import {ArrowLeftOutlined} from "@ant-design/icons";

function BlogIndex(props) {
    const navigate = useNavigate()
    return (
        <div>
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

            <p>这里是文章阅读界面的根目录</p>
            <div
                className="site-layout-background"
                style={{
                    padding: 24,
                    minHeight: 360,
                }}
            >
                <Outlet/>
            </div>
        </div>
    );
}

export default BlogIndex;