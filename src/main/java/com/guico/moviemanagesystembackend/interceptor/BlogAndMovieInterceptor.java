package com.guico.moviemanagesystembackend.interceptor;

import com.guico.moviemanagesystembackend.entry.User;
import com.guico.moviemanagesystembackend.exception.LevelException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.servlet.HandlerInterceptor;

import static com.guico.moviemanagesystembackend.interceptor.InterceptorUtil.*;

@Slf4j
public class BlogAndMovieInterceptor implements HandlerInterceptor {

    StringRedisTemplate stringRedisTemplate;

    public BlogAndMovieInterceptor (StringRedisTemplate stringRedisTemplate){
        this.stringRedisTemplate = stringRedisTemplate;
    }


    @Override
    public boolean preHandle(javax.servlet.http.HttpServletRequest request, javax.servlet.http.HttpServletResponse response, Object handler) throws Exception {
        User user = getUser(request, stringRedisTemplate);
        if(user.getLevel() >= 2){
            log.info("用户权限不足");
            throw new LevelException("用户权限不足，无法访问");
        }
        return true;
    }
}
