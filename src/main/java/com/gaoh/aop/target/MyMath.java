package com.gaoh.aop.target;

import org.springframework.stereotype.Component;

/**
 * @Author: GH
 * @Date: 2019/4/20 9:22
 * @Version 1.0
 */

public class MyMath {

    public double division(double a, double b) {
        return a / b;
    }

    public double add(double a, double b) {
        return a + b;
    }

}
