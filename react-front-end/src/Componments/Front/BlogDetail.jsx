import React from 'react';
import {useParams} from "react-router-dom";

function BlogDetail(props) {
    // 获取路由参数
    const params = useParams()

    return (
        <div>
            这里是文章阅读界面{params.id}
        </div>
    );
}

export default BlogDetail;