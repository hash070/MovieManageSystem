package com.guico.moviemanagesystembackend.utils;

import org.springframework.data.redis.core.StringRedisTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

public class RedisKeyContains {


    public static final String USER_LOGIN = "user:login:";
    public static final String USER_INFO = "user:info:";
    public static final String USER_CODE = "user:code:";
    public static final String SATOKEN_TOKEN = "satoken:login:token:";

    private StringRedisTemplate stringRedisTemplate;

    public RedisKeyContains(StringRedisTemplate stringRedisTemplate){
        this.stringRedisTemplate = stringRedisTemplate;
    }

    public Set<String> getKeys(String pattern){
        return stringRedisTemplate.keys(pattern);
    }

    public List<Object> getAllObjects(String pattern){
        List<Object> objects = new ArrayList<>();
        getKeys(pattern).forEach(key -> objects.add(stringRedisTemplate.opsForValue().get(key)));
        return objects;
    }


}
