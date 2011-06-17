package com.ideo.jso.junit.minimize;

import java.io.File;
import java.io.FileNotFoundException;

import com.ideo.jso.junit.JSOUnit;
import com.ideo.jso.main.JSOMain;
import com.ideo.jso.util.URLUtils;

public class TestJSOMain extends JSOMergeUnit {

	private static String ERR_MSG_INVALID_ARG_1 = 	"2 arguments are required : " +
													"[1] the list of groups to minimize, comma separated " +
													"and [2] a file name to write the result in.";
	private static String ERR_MSG_INVALID_ARG_2 = 	"A maximum of 4 arguments are required. " +
													"[1] the list of groups to minimize, comma separated, " +
													"[2] a file name to write the result in, " +
													"[3] a JSO configuration file path (optional) " +
													"and [4] a JSO property file (optional).";
	private static String ERR_MSG_INVALID_ARG_3 = 	"Could not find a jso.properties file. Initialization fail.";
	private static String ERR_MSG_INVALID_ARG_4 = 	"JSO configuration file not found or could not be readen.";
	
	public void testJSOMainError() throws Exception {
		
		// test 0 param
		try {
			JSOMain.main(new String[]{});
			fail("Test right number of arguments.");
		}
		catch (Exception e) {
			assertEquals("Correct exception message", ERR_MSG_INVALID_ARG_1, e.getMessage());
		}
		
		// test 1 param
		try {
			JSOMain.main(new String[]{"NOT ENOUGHT TOO"});
			fail("Test right number of arguments.");
		}
		catch (Exception e) {
			assertEquals("Correct exception message", ERR_MSG_INVALID_ARG_1, e.getMessage());
		}
		
		// test 5 param
		try {
			JSOMain.main(new String[]{"One is OK", "Two is OK", "Tree is OK too", "Four still OK", "Five ... no this is not good"});
			fail("Test right number of arguments.");
		}
		catch (Exception e) {
			assertEquals("Correct exception message", ERR_MSG_INVALID_ARG_2, e.getMessage());
		}
		
		// JSO property file doesn't exist.
		try {
			JSOMain.main(new String[]{"group1", "group1.js", "com/ideo/jso/junit/minimize/jso1.xml", 
									"com/ideo/jso/junit/minimize/jso1_not_existing.properties"});
			fail("Test jso property file existance.");
		}
		catch (Exception e) {
			assertEquals("Correct exception message", ERR_MSG_INVALID_ARG_3, e.getMessage());
		}

		// JSO configuration file doesn't exist.
		try {
			String propertiesFilePath = getRealPathForJarFile("com/ideo/jso/junit/minimize/jso1.properties");
			JSOMain.main(new String[]{"group1", "group1.js", "jso_not_existing.xml", propertiesFilePath});
			fail("Test jso configuration file existance.");
		}
		catch (Exception e) {
			assertEquals("Correct exception message", ERR_MSG_INVALID_ARG_4, e.getMessage());
		}
	}
	
	
	public void testJSOMainSimple() throws Exception {
		String propertiesFilePath = getRealPathForJarFile("com/ideo/jso/junit/minimize/jso1.properties");
		
		// test a first time
		checkGeneratedFile("group1", "group1_merged.txt", "ISO-8859-1" , null, propertiesFilePath);
		
		// test a second time
		checkGeneratedFile("group1", "group1_merged.txt", "ISO-8859-1" , null, propertiesFilePath);
		
		
	}
	
	public void testJSOMainTwoGroups() throws Exception {
	
		String propertiesFilePath = getRealPathForJarFile("com/ideo/jso/junit/minimize/jso1.properties");
		
		// test with two distinct groups
		checkGeneratedFile("group1,group2","group12_merged.txt", "ISO-8859-1" , null, propertiesFilePath);
		checkGeneratedFile("group2,group1", "group21_merged.txt", "ISO-8859-1" , null, propertiesFilePath);
		
	}
	
	public void testJSOMainComplexGroups() throws Exception {
		String propertiesFilePath = getRealPathForJarFile("com/ideo/jso/junit/minimize/jso1.properties");
		
		checkGeneratedFile("group3", "group3_merged.txt", "ISO-8859-1" , null, propertiesFilePath);
		checkGeneratedFile("group4", "group4_merged.txt", "ISO-8859-1" , null, propertiesFilePath);
	}
	
	
	protected void checkGeneratedFile(String groups, String testFileName, String encoding, String jsoConf, String jsoProperty)
	throws Exception {
		String generateFileName = "file_" + System.currentTimeMillis() + ".js";
		JSOMain.main(new String[]{groups, generateFileName, jsoConf, jsoProperty});
		checkMergedJSFiles(generateFileName, testFileName, encoding); 
		new File(generateFileName).delete();
	}
	
}
