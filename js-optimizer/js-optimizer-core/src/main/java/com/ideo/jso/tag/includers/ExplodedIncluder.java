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
package com.ideo.jso.tag.includers;

import java.io.IOException;
import java.io.Writer;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.jsp.PageContext;

import com.ideo.jso.conf.Group;
import com.ideo.jso.servlet.JsoServlet;
import com.ideo.jso.util.URLUtils;

/**
 * Include the tags that will get their data the classic way, as if JSO where disabled.
 * 
 * @author Julien Maupoux
 *
 */
class ExplodedIncluder implements IIncluder{
	
	/**
	 * Adds HTML links to javascript files into the output flow, 
	 * and (if groups allowed it) links are suffixed by a timestamp corresponding to the last modification date of the file
	 * @param group group containing the javascript files
	 * @param out output flow
	 * @param pageContext Page asking for jso-optimizer service
	 * @throws IOException
	 */
	public void includeJs(Group group, Writer out, PageContext pageContext) throws IOException{
		List includedResources = new ArrayList();
		includeRecursivJs(group, includedResources, out, pageContext, group.getLocation(), group.getTimeStampPolicy());
		includedResources = null;
	}
	
	// Add html links to js defined into group and its sub-groups.
	private void includeRecursivJs(Group group, List includedResources, Writer out, PageContext pageContext, String parentLocation, String parentTSPolicy) throws IOException{
		String groupLocation = group.getBestLocation(parentLocation);
		String groupTSPolicy = group.getBestTimestampPolicy(parentTSPolicy);
		
		for (Iterator it = group.getSubgroups().iterator(); it.hasNext() ; ) {
			includeRecursivJs((Group)it.next(), includedResources, out, pageContext, groupLocation, groupTSPolicy);
		}
		
		includeGroupResources(group.getJsNames(), includedResources, out, pageContext, groupLocation, groupTSPolicy, JS_BEGIN_TAG, JS_END_TAG);
	}

	/**
	 * Adds HTML links to javascript files into the output flow, 
	 * and (if groups allow it) links are suffixed by a timestamp corresponding to the last modification date of the file
	 * @param group group containing the javascript files
	 * @param out output flow
	 * @param pageContext Page asking for jso-optimizer service
	 * @throws IOException
	 */
	public void includeCss(Group group, Writer out, PageContext pageContext) throws IOException {
		List includedResources = new ArrayList();
		includeRecursivCss(group, includedResources, out, pageContext, group.getLocation(), group.getTimeStampPolicy());
		includedResources = null;
	}
	
	// Add html links to css defined into group and its sub-groups.
	private void includeRecursivCss(Group group, List includedResources, Writer out, PageContext pageContext, String parentLocation, String parentTSPolicy) throws IOException{
		String groupLocation = group.getBestLocation(parentLocation);
		String groupTSPolicy = group.getBestTimestampPolicy(parentTSPolicy);
		
		for (Iterator it = group.getSubgroups().iterator(); it.hasNext() ; ){
			includeRecursivCss((Group)it.next(), includedResources, out, pageContext, groupLocation, groupTSPolicy);
		}
		
		includeGroupResources(group.getCssNames(), includedResources, out, pageContext, groupLocation, groupTSPolicy, CSS_BEGIN_TAG, CSS_END_TAG);
		
	}
	
	// Adds tags into the flow to include all resources of a group "the classic way", 
	// and (if groups allow it) suffixes them by a timestamp corresponding to the last modification date of the file
	private void includeGroupResources(List groupFiles, List includedResources, Writer out, PageContext pageContext, String groupLocation, String timeStampPolicy, String tagBegin, String tagEnd) 
	throws IOException {
		String fileLocation = null;
		
		for (Iterator it = groupFiles.iterator(); it.hasNext() ; ){
			
			if(groupLocation == null){
				fileLocation = (String)it.next();
			}else{
				String resourceName = (String)it.next();
				fileLocation = URLUtils.concatUrlWithSlaches(groupLocation, resourceName);
			}
			
			if (! includedResources.contains(fileLocation)) {
				includeResource(pageContext, out, fileLocation, tagBegin, tagEnd, timeStampPolicy);
				includedResources.add(fileLocation);
			}
		}

		
	}

	// Adds a tag into the flow to include a resource "the classic way", 
	// and (if groups allow it)  suffix by a timestamp corresponding to the last modification date of the file
	private void includeResource(PageContext pageContext, Writer out, String webPath, String tagBegin, String tagEnd, String timeStampPolicy) 
	throws IOException {

		long timestamp = 0;
		
		// Try to determine :
		// - if file is local.
		// - it's timestamp
		// We have to compute local file timestamp even if policy is TIMESTAMP_NONE 
		// in order to determine if resource file is local or not.
		timestamp = URLUtils.getLocalFileTimeStamp(pageContext.getServletContext(), webPath);
		boolean isFileLocal = (timestamp != 0);
		String filePath = null;		
		
		if (!isFileLocal && Group.TIMESTAMP_ALL.equals(timeStampPolicy)) { 
			// Compute distant file timestamp only is needed.
			timestamp = URLUtils.getDistantFileTimeStamp(webPath);
		} 
			
		// Printing resource link
		if (isFileLocal) {
			// Adding context path for absolute to hostname linking.
			filePath = ((HttpServletRequest)pageContext.getRequest()).getContextPath();
			filePath = URLUtils.concatUrlWithSlaches(filePath, webPath);
		} else {
			filePath = webPath;
		}
		
		if (timestamp > 0 && !Group.TIMESTAMP_NONE.equals(timeStampPolicy) ) {
			filePath = URLUtils.addParamToUrl(filePath, JsoServlet.TIMESTAMP, Long.toString(timestamp));
		}
		
		out.write(tagBegin + filePath + tagEnd + "\n");

	}
	

}