import React, {useEffect} from "react";
import "antd/dist/antd.css";
import {InboxOutlined, UploadOutlined} from "@ant-design/icons";
import {Button, Form, Select, Switch, Upload, Input} from "antd";
import axios from "axios";
import {convertTypeObjToSelectList, errorMSG, getFormData, successMSG} from "../../Utils/CommonFuncs.js";
import TextArea from "antd/es/input/TextArea.js";
import {useNavigate} from "react-router-dom";

// 表单布局
const formItemLayout = {
    labelCol: {
        span: 6
    },
    wrapperCol: {
        span: 14
    }
};

const normFile = (e) => {
    console.log("表单文件上传回调函数:", e);
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};

let pic_upload_info
let movie_upload_info

const MovieUpload = () => {
    //获取navigate
    const navigate = useNavigate()

    useEffect(() => {//数据加载函数
        //发送请求
        axios.post('/api/type/getAll')
            .then((res) => {
                console.log('返回结果', res.data)
                if (!res.data.success) {//检查是否成功
                    //如果失败，则做出提示，然后直接返回
                    errorMSG('获取分类列表失败：' + res.data.errorMsg)
                    return
                }
                let data_recv = res.data.data
                //转换与设置数据
                let list_data = convertTypeObjToSelectList(data_recv)
                //如果长度为0，则提示添加分类且不设置数据
                if (list_data.length === 0) {
                    errorMSG('请先联系管理员添加电影分类')
                    return
                }
                console.log('转换后的数据', list_data)
                setTypeArray(list_data)
            })
    }, []);//绑定loading变量，只有当loading变化时，重新加载
    //在严格模式下，React会故意运行两次这个钩子函数，以便检查是否有副作用


    const [type_array, setTypeArray] = React.useState([
        {
            value: "-1",
            label: "暂无分类"
        }
    ]);

    const [is_public, setIsPublic] = React.useState(true);

    const onFormSubmit = (values) => {

        console.log("表单信息: ", values)
        console.log()
        //检查文件是否上传
        if (values.dragger===undefined||values.dragger.length === 0) {
            errorMSG('请上传电影文件')
            return
        }
        //检查图片是否上传
        if (values["picture-upload"]===undefined||values["picture-upload"].length === 0) {
            errorMSG('请上传电影图片')
            return
        }

        //构建请求体
        let req_body = getFormData({
            name: values["movie-name"],
            des: values["movie-desc"],
            typeId: values["movie-type"],
            tags: values["movie-tags"],
            visibility: is_public,
            pic: values["picture-upload"][0].response.data,
            movie: values.dragger[0].response.data
        })

        //循环遍历请求体中的键和值
        for (let key of req_body.entries()) {
            console.log(key[0] + ', ' + key[1]);
        }

        //发送请求
        axios.post('/api/movie/upload', req_body)
            .then((res) => {
                console.log('返回结果', res.data)
                if (!res.data.success) {//检查是否成功
                    //如果失败，则做出提示，然后直接返回
                    errorMSG('上传电影失败：' + res.data.errorMsg)
                    return
                }
                successMSG('上传电影成功')
                //跳转到电影列表
                navigate('/admin/movie/all')

            })
            .catch((err) => {
                errorMSG('上传电影失败：' + err)
            })

    };

    //图片文件上传回调函数
    const onPictureFileUpload = (info) => {
        console.log('图片文件上传信息', info)
        //当info包含response属性时，执行处理函数
        if (info.file.response) {
            console.log('图片文件上传结果', info.file.response.success)
            if (!info.file.response.success) {//检查是否成功
                errorMSG('图片文件上传失败：' + info.file.response.errorMsg)
                return
            }
            successMSG('操作成功')
            //临时保存图片文件上传信息到变量中
            pic_upload_info = info.file.response.data
            console.log('获取到的图片url', pic_upload_info)
        }
    }

    //影片上传回调函数
    const onMovieFileUpload = (info) => {
        console.log('影片文件上传信息', info)
        //当info包含response属性时，执行处理函数
        if (info.file.response) {
            console.log('影片文件上传结果', info.file.response.success)
            if (!info.file.response.success) {//检查是否成功
                errorMSG('影片文件上传失败：' + info.file.response.errorMsg)
                return
            }
            successMSG('操作成功')
            //临时保存图片文件上传信息到变量中
            movie_upload_info = info.file.response.data
            console.log('获取到的影片url', movie_upload_info)
        }
    }

    return (
        <Form
            name="validate_other"
            {...formItemLayout}
            onFinish={onFormSubmit}
            initialValues={{
                "input-number": 3,
                "checkbox-group": ["A", "B"],
                rate: 3.5
            }}
        >
            <Form.Item
                label="影片名称"
                name="movie-name"
                rules={[
                    {
                        required: true,
                        message: "请输入影片名称!"
                    }
                ]}
            >
                <Input placeholder="输入影片的名称"/>
            </Form.Item>
            <Form.Item
                name="movie-type"
                label="影片分类"
                rules={[
                    {
                        required: true,
                        message: "请选择影片类型"
                    }
                ]}
            >
                <Select
                    mode="single"
                    placeholder="选择该影片所属的分类"
                    // 搜索分类 功能 单选无效
                    // optionFilterProp="children"
                    // filterOption={(input, option) =>
                    //   (option?.label ?? "").includes(input)
                    // }
                    // filterSort={(optionA, optionB) =>
                    //   (optionA?.label ?? "")
                    //     .toLowerCase()
                    //     .localeCompare((optionB?.label ?? "").toLowerCase())
                    // }
                    options={type_array}
                />
            </Form.Item>
            <Form.Item
                name="movie-tags"
                rules={[
                    {
                        required: true,
                        message: "请输入电影标签"
                    }
                ]}
                label="电影标签"
            >
                <Select
                    mode="tags"
                    style={{
                        width: "100%"
                    }}
                    placeholder="请输入电影标签"
                />
            </Form.Item>

            <Form.Item
                name="movie-desc"
                rules={[
                    {
                        required: true,
                        message: "请输入电影描述"
                    }
                ]}
                label="电影描述"
            >
                <TextArea
                    showCount
                    maxLength={180}
                    style={{
                        height: 120,
                        resize: 'none',
                    }}
                    placeholder="请输入影片描述"
                />
            </Form.Item>

            <Form.Item
                name="movie-visibility"
                label="影片是否公开"
                valuePropName="checked"
            >
                <Switch
                    checked={is_public}
                    onChange={(e) => {
                        console.log('是否公开', e)
                        setIsPublic(e)
                    }}
                    defaultChecked/>
            </Form.Item>

            <Form.Item
                name="picture-upload"
                label="上传电影封面"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                extra="电影封面"
            >
                <Upload name="pic"
                        action="/api/movie/uploadPic"
                        maxCount={1}
                        onRemove={(e) => {
                            console.log('删除图片文件', e)
                        }}
                        listType="picture"
                        onChange={(info) => onPictureFileUpload(info)}
                >
                    <Button icon={<UploadOutlined/>}>点击上传</Button>
                </Upload>
                {/*<Input*/}
                {/*    type="file"*/}
                {/*    accept="image/*"*/}
                {/*    placeholder="点击上传影片封面"*/}
                {/*/>*/}
            </Form.Item>

            <Form.Item label="影片上传">
                <Form.Item
                    name="dragger"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    noStyle
                >
                    <Upload.Dragger
                        name="movie"
                        action="/api/movie/uploadMovie"
                        maxCount={1}
                        onRemove={(e) => {
                            console.log('删除影片文件', e)
                        }}
                        listType="picture"
                        onChange={(info) => onPictureFileUpload(info)}

                    >
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined/>
                        </p>
                        <p className="ant-upload-text">拖拽影片到这里</p>
                        <p className="ant-upload-hint">支持上传mp4</p>
                    </Upload.Dragger>
                    {/*<Input*/}
                    {/*    type="file"*/}
                    {/*    accept="video/mp4"*/}
                    {/*    placeholder="点击上传影片"*/}
                    {/*/>*/}
                </Form.Item>
            </Form.Item>

            <Form.Item
                wrapperCol={{
                    span: 12,
                    offset: 6
                }}
            >
                <Button type="primary" htmlType="submit">
                    上传影片
                </Button>
            </Form.Item>
        </Form>
    );
};
export default MovieUpload;
