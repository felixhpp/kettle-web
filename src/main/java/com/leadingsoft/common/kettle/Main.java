package com.leadingsoft.common.kettle;

import com.leadingsoft.web.utils.PropertyUtil;
import net.sf.json.JSONArray;
import org.pentaho.di.core.KettleEnvironment;
import org.pentaho.di.core.ProgressNullMonitorListener;
import org.pentaho.di.core.database.DatabaseMeta;
import org.pentaho.di.core.exception.KettleException;
import org.pentaho.di.core.logging.*;
import org.pentaho.di.core.variables.VariableSpace;
import org.pentaho.di.core.variables.Variables;
import org.pentaho.di.job.Job;
import org.pentaho.di.job.JobMeta;
import org.pentaho.di.repository.RepositoryDirectoryInterface;
import org.pentaho.di.repository.kdr.KettleDatabaseRepository;
import org.pentaho.di.repository.kdr.KettleDatabaseRepositoryMeta;
import org.pentaho.di.trans.Trans;
import org.pentaho.di.trans.TransMeta;
import org.pentaho.di.trans.step.StepInterface;
import org.pentaho.di.trans.step.StepStatus;

public class Main {
	private static String host = PropertyUtil.getProperty("jdbc.host");
	private static String dbName = PropertyUtil.getProperty("jdbc.dbname");
	private static String port = PropertyUtil.getProperty("jdbc.port");
	private static String name = PropertyUtil.getProperty("jdbc.username");
	private static String password = PropertyUtil.getProperty("jdbc.password");

	public static void main(String[] args) throws Exception{
		KettleEnvironment.init();		
		//数据库连接元对象
    	DatabaseMeta databaseMeta = new DatabaseMeta(null, "MYSQL", "Native", "localhost", "kettle-master", "3306", "root", "123456");
    	//资源库元对象
        KettleDatabaseRepositoryMeta repositoryInfo = new KettleDatabaseRepositoryMeta();
        repositoryInfo.setConnection(databaseMeta);
        //资源库
        KettleDatabaseRepository repository = new KettleDatabaseRepository();
        repository.init(repositoryInfo);
        repository.connect("admin", "admin");
        //判断是否连接成功
        if (repository.isConnected()) {
        	System.out.println( "connected" );
        }else{
        	System.out.println("error");
        }
        RepositoryDirectoryInterface jobDirectory = repository.loadRepositoryDirectoryTree().findDirectory("/");
        //runTranslate(repository, jobDirectory, "test111");
        runJob(repository, jobDirectory, "job1");
	}

	public static void runTranslate(KettleDatabaseRepository repository, RepositoryDirectoryInterface directory, String transName) throws KettleException{
		TransMeta transMeta = repository.loadTransformation(transName, directory, new ProgressNullMonitorListener(), true, "1.0");
		transMeta.setCapturingStepPerformanceSnapShots(true);
		//设置日志输出到表中
		setTransLog(transMeta);

		Trans trans = new Trans(transMeta);
        trans.setLogLevel(LogLevel.DEBUG);
        trans.setMonitored(true);
		trans.setInitializing(true);
		trans.setPreparing(true);
		trans.setRunning(true);
		trans.setSafeModeEnabled(true);


		// 执行ktr
		trans.execute(null);
		// 等待执行完毕
		trans.waitUntilFinished();
        if (trans.isFinished()){
        	System.out.println("执行成功");
        	/*Map<String, List<StepPerformanceSnapShot>> stepPerformanceSnapShots = trans.getStepPerformanceSnapShots();
        	stepPerformanceSnapShots.forEach((str, StepPerformanceSnapShotList) -> {
        		for (StepPerformanceSnapShot stepPerformanceSnapShot : StepPerformanceSnapShotList){
        			System.out.println(JSONObject.fromObject(stepPerformanceSnapShot).toString());
        		}        		
        	});*/

			JSONArray jsonArray = new JSONArray();
			for (int i = 0; i < trans.nrSteps(); i++) {
				StepInterface baseStep = trans.getRunThread(i);
				StepStatus stepStatus = new StepStatus(baseStep);
				//fields即为步骤度量信息
				String[] fields = stepStatus.getTransLogFields();
				JSONArray childArray = new JSONArray();
				for (int f = 1; f < fields.length; f++) {
					childArray.add(fields[f]);
					//System.out.println("11:" + fields[f]);
				}
				jsonArray.add(childArray);
			}

        	String logChannelId = trans.getLogChannelId();
        	LoggingBuffer appender = KettleLogStore.getAppender();
        	String logText = appender.getBuffer(logChannelId, true).toString();
        	System.out.println(logText);
        }else{
        	System.out.println("执行失败");
        }
	}
	
