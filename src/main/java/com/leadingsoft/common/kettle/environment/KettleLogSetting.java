/**
 * Copyright (C), 2015-2018, XXX有限公司
 * FileName: KettleLogSetting
 * Author:   lenovo
 * Date:     2018/9/27 11:46
 * Description:
 * History:
 * <author>          <time>          <version>          <desc>
 * 作者姓名           修改时间           版本号              描述
 */
package com.leadingsoft.common.kettle.environment;

import com.leadingsoft.web.utils.PropertyUtil;
import org.pentaho.di.core.database.DatabaseMeta;
import org.pentaho.di.core.logging.JobEntryLogTable;
import org.pentaho.di.core.logging.JobLogTable;
import org.pentaho.di.core.logging.StepLogTable;
import org.pentaho.di.core.logging.TransLogTable;
import org.pentaho.di.core.variables.VariableSpace;
import org.pentaho.di.core.variables.Variables;
import org.pentaho.di.job.JobMeta;
import org.pentaho.di.trans.TransMeta;

/**
 * 〈一句话功能简述〉<br> 
 * 〈〉
 *
 * @author lenovo
 * @create 2018/9/27
 * @since 1.0.0
 */
public class KettleLogSetting {
    private static String db_type = PropertyUtil.getProperty("jdbc.type");
    private static String host = PropertyUtil.getProperty("jdbc.host");
    private static String dbName = PropertyUtil.getProperty("jdbc.dbname");
    private static String port = PropertyUtil.getProperty("jdbc.port");
    private static String name = PropertyUtil.getProperty("jdbc.username");
    private static String password = PropertyUtil.getProperty("jdbc.password");

    private static final String VARIABLE_VALUE = "TEST";

    /**
     * @Title setTransLog
     * @Description 自定义设置转换日志(保存在单独的数据库中，不是资源库)
     * @param transMeta
     * @throws
     * @ruturn void
     */
    public static void setTransLog(TransMeta transMeta){

        DatabaseMeta databaseMeta = getDatabaseMeta();

        transMeta.addDatabase(databaseMeta);
        //region 设置变量集
        VariableSpace space = new Variables();
        //将step日志数据库配置名加入到变量集中
        space.setVariable("transloging",VARIABLE_VALUE);
        space.initializeVariablesFrom(null);
        //endregion

        //region 设置转换(trans)日志
        TransLogTable transLogTable = TransLogTable.getDefault(space, transMeta, transMeta.getSteps());
        transLogTable.setConnectionName(VARIABLE_VALUE);
        transLogTable.setTableName("k_trans_log");
        transMeta.setTransLogTable(transLogTable);
        //endregion

        //region 设置步骤(Step)日志
        StepLogTable stepLogTable = StepLogTable.getDefault(space,transMeta);
        //StepLogTable使用的数据库连接名（上面配置的变量名）。
        stepLogTable.setConnectionName(VARIABLE_VALUE);
        //设置Step日志的表名
        stepLogTable.setTableName("k_trans_step_log");
        //设置TransMeta的StepLogTable
        transMeta.setStepLogTable(stepLogTable);
        //endregion

    }

    /**
     * @Title setJobsLog
     * @Description 自定义设置作业日志(保存在单独的数据库中，不是资源库)
     * @param jobMeta
     * @throws
     * @ruturn void
     */
    public static void setJobsLog(JobMeta jobMeta){

        DatabaseMeta databaseMeta = getDatabaseMeta();

        jobMeta.addDatabase(databaseMeta);

        //region 定义变量
        VariableSpace space = new Variables();
        //将日志数据库配置名加入到变量集中
        space.setVariable("jobloging", VARIABLE_VALUE);
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

    private static void setDatabaseMeta(DatabaseMeta databaseMeta){
        databaseMeta = new DatabaseMeta();
        databaseMeta.setName(VARIABLE_VALUE);
        databaseMeta.setDatabaseType("MYSQL");
        databaseMeta.setAccessType(DatabaseMeta.TYPE_ACCESS_NATIVE);
        databaseMeta.setHostname(host);
        databaseMeta.setDBName(dbName);
        databaseMeta.setDBPort(port);
        databaseMeta.setUsername(name);
        databaseMeta.setPassword(password);
    }

    private static DatabaseMeta getDatabaseMeta(){
        DatabaseMeta databaseMeta = new DatabaseMeta();
        databaseMeta.setName(VARIABLE_VALUE);
        databaseMeta.setDatabaseType("MYSQL");
        databaseMeta.setAccessType(DatabaseMeta.TYPE_ACCESS_NATIVE);
        databaseMeta.setHostname(host);
        databaseMeta.setDBName(dbName);
        databaseMeta.setDBPort(port);
        databaseMeta.setUsername(name);
        databaseMeta.setPassword(password);

        return databaseMeta;
    }
}