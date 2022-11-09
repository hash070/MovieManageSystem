import React, {Component} from 'react';
import {BrowserRouter, NavLink, Route, Routes} from "react-router-dom";
import IndexPage from "../Componments/IndexPage.jsx";
import AdminIndexPage from "../Componments/AdminIndexPage.jsx";
import Login from "../Componments/Login.jsx";
import Register from "../Componments/Register.jsx";
import ResetPWD from "../Componments/ResetPWD.jsx";
import AdminPanel from "../Componments/Admin/AdminPanel.jsx";
import IndexNav from "../Componments/Admin/IndexNav.jsx";
import {Result} from "antd";
import Category from "../Componments/Admin/Category.jsx";
import NewBlog from "../Componments/Admin/NewBlog.jsx";
import AllBlogs from "../Componments/Admin/AllBlogs.jsx";
import UserProfile from "../Componments/Admin/UserProfile.jsx";
import AllUsers from "../Componments/Admin/AllUsers.jsx";
import MovieUpload from "../Componments/Admin/MovieUpload.jsx";
import AllMovies from "../Componments/Admin/AllMovies.jsx";
import BlogIndex from "../Componments/Front/BlogIndex.jsx";
import BlogDetail from "../Componments/Front/BlogDetail.jsx";
import MovieIndex from "../Componments/Front/MovieIndex.jsx";
import MovieDetail from "../Componments/Front/MovieDetail.jsx";


class MyRouter extends Component {
    render() {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path='/'>
                        <Route index element={<IndexPage/>}/>
                        <Route path='login' element={<Login/>}/>
                        <Route path='register' element={<Register/>}/>
                        <Route path='reset' element={<ResetPWD/>}/>
                        <Route path='blog' element={<BlogIndex/>}>
                            <Route path={':id'} element={<BlogDetail/>}/>
                        </Route>
                        <Route path='movie' element={<MovieIndex/>}>
                            <Route path={':id'} element={<MovieDetail/>}/>
                        </Route>
                    </Route>

                    <Route path={'/admin'} element={<AdminPanel/>}>
                        <Route index element={<AdminIndexPage/>}/>
                        <Route path='movie'>
                            <Route index element={<IndexNav name={'影片上传'} path={'/admin/movie/upload'}/>}/>
                            <Route path={'upload'} element={<MovieUpload/>}/>
                            <Route path={'all'} element={<AllMovies/>}/>
                            <Route path={'category'} element={<Category/>}/>
                        </Route>
                        <Route path='blog'>
                            <Route index element={<IndexNav name={'新建文章'} path={'/admin/blog/new'}/>}/>
                            <Route path={'new'} element={<NewBlog/>}/>
                            <Route path={'all'} element={<AllBlogs/>}/>
                        </Route>
                        <Route path='user'>
                            <Route index element={<IndexNav name={'个人资料'} path={'/admin/user/profile'}/>}/>
                            <Route path={'profile'} element={<UserProfile/>}/>
                            <Route path={'all'} element={<AllUsers/>}/>
                        </Route>
                    </Route>

                    {/*404 界面*/}
                    <Route path='*' element={
                        <Result
                            status="404"
                            title="404"
                            subTitle="抱歉，你访问的页面不存在。"
                            extra={<NavLink to="/admin"
                                            style={{
                                                color: '#3d82ff',
                                                background: '#f0f0f0',
                                            }
                                            }>返回首页</NavLink>}
                        />
                    }/>
                </Routes>
            </BrowserRouter>
        );
    }
}

export default MyRouter;