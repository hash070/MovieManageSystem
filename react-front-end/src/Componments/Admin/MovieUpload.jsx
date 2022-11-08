import React, {useEffect} from "react";
import "antd/dist/antd.css";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Form, Select, Switch, Upload, Input } from "antd";
import axios from "axios";
import {convertTypeObjToSelectList, errorMSG} from "../../Utils/CommonFuncs.js";

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
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};


const MovieUpload = () => {
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
                //设置数据
                console.log('默认数据',type_array)
                let list_data=  convertTypeObjToSelectList(data_recv)
                console.log('转换后的数据', list_data)
                setTypeArray(list_data)
            })
    },[]);//绑定loading变量，只有当loading变化时，重新加载


    const [type_array, setTypeArray] = React.useState([
        {
            value: "-1",
            label: "暂无分类"
        }
    ]);

    const onFinish = (values) => {
        console.log("Received values of form: ", values);
    };
    return (
        <Form
            name="validate_other"
            {...formItemLayout}
            onFinish={onFinish}
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
                <Input placeholder="输入影片的名称" />
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
                name="movie-visibility"
                label="影片是否公开"
                valuePropName="checked"
            >
                <Switch defaultChecked />
            </Form.Item>

            <Form.Item
                name="picture-upload"
                label="上传电影封面"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                extra="电影封面"
            >
                <Upload name="logo" action="/upload.do" listType="picture">
                    <Button icon={<UploadOutlined />}>点击上传</Button>
                </Upload>
            </Form.Item>

            <Form.Item label="影片上传">
                <Form.Item
                    name="dragger"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    noStyle
                >
                    <Upload.Dragger name="files" action="/upload.do">
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">拖拽影片到这里</p>
                        <p className="ant-upload-hint">支持上传mp4</p>
                    </Upload.Dragger>
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
