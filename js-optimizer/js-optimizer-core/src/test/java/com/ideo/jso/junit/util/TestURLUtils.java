package com.ideo.jso.junit.util;


import java.util.Map;
import java.util.Properties;

import com.ideo.jso.conf.AbstractConfigurationLoader;
import com.ideo.jso.conf.Group;
import com.ideo.jso.junit.JSOUnit;
import com.ideo.jso.junit.mock.JSOMockServletContext;
import com.ideo.jso.util.URLUtils;

public class TestURLUtils extends JSOUnit {


	
	/**
	 * Test basic JSO Config
	 * jso configuration : com/ideo/jso/junit/confLoad/jso1.properties
	 * @throws Exception
	 */
	public void testGetFileTimeStamp() throws Exception {

		JSOMockServletContext servletContext = new JSOMockServletContext("http://www.jsotest.net/jsotest/");
		String path = "http://www.jsotest.net/jsotest/test.js";
		
		System.out.println("TIMESTAMP : " + URLUtils.getLocalFileTimeStamp(servletContext, path));
		
		
	}
	

}
