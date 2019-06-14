package com.gaoh.aop.test;

import com.gaoh.aop.configuration.AopConfiguration;
import com.gaoh.aop.target.MyMath;
import org.junit.Test;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

/**
 * @Author: GH
 * @Date: 2019/4/20 9:19
 * @Version 1.0
 */
public class TestAop {

    @Test
    public void test() {
        AnnotationConfigApplicationContext applicationContext = new AnnotationConfigApplicationContext(AopConfiguration.class);

        MyMath myMath = applicationContext.getBean(MyMath.class);
        myMath.division(10, 2);
        myMath.add(1, 2);
    }
}
