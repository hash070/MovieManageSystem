import axios from "axios";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

//设置基础URL
axios.defaults.baseURL = "http://127.0.0.1:8901";
// axios请求拦截器
axios.interceptors.request.use(
    config => {
        NProgress.start() // 设置加载进度条(开始..)
        return config
    },
    error => {
        NProgress.done() // 设置加载进度条(结束..)
        NProgress.remove();
        return Promise.reject(error)
    }
)
// axios响应拦截器
axios.interceptors.response.use(
    function (response) {
        NProgress.done() // 设置加载进度条(结束..)
        NProgress.remove();
        return response
    },
    function (error) {
        NProgress.done() // 设置加载进度条(结束..)
        NProgress.remove();
        return Promise.reject(error)
    }
)