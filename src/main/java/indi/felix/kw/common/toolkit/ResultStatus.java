/**
 * Copyright (C), 2015-2018, XXX有限公司
 * FileName: ResultStatusEnum
 * Author:   lenovo
 * Date:     2018/9/29 12:38
 * Description:
 * History:
 * <author>          <time>          <version>          <desc>
 * 作者姓名           修改时间           版本号              描述
 */
package indi.felix.kw.common.toolkit;

public enum ResultStatus {
    Success(1, 1, "OKCode", "Requset is successful", true),
    Error(2, 0, "ErrorCode", "Requset is error", false),
    NotFoundCode(3, 400, "NotFoundCode", "Requset is successful", false),
    ErrorCode500(4, 500, "ErrorCode500", "Requset error", false);

    // 成员变量
    private String name;
    private int code;
    private int index;
    private String message;
    private Boolean success;

    // 构造方法
    private ResultStatus(Integer index, Integer code, String name, String message, Boolean success) {
        this.index = index;
        this.name = name;
        this.code = code;
        this.message = message;
        this.success = success;
    }

    // 普通方法       
    public static String getName(int index) {
        for (ResultStatus c : ResultStatus.values()) {
            if (c.getIndex() == index) {
                return c.name;
            }
        }
        return null;
    }

    public static Integer getCode(int index) {
        for (ResultStatus c : ResultStatus.values()) {
            if (c.getIndex() == index) {
                return c.code;
            }
        }
        return 0;
    }

    public static String getMessage(int index) {
        for (ResultStatus c : ResultStatus.values()) {
            if (c.getIndex() == index) {
                return c.message;
            }
        }
        return null;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public int getIndex() {
        return index;
    }

    public void setIndex(int index) {
        this.index = index;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Boolean getSuccess() {
        return success;
    }

    public void setSuccess(Boolean success) {
        this.success = success;
    }
}