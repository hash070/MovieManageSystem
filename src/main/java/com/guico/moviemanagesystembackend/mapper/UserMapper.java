package com.guico.moviemanagesystembackend.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.guico.moviemanagesystembackend.entry.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper extends BaseMapper<User> {

}
