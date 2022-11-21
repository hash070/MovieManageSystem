import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import 'react-markdown-editor-lite/lib/index.css'
import remarkGfm from 'remark-gfm'
import ReactMarkdown from "react-markdown";
import axios from "axios";
import {errorMSG, getFormData} from "../../Utils/CommonFuncs.js";


function BlogDetail(props) {
    // 获取路由参数
    const params = useParams()

    let [markdown_text, setMarkDownText] = useState('')
    let [title_text, setTitle] = useState('')
    let [author_text, setAuthor] = useState('')

    //获取文章内容的Hooks函数
    useEffect(() => {
        //构建请求体
        let req_body = getFormData({
            id: params.id
        })
        axios.post('/api/blog/getById', req_body)
            .then((res) => {
                console.log('返回结果', res.data)
                if (!res.data.success) {//检查是否成功
                    //如果失败，则做出提示，然后直接返回
                    errorMSG('获取文章失败：' + res.data.errorMsg)
                    return
                }
                //设置文章数据
                let data_recv = res.data.data
                setMarkDownText(data_recv.article)
                setTitle(data_recv.title)
                setAuthor(data_recv.author)
            })
            .catch((err) => {
                console.log('错误信息', err)
                errorMSG(err.message + '请检查网络连接')
            })
    }, [])


    return (
        <div>
            <b style={{fontSize: '40px'}}>{title_text}</b>
            <br/>
            <br/>
            <b style={{fontSize: '20px'}}>作者：{author_text}</b>
            <ReactMarkdown
                className={'custom-html-style'} //设置CSS类名，让react-markdown-editor-lite的样式生效
                children={markdown_text} //设置要显示的内容
                remarkPlugins={[remarkGfm]} //添加表格支持
            />
        </div>
    );
}

export default BlogDetail;