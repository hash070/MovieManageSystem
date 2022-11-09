import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import ReactPlayer from "react-player";
import {errorMSG, getFormData} from "../../Utils/CommonFuncs.js";
import axios from "axios";

function MovieDetail(props) {
    // 获取路由参数
    const params = useParams()

    // 变量存放
    // 放置一个默认的链接是为了防止获取并拼接出文件url前出现404错误，从而导致视频有时无法播放的BUG
    let [video_url, setVideoURL] = useState('https://ts.hash070.top/109/x264webmpack_agadrquaagpbyvu_AgADRQUAAgPBYVU.mp4?hash=AgADIg')
    let [title_text, setTitle] = useState('')
    let [author_text, setAuthor] = useState('')
    let [desc_text, setDesc] = useState('')

    //获取影片内容的Hooks函数
    useEffect(() => {
        //构建请求体
        let req_body = getFormData({
            id: params.id
        })
        axios.post('/api/movie/getById', req_body)
            .then((res) => {
                console.log('返回结果', res.data)
                if (!res.data.success) {//检查是否成功
                    //如果失败，则做出提示，然后直接返回
                    errorMSG('获取视频失败：' + res.data.errorMsg)
                    return
                }
                //设置视频数据
                let data_recv = res.data.data
                setVideoURL('/api/movie/getFile?url=' + data_recv.file)
                setTitle(data_recv.name)
                setAuthor(data_recv.uploader)
                setDesc(data_recv.des)
            })
            .catch((err) => {
                console.log('错误信息', err)
                errorMSG(err.message + '请检查网络连接')
            })
    }, [])

    return (
        <div>
            <b style={{fontSize: '30px'}}>{title_text}</b>
            <br/>
            <br/>
            <ReactPlayer
                controls={true}
                url={video_url}
                playing={true}
                loop={true}
                style={{
                    margin: 'auto',
                    width: '100%',
                    height: 'auto',
                    maxWidth: '100%',
                    maxWeight: '100%',
                }}
            />
            <br/>
            <p style={{fontSize: '15px'}}>作者：{author_text}</p>
            <p style={{fontSize: '15px'}}>影片描述：{desc_text}</p>
        </div>
    );
}

export default MovieDetail;