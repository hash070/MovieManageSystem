package com.guico.moviemanagesystembackend.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.guico.moviemanagesystembackend.entry.User;

public interface IUserService extends IService<User> {

    String sendCode(String email);

    String login(String email, String password);

    String register(String email, String password, String code);

    String resetPassword(String email, String password, String code);

    String updatePassword(String email, String newPassword);

    String logout(String SAToken);

}
