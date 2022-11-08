import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {convertTypeObjToSelectList, errorMSG, getFormData, successMSG} from "../../Utils/CommonFuncs.js";
import {Avatar, Button, Form, Input, List, Modal, Select, Skeleton, Switch, Upload} from "antd";
import TextArea from "antd/es/input/TextArea.js";
import {InboxOutlined, UploadOutlined} from "@ant-design/icons";

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

function AllMovies(props) {
    // 获取Form操作对象
    const [form] = Form.useForm();

    //对话框显示状态
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [type_array, setTypeArray] = React.useState([
        {
            value: "-1",
            label: "暂无分类"
        }
    ]);
    const [is_public, setIsPublic] = React.useState(true);

    const handleOk = () => {
        //启动加载状态
        setInitLoading(true)
        //构造请求体
        let req_body = new FormData()
        req_body.append('id', item_temp.id)
        req_body.append('typeName', update_val)
        //发送请求
        axios.post('/api/type/update', req_body)
            .then((res) => {
                console.log('返回结果', res.data)
                if (!res.data.success) {//检查是否成功
                    //如果失败，则做出提示，然后直接返回
                    errorMSG('更新失败：' + res.data.errorMsg)
                    return
                }
                //如果成功，则做出提示，然后清空输入框
                successMSG('更新成功')
            })
            .catch((err) => {
                console.log('错误信息', err)
                errorMSG(err.message + '请检查网络连接')
            })
            .finally(() => {
                //关闭加载状态
                setInitLoading(false)
                //变更Loading，要求重新加载列表数据
                setLoading(!loading)
            })


        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    // 对话框数值
    const [movie_name, setMovieName] = useState('')

    // 跳转到编辑页面，并传递视频参数
    const goToEdit = (item) => {
        setMovieName(item.name)
        errorMSG('暂未开发完成')
        setIsModalOpen(true);
        //TODO: 跳转到编辑页面并传递数值
        form.setFieldsValue({
            'movie-name': item.name
        })
    }

    //列表初始时加载状态设置
    const [initLoading, setInitLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [list, setList] = useState([]);

    //博客删除方法
    const deleteItem = (id) => {
        console.log('删除的影片ID是', id)
        //启动加载状态
        setInitLoading(true)
        //构造请求体
        let req_body = new FormData()
        req_body.append('movieId', id)
        //发送请求
        axios.post('/api/movie/delete', req_body)
            .then((res) => {
                console.log('返回结果', res.data)
                if (!res.data.success) {//检查是否成功
                    //如果失败，则做出提示，然后直接返回
                    errorMSG('删除失败：' + res.data.errorMsg)
                    return
                }
                //如果成功，则做出提示，然后清空输入框
                successMSG('删除成功')
            })
            .catch((err) => {
                console.log('错误信息', err)
                errorMSG(err.message + '请检查网络连接')
            })
            .finally(() => {
                //变更Loading，要求重新加载列表数据
                setLoading(!loading)
            })
    }

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

    //表单上传函数
    const onFormSubmit = (values) => {

        console.log("表单信息: ", values)
        console.log()
        //检查文件是否上传
        if (values.dragger === undefined || values.dragger.length === 0) {
            errorMSG('请上传电影文件')
            return
        }
        //检查图片是否上传
        if (values["picture-upload"] === undefined || values["picture-upload"].length === 0) {
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

    useEffect(() => {//数据加载函数
        //发送请求
        axios.post('/api/movie/getAll')
            .then((res) => {
                console.log('返回结果', res.data)
                if (!res.data.success) {//检查是否成功
                    //如果失败，则做出提示，然后直接返回
                    errorMSG('获取分类列表失败：' + res.data.errorMsg)
                    setInitLoading(false)
                    setList([])
                    return
                }
                let data_recv = res.data.data
                //设置数据
                setList(data_recv)
            })
            .catch((err) => {
                console.log('错误信息', err)
                errorMSG(err.message + '请检查网络连接')
            })
            .finally(() => {
                //关闭加载状态
                setInitLoading(false)
            })
        //获取分类列表
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
    }, [loading]);//绑定loading变量，只有当loading变化时，重新加载

    return (
        <div>
            <List
                loading={initLoading}
                itemLayout="horizontal"
                dataSource={list}
                renderItem={(item) => (
                    <List.Item
                        style={{height: '300px'}}
                        actions={[
                            <Button
                                key="list-loadmore-edit"
                                type={"primary"}
                                onClick={() => {
                                    goToEdit(item)
                                }}
                            >编辑</Button>,
                            <Button
                                key="list-loadmore-delete"
                                type={"primary"} danger
                                onClick={(msg) => {
                                    deleteItem(item.id)
                                }}
                            >删除</Button>,
                        ]}
                    >
                        <Skeleton avatar title={false} loading={item.loading} active>
                            <List.Item.Meta
                                size={{
                                    xs: 24,
                                    sm: 32,
                                    md: 40,
                                    lg: 64,
                                    xl: 80,
                                    xxl: 100,
                                }}
                                avatar={<Avatar src={'/api/movie/getFile?url=' + item.pic}/>}
                                title={<a style={{maxWidth: '90%', wordBreak: 'break-all'}}>{item.name}</a>}
                                description={<div style={{maxWidth: '90%', wordBreak: 'break-all'}}>{item.des}</div>}
                            />
                            <video
                                src={'/api/movie/getFile?url=' + item.file}
                                style={{width: '50%'}}
                                controls={true}
                            />
                            <div>作者：{item.uploader}</div>
                        </Skeleton>
                    </List.Item>
                )}
            />

            {/*弹出影片信息输入框*/}
            <Modal title="更新影片信息"
                   open={isModalOpen}
                   onOk={handleOk}
                   onCancel={handleCancel}
                   cancelText={'取消'}
                   okText={'确认'}
                   maskClosable={false}//点击遮罩层后是否关闭
            >
                <Form
                    form={form}
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
                        <Input
                            value={movie_name}
                            onChange={(e) => {
                                setMovieName(e.target.value)
                            }}
                            placeholder="输入影片的名称"/>
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
                                onChange={(info) => onMovieFileUpload(info)}
                        >
                            <Button icon={<UploadOutlined/>}>点击上传</Button>
                        </Upload>
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
            </Modal>
        </div>
    );
}

export default AllMovies;