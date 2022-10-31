import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import MyRouter from "./Routes/MyRouter.jsx";
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MyRouter/>
  </React.StrictMode>
)
