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



    public static List<Type> getTypeListFromMap(Map<Object, Object> typeMap) {
        List<Type> typeList = new ArrayList<>();
        for (Object key : typeMap.keySet()) {
            typeList.add(new Type(Long.parseLong(key.toString()), typeMap.get(key).toString()));
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
