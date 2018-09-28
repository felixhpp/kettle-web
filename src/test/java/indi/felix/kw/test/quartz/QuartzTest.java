package indi.felix.kw.test.quartz;

import indi.felix.kw.web.quartz.QuartzManager;
import indi.felix.kw.web.quartz.TransQuartz;
import org.junit.Test;

import java.util.HashMap;
import java.util.Map;


public class QuartzTest {

	@Test
	public void AddJobTest(){
		
		
		
		
		String cron = "*/5 * * * * ?";
		Map<String, Object> parameter = new HashMap<String, Object>();
		QuartzManager.addJob("work1", "/", "qqq1111", "aaa", TransQuartz.class, cron, parameter);
	}
	
	
	
	public static void main(String[] args){
		Map<String, Object> parameter = new HashMap<String, Object>();
		QuartzManager.addOnceJob("aaa", "aaaaaaaaaa", "qqq1111", "aaa", TransQuartz.class, parameter);
	}
}
