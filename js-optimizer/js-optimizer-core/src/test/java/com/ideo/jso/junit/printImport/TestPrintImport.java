package com.ideo.jso.junit.printImport;

import java.io.StringWriter;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import javax.servlet.jsp.PageContext;

import com.ideo.jso.conf.AbstractConfigurationLoader;
import com.ideo.jso.conf.Group;
import com.ideo.jso.junit.JSOUnit;
import com.ideo.jso.tag.InclusionController;

public class TestPrintImport extends JSOUnit {

	
	public void testImportGroup1() throws Exception {
		String jsoPropertiesFile = "com/ideo/jso/junit/printImport/jso1.properties";
		Properties properties = initJSO(jsoPropertiesFile);
		checkConfigFileName("com/ideo/jso/junit/printImport/jso1.xml", 1, properties);
		
		Map groups = AbstractConfigurationLoader.getInstance().getUpdatedGroups();	
		Group group = (Group) groups.get("group1");
		
		StaticFiles files  = new StaticFiles("group1", true);
		
		files.addJsFile("group1/js1.js");
		files.addJsFile("group1/js2.js");
		files.addCssFile("group1/css1.css");
		files.addCssFile("group1/css2.css");
		
		checkImportOk(group, files, true);
		
		checkImportOk(group, files, false);
	}
	
	
	public void testImportGroup2() throws Exception {
		String jsoPropertiesFile = "com/ideo/jso/junit/printImport/jso1.properties";
		Properties properties = initJSO(jsoPropertiesFile);
		checkConfigFileName("com/ideo/jso/junit/printImport/jso1.xml", 1, properties);
		
		Map groups = AbstractConfigurationLoader.getInstance().getUpdatedGroups();	
		Group group = (Group) groups.get("group2");

		StaticFiles files  = new StaticFiles("group2", true);
		
		files.addJsFile("group2/js1.js");
		files.addCssFile("group2/css1.css");
		
		checkImportOk(group, files, true);
		
		checkImportOk(group, files, false);
	}
	
	public void testImportGroup3() throws Exception {
		String jsoPropertiesFile = "com/ideo/jso/junit/printImport/jso1.properties";
		Properties properties = initJSO(jsoPropertiesFile);
		checkConfigFileName("com/ideo/jso/junit/printImport/jso1.xml", 1, properties);
		
		Map groups = AbstractConfigurationLoader.getInstance().getUpdatedGroups();	
		Group group = (Group) groups.get("group3");

		StaticFiles files  = new StaticFiles("group3", true);
		
		files.addJsFile("group2/js1.js");
		files.addCssFile("group2/css1.css");
		
		files.addJsFile("group1/js1.js");
		files.addJsFile("group1/js2.js");
		files.addCssFile("group1/css1.css");
		files.addCssFile("group1/css2.css");
		
		files.addJsFile("group3/js1.js");
		files.addJsFile("group3/js2.js");
		files.addCssFile("group3/css1.css");
		files.addCssFile("group3/css2.css");
		
		checkImportOk(group, files, true);
		
		checkImportOk(group, files, false);
	}
	
	public void testImportGroup1Merge() throws Exception {
		String jsoPropertiesFile = "com/ideo/jso/junit/printImport/jso1.properties";
		Properties properties = initJSO(jsoPropertiesFile);
		checkConfigFileName("com/ideo/jso/junit/printImport/jso1.xml", 1, properties);
		
		Map groups = AbstractConfigurationLoader.getInstance().getUpdatedGroups();	
		Group group = (Group) groups.get("group1m");

		StaticFiles files  = new StaticFiles("group1m", true);
		
		files.addJsFile("group1/js1.js");
		files.addJsFile("group1/js2.js");
		files.addCssFile("group1/css1.css");
		files.addCssFile("group1/css2.css");
		
		checkImportOk(group, files, true);
		
		checkImportOk(group, files, false);
	}
	
	public void testImportGroup2Merge() throws Exception {
		String jsoPropertiesFile = "com/ideo/jso/junit/printImport/jso1.properties";
		Properties properties = initJSO(jsoPropertiesFile);
		checkConfigFileName("com/ideo/jso/junit/printImport/jso1.xml", 1, properties);
		
		Map groups = AbstractConfigurationLoader.getInstance().getUpdatedGroups();	
		Group group = (Group) groups.get("group2m");

		StaticFiles files  = new StaticFiles("group2m", true);
		
		files.addJsFile("group1/js1.js");
		files.addJsFile("group1/js2.js");
		files.addCssFile("group1/css1.css");
		files.addCssFile("group1/css2.css");
		
		files.addJsFile("group2/js1.js");
		files.addCssFile("group2/css1.css");
		
		checkImportOk(group, files, true);
		
		checkImportOk(group, files, false);
	}
	
	public void testImportGroup3Merge() throws Exception {
		String jsoPropertiesFile = "com/ideo/jso/junit/printImport/jso1.properties";
		Properties properties = initJSO(jsoPropertiesFile);
		checkConfigFileName("com/ideo/jso/junit/printImport/jso1.xml", 1, properties);
		
		Map groups = AbstractConfigurationLoader.getInstance().getUpdatedGroups();	
		Group group = (Group) groups.get("group3m");

		StaticFiles files  = new StaticFiles("group3m", true);

		files.addJsFile("group2/js1.js");
		files.addCssFile("group2/css1.css");
		
		files.addJsFile("group1/js1.js");
		files.addJsFile("group1/js2.js");
		files.addCssFile("group1/css1.css");
		files.addCssFile("group1/css2.css");
		
		files.addJsFile("group3/js1.js");
		files.addJsFile("group3/js2.js");
		files.addCssFile("group3/css1.css");
		files.addCssFile("group3/css2.css");
		
		checkImportOk(group, files, true);
		
		checkImportOk(group, files, false);
	}
	

	public void testImportMultiJsoFile() throws Exception {
		String jsoPropertiesFile = "com/ideo/jso/junit/printImport/jso2.properties";
		Properties properties = initJSO(jsoPropertiesFile);
		checkConfigFileName("com/ideo/jso/junit/printImport/jso2.xml", 3, properties);
		
		Map groups = AbstractConfigurationLoader.getInstance().getUpdatedGroups();	

		StaticFiles files1  = new StaticFiles("group1", true);

		files1.addCssFile("group3/css1.css");
		files1.addCssFile("group3/css2.css");
		
		Group group1 = (Group) groups.get("group1");
		checkImportOk(group1, files1, true);
		checkImportOk(group1, files1, false);
		
		StaticFiles files2  = new StaticFiles("group2", true);
		
		files2.addJsFile("group2/js1.js");
		files2.addCssFile("group2/css1.css");

		Group group2 = (Group) groups.get("group2");
		checkImportOk(group2, files2, true);
		checkImportOk(group2, files2, false);
		
		StaticFiles files3  = new StaticFiles("group3", true);
		
		files1.addCssFile("group3/css1.css");
		files1.addCssFile("group3/css2.css");
		
		files3.addJsFile("group2/js1.js");
		files3.addCssFile("group2/css1.css");
		
		files3.addJsFile("group3/js1.js");
		files3.addJsFile("group3/js2.js");
		files3.addCssFile("group3/css1.css");
		files3.addCssFile("group3/css2.css");	
		
		Group group3 = (Group) groups.get("group3");
		checkImportOk(group3, files3, true);
		checkImportOk(group3, files3, false);
	}
	
	

	
	
}