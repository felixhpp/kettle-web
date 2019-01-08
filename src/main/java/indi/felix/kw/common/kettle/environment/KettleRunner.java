/**
 * Copyright (C), 2015-2018, felix
 * FileName: KettleRunner
 * Author:   felix
 * Date:     2018/9/28 14:33
 * Description: kettle运行工具类
 * History:
 * <author>          <time>          <version>          <desc>
 * 作者姓名           修改时间           版本号              描述
 */
package indi.felix.kw.common.kettle.environment;


import org.pentaho.di.core.exception.KettleException;
import org.pentaho.di.job.Job;
import org.pentaho.di.job.JobExecutionConfiguration;
import org.pentaho.di.job.JobMeta;
import org.pentaho.di.trans.Trans;
import org.pentaho.di.trans.TransExecutionConfiguration;
import org.pentaho.di.trans.TransMeta;
import org.pentaho.di.trans.cluster.TransSplitter;

import java.util.Map;
import java.util.UUID;

public class KettleRunner {

    //private static Logger log = LoggerFactory.getLogger("KettleRunner");

    /**
     * @Title runJob
     * @Description 执行job
     * @param jobMeta,
     * @param initKettleParam
     * @throws
     * @ruturn boolean
     */
    public static boolean runJob(JobMeta jobMeta, Map<String,String> initKettleParam) throws KettleException {

        String uuid = UUID.randomUUID().toString();
        String msg = "====== runJob =======" + uuid;
        //log.info(msg);
        Job job = new Job(null, jobMeta);
        //初始化job参数，脚本中获取参数值：${variableName}
        if(initKettleParam!=null) {
            for (String variableName : initKettleParam.keySet()) {
                job.setVariable(variableName, initKettleParam.get(variableName));
            }
        }
        job.start();
        job.waitUntilFinished();
        if (job.getErrors() > 0) {
            //log.info(msg + " 执行失败");
        }else{
            //log.info(msg + " 执行成功");
        }
        return true;
    }

    /**
     * @Title runTrans
     * @Description 执行转换
     * @param transMeta
     * @param initKettleParam
     * @throws
     * @ruturn boolean
     */
    public static boolean runTrans(TransMeta transMeta, Map<String,String> initKettleParam) throws KettleException {

        String uuid = UUID.randomUUID().toString();
        String msg = "====== runTrans =======" + uuid;
        //log.info("runTrans:"+ uuid);
        Trans trans = new Trans(transMeta);
        //初始化trans参数，脚本中获取参数值：${variableName}
        if(initKettleParam!=null) {
            for (String variableName : initKettleParam.keySet()) {
                trans.setVariable(variableName, initKettleParam.get(variableName));
            }
        }
        //执行转换
        trans.execute(null);
        //等待转换执行结束
        trans.waitUntilFinished();
        if (trans.getErrors() > 0) {
            //log.info(msg + " 执行失败");
        }else{
            //log.info(msg + " 执行成功");
        }
        return true;
    }

    /**
     * @Title runJobCluster
     * @Description 集群执行作业
     * @param jobMeta
     * @param initKettleParam
     * @throws
     * @ruturn TransSplitter
     */
    public static TransSplitter runJobCluster(JobMeta jobMeta, Map<String,String> initKettleParam) throws KettleException {
        Trans trans = null;
        //log.info(" ====== 集群runJobCluster =======");
        //转换
        Job job = new Job(null, jobMeta);
        //初始化job参数，脚本中获取参数值：${variableName}
        if(initKettleParam!=null) {
            for (String variableName : initKettleParam.keySet()) {
                job.setVariable(variableName, initKettleParam.get(variableName));
            }
        }
        JobExecutionConfiguration config  = new JobExecutionConfiguration();
        ////设置集群为true
        // config.setExecutingClustered(true);
        // //设置local为false
        // config.setExecutingLocally(false);
        // config.setExecutingRemotely(false);
        // config.setClusterPosting(true);
        // //设置准备执行为true
        // config.setClusterPreparing(true);
        // //设置开始执行为true，否则需要到carte的监控页面上点击开始执行
        // config.setClusterStarting(true);
        // job.setExecutingServer();
        // TransSplitter transSplitter = Trans.executeClustered(transMeta, config);
        // System.out.println(transSplitter.getCarteObjectMap());
        return null;
    }

    /**
     * @Title runTransCluster
     * @Description 集群执行转换
     * @param transMeta
     * @param initKettleParam
     * @throws
     * @ruturn TransSplitter
     */
    public static TransSplitter runTransCluster(TransMeta transMeta, Map<String,String> initKettleParam) throws KettleException {
        Trans trans = null;
        //log.info(" ====== 集群runTransCluster =======");
        //转换
        trans = new Trans(transMeta);
        for (String variableName : initKettleParam.keySet()) {
            trans.setVariable(variableName, initKettleParam.get(variableName));
        }
        // 设置执行模式
        TransExecutionConfiguration config = new TransExecutionConfiguration();
        ////设置集群为true
        config.setExecutingClustered(true);
        //设置local为false
        config.setExecutingLocally(false);
        config.setExecutingRemotely(false);
        config.setClusterPosting(true);
        //设置准备执行为true
        config.setClusterPreparing(true);
        //设置开始执行为true，否则需要到carte的监控页面上点击开始执行
        config.setClusterStarting(true);
        TransSplitter transSplitter = Trans.executeClustered(transMeta, config);
        System.out.println(transSplitter.getCarteObjectMap());

        return transSplitter;
    }
}