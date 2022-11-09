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
export function getEmailCheckReg() {
    return new RegExp('[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?')
}

//获取用户权限
export function getUserLevel(level) {
    switch (level) {
        case 0://root
            return '根用户'
            break
        case 1://admin
            return '管理员'
            break
        case 2://user
            return '普通用户'
            break
        default:
            return 'Error'
    }
}

// 菜单对象构造方法，生成菜单对象
export function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}

// 模拟React点击按钮
export function simulateMouseClick(element){
    let mouseClickEvents = ['mousedown', 'click', 'mouseup'];
    mouseClickEvents.forEach(mouseEventType =>
        element.dispatchEvent(
            new MouseEvent(mouseEventType, {
                view: window,
                bubbles: true,
                cancelable: true,
                buttons: 1
            })
        )
    );
}

function getValueAndLabel(obj) {
    return {
        value: obj.id.toString(),
        label: obj.name,
    };
}

// 转换[{id:'',name:''}...]列表为[{value:'',label:''}...]，用于适配antd的Select组件
export function convertTypeObjToSelectList(list) {
    let select = []
    for (let i = 0; i < list.length; i++) {
        select.push(getValueAndLabel(list[i]))
    }
    return select
}

//将以逗号分割的字符串转换为字符数组
export function convertTagsStrToArray(str) {
    return str.split(',')
}

function getListDataObject(obj) {
    return {
        id: obj.id,
        title: obj.name,
    };
}

// 转换[{id:'',name:''}...]列表为[{id:'',title:''}...]，用于适配antd的List组件
export function convertTypeObjToAntDList(list) {
    let antdList = []
    for (let i = 0; i < list.length; i++) {
        antdList.push(getListDataObject(list[i]))
    }
    return antdList
}