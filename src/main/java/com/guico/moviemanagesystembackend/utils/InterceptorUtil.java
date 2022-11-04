package com.guico.moviemanagesystembackend.utils;

import cn.hutool.json.JSONUtil;
import com.guico.moviemanagesystembackend.entry.User;
import com.guico.moviemanagesystembackend.exception.LevelException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

import static com.guico.moviemanagesystembackend.utils.RedisKeyContrains.*;

@Slf4j
public class InterceptorUtil {
    public static User getUser(HttpServletRequest request, StringRedisTemplate stringRedisTemplate){
        Cookie[] cookies = request.getCookies();
        String token = null;
        if(cookies != null){
            for (Cookie cookie : cookies) {
                if(cookie.getName().equals("token")){
                    token = cookie.getValue();
                }
            }
        } else {
            throw new LevelException("token为空，无法认证用户权限");
        }
        if(token == null){
            throw new LevelException("token为空，无法认证用户权限");
        }
//        根据token获取用户信息
        String email = stringRedisTemplate.opsForValue().get(SATOKEN_TOKEN + token);
        if(email == null){
            log.info("token无效");
            throw new LevelException("token无效，无法认证用户权限");
        }
        email = email.substring(11);
        log.info("email为：" + email);
        String userInfo = stringRedisTemplate.opsForValue().get(USER_INFO + email);
        if(userInfo == null){
            log.info("用户信息为空");
            throw new LevelException("用户信息为空，无法认证用户权限");
        }
        User user  = JSONUtil.toBean(userInfo, User.class);
        return user;
    }
}
