package com.gaoh.aop.configuration;

import com.gaoh.aop.aspect.MyAspect;
import com.gaoh.aop.target.MyMath;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

/**
 * @Author: GH
 * @Date: 2019/4/20 9:15
 * @Version 1.0
 */
@Configuration
@ComponentScan("com.gaoh.aop")
@EnableAspectJAutoProxy
public class AopConfiguration {

    @Bean
    public MyAspect aspect() {
        return new MyAspect();
    }

    @Bean
    public MyMath math() {
        return new MyMath();
    }

}
