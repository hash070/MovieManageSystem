package com.guico.moviemanagesystembackend.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.guico.moviemanagesystembackend.utils.Result;
import com.guico.moviemanagesystembackend.entry.Type;

public interface ITypeService extends IService<Type> {
    Result addType(String typeName, String SAToken);

    Result deleteType(Integer typeId, String SAToken);

    Result updateType(Integer typeId, String typeName, String SAToken);

    Result getTypeList();

}
