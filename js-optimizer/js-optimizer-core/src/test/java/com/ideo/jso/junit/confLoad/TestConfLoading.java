package com.ideo.jso.junit.confLoad;


import java.util.Map;
import java.util.Properties;

import com.ideo.jso.conf.AbstractConfigurationLoader;
import com.ideo.jso.conf.Group;
import com.ideo.jso.junit.JSOUnit;

public class TestConfLoading extends JSOUnit {


	
	/**
	 * Test basic JSO Config
	 * jso configuration : com/ideo/jso/junit/confLoad/jso1.properties
	 * @throws Exception
	 */
	public void testBase() throws Exception {
		//PageContext pageContext = createMockPageContext();
		//Writer out = createWriter();
		
		String jsoPropertiesFile = "com/ideo/jso/junit/confLoad/jso1.properties";
		
		Properties properties = initJSO(jsoPropertiesFile);

		checkConfigFileName("com/ideo/jso/junit/confLoad/jso1.xml", 1, properties);
		
		Map groups = AbstractConfigurationLoader.getInstance().getUpdatedGroups();
		
		// Are groups created ?
		testGroupPresents(groups, "group1");
		testGroupPresents(groups, "group2");
		testGroupPresents(groups, "group3");

		// Tests on groups

		// test on group1.
		Group group1 = (Group) groups.get("group1");
		checkSubGroupList(group1, null);
		checkJsFilesList(group1, new String[] {"GROUP1_FILEJS1","GROUP1_FILEJS2"});
		checkCssFilesList(group1, new String[] {"GROUP1_FILECSS1","GROUP1_FILECSS2"});
		
		// test on group2.
		Group group2 = (Group) groups.get("group2");
		
		checkSubGroupList(group2, null);
		checkJsFilesList(group2, null);
		checkCssFilesList(group2, null);
		
		// test on group3.
		Group group3 = (Group) groups.get("group3");
		
		checkSubGroupList(group3, new String[] {"group2","group1"});
		checkJsFilesList(group3, new String[] {"GROUP3_FILEJS1","GROUP3_FILEJS2"});
		checkCssFilesList(group3, new String[] {"GROUP3_FILECSS1","GROUP3_FILECSS2"});
	}
	
	/**
	 * Test location attributes.
	 * jso configuration : com/ideo/jso/junit/confLoad/jso2.properties
	 * @throws Exception
	 */
	public void testLocation() throws Exception {
		String jsoPropertiesFile = "com/ideo/jso/junit/confLoad/jso2.properties";
		
		Properties properties = initJSO(jsoPropertiesFile);

		checkConfigFileName("com/ideo/jso/junit/confLoad/jso2.xml", 1, properties);
		
		AbstractConfigurationLoader loader = AbstractConfigurationLoader.getInstance();
		Map groups = loader.getUpdatedGroups();
				
		// Are groups created ?
		testGroupPresents(groups, "group1");
		checkGroupLocation((Group) groups.get("group1"), null);
		testGroupPresents(groups, "group2");
		checkGroupLocation((Group) groups.get("group2"), "location_of_group2");
		testGroupPresents(groups, "group3");
		checkGroupLocation((Group) groups.get("group3"), "location_of_group3");

		// test on group3.
		Group group3 = (Group) groups.get("group3");
		
		checkSubGroupList(group3, new String[] {"group2","group1"});
		checkJsFilesList(group3, new String[] {"GROUP3_FILEJS1","GROUP3_FILEJS2"});
		checkCssFilesList(group3, new String[] {"GROUP3_FILECSS1","GROUP3_FILECSS2"});
	}
	
