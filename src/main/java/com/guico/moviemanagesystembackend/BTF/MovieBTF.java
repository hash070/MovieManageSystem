package com.guico.moviemanagesystembackend.BTF;

import com.guico.moviemanagesystembackend.entry.Type;
import com.guico.moviemanagesystembackend.entry.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MovieBTF {
    Long id;
    String name;
    String des;
    Type type;
    String banner;
    User uploader;
    String file;
    Boolean visibility;
    Long views;
    Long likes;
}
