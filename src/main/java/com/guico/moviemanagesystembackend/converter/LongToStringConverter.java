package com.guico.moviemanagesystembackend.converter;


import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class LongToStringConverter implements Converter<Long,String> {
    @Override
    public String convert(Long aLong) {
        return String.valueOf(aLong);
    }
}
