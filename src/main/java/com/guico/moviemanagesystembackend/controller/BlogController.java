package com.guico.moviemanagesystembackend.controller;

import com.guico.moviemanagesystembackend.entry.Blog;
import com.guico.moviemanagesystembackend.service.IBlogService;
import com.guico.moviemanagesystembackend.utils.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.Objects;

@RestController
@CrossOrigin
@RequestMapping("/api/blog")
public class BlogController {

    @Autowired
    IBlogService blogService;

    @PostMapping("/getAll")
    public Result getAll() {
        return blogService.getAll();
    }

    @PostMapping("/getByEmail")
    public Result getBlogByAuthorId(String email) {
        return blogService.getBlogByAuthorId(email);
    }

    @PostMapping("/getBySearch")
    public Result getBlogBySearch(String search) {
        return blogService.getBlogBySearch(search);
    }

//    @PostMapping("/add")
//    public Result addBlog(String des, String title, String article,String author, Date uploadTime, Boolean isNews) {
//        return blogService.addBlog(des, title, article, author, uploadTime, isNews);
//    }

    @PostMapping("/getById")
    public Result getBlogById(Long id) {
        return blogService.getBlogById(id);
    }

    @PostMapping("/add")
    public Result addBlog(String des, String title, String article, Date uploadTime, Boolean isNews) {
        return blogService.addBlog(des, title, article, uploadTime, isNews);
    }

    @PostMapping("/delete")
    public Result deleteBlog(Long blogId) {
        return blogService.deleteBlog(blogId);
    }

    @PostMapping("/update")
    public Result updateBlog(Long id, String des, String title, String article, Boolean isNews) {
        return blogService.updateBlog(id, des, title, article, isNews);
    }

    @PostMapping("/getAllPublicBlogs")
    public Result getAllPublicBlogs() {
        return blogService.getAllPublicBlogs();
    }
}
