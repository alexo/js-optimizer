package com.ideo.jso.junit.minimize;

import java.util.Map;
import java.util.Properties;

import com.ideo.jso.conf.AbstractConfigurationLoader;
import com.ideo.jso.conf.Group;
import com.ideo.jso.junit.JSOUnit;
import com.ideo.jso.util.URLConf;

public class Test extends JSOMergeUnit {
	
	public void testMergeExternFile() throws Exception {
		String jsoPropertiesFile = "com/ideo/jso/junit/minimize/jso2.properties";
		
		Properties properties = initJSO(jsoPropertiesFile);

		checkConfigFileName("com/ideo/jso/junit/minimize/jso2.xml", 1, properties);
		
		Map groups = AbstractConfigurationLoader.getInstance().getUpdatedGroups();
		
		Group group = (Group) groups.get("group3m");
		URLConf.setMockWebUrl("http://mocksite/MockContext/");
		
		// test if file is correctly merged
		checkMergedJSFiles(group, "group3_minimized.txt", "ISO-8859-1"); 
		// 2nd call without reseting group last load time should return empty file.
		checkMergedJSFilesAreEmpty(group, "ISO-8859-1"); 
		
		// 3rd call after reseting group last load time should return merged file.
		group.setLastLoadTime(0);
		checkMergedJSFiles(group, "group3_minimized.txt", "ISO-8859-1"); 
	}

}
