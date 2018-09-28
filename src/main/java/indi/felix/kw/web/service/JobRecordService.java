package indi.felix.kw.web.service;

import indi.felix.kw.common.toolkit.Constant;
import indi.felix.kw.core.dto.BootTablePage;
import indi.felix.kw.core.mapper.KJobRecordDao;
import indi.felix.kw.core.model.KJobRecord;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.List;

@Service
public class JobRecordService {

	@Autowired
	private KJobRecordDao kJobRecordDao;
	
	/**
	 * @Title getList
	 * @Description 获取带分页的列表
	 * @param start 起始行数
	 * @param size 每页行数
	 * @param uId 用户ID
	 * @param jobId 作业ID
	 * @return
	 * @return BootTablePage
	 */
	public BootTablePage getList(Integer start, Integer size, Integer uId, Integer jobId){
		KJobRecord template = new KJobRecord();
		template.setAddUser(uId);
		if (jobId != null){
			template.setRecordJob(jobId);
		}
		List<KJobRecord> kJobRecordList = kJobRecordDao.template(template, start, size);
		long totalCount = kJobRecordDao.templateCount(template);
		BootTablePage bootTablePage = new BootTablePage();
		bootTablePage.setRows(kJobRecordList);
		bootTablePage.setTotal(totalCount);
		return bootTablePage;
	}
	
	/**
	 * @Title getLogContent
	 * @Description 转换日志内容
	 * @param recordId 转换记录ID
	 * @return
	 * @throws IOException
	 * @return String
	 */
	public String getLogContent(Integer jobId) throws IOException{
		KJobRecord kJobRecord = kJobRecordDao.unique(jobId);
		String logFilePath = kJobRecord.getLogFilePath();
		return FileUtils.readFileToString(new File(logFilePath), Constant.DEFAULT_ENCODING);
	}
}