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
}
