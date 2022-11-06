package com.guico.moviemanagesystembackend.entry;

import com.baomidou.mybatisplus.annotation.*;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

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
    @OrderBy
    @TableField("upload_time")
    Date uploadTime;
    @TableField("views")
    Long views;
    @TableField("likes")
    Long likes;
    @TableField("pic")
    String pic;

    public Movie(String name, String desc, Integer type, String banner, String uploader, String file, Boolean visibility, Date uploadTime, Long views, Long likes, String pic) {
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
        this.pic = pic;
    }

    public Movie(String name, String desc, Integer type, String banner, String uploader, String file, Boolean visibility, Date uploadTime,  String pic) {
        this.name = name;
        this.des = desc;
        this.type = type;
        this.banner = banner;
        this.uploader = uploader;
        this.file = file;
        this.visibility = visibility;
        this.uploadTime = uploadTime;
        this.views = 0L;
        this.likes = 0L;
        this.pic = pic;
    }

    public Movie(Map<Object, Object> map){
        this.id = Long.parseLong((String) map.get("id"));
        this.name = (String) map.get("name");
        this.des = (String) map.get("des");
        this.type = Integer.parseInt((String)map.get("type"));
        this.banner = (String) map.get("banner");
        this.uploader = (String) map.get("uploader");
        this.file = (String) map.get("file");
        this.visibility = Boolean.parseBoolean( (String)map.get("visibility"));
        this.uploadTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse((String) map.get("uploadTime"), new java.text.ParsePosition(0));
        this.views = Long.parseLong((String) map.get("views")) ;
        this.likes = Long.parseLong((String) map.get("likes"));
        this.pic = (String) map.get("pic");
    }

    public Map toMap(){
        Map<Object,Object> map = new HashMap<>();
        map.put("id",String.valueOf(this.id));
        map.put("name",this.name);
        map.put("des",this.des);
        map.put("type",String.valueOf(this.type));
        map.put("banner",this.banner);
        map.put("uploader",this.uploader);
        map.put("file",this.file);
        map.put("visibility",String.valueOf(this.visibility));
        map.put("uploadTime",String.valueOf(this.uploadTime));
        map.put("views",String.valueOf(this.views));
        map.put("likes",String.valueOf(this.likes));
        map.put("pic",this.pic);
        return map;

    }
}
