package com.guico.moviemanagesystembackend.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.guico.moviemanagesystembackend.entry.Blog;
import com.guico.moviemanagesystembackend.utils.Result;

import java.util.Date;

public interface IBlogService extends IService<Blog> {

    Result getAll();

    Result getBlogByAuthorId(String authorId);

    Result getBlogBySearch(String search);

    Result getBlogById(Long id);

    Result addBlog(String des, String title, String article, String author, Date uploadTime, Boolean isNews);

    Result addBlog(String des, String title, String article, Date uploadTime, Boolean isNews);

    Result deleteBlog(Long blogId);

    Result updateBlog(Long id, String des, String title, String article, Boolean isNews);

    Result getAllPublicBlogs();
}
