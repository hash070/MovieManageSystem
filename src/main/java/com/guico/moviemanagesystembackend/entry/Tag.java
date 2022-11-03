package com.guico.moviemanagesystembackend.entry;


import cn.hutool.json.JSONUtil;
import lombok.Data;

import java.util.List;

@Data
public class Tag {
    String name;

    public Tag(String name) {
        this.name = name;
    }

    public static List<Tag> getTagsFromJson(String Json){
        return JSONUtil.toList(JSONUtil.parseArray(Json), Tag.class);
    }

    public static String getJsonFromTags(List<Tag> tags){
        return JSONUtil.toJsonStr(tags);
    }
}
