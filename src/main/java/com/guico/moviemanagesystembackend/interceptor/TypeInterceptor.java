package com.guico.moviemanagesystembackend.interceptor;

import com.guico.moviemanagesystembackend.entry.User;
import com.guico.moviemanagesystembackend.exception.LevelException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import static com.guico.moviemanagesystembackend.interceptor.InterceptorUtil.getUser;

@Slf4j
public class TypeInterceptor implements HandlerInterceptor {

    StringRedisTemplate stringRedisTemplate;
    public TypeInterceptor (StringRedisTemplate stringRedisTemplate){
        this.stringRedisTemplate = stringRedisTemplate;
    }
    @Override
    public boolean preHandle(javax.servlet.http.HttpServletRequest request, javax.servlet.http.HttpServletResponse response, Object handler) throws Exception {
        User user = getUser(request, stringRedisTemplate);
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
