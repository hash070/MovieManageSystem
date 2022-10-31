package com.guico.moviemanagesystembackend.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.guico.moviemanagesystembackend.utils.Result;
import com.guico.moviemanagesystembackend.entry.Movie;
import com.guico.moviemanagesystembackend.entry.Tag;

import java.util.List;

public interface IMovieService extends IService<Movie> {

    Result addMovie(Movie movie);

    Result getAllMovie();

    Result getMovieByTags(List<Tag> tags);

    Result getMovieByType(Integer typeId);

    Result getMovieByUp(Integer upId);

    Result getMovieBySearch(String search);

    Result deleteMovie(Integer movieId, String SAToken);

    Result updateMovie(Movie movie, String SAToken);

    Result getAllTags();

}
