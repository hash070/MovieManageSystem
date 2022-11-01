package com.guico.moviemanagesystembackend.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.guico.moviemanagesystembackend.entry.Movie;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MovieMapper extends BaseMapper<Movie> {


}
