package com.guico.moviemanagesystembackend.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.guico.moviemanagesystembackend.utils.Result;
import com.guico.moviemanagesystembackend.entry.User;

public interface IUserService extends IService<User> {

    Result sendCode(String email);

    Result login(String email, String password);

    Result register(String nickname, String email, String password, String code);

    Result resetPassword(String email, String password, String code);


    Result logout(String SAToken);


    Result addByRoot(String nickname, String email, String password, Integer level);

    Result updateByRoot(String nickname, String email, String password, Integer level);

    Result deleteByRoot(String email);

    Result checkToken(String saToken);

    Result getUserByEmail(String email);

    Result getAllUsers();
}
