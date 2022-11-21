import React from 'react'
import ReactDOM from 'react-dom/client'
import MyRouter from "./Routes/MyRouter.jsx";
import './Utils/AxiosConf'
// import './styles/ButtonRadius.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <MyRouter/>
    </React.StrictMode>
)
