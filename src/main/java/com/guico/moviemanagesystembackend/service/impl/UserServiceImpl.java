package com.guico.moviemanagesystembackend.service.impl;

import cn.dev33.satoken.stp.StpUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.guico.moviemanagesystembackend.utils.Result;
import com.guico.moviemanagesystembackend.entry.User;
import com.guico.moviemanagesystembackend.mapper.UserMapper;
import com.guico.moviemanagesystembackend.service.IUserService;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Objects;
import java.util.Random;
import java.util.concurrent.TimeUnit;

@Service
@Log4j2
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements IUserService {
    @Resource
    StringRedisTemplate stringRedisTemplate;

    @Override
    public Result sendCode(String email) {
        //先从redis中获取验证码
        String code = stringRedisTemplate.opsForValue().get("user:code:" + email);
        if (code != null) {
            return Result.fail("验证码已发送，请勿重复发送");
        }
        //生成并发送验证码
//        code = MailSend.doSend(email);
        code = String.valueOf(new Random().nextInt(899999) + 100000);
        //将验证码存入redis
        stringRedisTemplate.opsForValue().set("user:code:" + email, code,1, TimeUnit.MINUTES);
        log.info("验证码为：" + code);
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
        StpUtil.login("user:login:" + user.getEmail());
        String token = StpUtil.getTokenValue();
        //将用户信息存入redis,并设置过期时间
        stringRedisTemplate.opsForValue().set("user:info:" + email, user.toString(),3,TimeUnit.DAYS);
        return Result.ok(token);
    }

    @Override
    public Result register(String nickname, String email, String password, String code) {
        User user = query().eq("email", email).one();
        String redisCode = stringRedisTemplate.opsForValue().get("user:code:" + email);
        if (redisCode == null)
            return Result.fail("验证码已过期");
        if (user != null) {
            return Result.fail("邮箱已被注册");
        } else if (!Objects.equals(redisCode, code)) {
            return Result.fail("验证码错误");
        }
        User newUser = new User(nickname, password ,email, User.USER_LEVEL_USER);
//        删除验证码
        stringRedisTemplate.delete("user:code:" + email);
        save(newUser);
        return Result.ok();

    }

    @Override
    public Result resetPassword(String email, String password, String code) {
        User user = query().eq("email", email).one();
        if (user == null) {
            return Result.fail("用户不存在");
        } else if (!stringRedisTemplate.opsForValue().get("user:code:" + email).equals(code)) {
            return Result.fail("验证码错误");
        }
        stringRedisTemplate.delete("user:code:" + email);
        user.setPassword(password);
        updateById(user);
        return Result.ok();
    }


    @Override
    public Result logout(String SAToken) {
        String email = stringRedisTemplate.opsForValue().get("user:login:" + SAToken);
        String id = StpUtil.getLoginId(SAToken);
        stringRedisTemplate.delete("user:info:" + id);
        StpUtil.logout(id);
        return Result.ok();
    }

    @Override
    public Result addByRoot(String nickname, String email, String password, String SAToken) {
//        根據SAToken获取用户信息
        String userInfo = stringRedisTemplate.opsForValue().get("user:info:" + email);
//        将用户信息转换为User对象
        User user = JSONUtil.toBean(userInfo, User.class);
//        查看用户是否有权限
        if (user.getLevel() != User.USER_LEVEL_ROOT) {
            return Result.fail("权限不足");
        }
        User newUser = new User(nickname, email, password, User.USER_LEVEL_USER);
        save(newUser);
        return Result.ok();
    }

    @Override
    public Result checkToken(String token) {
//        根據SAToken获取用户信息
        String userInfo = stringRedisTemplate.opsForValue().get("user:info:" + token);
//        将用户信息转换为User对象
        if(userInfo == null||StrUtil.isEmptyIfStr(userInfo)){
            return Result.fail("登录失效");
        }
        User user = JSONUtil.toBean(userInfo, User.class);
        return Result.ok(user.getLevel());
    }

}
