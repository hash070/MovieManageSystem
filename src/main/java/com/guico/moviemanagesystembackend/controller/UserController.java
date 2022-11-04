package com.guico.moviemanagesystembackend.controller;

import com.guico.moviemanagesystembackend.entry.User;
import com.guico.moviemanagesystembackend.service.IUserService;
import com.guico.moviemanagesystembackend.utils.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/user")
@CrossOrigin
public class UserController {

    @Autowired
    IUserService userService;

    @Autowired
    HttpServletRequest request;

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
    public Result logout(String token) {
        return userService.logout(token);
    }

    @PostMapping("/resetPassword")
    public Result resetPassword(String email, String password, String code) {
        return userService.resetPassword(email, password, code);
    }

    @PostMapping("/addByRoot")
    public Result addByARoot(String nickname, String email, String password, String token) {
        return userService.addByRoot(nickname, email, password, token);
    }

    @PostMapping("/checkToken")
    public Result checkToken() {
        Cookie[] cookies = request.getCookies();
        if (cookies==null){
            return Result.fail("token为空");
        }
        String token = null;
        for (Cookie cookie : cookies) {
            if (cookie.getName().equals("token")) {
                token = cookie.getValue();
            }
        }
        if(token == null){
            return Result.fail("token为空");
        }
        return userService.checkToken(token);
    }

    @PostMapping("/getByEmail")
    public Result getByEmail(String email) {
        return userService.getUserByEmail(email);
    }

    @PostMapping("/getAll")
    public Result getAllUsers() {
        return userService.getAllUsers();
    }


}
