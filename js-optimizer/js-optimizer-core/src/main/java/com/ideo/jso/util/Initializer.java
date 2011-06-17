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

package com.ideo.jso.util;

import java.util.Properties;

import com.ideo.jso.conf.AbstractConfigurationLoader;
import com.ideo.jso.conf.AbstractGroupBuilder;
import com.ideo.jso.conf.JarRestrictionManager;
import com.ideo.jso.minifier.IJsMinifier;
import com.ideo.jso.processor.MinimizeJSProcessor;
import com.ideo.jso.retention.RetentionHelper;

/**
 * Load jso.properties parameter
 * @author Yannis Julienne
 *
 */
public class Initializer {
	public static void initialize(Properties properties, String configFile, String applicationPath) throws InstantiationException, IllegalAccessException, ClassNotFoundException{
		
		AbstractGroupBuilder.init(
				(String)properties.get("jso.groupLoaderClass")
		);
		AbstractConfigurationLoader.init(
				(String)properties.get("jso.configFileName"),
				(String)properties.get("jso.configurationLoaderClass"),
				configFile!=null?configFile:(String)properties.get("jso.externalFilePath")
		);

		RetentionHelper.RETENTION_PATH = (String)properties.getProperty("jso.retentionPath");
		RetentionHelper.APPLICATION_PATH = applicationPath;

		URLUtils.DEFAULT_ENCODING = (String)properties.getProperty("jso.defaultEncoding");
		
		 Class.forName((String)properties.getProperty("jso.jsMinifier")).newInstance();
		
		MinimizeJSProcessor.getInstance().setMinifier((IJsMinifier) Class.forName((String)properties.getProperty("jso.jsMinifier")).newInstance());
		
		JarRestrictionManager.getInstance().setCsvList((String)properties.getProperty("jso.allowedJar"));
	}
}
