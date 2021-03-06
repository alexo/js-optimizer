package com.ideo.jso.junit.printImport;

import java.util.Map;
import java.util.Properties;

import com.ideo.jso.conf.AbstractConfigurationLoader;
import com.ideo.jso.conf.Group;
import com.ideo.jso.junit.JSOUnit;
import com.ideo.jso.util.URLConf;

public class TestPrintImportExtern extends JSOUnit {
	
	public void testImportGroup1() throws Exception {
		String jsoPropertiesFile = "com/ideo/jso/junit/printImport/jso3.properties";
		Properties properties = initJSO(jsoPropertiesFile);
		checkConfigFileName("com/ideo/jso/junit/printImport/jso3.xml", 1, properties);
		
		Map groups = AbstractConfigurationLoader.getInstance().getUpdatedGroups();	
		Group group = (Group) groups.get("group1");
		
		StaticFiles files  = new StaticFiles("group1");
		
		files.addJsFile("group1/js1.js");
		files.addJsFile("group1/js2.js");
		files.addCssFile("group1/css1.css");
		files.addCssFile("group1/css2.css");
		
		checkImportOk(group, files, true);
		checkImportOk(group, files, false);
	}


	public void testImportGroup3() throws Exception {
		
		String jsoPropertiesFile = "com/ideo/jso/junit/printImport/jso3.properties";
		Properties properties = initJSO(jsoPropertiesFile);
		checkConfigFileName("com/ideo/jso/junit/printImport/jso3.xml", 1, properties);
		
		Map groups = AbstractConfigurationLoader.getInstance().getUpdatedGroups();	
		Group group = (Group) groups.get("group3");

		StaticFiles files  = new StaticFiles("group3");
		
		String mockSite = "http://mocksite/";
		URLConf.setMockWebUrl(mockSite);
		
		files.addJsFile("group2/js1.js", mockSite);
		files.addCssFile("group2/css1.css", mockSite);
		
		files.addJsFile("group1/js1.js", mockSite);
		files.addJsFile("group1/js2.js", mockSite);
		files.addCssFile("group1/css1.css", mockSite);
		files.addCssFile("group1/css2.css", mockSite);
		
		files.addJsFile("group3/js1.js", mockSite);
		files.addJsFile("group3/js2.js", mockSite);
		files.addCssFile("group3/css1.css", mockSite);
		files.addCssFile("group3/css2.css", mockSite);
		
		checkImportOk(group, files, true);
		
		checkImportOk(group, files, false);
	}

	public void testImportGroup4() throws Exception {
		String jsoPropertiesFile = "com/ideo/jso/junit/printImport/jso3.properties";
		Properties properties = initJSO(jsoPropertiesFile);
		checkConfigFileName("com/ideo/jso/junit/printImport/jso3.xml", 1, properties);
		
		Map groups = AbstractConfigurationLoader.getInstance().getUpdatedGroups();	
		Group group = (Group) groups.get("group4");

		StaticFiles files  = new StaticFiles("group4");
		
		String mockSite = "http://mocksite/";
		URLConf.setMockWebUrl(mockSite);
		
		files.addJsFile("group2/js1.js", mockSite, true);
		files.addCssFile("group2/css1.css", mockSite, true);
		
		files.addJsFile("group1/js1.js", mockSite, false);
		files.addJsFile("group1/js2.js", mockSite, false);
		files.addCssFile("group1/css1.css", mockSite, false);
		files.addCssFile("group1/css2.css", mockSite, false);
		
		files.addJsFile("group3/js1.js", mockSite, true);
		files.addJsFile("group3/js2.js", mockSite, true);
		files.addCssFile("group3/css1.css", mockSite, true);
		files.addCssFile("group3/css2.css", mockSite, true);
		
		checkImportOk(group, files, true);
		
		checkImportOk(group, files, false);
	}
	
	
}
