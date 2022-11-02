package com.guico.moviemanagesystembackend.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.guico.moviemanagesystembackend.mapper.TypeMapper;
import com.guico.moviemanagesystembackend.entry.Type;
import com.guico.moviemanagesystembackend.service.ITypeService;
import com.guico.moviemanagesystembackend.utils.Result;
import net.sf.jsqlparser.expression.StringValue;
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
    public Result addType(String typeName) {
        //由于配置了拦截器,所以不需要再次验证token
        //先从redis中查询是否存在该类型,存储的方式为HashMap
        Map<Object, Object> typeMap = stringRedisTemplate.opsForHash().entries("type");
        //如果map为空,则说明redis中没有存储任何类型,需要从持久层中查询
        if (typeMap.isEmpty()) {
//            先将持久层数据转入redis
            List<Type> types = query().list();
            for (Type type : types) {
                stringRedisTemplate.opsForHash().put("type", String.valueOf(type.getId()), type.getName());
            }
            //查看持久层中是否存在该类型
            for (Type type : types) {
                if (type.getName().equals(typeName)) {
//                    存在,返回错误
                    return Result.fail("该类型已存在");
                }
            }
//            不存在,存入持久层
            Type type = new Type(typeName);
            save(type);
            type = query().eq("name", typeName).one();
//            存入redis,这里可能会出现空指针异常,一会运行一下检查看看
            stringRedisTemplate.opsForHash().put("type", String.valueOf(type.getId()), type.getName());
//            返回ok
            return Result.ok();
        }
//        如果map不为空,则说明redis中已经存储了类型,直接从map中查询
        for (Object value : typeMap.values()) {
            if (value.equals(typeName)) {
//                存在,返回错误
                return Result.fail("该类型已存在");
            }
        }
//            不存在,存入持久层
        Type type = new Type(typeName);
        save(type);
//            存入redis,这里可能会出现空指针异常,一会运行一下检查看看
        stringRedisTemplate.opsForHash().put("type", String.valueOf(type.getId()), type.getName());
//            返回ok
        return Result.ok();
    }

    @Override
    public Result deleteType(Long id) {
//        如果存在,先删除redis中的type
        stringRedisTemplate.opsForHash().delete("type", String.valueOf(id));
//        再删除持久层中的type
        removeById(id);
        return Result.ok();
    }

    @Override
    public Result updateType(Long id, String typeName) {
//        先修改redis中的type
        stringRedisTemplate.opsForHash().put("type", String.valueOf(id), typeName);
//        再更新持久层中的type
        update().set("name", typeName).eq("id", String.valueOf(id)).update();
        return Result.ok();
    }

    @Override
    public Result getTypeList() {
//        先从redis中查询
        Map<Object, Object> typeMap = stringRedisTemplate.opsForHash().entries("type");
//        如果为空,则从持久层中查询
        if (typeMap.isEmpty()) {
            List<Type> types = query().list();
            for (Type type : types) {
                stringRedisTemplate.opsForHash().put("type", String.valueOf(type.getId()), type.getName());
            }
            return Result.ok(types);
        }
        List<Type> types = Type.getTypeListFromMap(typeMap);
//        如果不为空,则直接返回
        return Result.ok(types, typeMap.size());
    }
}


