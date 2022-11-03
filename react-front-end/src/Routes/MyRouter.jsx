import React, {Component} from 'react';
import {BrowserRouter, HashRouter, Route, Routes} from "react-router-dom";
import HelloWorld1 from "../Componments/HelloWorld1.jsx";
import HelloWorld2 from "../Componments/HelloWorld2.jsx";
import AdminTest from "../Componments/AdminTest.jsx";
import Login from "../Componments/Login.jsx";
import Register from "../Componments/Register.jsx";
import ResetPWD from "../Componments/ResetPWD.jsx";
import AdminPanel from "../Componments/Admin/AdminPanel.jsx";


class MyRouter extends Component {
    render() {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path='/'>
                        <Route index element={<HelloWorld1/>}/>
                        <Route path='login' element={<Login/>}/>
                        <Route path='register' element={<Register/>}/>
                        <Route path='reset' element={<ResetPWD/>}/>
                    </Route>
                    <Route path={'/admin'} element={<AdminPanel/>}>
                        <Route index element={<HelloWorld2/>}/>
                        <Route path='adminTest' element={<AdminTest/>}/>
                    </Route>
                </Routes>
            </BrowserRouter>
        );
    }
}

export default MyRouter;