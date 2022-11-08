package com.guico.moviemanagesystembackend.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.guico.moviemanagesystembackend.utils.Result;
import com.guico.moviemanagesystembackend.entry.Movie;
import com.guico.moviemanagesystembackend.entry.Tag;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Date;
import java.util.List;

public interface IMovieService extends IService<Movie> {

    Result upload(String name, String des, Integer typeId, String tags,
                  Boolean visibility, String pic, String movie);

    Result uploadMovie(MultipartFile movie) throws IOException;

    Result getMovieById(Integer id);

    Result getAll();

    Result getMovieByTags(List<Tag> tags);

    Result getMovieByType(Integer typeId);

    Result getMovieByUp(String upId);

    Result getMovieBySearch(String search);

    Result deleteMovie(Integer movieId);


    Result getAllTags();

    Result updateMovieMsg(Long id, String name, String des, Integer typeId, String tags,
                          Boolean visibility, String pic) throws IOException;


    String uploadMoviePic(MultipartFile pic) throws IOException;


}
