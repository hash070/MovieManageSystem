package com.guico.moviemanagesystembackend.entry;

import cn.hutool.core.map.MapWrapper;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@TableName("blog")
public class Blog {
    @TableId(value = "id", type= IdType.AUTO)
    Long id;
    @TableField("des")
    String des;
    @TableField("title")
    String title;
    @TableField("article")
    String article;
    @TableField("author")
    String author;
    @TableField("upload_time")
    Date uploadTime;
    @TableField("views")
    Long views;

    @TableField("isNews")
    Boolean isNews;


    public Map<String,String> toMap(){
        Map<String,String> map = new HashMap<>();
        map.put("id",id.toString());
        map.put("des",des);
        map.put("title",title);
        map.put("article",article);
        map.put("author",author);
        map.put("uploadTime",uploadTime.toString());
        map.put("views",views.toString());
        map.put("isNews",isNews.toString());
        return map;
    }

    public Blog(String des, String title, String article, String author, Date uploadTime, Boolean isNews) {
        this.des = des;
        this.title = title;
        this.article = article;
        this.author = author;
        this.uploadTime = uploadTime;
        this.isNews = isNews;
        this.views = 0L;
    }

    public Map<String,String> toUpdateMap(){
        Map<String,String> map = new HashMap<>();
        map.put("des",des);
        map.put("title",title);
        map.put("article",article);
        map.put("isNews",isNews.toString());
        return map;
    }

    public Blog(Map<Object, Object> map){
        this.id = Long.parseLong(map.get("id").toString());
        this.des = map.get("des").toString();
        this.title = map.get("title").toString();
        this.article = map.get("article").toString();
        this.author = map.get("author").toString();
        this.uploadTime = new Date(map.get("uploadTime").toString());
        this.views = Long.parseLong(map.get("views").toString());
        this.isNews = Boolean.parseBoolean(map.get("isNews").toString());
    }

}
