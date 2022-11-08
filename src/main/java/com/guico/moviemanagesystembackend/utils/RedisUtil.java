package com.guico.moviemanagesystembackend.utils;

import com.guico.moviemanagesystembackend.entry.Blog;
import com.guico.moviemanagesystembackend.entry.Movie;
import org.springframework.data.redis.core.StringRedisTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

public class RedisUtil {


    public static final String USER_LOGIN = "user:login:";
    public static final String USER_INFO = "user:info:";
    public static final String USER_CODE = "user:code:";
    public static final String SATOKEN_TOKEN = "satoken:login:token:";

    public static final String ALL_MOVIE = "movie:*";

    public static final String ALL_BLOG = "blog:*";



    public static Set<String> getKeys(StringRedisTemplate stringRedisTemplate,String pattern){
        return stringRedisTemplate.keys(pattern);
    }

    public static List<Object> getAllObjects(StringRedisTemplate stringRedisTemplate,String pattern){
        List<Object> objects = new ArrayList<>();
        getKeys(stringRedisTemplate,pattern).forEach(key -> objects.add(stringRedisTemplate.opsForValue().get(key)));
        return objects;
    }

    public static List<Blog> getAllBlogs(StringRedisTemplate stringRedisTemplate){
        List<Blog> blogs = new ArrayList<>();
        getKeys(stringRedisTemplate,ALL_BLOG).forEach(key -> blogs.add(new Blog(stringRedisTemplate.opsForHash().entries(key))));
        return blogs;
    }

    public static List<Movie> getAllMovies(StringRedisTemplate stringRedisTemplate){
        List<Movie> movies = new ArrayList<>();
        getKeys(stringRedisTemplate,ALL_MOVIE).forEach(key -> movies.add(new Movie(stringRedisTemplate.opsForHash().entries(key))));
        return movies;
    }


}