	public static void runJob(KettleDatabaseRepository repository, RepositoryDirectoryInterface directory, String jobName) throws KettleException{	
        JobMeta jobMeta = repository.loadJob(jobName, directory, new ProgressNullMonitorListener(), null);
		setJobsLog(jobMeta);
        Job job = new Job(repository, jobMeta);
        job.setDaemon(true);
        job.setLogLevel(LogLevel.DEBUG);

        job.run();
        job.waitUntilFinished();   
        if (job.isFinished()){
        	String logChannelId = job.getLogChannelId();
        	LoggingBuffer appender = KettleLogStore.getAppender();
        	String logText = appender.getBuffer(logChannelId, true).toString();
        	System.out.println(logText);
        }else{
        	System.out.println("执行失败");
        }
	}

	/**
	 * @Title setTransLog
	 * @Description 自定义设置转换日志
	 * @param transMeta
	 * @throws
	 * @ruturn void
	 */
	public static void setTransLog(TransMeta transMeta){

		DatabaseMeta databaseMeta = new DatabaseMeta();
		databaseMeta.setName("test");
		databaseMeta.setDatabaseType("MYSQL");
		databaseMeta.setAccessType(DatabaseMeta.TYPE_ACCESS_NATIVE);
		databaseMeta.setHostname(host);
		databaseMeta.setDBName(dbName);
		databaseMeta.setDBPort(port);
		databaseMeta.setUsername(name);
		databaseMeta.setPassword(password);

		transMeta.addDatabase(databaseMeta);
		//region 设置变量集
		VariableSpace space = new Variables();
		//将step日志数据库配置名加入到变量集中
		space.setVariable("transloging","test");
		space.initializeVariablesFrom(null);
		//endregion

		//region 设置转换(trans)日志
		TransLogTable transLogTable = TransLogTable.getDefault(space, transMeta, transMeta.getSteps());
		transLogTable.setConnectionName("test");
		transLogTable.setTableName("k_trans_log");
		transMeta.setTransLogTable(transLogTable);
		//endregion

		//region 设置步骤(Step)日志
		StepLogTable stepLogTable = StepLogTable.getDefault(space,transMeta);
		//StepLogTable使用的数据库连接名（上面配置的变量名）。
		stepLogTable.setConnectionName("test");
		//设置Step日志的表名
		stepLogTable.setTableName("k_trans_step_log");
		//设置TransMeta的StepLogTable
		transMeta.setStepLogTable(stepLogTable);
		//endregion

	}

	/**
	 * @Title setJobsLog
	 * @Description 自定义设置作业日志
	 * @param jobMeta
	 * @throws
	 * @ruturn void
	 */
	public static void setJobsLog(JobMeta jobMeta){

		DatabaseMeta databaseMeta = new DatabaseMeta();
		databaseMeta.setName("test");
		databaseMeta.setDatabaseType("MYSQL");
		databaseMeta.setAccessType(DatabaseMeta.TYPE_ACCESS_NATIVE);
		databaseMeta.setHostname(host);
		databaseMeta.setDBName(dbName);
		databaseMeta.setDBPort(port);
		databaseMeta.setUsername(name);
		databaseMeta.setPassword(password);

		jobMeta.addDatabase(databaseMeta);

		//region 定义变量
		VariableSpace space = new Variables();
		//将日志数据库配置名加入到变量集中
		space.setVariable("jobloging", "test");
		space.initializeVariablesFrom(null);
		//endregion

		//定义job日志
		//声明JobLogTable。space:系统变量;jobMeta:提供数据库连接
		JobLogTable jobLogTable = JobLogTable.getDefault(space,jobMeta);
		//JobLogTable使用的数据库连接名（上面配置的变量名）。
		jobLogTable.setConnectionName("test");
		//设置job日志的表名
		jobLogTable.setTableName("k_job_log");
		//设置jobMeta的JobLogTable
		jobMeta.setJobLogTable(jobLogTable);

		//定义JobEntry日志
		//声明JobEntryLogTable。space:系统变量;jobMeta:提供数据库连接
		JobEntryLogTable jobEntryLogTable = JobEntryLogTable.getDefault(space, jobMeta);
		//JobEntryLogTable使用的数据库连接名（上面配置的变量名）。
		jobEntryLogTable.setConnectionName("test");
		//设置JobEntry日志的表名
		jobEntryLogTable.setTableName("k_job_step_log");
		//设置jobMeta的JobEntryLogTable
		jobMeta.setJobEntryLogTable(jobEntryLogTable);

	}
}
