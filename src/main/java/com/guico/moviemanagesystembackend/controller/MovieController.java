package com.guico.moviemanagesystembackend.controller;

import com.guico.moviemanagesystembackend.service.IMovieService;
import com.guico.moviemanagesystembackend.utils.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.Date;

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
                              Boolean visibility, MultipartFile pic, MultipartFile movie) throws IOException {
        return movieService.uploadMovie(name, des, typeId, tags, visibility, pic, movie);
    }

    @PostMapping("/getMovieById")
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
                                 Boolean visibility, MultipartFile pic) throws IOException {
        return movieService.updateMovieMsg(id, name, des, typeId, tags, visibility, pic);
    }

    @PostMapping("/uploadPic")
    public Result uploadMoviePic(MultipartFile pic) throws IOException {
        return Result.ok(movieService.uploadMoviePic(pic));
    }

    @RequestMapping("/getFile")
    public Result getFile(String url){
        File file = new File(url);
        if(file.exists()){
            response.setHeader("Content-Disposition", "attachment;filename="+ path + file.getName());
            response.setContentType("application/octet-stream");
            response.setHeader("Content-Length", String.valueOf(file.length()));
            byte[] buffer = new byte[(int)file.length()];
            FileInputStream fis = null;
            BufferedInputStream bfs = null;
            try {
                fis = new FileInputStream(file);
                bfs = new BufferedInputStream(fis);
                OutputStream os = response.getOutputStream();
                int len = bfs.read(buffer);
                while (len != -1) {
                    os.write(buffer, 0, len);
                    len = bfs.read(buffer);
                }
                response.getOutputStream().write(buffer);
            } catch (Exception e) {
                e.printStackTrace();
                return Result.fail(e.getMessage());
            }
        }
        log.info("下载成功文件{}", file.getName());
        return Result.ok();
    }


}
