import React, {useState} from 'react';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite'
// import style manually
import 'react-markdown-editor-lite/lib/index.css'

// import ReactMarkdown from 'react-markdown'
// import 'github-markdown-css'
//添加表格支持
// import remarkGfm from 'remark-gfm'
import {Button, Input} from "antd";
import {errorMSG, successMSG} from "../../Utils/CommonFuncs.js";
import axios from "axios";
import {useLocation, useNavigate} from "react-router-dom";

const {TextArea} = Input;

function NewBlog(props) {
    // 获取Navigate
    const navigate = useNavigate()
    // 获取Location
    const location = useLocation();

    // 初始化MarkDown解析器
    const mdParser = new MarkdownIt(/* Markdown-it options */);

    // 获得State中的所有变量
    // Check if state is null
    let {id, des, title, article, author, uploadTime, views, isNews} = location.state === null ? {
        id: null,
        des: null,
        title: null,
        article: null,
        author: null,
        uploadTime: null,
        views: null,
        isNews: null
    } : location.state

    // MarkDown编辑器，数据绑定
    let [html_text, upDataHtml] = useState('')
    let [markdown_text, upMarkDownText] = useState(article == null ? '' : article) // 如果是Null的话，就设置为空字符串
    // 标题输入框数据绑定
    let [title_text, upTitleText] = useState(title == null ? '' : title)
    // 详情输入框数据绑定
    let [detail_text, upDetailText] = useState(des == null ? '' : des)
    // 是否是外部跳转
    let [is_out, upIsOut] = useState(article != null)//如果不是null，则意味着是外部跳转过来的
    // 设置提交按钮文字
    let [submit_button_text, submitButtonText] = useState(is_out ? '更新文章' : '发布文章')


    // 输入框内容变更Handler
    function handleEditorChange({html, text}) {
        console.log('handleEditorChange', html, text);
        upDataHtml(html)
        upMarkDownText(text)
    }

    const onSubmit = () => {
        console.log('提交的数据是', title_text, markdown_text, detail_text)
        //检查数据是否为空
        if (title_text === '' || markdown_text === '' || detail_text === '') {
            errorMSG('提交内容不能为空')
            return
        }

        // 开始构建请求体
        let req_body = new FormData()
        // 文章标题
        req_body.append('title', title_text)
        // 文章描述
        req_body.append('des', detail_text)
        // 文章内容
        req_body.append('article', markdown_text)
        // 当前日期 格式：2022-11-04T04:30:31.000+00:00 //decrypted//现在使用服务端时间
        req_body.append('uploadTime', new Date().toISOString())
        // isNews
        req_body.append('isNews', 'false')

        let blog_api = ''
        let blog_add_api = '/api/blog/add'
        let blog_update_api = '/api/blog/update'

        let success_msg = ''

        console.log('是否为外部请求', is_out)

        // 发送请求
        if (is_out) {//如果是外部请求
            blog_api = blog_update_api // 则意味着这是更新请求
            //如果是外部请求，则需要添加文章ID
            req_body.append('id', id)
            success_msg = '文章更新成功'
        } else {
            blog_api = blog_add_api // 否则是添加请求
            success_msg = '文章发布成功'
        }

        console.log('发送的请求体：', req_body)

        axios.post(blog_api, req_body)
            .then(res => {
                console.log('发送请求完成', res)
                //检查返回状态
                if (!res.data.success) {//失败
                    console.log('错误信息', res.data.errorMsg)
                    errorMSG('文章发布失败：' + res.data.errorMsg)
                    return
                }
                //成功
                successMSG(success_msg)
                //清空数据
                upTitleText('')
                upDetailText('')
                upMarkDownText('')
                // 如果是修改文章的话，点击提交后就跳转到博客列表
                if (is_out) {
                    navigate('/admin/blog/all')
                }
            })
            .catch((err) => {
                console.log('error', err)
                errorMSG('网络错误，请检查网络连接')
            })

    }

    return (
        <div>
            <Input
                style={{
                    width: 'calc(100% - 90px)',
                }}
                //数据流双向绑定
                value={title_text}
                onChange={(e) => {
                    console.log('输入框值更新', e.target.value)
                    upTitleText(e.target.value)
                }}
                placeholder="文章标题"
                maxLength={100}
            />

            <Button
                type="primary"
                onClick={onSubmit}
            >{submit_button_text}</Button>
            <br/>
            <br/>

            <TextArea
                showCount
                maxLength={180}
                style={{
                    height: 120,
                    resize: 'none',
                }}
                //数据流双向绑定
                value={detail_text}
                onChange={(e) => {
                    console.log('输入框值更新', e.target.value)
                    upDetailText(e.target.value)
                }}
                placeholder="文章描述"
            />
            <br/>
            <MdEditor style={{height: '600px'}}
                      renderHTML={text => mdParser.render(text)} //实时渲染方法
                      value={markdown_text} //绑定数据
                      onChange={handleEditorChange} //编辑器内容改变时的触发器
            />

            {/*<h1>下方是文章浏览界面</h1>*/}
            {/*<ReactMarkdown*/}
            {/*    className={'custom-html-style'} //设置CSS类名，让react-markdown-editor-lite的样式生效*/}
            {/*    children={markdown_text} //设置要显示的内容*/}
            {/*    remarkPlugins={[remarkGfm]} //添加表格支持*/}
            {/*/>*/}

        </div>
    );
}

export default NewBlog;