	/**
	 * 
	 * @throws Exception
	 */
	public void testConfigFile() throws Exception {
		String jsoPropertiesFile = "com/ideo/jso/junit/confLoad/jso30.properties";
		
		Properties properties = initJSO(jsoPropertiesFile);

		checkConfigFileName("com/ideo/jso/junit/confLoad/jso3.xml", 1, properties);
		
		Map groups = AbstractConfigurationLoader.getInstance().getUpdatedGroups();
		
		// Are groups created ?
		testGroupPresents(groups, "group1");
		testGroupPresents(groups, "group2");
		testGroupPresents(groups, "group3");

		// Tests on groups

		// test on group1.
		Group group1 = (Group) groups.get("group1");
		checkSubGroupList(group1, null);
		checkJsFilesList(group1, new String[] {"GROUP1_FILEJS1","GROUP1_FILEJS2"});
		checkCssFilesList(group1, new String[] {"GROUP1_FILECSS1","GROUP1_FILECSS2"});
		
		// test on group2.
		Group group2 = (Group) groups.get("group2");
		
		checkSubGroupList(group2, null);
		checkJsFilesList(group2, null);
		checkCssFilesList(group2, null);
		
		// test on group3.
		Group group3 = (Group) groups.get("group3");
		
		checkSubGroupList(group3, new String[] {"group2","group1"});
		checkJsFilesList(group3, new String[] {"GROUP3_FILEJS1","GROUP3_FILEJS2"});
		checkCssFilesList(group3, new String[] {"GROUP3_FILECSS1","GROUP3_FILECSS2"});		
	}
	
	/**
	 * 
	 * @throws Exception
	 */
	public void testDefaultConfig() throws Exception {
		String jsoPropertiesFile = "com/ideo/jso/junit/confLoad/jso4.properties";
		
		Properties properties = initJSO(jsoPropertiesFile);

		checkConfigFileName("com/ideo/jso/junit/confLoad/jso4.xml", 1, properties);
		
		AbstractConfigurationLoader loader = AbstractConfigurationLoader.getInstance();
		loader.getUpdatedGroups();
	
		assertEquals("Default location is OK", "default_location", loader.getDefaultLocation());
		assertEquals("Default location is OK", "local", loader.getDefaultTimestampPolicy());
	}
	

