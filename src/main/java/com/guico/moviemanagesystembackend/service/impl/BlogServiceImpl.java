package com.guico.moviemanagesystembackend.service.impl;

import cn.hutool.core.util.BooleanUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.guico.moviemanagesystembackend.entry.Blog;
import com.guico.moviemanagesystembackend.entry.User;
import com.guico.moviemanagesystembackend.interceptor.InterceptorUtil;
import com.guico.moviemanagesystembackend.mapper.BlogMapper;
import com.guico.moviemanagesystembackend.service.IBlogService;
import com.guico.moviemanagesystembackend.service.IUserService;
import com.guico.moviemanagesystembackend.utils.RedisUtil;
import com.guico.moviemanagesystembackend.utils.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class BlogServiceImpl extends ServiceImpl<BlogMapper, Blog> implements IBlogService {

    @Autowired
    StringRedisTemplate stringRedisTemplate;

    @Autowired
    IUserService userService;

    @Autowired
    HttpServletRequest request;

//    Blog对象以HashMap的形式存储在Redis中，key为blogId，value为Blog对象
    public Result getAll(){
        User user = InterceptorUtil.getUser(request, stringRedisTemplate);
        if(user.getLevel()>1){
            return getBlogByAuthorId(user.getEmail());
        }
//        先从Redis中获取所有的Blog对象
        List<Blog> blogList = RedisUtil.getAllBlogs(stringRedisTemplate);
//        如果Redis中没有Blog对象，则从数据库中获取
        if(blogList.size() == 0) {
            List<Blog> blogs =  query().list();
            if(blogs.size() == 0) {
                return Result.fail("暂无博客");
            }
//            将从数据库中获取的Blog对象存储到Redis中
            for (Blog blog : blogs) {
                stringRedisTemplate.opsForHash().putAll("blog:" + blog.getId(), blog.toMap());
            }
            return Result.ok(blogs, blogs.size());
        }
//        如果Redis中有Blog对象，则直接返回
        return Result.ok(blogList, blogList.size());
    }

    @Override
    public Result getBlogByAuthorId(String authorId) {
//        先从Redis中获取所有的Blog对象
        List<Blog> blogList = RedisUtil.getAllBlogs(stringRedisTemplate);
//        如果Redis中没有Blog对象，则从数据库中获取
        if(blogList.size() == 0) {
            List<Blog> blogs =  query().eq("author", authorId).list();
            if(blogs.size() == 0) {
                return Result.fail("暂无博客");
            }
//            将从数据库中获取的Blog对象存储到Redis中
            for (Blog blog : blogs) {
                stringRedisTemplate.opsForHash().putAll("blog:" + blog.getId(), blog.toMap());
            }
            return Result.ok(blogs, blogs.size());
        }
//        如果Redis中有Blog对象，则从Redis中获取
        blogList.removeIf(blog -> !(blog).getAuthor().equals(authorId));
        return Result.ok(blogList, blogList.size());
    }

    @Override
    public Result getBlogBySearch(String search) {
//        先从Redis中获取所有的Blog对象
        List<Blog> blogList = RedisUtil.getAllBlogs(stringRedisTemplate);
        List<Blog> blogs = null;
//        如果Redis中没有Blog对象，则从数据库中获取
        if(blogList.size() == 0) {
            blogs =  query().like("title", search).list();
            if(blogs.size() == 0) {
                return Result.fail("暂无博客");
            }
//            将从数据库中获取的Blog对象存储到Redis中
            for (Blog blog : blogs) {
                stringRedisTemplate.opsForHash().putAll("blog:" + blog.getId(), blog.toMap());
            }
//            移除不符合搜索条件的Blog对象
            blogs.removeIf(blog -> !blog.getTitle().contains(search));
            return Result.ok(blogs, blogs.size());
        }
//        如果Redis中有Blog对象，则从Redis中获取
        blogList.removeIf(blog -> !(blog).getTitle().contains(search));
        return Result.ok(blogList, blogList.size());
    }

    @Override
    public Result getBlogById(Long id) {
//        先从Redis中获取Blog对象
        Map<Object, Object> blogMap = stringRedisTemplate.opsForHash().entries("blog:" + id);
//        如果Redis中没有Blog对象，则从数据库中获取
        if(blogMap.size() == 0) {
            Blog blog = query().eq("id", id).one();
            if(blog == null) {
                return Result.fail("博客不存在");
            }
//            将从数据库中获取的Blog对象存储到Redis中
            stringRedisTemplate.opsForHash().putAll("blog:" + blog.getId(), blog.toMap());
            return Result.ok(blog);
        }
        blogMap.put("author", userService.getNickNameByEmail((String) blogMap.get("author")));
//        如果Redis中有Blog对象，则直接返回w
        return Result.ok(new Blog(blogMap));
    }

    @Override
    public Result addBlog(String des, String title, String article, String author, Date uploadTime, Boolean isNews) {
        Blog blog = new Blog(des, title, article,author , uploadTime, isNews);
        log.info("添加博客：{}", blog);
//        先在数据库中查询是否存在作者和题目相同的blog
        Blog oldBlog = query().eq("author", blog.getAuthor()).eq("title", blog.getTitle()).one();
//        如果存在，则返回错误信息
        if(oldBlog != null){
            return Result.fail("已存在相同作者和题目的blog，请修改标题再试");
        }
//        不存在，则在数据库中添加blog
        log.info("blog:{}", blog);
        save(blog);
//        从mysql中获取Blog对象
        Blog blog1 = query().eq("title", blog.getTitle()).one();
        stringRedisTemplate.opsForHash().putAll("blog:" + blog1.getId(),blog1.toMap());
        return Result.ok();
    }

    public Result addBlog(String des, String title, String article, Date uploadTime, Boolean isNews){
        User user = InterceptorUtil.getUser(request, stringRedisTemplate);
        log.info("user:{}", user);
        return addBlog(des, title, article, user.getEmail(),  uploadTime, isNews);
    }

    @Override
    public Result deleteBlog(Long blogId) {
//        先删除数据库中的Blog对象
        if(removeById(blogId)&& BooleanUtil.isTrue(stringRedisTemplate.delete("blog:" + blogId))){
            return Result.ok();
        } else {
            return Result.fail("删除失败");
        }

    }



    @Override
    public Result updateBlog(Long id, String des, String title, String article, Boolean isNews) {
        Blog blog = new Blog();
        blog.setId(id);
        blog.setDes(des);
        blog.setTitle(title);
//        title不能超过100个中文字符
        if(title.length() > 100) {
            return Result.fail("标题不能超过100个中英文字符");
        }
        blog.setArticle(article);
        blog.setIsNews(isNews);
//        如果存在，则返回错误信息
        if(query().eq("title", blog.getTitle()).count() > 1){
            return Result.fail("已存在相同作者和题目的blog，请修改题目");
        }
//        将Blog对象存储到mysql中
        update().eq("id", id).set("des", des).set("title", title).set("article", article).set("isNews", isNews).update();
//        再从mysql中获取Blog对象
        stringRedisTemplate.opsForHash().putAll("blog:" + blog.getId(), blog.toUpdateMap());
        return Result.ok();
    }

    @Override
    public Result getAllPublicBlogs() {
//        先从Redis中获取所有的Blog对象
        List<Blog> blogList = RedisUtil.getAllBlogs(stringRedisTemplate);
        List<Blog> blogs = null;
//        如果Redis中没有Blog对象，则从数据库中获取
        if(blogList.size() == 0) {
            blogs =  list();
            if(blogs.size() == 0) {
                return Result.fail("暂无博客");
            }
//            将从数据库中获取的Blog对象存储到Redis中
            for (Blog blog : blogs) {
                stringRedisTemplate.opsForHash().putAll("blog:" + blog.getId(), blog.toMap());
            }
            return Result.ok(blogs, blogs.size());
        }
//        将所有的Blog
        for (Blog blog : blogList) {
            blog.setAuthor(userService.getNickNameByEmail(blog.getAuthor()));
        }
//        如果Redis中有Blog对象，则从Redis中获取
        return Result.ok(blogList, blogList.size());
    }

}

