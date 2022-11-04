package com.guico.moviemanagesystembackend.entry;

import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.*;

import java.util.HashMap;
import java.util.Map;

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

    public User(Map<Object,Object> map ){
        this.nickname = (String) map.get("nickname");
        this.password = (String) map.get("password");
        this.email = (String) map.get("email");
        this.level = Integer.valueOf((String) map.get("level"));
    }

    public Map<String,String> toMap(){
        Map<String,String> map = new HashMap<>();
        map.put("nickname",nickname);
        map.put("password",password);
        map.put("email",email);
        map.put("level",level.toString());
        return map;
    }
}
