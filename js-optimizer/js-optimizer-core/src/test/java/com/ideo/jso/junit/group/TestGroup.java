package com.ideo.jso.junit.group;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.servlet.ServletContext;
import javax.servlet.jsp.PageContext;

import com.ideo.jso.conf.AbstractConfigurationLoader;
import com.ideo.jso.conf.Group;
import com.ideo.jso.junit.JSOUnit;
import com.ideo.jso.junit.Util;

public class TestGroup extends JSOUnit {

	public void testBasicTest() {
		Group group1 = new Group("testGroup1");
		Group group2 = new Group("testGroup2");
		Group group3 = new Group("testGroup3");
		Group group4 = new Group("testGroup4");
				
		group2.getJsNames().add("group2.js1");
		group3.getJsNames().add("group3.js1");
		group4.getJsNames().add("group4.js1");
		group4.getJsNames().add("group4.js2");

		group1.getCssNames().add("group1.css1");
		group3.getCssNames().add("group3.css1");
		group3.getCssNames().add("group3.css2");
		group4.getCssNames().add("group4.css1");

		group1.getSubgroups().add(group2);
		group2.getSubgroups().add(group3);
		group2.getSubgroups().add(group4);
		
		assertEquals("Nom de group OK", "testGroup1", group1.getName());
		assertEquals("Nom de group OK", "testGroup2", group2.getName());
		assertEquals("Nom de group OK", "testGroup3", group3.getName());
		assertEquals("Nom de group OK", "testGroup4", group4.getName());
		
		checkSubGroupList(group1, new String[] {"testGroup2"});
		checkSubGroupList(group2, new String[] {"testGroup3","testGroup4"});
		
		checkJsFilesList(group1, null);
		checkJsFilesList(group2, new String[] {"group2.js1"});
		checkJsFilesList(group3, new String[] {"group3.js1"});
		checkJsFilesList(group4, new String[] {"group4.js1","group4.js2"});

		checkCssFilesList(group1, new String[] {"group1.css1"});
		checkCssFilesList(group2, null);
		checkCssFilesList(group3, new String[] {"group3.css1","group3.css2"});
		checkCssFilesList(group4, new String[] {"group4.css1"});
	}
	
	public void testGroupLocation() throws ClassNotFoundException, InstantiationException, IllegalAccessException {
		Group group1 = new Group("testGroup1");
		
		AbstractConfigurationLoader.init(null, "com.ideo.jso.conf.ConfigurationLoaderImpl", null);
		
		assertNull("Best Location : parent location null, group location null", group1.getBestLocation(null));
		assertEquals("Best Location : parent location 'PARENT_LOCATION', group location null", 
					"PARENT_LOCATION", group1.getBestLocation("PARENT_LOCATION"));
		
		group1.setLocation("GROUP1_LOCATION");
		checkGroupLocation(group1, "GROUP1_LOCATION");

		assertEquals("Best Location : parent location null, group location 'GROUP1_LOCATION'", 
					"GROUP1_LOCATION", group1.getBestLocation(null));
		assertEquals("Best Location : parent location 'PARENT_LOCATION', group location 'GROUP1_LOCATION'", 
					"GROUP1_LOCATION", group1.getBestLocation("PARENT_LOCATION"));
		
		
		
	}
	
	public void testGroupTimestampPolicy() throws ClassNotFoundException, InstantiationException, IllegalAccessException {
		Group group1 = new Group("testGroup1");
		
		AbstractConfigurationLoader.init(null, "com.ideo.jso.conf.ConfigurationLoaderImpl", null);
	
		String test = group1.getBestTimestampPolicy(null);	
		assertNull("Best TimestampPolicy : parent 'null', group 'null'", test);
		
		test = group1.getBestTimestampPolicy("PARENT_POLICY");
		assertEquals("Best Location : parent location 'PARENT_POLICY', group location null", 
					"PARENT_POLICY", test);
		
		group1.setTimeStampPolicy("GROUP1_POLICY");
		checkGroupTimestampPolicy(group1, "GROUP1_POLICY");

		assertEquals("Best Location : parent location null, group location 'GROUP1_POLICY'", 
					"GROUP1_POLICY", group1.getBestTimestampPolicy(null));
		assertEquals("Best Location : parent location 'PARENT_POLICY', group location 'GROUP1_POLICY'", 
					"GROUP1_POLICY", group1.getBestTimestampPolicy("PARENT_POLICY"));
		
	}
	
	public void testComputeTimeStamp() throws Exception {

		PageContext pc = createMockPageContext(null);
		ServletContext sc = pc.getServletContext();
		
		Group group1 = new Group("group1");
		group1.getJsNames().add("/resources/js/group1/js1.js");
		group1.getCssNames().add("/resources/css/group1/css1.css");
		
		AbstractConfigurationLoader.init(null, "com.ideo.jso.conf.ConfigurationLoaderImpl", null);

		checkJSFileTimestamp(group1, sc, getAllJsFilesMaxTimeStamp(group1, null));
		checkCSSFileTimestamp(group1, sc, getAllCssFilesMaxTimeStamp(group1, null));
		
		
		Group group2 = new Group("group2");
		group2.getJsNames().add( "/resources/js/group2/js1.js");
		group2.getJsNames().add( "/resources/js/group2/js2.js");
		group2.getCssNames().add("/resources/css/group2/css1.css");
		group2.getCssNames().add("/resources/css/group2/css2.css");
		
		AbstractConfigurationLoader.init(null, "com.ideo.jso.conf.ConfigurationLoaderImpl", null);
		
		checkJSFileTimestamp(group2, sc, getAllJsFilesMaxTimeStamp(group2, null));
		checkCSSFileTimestamp(group2, sc, getAllCssFilesMaxTimeStamp(group2, null));
	}
	
	private long getAllJsFilesMaxTimeStamp(Group group, String parentLocation) throws Exception {
		long maxTs = 0;
		
		String location = group.getBestLocation(parentLocation);
		
		if (group.getSubgroups() != null) {
			Iterator i = group.getSubgroups().iterator();
			while (i.hasNext()) {
				Group sg = (Group) i.next();
				maxTs = Math.max(maxTs, getAllJsFilesMaxTimeStamp(sg, location));
			}
		}
		
		if (group.getJsNames() != null) {
			maxTs = Math.max(maxTs, Util.getJSFilesTimestamp(group));
		}
		
		return maxTs;
	}
	
	private long getAllCssFilesMaxTimeStamp(Group group, String parentLocation) throws Exception {
		long maxTs = 0;
		
		String location = group.getBestLocation(parentLocation);
		
		if (group.getSubgroups() != null) {
			Iterator i = group.getSubgroups().iterator();
			while (i.hasNext()) {
				Group sg = (Group) i.next();
				maxTs = Math.max(maxTs, getAllCssFilesMaxTimeStamp(sg, location));
			}
		}
		
		if (group.getJsNames() != null) {
			maxTs = Math.max(maxTs, Util.getCSSFilesTimestamp(group));
		}
		
		return maxTs;
	}
	
	

	
}
