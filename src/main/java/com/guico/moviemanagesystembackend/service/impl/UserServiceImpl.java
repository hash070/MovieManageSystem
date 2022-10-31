package com.guico.moviemanagesystembackend.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.guico.moviemanagesystembackend.utils.Result;
import com.guico.moviemanagesystembackend.entry.User;
import com.guico.moviemanagesystembackend.mapper.UserMapper;
import com.guico.moviemanagesystembackend.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements IUserService {
    @Autowired
    StringRedisTemplate stringRedisTemplate;

    @Override
    public Result sendCode(String email) {
        return null;
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
