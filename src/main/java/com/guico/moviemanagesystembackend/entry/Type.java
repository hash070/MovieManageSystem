package com.guico.moviemanagesystembackend.entry;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@TableName("type")
public class Type {

    @TableId(value = "id", type = IdType.AUTO)
    Long id;
    @TableField("name")
    String name;

    public Type (String name) {
        this.name = name;
    }

    public static List<String> getTypeList(List<Type> types) {
        List<String> typeList = new ArrayList<>();
        for (Type type : types) {
            typeList.add(type.getName());
        }
        return typeList;
    }

    public static Map<Long, String> getTypeMap(List<Type> types) {
        Map<Long, String> typeMap = new HashMap<>();
        for (Type type : types) {
            typeMap.put(type.getId(), type.getName());
        }
        return typeMap;
    }
}
