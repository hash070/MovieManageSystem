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

    Result uploadMovie(String name, String des, Integer typeId, String tags,
                       Boolean visibility, Date uploadTime, MultipartFile pic, MultipartFile movie) throws IOException;


    Result getAllMovie();

    Result getMovieByTags(List<Tag> tags);

    Result getMovieByType(Integer typeId);

    Result getMovieByUp(Integer upId);

    Result getMovieBySearch(String search);

    Result deleteMovie(Integer movieId);

    Result updateMovie(Movie movie);

    Result getAllTags();

    Result uploadMoviePic(MultipartFile pic) throws IOException;

    Result uploadMovieFile(MultipartFile movie) throws IOException;

}
