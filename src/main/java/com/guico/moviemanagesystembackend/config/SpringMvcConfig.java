package com.guico.moviemanagesystembackend.config;

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
        registry.addInterceptor(new BlogAndMovieInterceptor(stringRedisTemplate))
                .addPathPatterns("/api/blog/getAll")
                .addPathPatterns("/api/movie/getAll");
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/files/**")
                .addResourceLocations("../files/");
    }

}

