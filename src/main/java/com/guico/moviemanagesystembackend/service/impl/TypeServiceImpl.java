package com.guico.moviemanagesystembackend.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.guico.moviemanagesystembackend.mapper.TypeMapper;
import com.guico.moviemanagesystembackend.entry.Type;
import com.guico.moviemanagesystembackend.service.ITypeService;
import com.guico.moviemanagesystembackend.utils.Result;
import org.springframework.stereotype.Service;

@Service
public class TypeServiceImpl extends ServiceImpl<TypeMapper, Type> implements ITypeService {
    @Override
    public Result addType(String typeName, String SAToken) {
        return null;
    }

    @Override
    public Result deleteType(Integer typeId, String SAToken) {
        return null;
    }

    @Override
    public Result updateType(Integer typeId, String typeName, String SAToken) {
        return null;
    }

    @Override
    public Result getTypeList() {
        return null;
    }
}


