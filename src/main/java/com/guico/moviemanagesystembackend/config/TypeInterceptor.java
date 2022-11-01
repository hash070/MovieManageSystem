package com.guico.moviemanagesystembackend.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.annotation.WebFilter;

@Slf4j
public class TypeInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(javax.servlet.http.HttpServletRequest request, javax.servlet.http.HttpServletResponse response, Object handler) throws Exception {
        log.info("拦截器拦截到请求");
        String token = request.getParameter("SAToken");
        if(token == null){
            log.info("token为空");
            return false;
        }
        return true;
    }
}
