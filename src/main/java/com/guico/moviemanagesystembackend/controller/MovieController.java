package com.guico.moviemanagesystembackend.controller;

import com.guico.moviemanagesystembackend.service.IMovieService;
import com.guico.moviemanagesystembackend.utils.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@CrossOrigin
@RequestMapping("/api/movie")
@Slf4j
public class MovieController {
    @Autowired
    IMovieService movieService;

    @Autowired
    HttpServletResponse response;

    String path = System.getProperty("user.dir")+ "/upload";

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
    public ResponseEntity<byte[]> getFile(String url) {
        url = path + url;
//        将url中的/替换为\
        url = url.replace("/", "\\");
        if(System.getProperty("os.name").equalsIgnoreCase("linux")) {
            url = url.replace("\\", "/");
        }
        File file = new File(url);
        log.info(url);
        if (file.exists()) {
            try {
                log.info("文件存在,开始下载");
                log.info("文件路径为:{}", url);
                byte[] bytes = Files.readAllBytes(file.toPath());
                HttpHeaders headers = new HttpHeaders();
                headers.add("Cache-Control", "no-cache, no-store, must-revalidate");
                headers.add("Content-Disposition", String.format("attachment; filename=\"%s\"", file.getName()));
                headers.add("Pragma", "no-cache");
                headers.add("Expires", "0");
                ResponseEntity<byte[]> responseEntity = ResponseEntity
                        .ok()
                        .headers(headers)
                        .contentLength(file.length())
                        .body(bytes);
                return responseEntity;
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        log.error("文件不存在");

        response.setStatus(404);

        return null;
    }





}
