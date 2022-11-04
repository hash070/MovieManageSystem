package com.guico.moviemanagesystembackend.utils;


import com.guico.moviemanagesystembackend.utils.Result;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

//@RestControllerAdvice
public class ExceptionCatchHandler {

    @ExceptionHandler
    public Result handlerException(Exception e){
        return Result.fail(e.getMessage());
    }
}
