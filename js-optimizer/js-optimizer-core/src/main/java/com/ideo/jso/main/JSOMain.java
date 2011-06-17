/** ------------------------------------
 * JavaScript Optimizer
 * Copyright [2007] [Ideo Technologies]
 * ------------------------------------
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * 		http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *
 * For more information, please contact us at:
 *         Ideo Technologies S.A
 *        124 rue de Verdun
 *        92800 Puteaux - France
 *
 *      France & Europe Phone : +33 1.46.25.09.60
 *         USA & Canada Phone : (201) 984-7514
 *
 *        web : http://www.ideotechnologies.com
 *        email : js-optimizer@ideotechnologies.com
 *
 *
 * @version 1.0
 * @author Ideo Technologies
 */
package com.ideo.jso.main;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import com.ideo.jso.conf.AbstractConfigurationLoader;
import com.ideo.jso.conf.AbstractGroupBuilder;
import com.ideo.jso.conf.Group;
import com.ideo.jso.util.Initializer;
import com.ideo.jso.util.URLUtils;

/**
 * Class containing a main method, for single build out from a web context 
 * Requires 2 args : 
 * A list of group to minimize, as defined in the tag (comma separated).
 * A file name where the result will be written.
 * A file that will be use as jso.xml
 * 
 * Every other configuration is gathered from the configuration files.
 * 
 * @author Julien Maupoux
 *
 */
public class JSOMain {

	private static final String ERR_MSG_INVALID_ARG_1 = "2 arguments are required : " +
														"[1] the list of groups to minimize, comma separated " +
														"and [2] a file name to write the result in.";
	private static final String ERR_MSG_INVALID_ARG_2 = "A maximum of 4 arguments are required. " +
														"[1] the list of groups to minimize, comma separated, " +
														"[2] a file name to write the result in, " +
														"[3] a JSO configuration file path (optional) " +
														"and [4] a JSO property file (optional).";
	private static final String ERR_MSG_INVALID_ARG_3 = "Could not find a jso.properties file. Initialization fail.";
	private static final String ERR_MSG_INVALID_ARG_4 = "JSO configuration file not found or could not be readen.";

		
	private static final String DEFAULT_PROPERTY_FILE = "jso.properties";


	/**
	 * Launch JS minification of several groups into one or several groups.<br>
	 * Arguments :<br>
	 * <ol>
	 * <li> the list of groups to minimize, comma separated
	 * <li> a file name to write the result in. Il filename begin with "multi:" then one
	 * file per group will be created, with a name wich prefix is the string after "multi:", 
	 * the suffix is the group name and extension ".js".
	 * <li> A file path to the JSO configuration file in file system (default see configuration file)
	 * <li> A file path to the JSO property file in classpath (default "jso.properties");
	 * </ol>
	 * @param args
	 * @throws Exception
	 */
	public static void main(String[] args) throws Exception {
		if(args.length < 2){
			throw new IllegalArgumentException(ERR_MSG_INVALID_ARG_1);
		}
		if(args.length > 4){
			throw new IllegalArgumentException(ERR_MSG_INVALID_ARG_2);
		}
		
		String groupsArg = args[0];
		String[] groups = groupsArg.split("[,;]");
		String outFileName = args[1];
		String configFileName = args.length>2?args[2]:null;
		String propertyFileName = args.length>3?args[3]:null;
		
		new JSOMain().run(groups, outFileName, configFileName, propertyFileName);
	}

	private void run(String[] groups, String filename, String configFile, String propertyFile) 
	throws Exception {
		Properties properties = new Properties();
		
		InputStream fileInput = null;
		
		URL propertyFileUrl = null;
		
		// Use default property file or defined one
		if (propertyFile == null) {
			propertyFileUrl = URLUtils.getClassPathUrlResource(DEFAULT_PROPERTY_FILE);
		} else {
			propertyFileUrl = new File(propertyFile).toURL();
		}	
	
		// If URL invalid raise error
		if (propertyFileUrl == null) {
			throw new Exception(ERR_MSG_INVALID_ARG_3);
		}
	
		// Load properties file, raise error if not found
		try {
			fileInput = propertyFileUrl.openStream();
			properties.load(fileInput);

		} catch (FileNotFoundException e) {
			throw new Exception(ERR_MSG_INVALID_ARG_3, e);
		} finally {
			if (fileInput != null) {
				fileInput.close();
			}
		}
		
		// XML config file should be readable or raise error
		if (configFile != null && !(new File(configFile).canRead())) {
			throw new Exception(ERR_MSG_INVALID_ARG_4);
		}
		
		// Initialize configuration
		Initializer.initialize(properties, configFile, ".");
		
		File file = new File(filename);
		
		// Generate JS minimized file
		OutputStream out = null;
		try {
			file.createNewFile();
			out = new FileOutputStream(file);
		
			AbstractConfigurationLoader confLoader = AbstractConfigurationLoader.getInstance();
			AbstractGroupBuilder groupBuilder = AbstractGroupBuilder.getInstance();
			Map mapGroups = confLoader.getGroups();
			List alreadyIncludedResources = new ArrayList();
			
			for(int i=0;i<groups.length;++i){
				Group group = (Group) mapGroups.get(groups[i]);
				
				if (group == null) {
					throw new Exception("Group '" + groups[i] + "' isn't loaded.");
				}
				groupBuilder.buildGroupJsIfNeeded(group, out, null);
			}
		} finally {
			if (out != null) {
				out.close();
			}
		}
	}
}