	/**
	 * 
	 * @throws Exception
	 */
	public void testSeveralXmlOverride() throws Exception {
		String jsoPropertiesFile = "com/ideo/jso/junit/confLoad/jso50.properties";
		
		Properties properties = initJSO(jsoPropertiesFile);

		checkConfigFileName("com/ideo/jso/junit/confLoad/jso50.xml", 3, properties);
		
		AbstractConfigurationLoader loader = AbstractConfigurationLoader.getInstance();
		Map groups = loader.getUpdatedGroups();
		
		// Groups configuration should merge
		// in case of conflict the lastest jso xml file readen as the advantage
		// order :
		// - jso-optimizer-junit-conf2
		// - jso-optimizer-junit-conf1
		// - jso-optimizer-junit
		// test on group 1
		Group group1 = (Group) groups.get("group1");
		checkSubGroupList(group1, new String[] {"group4","group5"});
		checkJsFilesList(group1, null);
		checkCssFilesList(group1, null);
		checkGroupLocation(group1, null);
		
		// test on group2.
		Group group2 = (Group) groups.get("group2");
		
		checkSubGroupList(group2, null);
		checkJsFilesList(group2, new String[] {"GROUP1_FILEJS2"});
		checkCssFilesList(group2, new String[] {"GROUP1_FILECSS1"});
		checkGroupLocation(group2, "location_of_group2");
		
		// test on group3.
		Group group3 = (Group) groups.get("group3");
		
		checkSubGroupList(group3, new String[] {"group2"});
		checkJsFilesList(group3, null);
		checkCssFilesList(group3, null);		
		checkGroupLocation(group3, "location_of_group3");
		
		// test on group4.
		Group group4 = (Group) groups.get("group4");
		
		checkSubGroupList(group4, null);
		checkJsFilesList(group4, null);
		checkCssFilesList(group4, new String[] {"GROUP4_FILECSS1"});		
		checkGroupLocation(group4, "location_of_group4");
		
		// test on group5.
		Group group5 = (Group) groups.get("group5");
		
		checkSubGroupList(group5, null);
		checkJsFilesList(group5, new String[] {"GROUP5_FILEJS1","GROUP5_FILEJS2"});
		checkCssFilesList(group5, null);		
		checkGroupLocation(group5, "location_of_group5");
	
	}	
	
	
	/**
	 * 
	 * @throws Exception
	 */
	public void testSeveralXmlAppend() throws Exception {
		String jsoPropertiesFile = "com/ideo/jso/junit/confLoad/jso51.properties";
		
		Properties properties = initJSO(jsoPropertiesFile);

		checkConfigFileName("com/ideo/jso/junit/confLoad/jso51.xml", 3, properties);
		
		AbstractConfigurationLoader loader = AbstractConfigurationLoader.getInstance();
		Map groups = loader.getUpdatedGroups();
		
		// test on group 1
		Group group1 = (Group) groups.get("group1");
		checkSubGroupList(group1, new String[] {"group4","group5"});
		checkJsFilesList(group1, new String[] {"GROUP1_FILEJS1","GROUP1_FILEJS2","GROUP1_FILEJS3"});
		checkCssFilesList(group1, new String[] {"GROUP1_FILECSS1","GROUP1_FILECSS2"});
		checkGroupLocation(group1, null);
		
		// test on group2.
		Group group2 = (Group) groups.get("group2");
		
		checkSubGroupList(group2, null);
		checkJsFilesList(group2, new String[] {"GROUP1_FILEJS1","GROUP1_FILEJS2"});
		checkCssFilesList(group2, new String[] {"GROUP1_FILECSS1"});
		checkGroupLocation(group2, "location_of_group2");
		
		// test on group3.
		Group group3 = (Group) groups.get("group3");
		
		// checkSubGroupList(group3, new String[] {"group2","group1"}); // see testSeveralXmlAppendGroup3SubGroups
		checkJsFilesList(group3, new String[] {"GROUP3_FILEJS1","GROUP3_FILEJS2"});
		checkCssFilesList(group3, new String[] {"GROUP3_FILECSS1","GROUP3_FILECSS2"});		
		checkGroupLocation(group3, "location_of_group3");
		
		// test on group4.
		Group group4 = (Group) groups.get("group4");
		
		checkSubGroupList(group4, new String[] {"group5"});
		checkJsFilesList(group4, null);
		checkCssFilesList(group4, new String[] {"GROUP4_FILECSS1"});		
		// checkGroupLocation(group4, "location_of_group4"); // see testSeveralXmlAppendGroup4location
		
		// test on group5.
		Group group5 = (Group) groups.get("group5");
		
		checkSubGroupList(group5, null);
		checkJsFilesList(group5, new String[] {"GROUP5_FILEJS1","GROUP5_FILEJS2"});
		checkCssFilesList(group5, null);		
		checkGroupLocation(group5, "location_of_group5");
		
	}
	
	/**
	 * Bug identifie en version 2.2
	 * @throws Exception
	 */
	public void testSeveralXmlAppendGroup3SubGroups() throws Exception {
		String jsoPropertiesFile = "com/ideo/jso/junit/confLoad/jso51.properties";
		
		Properties properties = initJSO(jsoPropertiesFile);

		checkConfigFileName("com/ideo/jso/junit/confLoad/jso51.xml", 3, properties);
		
		AbstractConfigurationLoader loader = AbstractConfigurationLoader.getInstance();
		Map groups = loader.getUpdatedGroups();
		
		// test on group3.
		Group group3 = (Group) groups.get("group3");
		
		// !! Probleme redondance des groupes - a faire evoluer
		checkSubGroupList(group3, new String[] {"group2","group1","group2"}); // TODO tester group2, group1
	}	
	
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
	
	
	
