/**
 * Copyright (C), 2015-2018, felix
 * FileName: PropertyUtil
 * Author:   felix
 * Date:     2018/9/26 14:20
 * Description: properties文件获取工具类
 * History:
 * <author>          <time>          <version>          <desc>
 * 作者姓名           修改时间           版本号              描述
 */
package indi.felix.kw.web.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class PropertyUtil {
    private static final Logger logger = LoggerFactory.getLogger(PropertyUtil.class);
    private static Properties props;
    static{
        loadProps();
    }

    synchronized static private void loadProps(){
        props = new Properties();
        InputStream in = null;
        try {
            //<!--第一种，通过类加载器进行获取properties文件流-->
            //in = PropertyUtil.class.getClassLoader().getResourceAsStream("db.properties");
            //<!--第二种，通过类进行获取properties文件流-->
            in = PropertyUtil.class.getResourceAsStream("/resource/db.properties");
            props.load(in);
        } catch (FileNotFoundException e) {

        } catch (IOException e) {

        } finally {
            try {
                if(null != in) {
                    in.close();
                }
            } catch (IOException e) {

            }
        }
        //logger.info("加载properties文件内容完成...........");
        //logger.info("properties文件内容：" + props);
    }

    public static String getProperty(String key){
        if(null == props) {
            loadProps();
        }
        return props.getProperty(key);
    }

    public static String getProperty(String key, String defaultValue) {
        if(null == props) {
            loadProps();
        }
        return props.getProperty(key, defaultValue);
    }
}