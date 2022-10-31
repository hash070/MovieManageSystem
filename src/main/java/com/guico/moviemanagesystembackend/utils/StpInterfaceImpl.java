package com.guico.moviemanagesystembackend.utils;

import cn.dev33.satoken.stp.StpInterface;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class StpInterfaceImpl implements StpInterface {


    @Override
    public List<String> getPermissionList(Object o, String s) {
        List<String> list = new ArrayList<>();
//        root管理员权限
        list.add("user.add");
        list.add("user.delete");
        list.add("user.update");
//        仅管理员可以对type进行增删改
        list.add("type.add");
        list.add("type.delete");
        list.add("type.update");
//        仅管理员可以对任意电影进行修改和删除
//        作者仅能对自己的电影进行修改和删除
        list.add("movie.update");
        list.add("movie.delete");
//        仅管理员可以对任意文章进行修改和删除
//        作者仅能对自己的文章进行修改和删除
        list.add("blog.update");
        list.add("blog.delete");
        return list;
    }

    @Override
    public List<String> getRoleList(Object o, String s) {
        List<String> list = new ArrayList<>();
        list.add("root");
        list.add("admin");
        list.add("author");
        list.add("user");
        return list;
    }
}
