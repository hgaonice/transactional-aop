package com.gaoh.aop.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;

/**
 * @Author: GH
 * @Date: 2019/4/20 9:17
 * @Version 1.0
 * 织入的逻辑
 */
@Aspect
public class MyAspect {

    /**
     * 切点
     */
    @Pointcut("execution(public * com.gaoh.aop.target.MyMath.*(..))")
    public void pointcut() {
    }


    /**
     * 前置通知
     * @param joinPoint
     */
    @Before("pointcut()")
    public void before(JoinPoint joinPoint) {
        System.out.println("=======beforeBegin=======");
        String name = joinPoint.getSignature().getName();
        System.out.println("方法名称:" + name);
        Object[] args = joinPoint.getArgs();
        System.out.println(Arrays.asList(args));
        System.out.println("=======beforeEnd=======");
    }

    /**
     * 后置通知
     */
    @After("pointcut()")
    public void after(JoinPoint joinPoint) {
        System.out.println("=======afterBegin=======");
        String name = joinPoint.getSignature().getName();
        System.out.println("执行的方法名:" + name);
        System.out.println("=======afterEnd=======");
    }

    /**
     * 环绕通知  必须要有返回值
     * @param joinPoint
     * @return
     */
    @Around("pointcut()")
    public Object around(ProceedingJoinPoint  joinPoint) {
        Object result = null;
        System.out.println("=======aroundBegin=======");
        String name = joinPoint.getSignature().getName();
        System.out.println("方法名:" + name);
        System.out.println("=======aroundEnd=======");

        try {
            result = joinPoint.proceed();
        } catch (Throwable throwable) {
            throwable.printStackTrace();
        }
        return result;
    }

    /**
     * 正常返回
     */
    @AfterReturning(value = "pointcut()", returning = "result")
    public void AfterReturning(Object result) {
        System.out.println("返回的结果:" + result);
    }

    @AfterThrowing(value = "pointcut()",throwing = "e")
    public void afterThrowing(Exception e) {
        System.out.println("异常信息:" + e);
    }


}
