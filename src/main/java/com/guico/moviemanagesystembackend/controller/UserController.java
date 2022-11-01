package com.guico.moviemanagesystembackend.controller;

import com.guico.moviemanagesystembackend.service.IUserService;
import com.guico.moviemanagesystembackend.utils.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    IUserService userService;

    @PostMapping("/code")
    public Result sendCode(String email){
        return userService.sendCode(email);
    }
    
    @PostMapping("/login")
    public Result login(String email, String password) {
        return userService.login(email, password);
    }

    @PostMapping("/register")
    public Result register(String nickname, String email, String password, String code) {
        return userService.register(nickname, email, password, code);
    }

    @PostMapping("/logout")
    public Result logout(String SAToken) {
        return userService.logout(SAToken);
    }

    @PostMapping("/resetPassword")
    public Result resetPassword(String email, String password, String code) {
        return userService.resetPassword(email, password, code);
    }

    @PostMapping("/addByAdmin")
    public Result addByAdmin(String nickname, String email, String password, String SAToken) {
        return userService.addByAdmin(nickname, email, password, SAToken);
    }
}
