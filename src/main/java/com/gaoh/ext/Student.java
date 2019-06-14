package com.gaoh.ext;

/**
 * @Author: GH
 * @Date: 2019/5/12 12:48
 * @Version 1.0
 */
public class Student {
    private String name;
    private Integer age;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public Student() {
        System.out.println("Student创建");
    }
}
