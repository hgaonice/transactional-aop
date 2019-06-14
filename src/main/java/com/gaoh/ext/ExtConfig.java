package com.gaoh.ext;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

/**
 * @Author: GH
 * @Date: 2019/5/12 12:46
 * @Version 1.0
 */
@ComponentScan("com.gaoh.ext")
@Configuration
@Import(MyBeanFactoryPostProcessor.class)
public class ExtConfig {

    @Bean
    public Student student() {
        return new Student();
    }
}
