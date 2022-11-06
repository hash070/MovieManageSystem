package com.guico.moviemanagesystembackend.utils;

import cn.hutool.json.JSONUtil;
import com.guico.moviemanagesystembackend.entry.User;
import com.guico.moviemanagesystembackend.exception.LevelException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.Cookie;

@Slf4j
public class BlogAndMovieInterceptor implements HandlerInterceptor {

    StringRedisTemplate stringRedisTemplate;

    public BlogAndMovieInterceptor (StringRedisTemplate stringRedisTemplate){
        this.stringRedisTemplate = stringRedisTemplate;
    }


    @Override
    public boolean preHandle(javax.servlet.http.HttpServletRequest request, javax.servlet.http.HttpServletResponse response, Object handler) throws Exception {
        log.info("拦截器拦截到请求");
//        获取token
        Cookie[] cookies = request.getCookies();
        String token = null;
        for (Cookie cookie : cookies) {
            if (cookie.getName().equals("token")) {
                token = cookie.getValue();
            }
        }
        if(token == null){
            log.info("token为空");
            throw new LevelException("token为空，无法认证用户权限");
        }
//        根据token获取用户信息
        String email = stringRedisTemplate.opsForValue().get("satoken:login:token:" + token);
        if(email == null){
            log.info("token无效");
            throw new LevelException("token无效，无法认证用户权限");
        }
        email = email.substring(11);
        log.info("email为：" + email);
        String userInfo = stringRedisTemplate.opsForValue().get("user:info:" + email);
        if(userInfo == null){
            log.info("用户信息为空");
            throw new LevelException("用户信息为空，无法认证用户权限");
        }
        User user  = JSONUtil.toBean(userInfo, User.class);
        if(user.getLevel() >= 2){
            log.info("用户权限不足");
            throw new LevelException("用户权限不足，无法访问");
        }
        return true;
    }
}
