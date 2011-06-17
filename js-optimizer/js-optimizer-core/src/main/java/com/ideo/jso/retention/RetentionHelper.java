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
package com.ideo.jso.retention;

import com.ideo.jso.conf.Group;
import com.ideo.jso.util.URLUtils;

/**
 * This class help to manage the retention groups
 * 
 * @author Julien Maupoux
 *
 */
public class RetentionHelper {	
	public static String RETENTION_PATH = "/";
	public static String APPLICATION_PATH = "";
	
	public static String buildRootRetentionFilePath(Group group, String ext){
		return URLUtils.concatUrlWithSlaches(RETENTION_PATH, group.getName()+ext);
	}
	
	public static String buildFullRetentionFilePath(Group group, String ext){
		return URLUtils.concatUrlWithSlaches(APPLICATION_PATH, RETENTION_PATH, group.getName()+ext);
	}
}
