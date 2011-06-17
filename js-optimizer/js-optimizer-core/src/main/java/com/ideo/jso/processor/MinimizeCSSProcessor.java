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
import java.io.InputStream;
import java.io.Writer;
import java.net.URL;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.servlet.ServletContext;

import org.apache.log4j.Logger;

import com.ideo.jso.conf.Group;
import com.ideo.jso.minifier.ICssMinifier;
import com.ideo.jso.util.URLUtils;

/**
 * Process the resources by minimizing its CSS file
 * 
 * @author Julien Maupoux
 *
 */
//TODO
public class MinimizeCSSProcessor implements ResourcesProcessor {
	private final static Logger LOG = Logger.getLogger(MinimizeCSSProcessor.class);
	
	private static MinimizeCSSProcessor instance;
	private static ICssMinifier minifier;
	
	public static MinimizeCSSProcessor getInstance(){
		if(instance==null)
			instance = new MinimizeCSSProcessor();
		return instance;
	}
	
	private MinimizeCSSProcessor(){}
	
	public void process(Group group, List resourcesName, ServletContext servletContext, Writer out, String location) throws IOException {
		List excludeResources = new ArrayList();
		process(group, resourcesName, excludeResources, servletContext, out, location);
		excludeResources = null;
	}
	
	public void process(Group group, List resourcesName, List excludeResources, ServletContext servletContext, Writer out, String location) throws IOException {
		for (Iterator iterator = group.getSubgroups().iterator(); iterator.hasNext();) {
			Group subGroup = (Group)iterator.next();
			String subLocation = subGroup.getBestLocation(location);
			ResourcesProcessor subGroupProcessor = null;
			if(subGroup.isMinimize()==null)
				subGroupProcessor = this;
			else
				subGroupProcessor = subGroup.getCSSProcessor();
			subGroupProcessor.process(subGroup, subGroup.getJsNames(), excludeResources, servletContext, out, subLocation);
		}
		
		for(Iterator it = resourcesName.iterator() ; it.hasNext();){
			URL url = null;
			String path = (String) it.next();
			
			if (! excludeResources.contains(path)) {

				url = URLUtils.getLocalURL(path, servletContext);
				
				if (url == null) {
					String webPath = URLUtils.concatUrlWithSlaches(group.getBestLocation(location), path);
					url = URLUtils.getWebUrlResource(webPath);
				}
	
				if(url==null) {
					throw new IOException("The resources '"+path+"' could not be found neither in the webapp folder nor in a jar");
				}
				
				InputStream in = null;
				
				try{
					in = url.openStream();
					minifier.minify(in, out);
					out.write("\n\n");
					out.flush();
				}catch (Exception e) {
					LOG.error("The JS minifier failed for file " + path, e);
				}finally{
					if (in != null) {
						in.close();
					}
				}	
				
				// mark the file included
				excludeResources.add(path);
								
			}
		}
	}

	public void setMinifier(ICssMinifier minifier) {
		MinimizeCSSProcessor.minifier = minifier;
	}

}
