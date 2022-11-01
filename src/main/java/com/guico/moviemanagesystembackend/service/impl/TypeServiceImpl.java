package com.guico.moviemanagesystembackend.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.guico.moviemanagesystembackend.mapper.TypeMapper;
import com.guico.moviemanagesystembackend.entry.Type;
import com.guico.moviemanagesystembackend.service.ITypeService;
import com.guico.moviemanagesystembackend.utils.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class TypeServiceImpl extends ServiceImpl<TypeMapper, Type> implements ITypeService {
    @Autowired
    StringRedisTemplate stringRedisTemplate;

    @Override
    public Result addType(String typeName, String SAToken) {
        //由于配置了拦截器,所以不需要再次验证token
        //先从redis中查询是否存在该类型,存储的方式为List
        List<String> typeList = stringRedisTemplate.opsForList().range("type:list", 0, -1);
        //如果map为空,则说明redis中没有存储任何类型,需要从持久层中查询
        if(typeList == null){
            List<Type> types = query().list();
            //查看持久层中是否存在该类型
            for (Type type : types) {
                if(type.getName().equals(typeName)){
//                    存在,返回错误
                    return Result.fail("该类型已存在");
                }
            }
//            不存在,存入持久层
            Type type = new Type(typeName);
            save(type);
//            存入redis,这里可能会出现空指针异常,一会运行一下检查看看
            stringRedisTemplate.opsForHash().put("type",type.getId().toString(),type.getName());
//            返回ok
            return Result.ok();
        }
//        如果map不为空,则说明redis中已经存储了类型,直接从map中查询
        for (String name: typeList) {
            if(name.equals(typeName)) {
//                存在,返回错误
                return Result.fail("该类型已存在");
            }
//            不存在,存入持久层
            Type type = new Type(typeName);
            save(type);
//            存入redis,这里可能会出现空指针异常,一会运行一下检查看看
            stringRedisTemplate.opsForHash().put("type",type.getId().toString(),type.getName());
//            返回ok
            return Result.ok();
        }
        return Result.fail("未知错误");
    }

    @Override
    public Result deleteType(String name , String SAToken) {
//        先删除redis中的type
        return null;
    }

    @Override
    public Result updateType(String typeId, String typeName, String SAToken) {
        return null;
    }

    @Override
    public Result getTypeList() {
        return null;
    }
}


