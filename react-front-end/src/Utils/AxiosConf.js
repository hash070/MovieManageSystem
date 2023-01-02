import axios from "axios";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

//设置基础URL
axios.defaults.baseURL = "https://blog-demo.hhhwww.top";
// axios.defaults.baseURL = "http://127.0.0.1:8901";

/**
 * 跨域问题解决方案：
 *

 # 删除原后端返回的响应头
 proxy_hide_header 'Access-Control-Allow-Origin';

 # 添加新的响应头，允许跨域访问
 add_header 'Access-Control-Allow-Origin' $http_origin always;
 add_header 'Access-Control-Allow-Methods' 'GET,POST,OPTIONS,DELETE,PUT' always;
 add_header 'Access-Control-Allow-Credentials' 'true' always;
 add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range' always;
 */

//要求发送Cookie
axios.defaults.withCredentials = true
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