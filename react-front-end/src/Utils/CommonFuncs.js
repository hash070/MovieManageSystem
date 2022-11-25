import {message} from "antd";
import MarkdownIt from "markdown-it";

//工具类

//失败提示信息回调函数
export function errorMSG(msg) {
    message.error(msg);
};

//成功提示信息回调函数
export function successMSG(msg) {
    message.success(msg);
};

//普通提示信息
export function infoMSG(msg) {
    message.info(msg);
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
export function simulateMouseClick(element) {
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

// 前台头部JS动态效果
export function headerJSMovement() {
    var startX = 0;
    let blurValue;
    const images = document.querySelectorAll("header>div>img");

    document.querySelector("header").addEventListener("mousemove", (e) => {
        let offsetX = e.clientX - startX + 482;
        let percentage = offsetX / window.outerWidth;
        let offset = 15 * percentage;
        let blur = 20;

        for (let [index, image] of images.entries()) {
            offset *= 1.3;
            blurValue =
                Math.pow(index / images.length - percentage, 2) * blur;
            image.style.setProperty("--offset", `${offset}px`);
            image.style.setProperty("--blur", `${blurValue}px`);
        }
    });
    document.querySelector("header").addEventListener("mouseover", (e) => {
        startX = e.clientX;
        for (let [index, image] of images.entries()) {
            image.style.transition = "none";
        }
    });

    document.querySelector("header").addEventListener("mouseout", () => {
        let offsetX = 482;
        let blur = 20;
        let percentage = offsetX / window.outerWidth;
        let offset = 15 * percentage;
        for (let [index, image] of images.entries()) {
            offset *= 1.3;
            blurValue = Math.pow(index / images.length - percentage, 2) * blur;
            image.style.setProperty("--offset", `${offset}px`);
            image.style.setProperty("--blur", `${blurValue}px`);
            image.style.transition = "all .3s ease";
        }
    });
    window.addEventListener("load", () => {
        let offsetX = 482;
        let blur = 20;
        let percentage = offsetX / window.outerWidth;
        let offset = 15 * percentage;
        for (let [index, image] of images.entries()) {
            offset *= 1.3;
            blurValue = Math.pow(index / images.length - percentage, 2) * blur;
            image.style.setProperty("--offset", `${offset}px`);
            image.style.setProperty("--blur", `${blurValue}px`);
        }
    });
}

export function getMarkdownIterator(){
    return new MarkdownIt({
        html:         true,        // Enable HTML tags in source
        xhtmlOut:     false,        // Use '/' to close single tags (<br />).
                                    // This is only for full CommonMark compatibility.
        breaks:       false,        // Convert '\n' in paragraphs into <br>
        langPrefix:   'language-',  // CSS language prefix for fenced blocks. Can be
                                    // useful for external highlighters.
        linkify:      true,        // Autoconvert URL-like text to links

        // Enable some language-neutral replacement + quotes beautification
        // For the full list of replacements, see https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/replacements.js
        typographer:  false,
    });
}