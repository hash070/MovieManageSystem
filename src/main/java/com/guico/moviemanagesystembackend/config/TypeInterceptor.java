package com.guico.moviemanagesystembackend.config;

import cn.hutool.json.JSONUtil;
import com.guico.moviemanagesystembackend.entry.User;
import com.guico.moviemanagesystembackend.exception.LevelException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Slf4j

public class TypeInterceptor implements HandlerInterceptor {

    StringRedisTemplate stringRedisTemplate;
    public TypeInterceptor (StringRedisTemplate stringRedisTemplate){
        this.stringRedisTemplate = stringRedisTemplate;
    }
    @Override
    public boolean preHandle(javax.servlet.http.HttpServletRequest request, javax.servlet.http.HttpServletResponse response, Object handler) throws Exception {
        log.info("拦截器拦截到请求");
        String token = request.getParameter("token");
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

        if(user.getLevel() > 1){
            log.info("用户权限不足");
            throw new LevelException("用户权限不足，无法访问");
        }
        log.info("用户权限验证通过");
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
//        log.info("拦截器postHandle");
//        log.info("拦截器拦截到响应:{}",response);
//        log.info("当前状态码:{}",response.getStatus());
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
//        log.info("拦截器afterCompletion");
//        log.info("拦截器拦截到响应:{}",response);
//        log.info("当前状态码:{}",response.getStatus());
    }
}
