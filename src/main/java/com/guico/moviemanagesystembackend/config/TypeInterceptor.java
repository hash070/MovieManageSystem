package com.guico.moviemanagesystembackend.config;

import cn.hutool.json.JSONUtil;
import com.guico.moviemanagesystembackend.entry.User;
import com.guico.moviemanagesystembackend.exception.LevelException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.annotation.WebFilter;

@Slf4j

public class TypeInterceptor implements HandlerInterceptor {

    StringRedisTemplate stringRedisTemplate;
    public TypeInterceptor (StringRedisTemplate stringRedisTemplate){
        this.stringRedisTemplate = stringRedisTemplate;
    }
    @Override
    public boolean preHandle(javax.servlet.http.HttpServletRequest request, javax.servlet.http.HttpServletResponse response, Object handler) throws Exception {
        log.info("拦截器拦截到请求");
        String token = request.getParameter("SAToken");
        if(token == null){
            log.info("token为空");
            throw new LevelException("token为空，无法认证用户权限");
        }
//        根据token获取用户信息
        String userInfo = stringRedisTemplate.opsForValue().get("user:info:" + token);
        User user  = JSONUtil.toBean(userInfo, User.class);
        if(userInfo == null){
            log.info("用户信息为空");
            throw new LevelException("用户信息为空，无法认证用户权限");
        }
        if(user.getLevel() > 1){
            log.info("用户权限不足");
            throw new LevelException("用户权限不足，无法访问");
        }
        return true;
    }
}
