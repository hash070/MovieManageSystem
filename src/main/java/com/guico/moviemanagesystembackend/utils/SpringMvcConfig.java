package com.guico.moviemanagesystembackend.utils;

import com.guico.moviemanagesystembackend.interceptor.BlogAndMovieInterceptor;
import com.guico.moviemanagesystembackend.interceptor.TypeInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.multipart.support.StandardServletMultipartResolver;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class SpringMvcConfig implements WebMvcConfigurer {

    @Autowired
    StringRedisTemplate stringRedisTemplate;

    @Bean
    public TypeInterceptor typeInterceptor(){
        return new TypeInterceptor(stringRedisTemplate);
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new TypeInterceptor(stringRedisTemplate))
                .addPathPatterns("/api/type/*")
                .excludePathPatterns("/api/type/getAll");
    }


}

