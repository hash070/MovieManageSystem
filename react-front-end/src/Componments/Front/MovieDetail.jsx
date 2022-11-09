import React from 'react';
import {useParams} from "react-router-dom";

function MovieDetail(props) {
    // 获取路由参数
    const params = useParams()
    return (
        <div>
            这里是影片详情界面{params.id}
        </div>
    );
}

export default MovieDetail;