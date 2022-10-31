import React, {Component} from 'react';
import {BrowserRouter, HashRouter, Route, Routes} from "react-router-dom";
import HelloWorld1 from "../Componments/HelloWorld1.jsx";
import HelloWorld2 from "../Componments/HelloWorld2.jsx";
import AdminTest from "../Componments/AdminTest.jsx";
import Login from "../Componments/Login.jsx";


class MyRouter extends Component {
    render() {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path='/'>
                        <Route index element={<HelloWorld1/>}/>
                    </Route>
                    <Route path={'/admin'}>
                        <Route index element={<HelloWorld1/>}/>
                        <Route path='hello2' element={<HelloWorld2/>}/>
                        <Route path='login' element={<Login/>}/>
                        <Route path='adminTest' element={<AdminTest/>}/>
                    </Route>
                </Routes>
            </BrowserRouter>
        );
    }
}

export default MyRouter;