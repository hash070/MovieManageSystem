package com.guico.moviemanagesystembackend.BTF;

import com.guico.moviemanagesystembackend.entry.Blog;
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

    public BlogBTF(Blog blog,User user){
        this.id = blog.getId();
        this.des = blog.getDes();
        this.title = blog.getTitle();
        this.article = blog.getArticle();
        this.author = user;
        this.views = blog.getViews();
        this.uploadTime = blog.getUploadTime();
        this.isNews = blog.getIsNews();
    }
}
