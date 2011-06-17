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

import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.util.List;

import javax.servlet.ServletContext;

import com.ideo.jso.processor.ResourcesProcessor;

/**
 * This class represents the contract to override to describe the rule to apply to the group builder
 * 
 * @author Julien Maupoux
 *
 */
public abstract class AbstractGroupBuilder {
	//private final static Logger log = Logger.getLogger(AbstractGroupLoader.class); 
    
    private static AbstractGroupBuilder instance;

	/**
	 * Return the instance of the group builder. This instance must have been created during the initialization
	 * @return the instance of the group builder
	 */
    public static AbstractGroupBuilder getInstance(){
    	return instance;
    }
    
    /**
     * Initializes the group builder, with the class given in parameter
     * @param clazz the class extending AbstractGroupBuilder which define the way to build groups
     * @throws InstantiationException if the class parameter does not represent a valid class.
     * @throws IllegalAccessException if the class given in parameter is not accessible.
     * @throws ClassNotFoundException if the class given in parameter cannot be found
     * @throws ClassCastException if the class given in parameter does not extend AbstractGroupBuilder
     */
	public static void init(String clazz) throws InstantiationException, IllegalAccessException, ClassNotFoundException, ClassCastException{
		if(clazz == null){
			throw new IllegalArgumentException("The key jso.groupLoaderClass must be filled in the jso.properties.");
		}else{
			instance = (AbstractGroupBuilder) Class.forName(clazz).newInstance();
		}
	}
    
	/**
	 * Return true if the group must be built, false otherwise.
	 * @param group the group to build
	 * @return true if the group must be rebuilt, false otherwise.
	 */
    protected abstract boolean mustBuildGroup(Group group);
	
    /**
     * Build the group into the stream if the builder requires it. 
     * @param group the group required
     * @param out the outputstream where the group must be built
     * @param servletContext the servletContext in a web environment, or null for a classic build.
     * @return true if the group has been rebuilt, false otherwise
     * @throws IOException
     */
    public synchronized boolean buildGroupJsIfNeeded(Group group, OutputStream out, ServletContext servletContext) throws IOException {
		if(mustBuildGroup(group)){
			OutputStreamWriter w = new OutputStreamWriter(out);
			List jsResources =  group.getJsNames();
			String location = group.getLocation();
			ResourcesProcessor rp = group.getJSProcessor(); 
			rp.process(group, jsResources, servletContext, w, location);
			w.flush(); // JSO-16
			group.setLastLoadTime(System.currentTimeMillis());
			return true;
		}
		return false;
	}
}
