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

package com.ideo.jso.tag;


import java.io.IOException;
import java.io.Writer;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.StringTokenizer;

import javax.servlet.jsp.PageContext;

import org.apache.log4j.Logger;

import com.ideo.jso.conf.AbstractConfigurationLoader;
import com.ideo.jso.conf.Group;
import com.ideo.jso.tag.includers.IIncluder;
import com.ideo.jso.tag.includers.IncluderFactory;

/**
 * Include the generated resources tags into the flow.
 *  
 * @author Julien Maupoux
 *
 */
public class InclusionController {
	// init logger first, if configuration fails
	private static final Logger log = Logger.getLogger(InclusionController.class);

	private static InclusionController instance = new InclusionController();

	/**
	 * Singleton. get the instance
	 * @return
	 */
	public static InclusionController getInstance() {
		return instance;
	}


	/**
	 * Display all the inclusions HTML tags for the requested groups 
	 * @param pageContext
	 * @param out the Writer
	 * @param groupNames the groups to include
	 * @param exploded if the inclusion should be the classic way or the merged one 
	 * @throws IOException
	 */
	public void printImports(PageContext pageContext, Writer out, String groupNames, boolean exploded) throws IOException {
		Map groups = AbstractConfigurationLoader.getInstance().getUpdatedGroups();
		List includeGroups = new ArrayList();
		StringTokenizer st = new StringTokenizer(groupNames, ",;", false);
		while (st.hasMoreTokens()) {
			String groupName = st.nextToken().trim();

			Group g = (Group) groups.get(groupName);
			if (g == null)
				throw new RuntimeException("Group '" + groupName + "' not found in any " + AbstractConfigurationLoader.getInstance().getConfigurationFileName());

			log.debug("Loading group : "+groupName);

			includeGroups.add(g);
		}

		for (int i = 0; i < includeGroups.size(); i++) {
			Group group = (Group) includeGroups.get(i);
			includeGroup(group, pageContext, out, exploded);
		}
	}
	
	/**
	 * Include the tags related to a group in the flow
	 * @param group the group to include
	 * @param pageContext the page to write for
	 * @param out the flow to write in
	 * @param exploded the exploded state of this including
	 * @throws IOException
	 */
	public void includeGroup(Group group, PageContext pageContext, Writer out, boolean exploded) throws IOException{		
		printIncludeJSTag(getIncluderForGroup(group, exploded), group, pageContext, out);
		printIncludeCSSTag(IncluderFactory.getInstance().getIncluder(IIncluder.EXPLODED), group, pageContext, out);
	}
	
	/**
	 * Return the includer related to a group given in parameter
	 * @param group the group
	 * @param exploded whether the exploded state has been enabled or not.
	 * @return
	 */
	private IIncluder getIncluderForGroup(Group group, boolean exploded){
		IIncluder includer = null;
		if(exploded){
			includer = IncluderFactory.getInstance().getIncluder(IIncluder.EXPLODED);
		}else{
			if(group.isRetention()){
				includer = IncluderFactory.getInstance().getIncluder(IIncluder.RETENTION);
			}
			else{
				includer = IncluderFactory.getInstance().getIncluder(IIncluder.BUFFER);
			}
		}
		return includer;
	}

	/**
	 * Display the js import tags, depending of the group parameters set in the XML descriptor and of the tag exploded parameter.
	 * @param pageContext
	 * @param out the writer into which will be written the tags  
	 * @throws IOException
	 */
	public void printIncludeJSTag(IIncluder includer, Group group, PageContext pageContext, Writer out) throws IOException {
		includer.includeJs(group, out, pageContext);
	}

	/**
	 * Display the css import tags, depending of the group parameters set in the XML descriptor.
	 * @param pageContext
	 * @param out the writer into which will be written the tags  
	 * @throws IOException
	 */
	public void printIncludeCSSTag(IIncluder includer, Group group, PageContext pageContext, Writer out) throws IOException {
		includer.includeCss(group, out, pageContext);
	}
}
