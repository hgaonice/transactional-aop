package com.gaoh.transactional.service;

import com.gaoh.transactional.dao.StudentDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * @Author: GH
 * @Date: 2019/5/7 13:03
 * @Version 1.0
 */
@Service
public class StudentService {
    @Autowired
    private StudentDao studentDao;

    @Transactional(rollbackFor = Exception.class)
    public void insert() throws Exception {
        studentDao.insert();
        int q = 1 / 0;
    }
}
