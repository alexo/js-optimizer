package com.ideo.jso.junit;

import junit.framework.Test;
import junit.framework.TestSuite;

import com.ideo.jso.junit.confLoad.TestConfLoading;
import com.ideo.jso.junit.confLoad.TestJarExclusion;
import com.ideo.jso.junit.group.TestGroup;
import com.ideo.jso.junit.minimize.TestJSOMain;
import com.ideo.jso.junit.minimize.TestMerge;
import com.ideo.jso.junit.minimize.TestMinimize;
import com.ideo.jso.junit.printImport.TestAno26;
import com.ideo.jso.junit.printImport.TestPrintImport;
import com.ideo.jso.junit.printImport.TestPrintImportExtern;
import com.ideo.jso.junit.util.TestURLUtils;

public class JSOTestSuite extends TestSuite {

	static public Test suite() {
		TestSuite suite = new TestSuite();
		suite.addTestSuite(TestConfLoading.class);
		suite.addTestSuite(TestJarExclusion.class);
		
		suite.addTestSuite(TestGroup.class);
		
		suite.addTestSuite(TestMerge.class);
		suite.addTestSuite(TestMinimize.class);
		suite.addTestSuite(TestJSOMain.class);
		
		suite.addTestSuite(TestAno26.class);
		suite.addTestSuite(TestPrintImport.class);
		suite.addTestSuite(TestPrintImportExtern.class);
		
		suite.addTestSuite(TestURLUtils.class);
		
		return suite;
	}
	
}
