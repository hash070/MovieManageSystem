package com.guico.moviemanagesystembackend.controller;

import com.guico.moviemanagesystembackend.service.IMovieService;
import com.guico.moviemanagesystembackend.utils.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Date;

@RestController
@CrossOrigin
@RequestMapping("/api/movie")
public class MovieController {
    @Autowired
    IMovieService movieService;

    @PostMapping("/uploadMovie")
    public Result uploadMovie(String name, String des, Integer typeId, String tags,
                              Boolean visibility, MultipartFile pic, MultipartFile movie) throws IOException {
        return movieService.uploadMovie(name, des, typeId, tags, visibility, pic, movie);
    }

    @PostMapping("/getMovieById")
    public Result getMovieById(Integer id) {
        return movieService.getMovieById(id);
    }

    @PostMapping("/getAll")
    public Result getAll() {
        return movieService.getAll();
    }

    @PostMapping("/delete")
    public Result deleteMovie(Integer movieId) {
        return movieService.deleteMovie(movieId);
    }

    @PostMapping("/uploadPic")
    public Result uploadMoviePic(MultipartFile pic) throws IOException {
        return Result.ok(movieService.uploadMoviePic(pic));
    }


}
