package indi.felix.kw.core.dto;

import com.fasterxml.jackson.databind.ObjectMapper;
import indi.felix.kw.common.toolkit.ResultStatus;

import java.text.SimpleDateFormat;

public class ResultDto {

	/**
     * 定义返回值状态
     */
    private Integer status;

    /**
     * 返回值数据
     */
    private Object data;
    /**
     * 返回值失败携带提示信息
     */
    private String message;

    private Boolean success;

    /**
     * jackson进行json序列化工具
     */
    private static ObjectMapper objectMapper = new ObjectMapper();
    /**
     * 序列化中的时间格式化
     */
    private static final String DEFAULT_DATE_FORMAT = "yyyy-MM-dd HH:mm:ss";

    private static final String RESTULT_STATU_ERROR = "error";
    private static final String RESTULT_STATU_SUCCESS = "success";

    public ResultDto() { }
    
    public ResultDto(ResultStatus status) {
        setResultStatus(status);
    }

    private ResultDto(ResultStatus status, Object data){
        setResultStatus(status);
        this.data = data;
    }

    private ResultDto(ResultStatus status, String message) {
        setResultStatus(status);
        this.message = message;
    }

    /**
     * 返回成功，返回列表，需要自定义时间格式化
     * @param status 返回值状态
     * @param data 返回的列表数据
     * @param DateFormat 返回的列表需要时间格式化的自定义格式
     * @return JSON字符串
     */
    public static String resultListWithFormat(ResultStatus status, Object data, String DateFormat) {
        try {
            objectMapper.setDateFormat(new SimpleDateFormat(DateFormat));
            return objectMapper.writeValueAsString(new ResultDto(status, data));
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * 返回成功，返回列表，默认时间格式化
     * @param status 返回值状态
     * @param data 返回值列表数据
     * @return JSON字符串
     */
    public static String resultList(ResultStatus status, Object data) {
        try {
            objectMapper.setDateFormat(new SimpleDateFormat(DEFAULT_DATE_FORMAT));
            return objectMapper.writeValueAsString(new ResultDto(status, data));
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * 返回成功，返回单个实体
     * @param data 单个实体的数据
     * @return JSON字符串
     */
    public static String success(Object data) {
        try {
            objectMapper.setDateFormat(new SimpleDateFormat(DEFAULT_DATE_FORMAT));
            return objectMapper.writeValueAsString(new ResultDto(ResultStatus.Success, data));
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * 返回成功，没有参数
     * @return JSON字符串
     */
    public static String success() {
        try {
            return objectMapper.writeValueAsString(new ResultDto(ResultStatus.Success));
        } catch (Exception e) {
            return null;
        }
    }

    public static String fail() {
        try {
            return objectMapper.writeValueAsString(new ResultDto(ResultStatus.Error, "系统异常，请联系管理员。"));
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * 返回失败
     * @param message 返回失败的提示信息
     * @return JSON字符串
     */
    public static String fail(String message) {
        try {
            return objectMapper.writeValueAsString(new ResultDto(ResultStatus.Error, message));
        } catch (Exception e) {
            return null;
        }
    }

    private void setResultStatus(ResultStatus status){
        this.status = status.getCode();
        this.success = status.getSuccess();
        this.message = status.getMessage();
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Boolean getSuccess(){
        return success;
    }

    public void setSuccess(Boolean success){
        this.success = success;
    }
}