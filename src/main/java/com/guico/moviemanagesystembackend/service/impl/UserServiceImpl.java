package com.guico.moviemanagesystembackend.service.impl;

import cn.dev33.satoken.stp.StpUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.guico.moviemanagesystembackend.utils.MailSend;
import com.guico.moviemanagesystembackend.utils.Result;
import com.guico.moviemanagesystembackend.entry.User;
import com.guico.moviemanagesystembackend.mapper.UserMapper;
import com.guico.moviemanagesystembackend.service.IUserService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@Log4j2
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements IUserService {
    @Autowired
    StringRedisTemplate stringRedisTemplate;

    @Override
    public Result sendCode(String email) {
        //先从redis中获取验证码
        String code = stringRedisTemplate.opsForValue().get("user:code:"+email);
        if (code != null) {
            return Result.fail("验证码已发送，请勿重复发送");
        }
        //生成并发送验证码
        code = MailSend.doSend(email);
        //将验证码存入redis
        stringRedisTemplate.opsForValue().set("user:code:"+email, code);
        log.info("验证码为："+code);
        return Result.ok();
    }

    @Override
    public Result login(String email, String password) {
        return null;
    }

    @Override
    public Result register(String nickname, String email, String password, String code) {
        return null;
    }

    @Override
    public Result resetPassword(String email, String password, String code) {
        return null;
    }

    @Override
    public Result updatePassword(String email, String newPassword) {
        return null;
    }

    @Override
    public Result logout(String SAToken) {
        return null;
    }

    @Override
    public Result addByAdmin(String nickname, String email, String password, String SAToken) {
        return null;
    }
}