package indi.felix.kw.web.service;

import indi.felix.kw.core.dto.BootTablePage;
import indi.felix.kw.core.mapper.KQuartzDao;
import indi.felix.kw.core.model.KQuartz;
import org.beetl.sql.core.DSTransactionManager;
import org.pentaho.di.core.exception.KettleException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class QuartzService {

	
	@Autowired
	private KQuartzDao kQuartzDao;
	
	/**
	 * @Title getList
	 * @Description 获取定时策略列表
	 * @return 
	 * @throws KettleException
	 * @return List<KQuartz>
	 */
	public List<KQuartz> getList(Integer uId){
		List<KQuartz> resultList = new ArrayList<KQuartz>();
		KQuartz kQuartz = new KQuartz();
		kQuartz.setDelFlag(1);
		kQuartz.setAddUser(uId);
		resultList.addAll(kQuartzDao.template(kQuartz));		
		return resultList;
	}
	
	/**
	 * @Title getList
	 * @Description 获取分页列表
	 * @param start 起始行数
	 * @param size 每页行数
	 * @param uId 用户ID
	 * @return
	 * @throws KettleException
	 * @return BootTablePage
	 */
	public BootTablePage getList(Integer start, Integer size, Integer uId){
		KQuartz kQuartz = new KQuartz();
		kQuartz.setDelFlag(1);
		kQuartz.setAddUser(uId);
		List<KQuartz> kQuartzList = kQuartzDao.template(kQuartz, start, size);
		long allCount = kQuartzDao.templateCount(kQuartz);
		BootTablePage bootTablePage = new BootTablePage();
		bootTablePage.setRows(kQuartzList);
		bootTablePage.setTotal(allCount);
		return bootTablePage;
	}

	/**
	 * @Title delete
	 * @Description 删除定时策略
	 * @param quartzId 转换ID
	 * @return void
	 */
	public void delete(Integer quartzId){
		KQuartz kQuartz = kQuartzDao.unique(quartzId);
		kQuartz.setDelFlag(0);
		kQuartzDao.updateById(kQuartz);
	}

	/**
	 * @Title insert
	 * @Description 添加定时策略到数据库
	 * @param kQuartz 转换对象
	 * @param uId 用户ID
	 * @throws SQLException
	 * @return void
	 */
	public void insert(KQuartz kQuartz, Integer uId) throws SQLException {
		DSTransactionManager.start();
		//补充添加作业信息
		//作业基础信息
		kQuartz.setAddUser(uId);
		kQuartz.setAddTime(new Date());
		kQuartz.setEditUser(uId);
		kQuartz.setEditTime(new Date());
		//作业是否被删除
		kQuartz.setDelFlag(1);

		kQuartzDao.insert(kQuartz);
		DSTransactionManager.commit();
	}

	/**
	 * @Title getQuartz
	 * @Description 获取定时策略对象
	 * @param quartzId 定时策略ID
	 * @return KQuartz
	 */
	public KQuartz getQuartz(Integer quartzId){
		return kQuartzDao.single(quartzId);
	}

	/**
	 * @Title update
	 * @Description 更新定时策略信息
	 * @param kQuartz 定时策略对象
	 * @param uId 用户ID
	 * @return void
	 */
	public void update(KQuartz kQuartz,Integer uId){
		kQuartz.setEditTime(new Date());
		kQuartz.setEditUser(uId);
		kQuartzDao.updateTemplateById(kQuartz);
	}

	/**
	 * @Title check
	 * @Description 检查定时策略是否已存在
	 * @param quartzCron 定时策略表达式
	 * @ruturn boolean
	 */
	public boolean check(String quartzCron){
		KQuartz template = new KQuartz();
		template.setDelFlag(1);
		template.setQuartzCron(quartzCron);

		List<KQuartz> kQuartzList = kQuartzDao.template(template);
		if (null != kQuartzList && kQuartzList.size() > 0){
			return false;
		}else {
			return true;
		}
	}
}