package com.guico.moviemanagesystembackend.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.guico.moviemanagesystembackend.entry.Blog;
import com.guico.moviemanagesystembackend.mapper.BlogMapper;
import com.guico.moviemanagesystembackend.service.IBlogService;
import com.guico.moviemanagesystembackend.utils.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class BlogServiceImpl extends ServiceImpl<BlogMapper, Blog> implements IBlogService {

    @Autowired
    StringRedisTemplate stringRedisTemplate;

//    Blog对象以HashMap的形式存储在Redis中，key为blogId，value为Blog对象
    public Result getAll(){
//        先从Redis中获取所有的Blog对象
        List<Object> blogList = stringRedisTemplate.opsForHash().values("blog");

//        如果Redis中没有Blog对象，则从数据库中获取
        if(blogList.size() == 0) {
            List<Blog> blogs = null;
            blogs = query().list();
//            将从数据库中获取的Blog对象存储到Redis中
            for (Blog blog : blogs) {
                stringRedisTemplate.opsForHash().put("blog", blog.getId(), blog);
            }
            return Result.ok(blogs, blogs.size());
        }
//        如果Redis中有Blog对象，则直接返回
        return Result.ok(blogList, blogList.size());
    }

    @Override
    public Result getBlogByAuthorId(String authorId) {
//        先从Redis中获取所有的Blog对象
        List<Blog> blogs = Collections.unmodifiableList((List<Blog>) getAll().getData());
//        从所有的Blog对象中筛选出authorId为authorId的Blog对象
        for (int i = 0; i < blogs.size(); i++) {
            if(!blogs.get(i).getAuthor().equals(authorId)){
                blogs.remove(i);
                i--;
            }
        }
        return Result.ok(blogs, blogs.size());
    }

    @Override
    public Result getBlogBySearch(String search) {
//        先从Redis中获取所有的Blog对象
        List<Blog> blogs = Collections.unmodifiableList((List<Blog>) getAll().getData());
//        从所有的Blog对象中筛选出title或content中包含search的Blog对象
        for (int i = 0; i < blogs.size(); i++) {
            if(!blogs.get(i).getTitle().contains(search) && !blogs.get(i).getTitle().contains(search)){
                blogs.remove(i);
                i--;
            }
        }
        return Result.ok(blogs, blogs.size());
    }

    @Override
    public Result addBlog(Blog blog) {
//        先在数据库中查询是否存在作者和题目相同的blog
        Blog oldBlog = query().eq("author", blog.getAuthor()).eq("title", blog.getTitle()).one();
//        如果存在，则返回错误信息
        if(oldBlog != null){
            return Result.fail("已存在相同作者和题目的blog，请修改标题再试");
        }
//        不存在，则在数据库中添加blog
        save(blog);
//        从mysql中获取Blog对象
        Blog blog1 = query().eq("title", blog.getTitle()).one();
        stringRedisTemplate.opsForHash().put("blog", blog1.getId(), blog1);
        return Result.ok();
    }

    @Override
    public Result deleteBlog(String blogId) {
//        从mysql中删除Blog对象
        removeById(blogId);
//        从Redis中删除Blog对象
        stringRedisTemplate.opsForHash().delete("blog", blogId);
        return Result.ok();
    }

    @Override
    public Result updateBlog(Blog blog) {
//        检测是否存在相同作者和题目的blog
        Blog oldBlog = query().eq("author", blog.getAuthor()).eq("title", blog.getTitle()).one();
//        如果存在，则返回错误信息
        if(oldBlog != null){
            return Result.fail("已存在相同作者和题目的blog，请修改题目");
        }
//        将Blog对象存储到mysql中
        updateById(blog);
//        再从mysql中获取Blog对象
        stringRedisTemplate.opsForHash().put("blog", blog.getId(), blog);
        return Result.ok();
    }

}

