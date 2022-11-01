package com.guico.moviemanagesystembackend.entry;

import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@TableName("user")
public class User {
    public static final int USER_LEVEL_ROOT = 0;
    public static final int USER_LEVEL_ADMIN = 1;
    public static final int USER_LEVEL_USER = 2;

    @TableField("nickname")
    String nickname;
    @TableField("password")
    String password;
    @TableId(value = "email", type = IdType.INPUT)
    String email;
    @TableField("level")
    Integer level;

    public String toString(){
        return JSONUtil.toJsonStr(this);
    }
}
