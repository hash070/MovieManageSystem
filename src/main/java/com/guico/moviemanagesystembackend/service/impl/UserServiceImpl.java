package com.guico.moviemanagesystembackend.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
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
    public String sendCode(String email) {
        return null;
    }

    @Override
    public String login(String email, String password) {
        return null;
    }

    @Override
    public String register(String email, String password, String code) {
        return null;
    }

    @Override
    public String resetPassword(String email, String password, String code) {
        return null;
    }

    @Override
    public String updatePassword(String email, String newPassword) {
        return null;
    }

    @Override
    public String logout(String SAToken) {
        return null;
    }
}
