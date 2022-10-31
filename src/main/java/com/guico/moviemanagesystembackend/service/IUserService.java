package com.guico.moviemanagesystembackend.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.guico.moviemanagesystembackend.utils.Result;
import com.guico.moviemanagesystembackend.entry.User;

public interface IUserService extends IService<User> {

    Result sendCode(String email);

    Result login(String email, String password);

    Result register(String nickname, String email, String password, String code);

    Result resetPassword(String email, String password, String code);

    Result updatePassword(String email, String newPassword);

    Result logout(String SAToken);

    Result addByAdmin(String nickname, String email, String password, String SAToken);

}