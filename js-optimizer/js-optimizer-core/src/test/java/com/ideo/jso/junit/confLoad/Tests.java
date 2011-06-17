package com.ideo.jso.junit.confLoad;

import java.util.Iterator;
import java.util.Map;
import java.util.Properties;

import com.ideo.jso.conf.AbstractConfigurationLoader;
import com.ideo.jso.conf.Group;
import com.ideo.jso.junit.JSOUnit;

public class Tests extends JSOUnit {

	/**
	 * Bug identifie en version 2.2
	 * 
	 * @throws Exception
	 */
	public void testSeveralXmlAppendGroup4location() throws Exception {
		String jsoPropertiesFile = "com/ideo/jso/junit/confLoad/jso51.properties";
		
		Properties properties = initJSO(jsoPropertiesFile);

		checkConfigFileName("com/ideo/jso/junit/confLoad/jso51.xml", 3, properties);
		
		AbstractConfigurationLoader loader = AbstractConfigurationLoader.getInstance();
		Map groups = loader.getUpdatedGroups();
		
		
		// test on group4.
		Group group4 = (Group) groups.get("group4");
			
		checkGroupLocation(group4, "location_of_group4");
	}	

	
}
