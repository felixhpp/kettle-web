package com.leadingsoft.web.controller;

import com.leadingsoft.common.toolkit.Constant;
import com.leadingsoft.core.dto.ResultDto;
import com.leadingsoft.core.model.KUser;
import com.leadingsoft.web.service.UserService;
import com.leadingsoft.web.utils.JsonUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.sql.SQLException;

@RestController
@RequestMapping("/user/")
public class UserController {

	@Autowired
	private UserService userService;
	
	@RequestMapping("getList.shtml")
	public String getList(Integer offset, Integer limit){
		return JsonUtils.objectToJson(userService.getList(offset, limit));
	}
	
	@RequestMapping("delete.shtml")
	public String delete(Integer uId){
		userService.delete(uId);
		return ResultDto.success();
	}
	
	@RequestMapping("resetPassword.shtml")
	public String resetPassword(){
		
		return ResultDto.success();
	}

	@RequestMapping("insert.shtml")
	public String insert(KUser kUser, HttpServletRequest request){
		KUser addkUser = (KUser) request.getSession().getAttribute(Constant.SESSION_ID);
		Integer uId = addkUser.getuId();
		if (userService.check(kUser.getuAccount())){
			try {
				userService.insert(kUser, uId);
				return ResultDto.success();
			}catch (SQLException e) {
				e.printStackTrace();
				return ResultDto.fail("添加用户失败");
			}
		}else{
			return ResultDto.fail("该用户名已存在");
		}
	}

	@RequestMapping("update.shtml")
	public String update(KUser kUser, HttpServletRequest request){
		KUser editkUser = (KUser) request.getSession().getAttribute(Constant.SESSION_ID);
		try{
			userService.update(kUser, editkUser.getuId());
			return ResultDto.success();
		}catch(Exception e){
			return ResultDto.success(e.toString());
		}
	}
}
