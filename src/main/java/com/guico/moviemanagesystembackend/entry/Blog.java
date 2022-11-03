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
@TableName("blog")
public class Blog {
    @TableId(value = "id", type= IdType.AUTO)
    Long id;
    @TableField("desc")
    String desc;
    @TableField("title")
    String title;
    @TableField("article")
    String article;
    @TableField("author")
    Integer author;
    @TableField("upload_time")
    Date uploadTime;
    @TableField("views")
    Long views;

    @TableField("isNews")
    Boolean isNews;
}
