package com.guico.moviemanagesystembackend.entry;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;

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
}
