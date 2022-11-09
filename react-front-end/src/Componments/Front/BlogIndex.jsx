import React from 'react';
import {Outlet} from "react-router-dom";

function BlogIndex(props) {
    return (
        <div>
            这里是影片观看界面的Index
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