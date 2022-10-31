package com.guico.moviemanagesystembackend.service.impl;

import cn.dev33.satoken.stp.StpUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.guico.moviemanagesystembackend.utils.Result;
import com.guico.moviemanagesystembackend.entry.User;
import com.guico.moviemanagesystembackend.mapper.UserMapper;
import com.guico.moviemanagesystembackend.service.IUserService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Random;
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
//        code = MailSend.doSend(email);
        code =String.valueOf(new Random().nextInt(899999) +100000) ;
        //将验证码存入redis
        stringRedisTemplate.opsForValue().set("user:code:"+email, code);
        log.info("验证码为："+code);
        return Result.ok();
    }

    @Override
    public Result login(String email, String password) {
        User user = query().eq("email", email).one();
        if (user == null) {
            return Result.fail("用户不存在");
        } else if (!user.getPassword().equals(password)) {
            return Result.fail("密码错误");
        }
        //验证登录
        StpUtil.login("user:login:"+user.getEmail());
        String token = StpUtil.getTokenValue();
        //将用户信息存入redis
        stringRedisTemplate.opsForValue().set("user:info:"+token, user.toString(),1, TimeUnit.MINUTES);
        return Result.ok(token);
    }

    @Override
    public Result register(String nickname, String email, String password, String code) {
        User user = query().eq("email", email).one();
        if (user != null) {
            return Result.fail("邮箱已被注册");
        } else if (!stringRedisTemplate.opsForValue().get("user:code:"+email).equals(code)) {
            return Result.fail("验证码错误");
        }
        User newUser = new User(nickname, email, password,User.USER_LEVEL_USER);
        save(newUser);
        return Result.ok();
    }

    @Override
    public Result resetPassword(String email, String password, String code) {
        User user = query().eq("email", email).one();
        if (user == null) {
            return Result.fail("用户不存在");
        } else if (!stringRedisTemplate.opsForValue().get("user:code:"+email).equals(code)) {
            return Result.fail("验证码错误");
        }
        user.setPassword(password);
        updateById(user);
        return Result.ok();
    }


    @Override
    public Result logout(String SAToken) {
        String id = StpUtil.getLoginId(SAToken);
        StpUtil.logout(id);
        return Result.ok();
    }

    @Override
    public Result addByAdmin(String nickname, String email, String password, String SAToken) {
        return null;
    }
}
