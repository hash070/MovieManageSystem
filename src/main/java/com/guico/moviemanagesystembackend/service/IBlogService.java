package com.guico.moviemanagesystembackend.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.guico.moviemanagesystembackend.entry.Blog;
import com.guico.moviemanagesystembackend.utils.Result;

public interface IBlogService extends IService<Blog> {

    Result getAll();

    Result getBlogByAuthorId(String authorId);

    Result getBlogBySearch(String search);

    Result addBlog(Blog blog);

    Result deleteBlog(String blogId);

    Result updateBlog(Blog blog);

}
