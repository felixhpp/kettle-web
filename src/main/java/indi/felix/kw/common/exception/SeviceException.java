package indi.felix.kw.common.exception;

public class SeviceException extends Exception{

	private static final long serialVersionUID = 1L;

	/**
	 * 错误编码
	 */
	private String errorCode;

	/**
	 * 消息是否为属性文件中的Key
	 */
	private boolean propertiesKey = true;
	/**
	 * 提供无参数的构造方法
	 */
	public SeviceException(){

	}

	public SeviceException(String message){
		super(message);// 把参数传递给Throwable的带String参数的构造方法
	}

	/**
	 * 构造一个基本异常.
	 *
	 * @param errorCode
	 *            错误编码
	 * @param message
	 *            信息描述
	*/
	public SeviceException(String errorCode, String message){
		this(errorCode, message, true);
	}

	/**
	 * 构造一个基本异常.
	 *
	 * @param errorCode
	 *            错误编码
	 * @param message
	 *            信息描述
	 */
	public SeviceException(String errorCode, String message, Throwable cause){
		this(errorCode, message, cause, true);
	}

	/**
	 * 构造一个基本异常.
	 *
	 * @param errorCode
	 *            错误编码
	 * @param message
	 *            信息描述
	 * @param propertiesKey
	 * 			  消息是否为属性文件中的Key
	 */
	public SeviceException(String errorCode, String message, boolean propertiesKey){
		super(message);
		this.setErrorCode(errorCode);
		this.setPropertiesKey(propertiesKey);
	}

	public SeviceException(String errorCode, String message, Throwable cause, boolean propertiesKey){
		super(message);
		this.setErrorCode(errorCode);
		this.setPropertiesKey(propertiesKey);
	}

	public String getErrorCode() {
		return errorCode;
	}

	public void setErrorCode(String errorCode) {
		this.errorCode = errorCode;
	}

	public boolean isPropertiesKey() {
		return propertiesKey;
	}

	public void setPropertiesKey(boolean propertiesKey) {
		this.propertiesKey = propertiesKey;
	}

}
