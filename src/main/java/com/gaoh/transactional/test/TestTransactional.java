package com.gaoh.transactional.test;

import com.gaoh.transactional.config.ConfigTransactional;
import com.gaoh.transactional.service.StudentService;
import org.junit.Test;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

/**
 * @Author: GH
 * @Date: 2019/5/7 13:08
 * @Version 1.0
 */
public class TestTransactional {

    @Test
    public void test01() throws Exception {
        AnnotationConfigApplicationContext annotationConfigApplicationContext = new AnnotationConfigApplicationContext(ConfigTransactional.class);
        StudentService studentService = annotationConfigApplicationContext.getBean(StudentService.class);
        studentService.insert();
    }
}
