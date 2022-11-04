package com.guico.moviemanagesystembackend.BTF;

import com.guico.moviemanagesystembackend.entry.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BlogBTF {
    Long id;
    String des;
    String title;
    String article;
    User author;
    Long views;
    Date uploadTime;
    Boolean isNews;
}
