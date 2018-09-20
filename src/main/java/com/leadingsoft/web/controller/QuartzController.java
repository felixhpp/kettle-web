package com.leadingsoft.web.controller;

import com.leadingsoft.common.toolkit.Constant;
import com.leadingsoft.core.dto.BootTablePage;
import com.leadingsoft.core.dto.ResultDto;
import com.leadingsoft.core.model.KQuartz;
import com.leadingsoft.core.model.KUser;
import com.leadingsoft.web.service.QuartzService;
import com.leadingsoft.web.utils.JsonUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.sql.SQLException;

@RestController
@RequestMapping("/quartz/")
public class QuartzController {

	@Autowired
	private QuartzService quartzService;
	
	@RequestMapping("getSimpleList.shtml")
	public String simpleList(HttpServletRequest request){
		KUser kUser = (KUser) request.getSession().getAttribute(Constant.SESSION_ID);
		return JsonUtils.objectToJson(quartzService.getList(kUser.getuId()));
	}



	@RequestMapping("getList.shtml")
	public String getList(Integer offset, Integer limit, HttpServletRequest request){
		KUser kUser = (KUser) request.getSession().getAttribute(Constant.SESSION_ID);
		BootTablePage list = quartzService.getList(offset, limit, kUser.getuId());
		return JsonUtils.objectToJson(list);
	}

	@RequestMapping("insert.shtml")
	public String insert(KQuartz kQuartz, HttpServletRequest request){
		KUser kUser = (KUser) request.getSession().getAttribute(Constant.SESSION_ID);
		Integer uId = kUser.getuId();
		try {
			quartzService.insert(kQuartz, uId);
			return ResultDto.success();
		} catch (SQLException e) {
			e.printStackTrace();
			return ResultDto.fail("添加定时策略失败");
		}
	}

	@RequestMapping("getTrans.shtml")
	public String getTrans(Integer quartzId){
		return ResultDto.success(quartzService.getQuartz(quartzId));
	}

	@RequestMapping("update.shtml")
	public String update(KQuartz kQuartz, HttpServletRequest request){
		KUser kUser = (KUser) request.getSession().getAttribute(Constant.SESSION_ID);
		try{
			quartzService.update(kQuartz, kUser.getuId());
			return ResultDto.success();
		}catch(Exception e){
			return ResultDto.success(e.toString());
		}
	}

	@RequestMapping("delete.shtml")
	public String delete(Integer quartzId){
		quartzService.delete(quartzId);
		return ResultDto.success();
	}
}
