import {message} from "antd";

//工具类

//失败提示信息回调函数
export function errorMSG(msg) {
    message.error(msg);
};

//成功提示信息回调函数
export function successMSG(msg) {
    message.success(msg);
};

//将对象转换成FormData
export function getFormData(object) {
    const formData = new FormData();
    Object.keys(object).forEach(key => formData.append(key, object[key]));
    return formData;
}

//邮箱Regx校验
export function getEmailCheckReg(){
    return  new RegExp('[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?')
}