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
package com.ideo.jso.processor;

import java.io.IOException;
import java.io.Writer;
import java.util.List;

import javax.servlet.ServletContext;

import com.ideo.jso.conf.Group;

/**
 * This interface represents the contract to override for a class executing some process on the resources
 * @author Julien Maupoux
 *
 */
public interface ResourcesProcessor {

	/**
	 * Process list of resources inclusion.
	 * @param group				Group to include
	 * @param resourcesName		Resources to include
	 * @param servletContext	
	 * @param out
	 * @param location			Default location
	 * @throws IOException
	 */
	public void process(Group group, List resourcesName, ServletContext servletContext, Writer out, String location) throws IOException ;

	/**
	 * Process list of resources inclusion.
	 * @param group				Group to include
	 * @param resourcesName		Resources to include
	 * @param excludeResources	Resources to exclude
	 * @param servletContext	
	 * @param out
	 * @param location			Default location
	 * @throws IOException
	 */

	public void process(Group group, List resourcesName, List excludeResources, ServletContext servletContext, Writer out, String location) throws IOException ;
}
