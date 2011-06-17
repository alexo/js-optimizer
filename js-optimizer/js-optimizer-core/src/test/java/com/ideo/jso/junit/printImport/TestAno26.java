package com.ideo.jso.junit.printImport;

import java.util.Map;
import java.util.Properties;

import com.ideo.jso.conf.AbstractConfigurationLoader;
import com.ideo.jso.conf.Group;
import com.ideo.jso.junit.JSOUnit;
import com.ideo.jso.util.URLConf;

public class TestAno26 extends JSOUnit {

	public void testImportGroup4() throws Exception {
		String jsoPropertiesFile = "com/ideo/jso/junit/printImport/jso4.properties";
		Properties properties = initJSO(jsoPropertiesFile);
		checkConfigFileName("com/ideo/jso/junit/printImport/jso4.xml", 1, properties);
		
		Map groups = AbstractConfigurationLoader.getInstance().getUpdatedGroups();	
		Group group = (Group) groups.get("group1");

		StaticFiles files  = new StaticFiles("group1");
		
		String mockSite = "http://mocksite/";
		URLConf.setMockWebUrl(mockSite);
		
		files.addJsFile("group1/js1.js", mockSite, false);
		files.addJsFile("group1/js2.js", mockSite, false);
		files.addCssFile("group1/css1.css", mockSite, false);
		files.addCssFile("group1/css2.css", mockSite, false);
		
		checkImportOk(group, files, true);
		
		checkImportOk(group, files, false);
	}
	


	
}
