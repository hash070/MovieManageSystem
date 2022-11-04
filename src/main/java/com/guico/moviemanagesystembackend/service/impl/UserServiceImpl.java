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
import java.util.*;
import java.util.concurrent.TimeUnit;

import static com.guico.moviemanagesystembackend.utils.RedisKeyContrains.*;

@Service
@Log4j2
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements IUserService {
    @Resource
    StringRedisTemplate stringRedisTemplate;

    @Override
    public Result sendCode(String email) {
        //先从redis中获取验证码
        String code = stringRedisTemplate.opsForValue().get(USER_CODE + email);
        if (code != null) {
            return Result.fail("验证码已发送，请勿重复发送");
        }
        //生成并发送验证码
//        code = MailSend.doSend(email);
        code = String.valueOf(new Random().nextInt(899999) + 100000);
        //将验证码存入redis
        stringRedisTemplate.opsForValue().set(USER_CODE + email, code, 1, TimeUnit.MINUTES);
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
        StpUtil.login(USER_LOGIN + user.getEmail());
        String token = StpUtil.getTokenValue();
        //将用户信息存入redis,并设置过期时间
        stringRedisTemplate.opsForValue().set(USER_LOGIN + email, email, 3, TimeUnit.DAYS);
        return Result.ok(token);
    }

    @Override
    public Result register(String nickname, String email, String password, String code) {
        User user = query().eq("email", email).one();
        String redisCode = stringRedisTemplate.opsForValue().get(USER_CODE + email);
        if (redisCode == null)
            return Result.fail("验证码已过期");
        if (user != null) {
            return Result.fail("邮箱已被注册");
        } else if (!Objects.equals(redisCode, code)) {
            return Result.fail("验证码错误");
        }
        User newUser = new User(nickname, password, email, User.USER_LEVEL_USER);
//        删除验证码
        stringRedisTemplate.delete(USER_CODE + email);
        save(newUser);
        return Result.ok();

    }

    @Override
    public Result resetPassword(String email, String password, String code) {
        User user = query().eq("email", email).one();
        if (user == null) {
            return Result.fail("用户不存在");
        } else if (!stringRedisTemplate.opsForValue().get(USER_CODE + email).equals(code)) {
            return Result.fail("验证码错误");
        }
        stringRedisTemplate.delete(USER_CODE + email);
        user.setPassword(password);
        updateById(user);
        return Result.ok();
    }


    @Override
    public Result logout(String token) {
        String email = stringRedisTemplate.opsForValue().get("satoken:login:token:" + token);
        if (StrUtil.isBlank(email))
            return Result.fail("用户未登录");
        email = email.substring(11);
        //删除redis中的用户信息
        stringRedisTemplate.delete(USER_LOGIN + email);
        String id = StpUtil.getLoginId(token);
        StpUtil.logout(id);
        return Result.ok();
    }

    @Override
    public Result addByRoot(String nickname, String email, String password, String token) {
//        根據SAToken获取用户信息
        String userInfo = stringRedisTemplate.opsForValue().get(USER_LOGIN + email);
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
        String email = stringRedisTemplate.opsForValue().get("satoken:login:token:" + token);
        if (email == null) {
            return Result.fail("登录失效");
        }
        email = email.substring(11);
        String userInfo = stringRedisTemplate.opsForHash().get(USER_INFO + email,"level").toString();
//        将用户信息转换为User对象
        if (userInfo == null || StrUtil.isEmptyIfStr(userInfo)) {
            return Result.fail("登录失效");
        }
        return Result.ok(userInfo);
    }

    public Result getUserByEmail(String email) {
//        先从redis中获取用户信息
//        "user:info:"目录下存储的是hash类型的数据
        Map<Object, Object> map = stringRedisTemplate.opsForHash().entries(USER_INFO + email);
        if (map.isEmpty()) {
//            如果redis中没有用户信息，从数据库中获取
            User user = query().eq("email", email).one();
            if (user == null) {
//                如果数据库中也没有用户信息，返回null
                return Result.fail("用户不存在");
            }
//            将用户信息存入redis
            stringRedisTemplate.opsForHash().putAll(USER_INFO + email, user.toMap());
            return Result.ok(user);
        }
        return Result.ok(new User(map));
    }

    public Result getAllUsers() {
//                先从redis中获取用户信息
//        "user:info:"目录下存储的是hash类型的数据
        List<User> users = new ArrayList<>();
        Set<String> keys = stringRedisTemplate.keys(USER_INFO + "*");
        if (keys.isEmpty()) {
//            如果redis中没有用户信息，从数据库中获取
            users = query().list();
            if (users.isEmpty()) {
//                如果数据库中也没有用户信息，返回null
                return Result.fail("库中没有用户信息");
            }
//            将用户信息存入redis
            for (User user : users) {
                stringRedisTemplate.opsForHash().putAll(USER_INFO + user.getEmail(), user.toMap());
            }
            return Result.ok(users);
        }
//        如果redis中有用户信息，从redis中获取
        for (String key : keys) {
            Map<Object, Object> map = stringRedisTemplate.opsForHash().entries(key);
            users.add(new User(map));
        }
        return Result.ok(users, users.size());
    }

}
