package com.guico.moviemanagesystembackend.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.guico.moviemanagesystembackend.entry.Movie;
import com.guico.moviemanagesystembackend.entry.Tag;
import com.guico.moviemanagesystembackend.mapper.MovieMapper;
import com.guico.moviemanagesystembackend.service.IMovieService;
import com.guico.moviemanagesystembackend.utils.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

@Service
public class MovieServiceImpl extends ServiceImpl<MovieMapper, Movie> implements IMovieService {

    @Autowired
    StringRedisTemplate stringRedisTemplate;

    @Override
    public Result uploadMovie() {
        return null;
    }

    @Override
    public Result addMovie(Movie movie) {
        return null;
    }

    @Override
    public Result getAllMovie() {
        return null;
    }

    @Override
    public Result getMovieByTags(List<Tag> tags) {
        return null;
    }

    @Override
    public Result getMovieByType(Integer typeId) {
        return null;
    }

    @Override
    public Result getMovieByUp(Integer upId) {
        return null;
    }

    @Override
    public Result getMovieBySearch(String search) {
        return null;
    }

    @Override
    public Result deleteMovie(Integer movieId) {
        return null;
    }

    @Override
    public Result updateMovie(Movie movie) {
        return null;
    }

    @Override
    public Result getAllTags() {
        return null;
    }

    @Override
    public Result uploadMoviePic(MultipartFile pic) throws IOException {
        File file = new File("./files/moviePic/" + pic.getOriginalFilename());
        if (!file.exists()) {
            if (!file.createNewFile()){
                return Result.fail("创建文件失败");
            }
        }
        Files.copy(pic.getInputStream(), file.toPath());
        return Result.ok(file.getPath());
    }

    @Override
    public Result uploadMovieFile(MultipartFile movie) {
        return null;
    }
}
