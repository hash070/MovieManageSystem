package com.guico.moviemanagesystembackend.entry;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Date;

@Data
@AllArgsConstructor
@TableName("movie")
public class Movie {
    @TableId(value = "id", type = IdType.AUTO)
    Long id;
    @TableField("name")
    String name;
    @TableField("des")
    String des;
    //此字段为外键，表中的字段为type的id
    @TableField("type")
    Integer type;
    @TableField("banner")
    String banner;
    @TableField("uploader")
    String uploader;
    @TableField("file")
    String file;
    @TableField("visibility")
    Boolean visibility;
    @TableField("upload_time")
    Date uploadTime;
    @TableField("views")
    Long views;
    @TableField("likes")
    Long likes;

    public Movie(String name, String desc, Integer type, String banner, String uploader, String file, Boolean visibility, Date uploadTime, Long views, Long likes) {
        this.name = name;
        this.des = desc;
        this.type = type;
        this.banner = banner;
        this.uploader = uploader;
        this.file = file;
        this.visibility = visibility;
        this.uploadTime = uploadTime;
        this.views = views;
        this.likes = likes;
    }
}
