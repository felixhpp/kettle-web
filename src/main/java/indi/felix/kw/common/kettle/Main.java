package indi.felix.kw.common.kettle;

import indi.felix.kw.common.kettle.environment.KettleLogSetting;
import indi.felix.kw.common.toolkit.MD5Utils;
import net.sf.json.JSONArray;
import org.pentaho.di.core.KettleEnvironment;
import org.pentaho.di.core.ProgressNullMonitorListener;
import org.pentaho.di.core.database.DatabaseMeta;
import org.pentaho.di.core.exception.KettleException;
import org.pentaho.di.core.logging.KettleLogStore;
import org.pentaho.di.core.logging.LogLevel;
import org.pentaho.di.core.logging.LoggingBuffer;
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
        //runJob(repository, jobDirectory, "job1");
		String ps = MD5Utils.Encrypt("admin", true);
		System.out.println(ps);
	}

	public static void runTranslate(KettleDatabaseRepository repository, RepositoryDirectoryInterface directory, String transName) throws KettleException{
		TransMeta transMeta = repository.loadTransformation(transName, directory, new ProgressNullMonitorListener(), true, "1.0");
		transMeta.setCapturingStepPerformanceSnapShots(true);
		//设置日志输出到表中
		KettleLogSetting.setTransLog(transMeta);

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
		//设置日志输出到表中
		KettleLogSetting.setJobsLog(jobMeta);
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

}
