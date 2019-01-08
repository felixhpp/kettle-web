package indi.felix.kw.web.service;

import indi.felix.kw.common.exception.SeviceException;
import indi.felix.kw.common.toolkit.MD5Utils;
import indi.felix.kw.core.dto.BootTablePage;
import indi.felix.kw.core.mapper.KUserDao;
import indi.felix.kw.core.model.KUser;
import org.beetl.sql.core.DSTransactionManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.Date;
import java.util.List;

@Service
public class UserService {

	@Autowired
	private KUserDao kUserDao;
		
	/**
	 * @Title login
	 * @Description 登陆
	 * @param kUser 用户信息对象
	 * @return KUser
	 */
	public KUser login(KUser kUser){
		KUser template = new KUser();
		template.setDelFlag(1);
		template.setuAccount(kUser.getuAccount());
		KUser user = kUserDao.templateOne(template);
		if (null != user){
			if (user.getuPassword().equals(MD5Utils.Encrypt(kUser.getuPassword(), true))){
				return user;
			}
			return null;
		}
		return null;
	}
	
	/**
	 * @Title isAdmin
	 * @Description 用户是否为管理员
	 * @param uId 用户ID
	 * @return boolean
	 */
	public boolean isAdmin(Integer uId){
		KUser kUser = kUserDao.unique(uId);
		if ("admin".equals(kUser.getuAccount())){
			return true;
		}else {
			return false;	
		}
	}
	
	/**
	 * @Title getList
	 * @Description 获取用户分页列表
	 * @param start 其实行数
	 * @param size 每页显示行数
	 * @return BootTablePage
	 */
	public BootTablePage getList(Integer start, Integer size){
		KUser template = new KUser();
		template.setDelFlag(1);
		List<KUser> kUserList = kUserDao.template(template, start, size);
		long allCount = kUserDao.templateCount(template);
		BootTablePage bootTablePage = new BootTablePage();
		bootTablePage.setRows(kUserList);
		bootTablePage.setTotal(allCount);
		return bootTablePage;
	}

	/**
	 * @Title getKUser
	 * @Description 根据uId获取用户
	 * @param uId 用户id
	 * @throws
	 * @ruturn 用户记录
	 */
	public KUser getKUser(Integer uId){
		return kUserDao.single(uId);
	}
	
	/**
	 * @Title delete
	 * @Description 删除用户
	 * @param uId 用户ID
	 * @return void
	 */
	public void delete(Integer uId) throws SeviceException{
		KUser kUser = kUserDao.unique(uId);
		//禁止用户删除admin账号
		if(kUser.getuAccount().equals("admin")){
			throw new SeviceException("管理员账号不用允许删除");
		}
		kUser.setDelFlag(0);
		kUserDao.updateById(kUser);
	}

	/**
	 * @Title inster
	 * @Description 插入一个用户
	 * @param kUser 用户信息
	 * @param uId 操作用户ID
	 * @throws SQLException
	 * @ruturn void
	 */
	public void insert(KUser kUser,Integer uId) throws SQLException {
		DSTransactionManager.start();
		//补充添加用户信息
		//用户基础信息
		kUser.setAddUser(uId);
		kUser.setAddTime(new Date());
		kUser.setEditUser(uId);
		kUser.setEditTime(new Date());

		kUser.setuPassword(MD5Utils.Encrypt(kUser.getuPassword(),true));
		//用户是否被删除
		kUser.setDelFlag(1);
		kUserDao.insert(kUser);
		DSTransactionManager.commit();
	}

	/**
	 * @Title update
	 * @Description 更新用户信息
	 * @param kUser 用户对象
	 * @param uId 操作用户ID
	 * @return void
	 */
	public void update(KUser kUser,Integer uId){
		kUser.setEditUser(uId);
		kUser.setEditTime(new Date());
		kUser.setuPassword(MD5Utils.Encrypt(kUser.getuPassword(),true));
		kUserDao.updateTemplateById(kUser);
	}

	/**
	 * @Title check
	 * @Description 检查用户名是否已存在
	 * @param uAccount 用户名
	 * @ruturn boolean
	 */
	public boolean check(String uAccount){
		KUser template = new KUser();
		template.setDelFlag(1);
		template.setuAccount(uAccount);

		List<KUser> kUserList = kUserDao.template(template);
		if (null != kUserList && kUserList.size() > 0){
			return false;
		}else {
			return true;
		}
	}
}