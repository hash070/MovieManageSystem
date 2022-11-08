package com.guico.moviemanagesystembackend.controller;

import com.guico.moviemanagesystembackend.service.IMovieService;
import com.guico.moviemanagesystembackend.utils.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.*;

@RestController
@CrossOrigin
@RequestMapping("/api/movie")
@Slf4j
public class MovieController {
    @Autowired
    IMovieService movieService;

    @Autowired
    HttpServletResponse response;

    String path = System.getProperty("user.dir");

    @PostMapping("/upload")
    public Result uploadMovie(String name, String des, Integer typeId, String tags,
                              Boolean visibility, String pic, String movie) throws IOException {
        return movieService.upload(name, des, typeId, tags, visibility, pic, movie);
    }

    @PostMapping("/getById")
    public Result getMovieById(Integer id) {
        return movieService.getMovieById(id);
    }

    @PostMapping("/getBySearch")
    public Result getMovieBySearch(String search) {
        return movieService.getMovieBySearch(search);
    }

    @PostMapping("/getByUp")
    public Result getMovieByUp(String upId) {
        return movieService.getMovieByUp(upId);
    }

    @PostMapping("/getByType")
    public Result getMovieByType(Integer typeId) {
        return movieService.getMovieByType(typeId);
    }

    @PostMapping("/getAll")
    public Result getAll() {
        return movieService.getAll();
    }

    @PostMapping("/delete")
    public Result deleteMovie(Integer movieId) {
        return movieService.deleteMovie(movieId);
    }

    @PostMapping("/update")
    public Result updateMovieMsg(Long id, String name, String des, Integer typeId, String tags,
                                 Boolean visibility, String pic) throws IOException {
        return movieService.updateMovieMsg(id, name, des, typeId, tags, visibility, pic);
    }

    @PostMapping("/uploadMovie")
    public Result uploadMovie(MultipartFile movie) throws IOException {
        return movieService.uploadMovie(movie);
    }

    @PostMapping("/uploadPic")
    public Result uploadMoviePic(MultipartFile pic) throws IOException {
        return Result.ok(movieService.uploadMoviePic(pic));
    }

    @RequestMapping("/getFile")
    public String getFile(String url){
        url = path + url;
        log.info(url);
        return url;
    }


}