	/**
	 * 
	 * @throws Exception
	 */
	public void testSeveralXmlPartialAppend() throws Exception {
		String jsoPropertiesFile = "com/ideo/jso/junit/confLoad/jso52.properties";
		
		Properties properties = initJSO(jsoPropertiesFile);

		checkConfigFileName("com/ideo/jso/junit/confLoad/jso52.xml", 3, properties);
		
		AbstractConfigurationLoader loader = AbstractConfigurationLoader.getInstance();
		Map groups = loader.getUpdatedGroups();
		
		Group group1 = (Group) groups.get("group1");
		checkSubGroupList(group1, new String[] {"group4"});
		checkGroupLocation(group1, null);
		
		// test on group2.
		Group group2 = (Group) groups.get("group2");
		
		checkSubGroupList(group2, null);
		checkJsFilesList(group2, new String[] {"GROUP1_FILEJS2"});
		checkCssFilesList(group2, new String[] {"GROUP1_FILECSS1"});
		checkGroupLocation(group2, "location_of_group2");
		
		// test on group3.
		Group group3 = (Group) groups.get("group3");
		
		checkSubGroupList(group3, new String[] {"group2"});
		checkJsFilesList(group3, null);
		checkCssFilesList(group3, null);		
		checkGroupLocation(group3, "location_of_group3");
		
		// test on group4.
		// test on group4.
		Group group4 = (Group) groups.get("group4");
		
		checkSubGroupList(group4, new String[] {"group5"});
		checkJsFilesList(group4, null);
		checkCssFilesList(group4, new String[] {"GROUP4_FILECSS1"});		
		// checkGroupLocation(group4, "location_of_group4"); // see testSeveralXmlAppendGroup4location
		
		// test on group5.
		Group group5 = (Group) groups.get("group5");
		
		checkSubGroupList(group5, null);
		checkJsFilesList(group5, new String[] {"GROUP5_FILEJS1","GROUP5_FILEJS2"});
		checkCssFilesList(group5, null);		
		checkGroupLocation(group5, "location_of_group5");
		
	}
	
	/**
	 * Bug identifie en 2.2.4.1
	 * @throws Exception
	 */
	public void testSeveralXmlPartialAppendGroup1Files() throws Exception {
		String jsoPropertiesFile = "com/ideo/jso/junit/confLoad/jso52.properties";
		
		Properties properties = initJSO(jsoPropertiesFile);

		checkConfigFileName("com/ideo/jso/junit/confLoad/jso52.xml", 3, properties);
		
		AbstractConfigurationLoader loader = AbstractConfigurationLoader.getInstance();
		Map groups = loader.getUpdatedGroups();
		
		
		Group group1 = (Group) groups.get("group1");
		checkJsFilesList(group1, new String[] {"GROUP1_FILEJS3"});
		checkCssFilesList(group1, null);

	}

	/**
	 * @throws Exception
	 */
	public void testSeveralXmlConflictRule() throws Exception {
		String jsoPropertiesFile = "com/ideo/jso/junit/confLoad/jso53.properties";
		
		Properties properties = initJSO(jsoPropertiesFile);

		checkConfigFileName("com/ideo/jso/junit/confLoad/jso53.xml", 3, properties);
		
		AbstractConfigurationLoader loader = AbstractConfigurationLoader.getInstance();
		Map groups = loader.getUpdatedGroups();
		
		Group group1 = (Group) groups.get("group1");
		checkGroupLocation(group1, "location1_of_group1");
		checkJsFilesList(group1, new String[]{"GROUP1_FILEJS3","GROUP1_FILEJS1"});
		
		Group group2 = (Group) groups.get("group2");
		checkGroupLocation(group2, "location1_of_group2");
		checkJsFilesList(group2, new String[]{"GROUP2_FILEJS2","GROUP2_FILEJS3","GROUP2_FILEJS1"});
		
		Group group3 = (Group) groups.get("group3");
		checkGroupLocation(group3, "location1_of_group3");
		checkJsFilesList(group3, new String[]{"GROUP3_FILEJS1"});
		
	}
		

}
