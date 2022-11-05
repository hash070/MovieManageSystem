import React, {useState} from 'react';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite'
// import style manually
import 'react-markdown-editor-lite/lib/index.css'

import ReactMarkdown from 'react-markdown'

// import 'github-markdown-css'

//添加表格支持
import remarkGfm from 'remark-gfm'
import {Button, Input} from "antd";
const { TextArea } = Input;

import {errorMSG} from "../../Utils/CommonFuncs.js";

function NewBlog(props) {

    // 初始化MarkDown解析器
    const mdParser = new MarkdownIt(/* Markdown-it options */);

    // MarkDown编辑器，数据绑定
    let [html_text, upDataHtml] = useState('')
    let [markdown_text, upMarkDownText] = useState('')
    // 标题输入框数据绑定
    let [title_text, upTitleText] = useState('')
    // 详情输入框数据绑定
    let [detail_text, upDetailText] = useState('')

    // 输入框内容变更Handler
    function handleEditorChange({html, text}) {
        console.log('handleEditorChange', html, text);
        upDataHtml(html)
        upMarkDownText(text)
    }

    const onSubmit = () => {
        console.log('提交的数据是', title_text, markdown_text,detail_text)
        //检查数据是否为空
        if (title_text === '' || html_text === '' || markdown_text === ''||detail_text === '') {
            errorMSG('提交内容不能为空')
            return
        }

    }

    return (
        <div>
            <Input
                style={{
                    width: 'calc(100% - 88px)',
                }}
                //数据流双向绑定
                value={title_text}
                onChange={(e) => {
                    console.log('输入框值更新', e.target.value)
                    upTitleText(e.target.value)
                }}
                placeholder="文章标题"
            />

            <Button
                type="primary"
                onClick={onSubmit}
            >发布文章</Button>
            <br/>
            <br/>

            <TextArea
                showCount
                maxLength={100}
                style={{
                    height: 120,
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