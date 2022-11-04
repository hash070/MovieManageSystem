package com.guico.moviemanagesystembackend.converter;

import cn.hutool.core.date.DateUtil;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class StringToDateConverter implements Converter<String, Date> {

    public Date convert(String s) {
        return DateUtil.parse(s);
    }
}

