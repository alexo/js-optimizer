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
package com.ideo.jso.conf;

import org.apache.log4j.Logger;

/**
 * singleton
 * This class manage jar restriction. 
 * By default jso xml file is retrieved from all resources (local class path, jars).
 * This class manage from which jar jso xml file could be readen.
 * @author Raphael AGNEL
 *
 */
public class JarRestrictionManager {
	
	private final static Logger LOG = Logger.getLogger(JarRestrictionManager.class); 

	public static String SEPARATOR = ",";
	public static String NO_RESTRICTION = "*";
	
	static JarRestrictionManager singleton;
	
	static public JarRestrictionManager getInstance() {
		if (singleton == null) {
			singleton = new JarRestrictionManager();
		}
		return singleton;
	}
	
	String csvListOfJar = NO_RESTRICTION;
	
	
	protected JarRestrictionManager() {
		
	}
	
	/**
	 * Set the csv list of allowed jar to contain a jso xml config file.
	 * * or null : all jar are allowed
	 * empty string : none
	 * list of csv jar names : only this jar are allowed. 
	 * @param list
	 */
	public void setCsvList(String list) {
		if (list == null) {
			list = NO_RESTRICTION;
		}
		list = list.trim();
		if (!NO_RESTRICTION.equals(list)) {
			String[] jars = list.split(SEPARATOR);
			if (jars == null) {
				list = NO_RESTRICTION;
			} else {
				list = SEPARATOR;
				for (int i=0; i < jars.length; i++) {
					String jarName = jars[i].trim();
					if (!NO_RESTRICTION.equals(jarName )) {
						if (!"".equals(jarName)) {
							list += jarName  + SEPARATOR;
						}
					} else {
						LOG.warn("Warning : CVS list of jar contain '*' (NO_RESTRICTION joker). It will be ignored");
					}
					
				}
			}
		}
		csvListOfJar = list;
	}
	
	/**
	 * check if a jar is allowed. If jarName is null return false.
	 * @param jarName name of the jar
	 * @return true|false
	 */
	public boolean isJarAllowed(String jarName) {	
		if (jarName == null) {
			return false;
		}
		
		if (NO_RESTRICTION.equals(csvListOfJar)) {
			return true;
		}
		
		// Prepare jarName for check
		if (!jarName.startsWith(SEPARATOR)) {
			jarName = SEPARATOR + jarName;
		}
		
		if (!jarName.endsWith(SEPARATOR)) {
			jarName = jarName + SEPARATOR;
		}
		
		return !(csvListOfJar.indexOf(jarName) < 0);
	}
	
	public static void main(String[] args) {
		JarRestrictionManager jr = JarRestrictionManager.getInstance();
		jr.setCsvList("totor.jar, bla.jar   , joe.jar");
		System.out.println(jr.csvListOfJar);
		
		System.out.println("totor.jar is allowed : " +  jr.isJarAllowed("totor.jar"));
		System.out.println("bla.jar is allowed : " +  jr.isJarAllowed("bla.jar"));
		System.out.println("joe.jar is allowed : " +  jr.isJarAllowed("joe.jar"));
		System.out.println("babar.jar is allowed : " +  jr.isJarAllowed("babar.jar"));
		
		
		jr.setCsvList("  ");
		System.out.println(jr.csvListOfJar);
		System.out.println("totor.jar is allowed : " +  jr.isJarAllowed("totor.jar"));
		System.out.println("bla.jar is allowed : " +  jr.isJarAllowed("bla.jar"));
		System.out.println("joe.jar is allowed : " +  jr.isJarAllowed("joe.jar"));
		System.out.println("babar.jar is allowed : " +  jr.isJarAllowed("babar.jar"));

		jr.setCsvList(null);
		System.out.println(jr.csvListOfJar);
		System.out.println("totor.jar is allowed : " +  jr.isJarAllowed("totor.jar"));
		System.out.println("bla.jar is allowed : " +  jr.isJarAllowed("bla.jar"));
		System.out.println("joe.jar is allowed : " +  jr.isJarAllowed("joe.jar"));
		System.out.println("babar.jar is allowed : " +  jr.isJarAllowed("babar.jar"));
		
		jr.setCsvList(" *  ");
		System.out.println(jr.csvListOfJar);
		System.out.println("totor.jar is allowed : " +  jr.isJarAllowed("totor.jar"));
		System.out.println("bla.jar is allowed : " +  jr.isJarAllowed("bla.jar"));
		System.out.println("joe.jar is allowed : " +  jr.isJarAllowed("joe.jar"));
		System.out.println("babar.jar is allowed : " +  jr.isJarAllowed("babar.jar"));
		
		jr.setCsvList(" * , joe.jar ");
		System.out.println(jr.csvListOfJar);
		System.out.println("totor.jar is allowed : " +  jr.isJarAllowed("totor.jar"));
		System.out.println("bla.jar is allowed : " +  jr.isJarAllowed("bla.jar"));
		System.out.println("joe.jar is allowed : " +  jr.isJarAllowed("joe.jar"));
		System.out.println("babar.jar is allowed : " +  jr.isJarAllowed("babar.jar"));
		
		jr.setCsvList(" * , ");
		System.out.println(jr.csvListOfJar);
		System.out.println("totor.jar is allowed : " +  jr.isJarAllowed("totor.jar"));
		System.out.println("bla.jar is allowed : " +  jr.isJarAllowed("bla.jar"));
		System.out.println("joe.jar is allowed : " +  jr.isJarAllowed("joe.jar"));
		System.out.println("babar.jar is allowed : " +  jr.isJarAllowed("babar.jar"));
	}
	
	
	
	
}
