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

import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;

import javax.servlet.ServletContext;

import com.ideo.jso.processor.MergeProcessor;
import com.ideo.jso.processor.MinimizeJSProcessor;
import com.ideo.jso.processor.ResourcesProcessor;
import com.ideo.jso.util.URLUtils;
import com.ideo.jso.util.ResourcesBuffer;

/**
 * Represents a group of resources
 * @author Julien Maupoux
 *
 */
public class Group {

	public static final String TIMESTAMP_NONE = "no"; // Never add timestamp to resource links
	public static final String TIMESTAMP_ALL = "all"; // add timestamp to all resource links
	public static final String TIMESTAMP_LOCAL = "local"; // add timestamp to local resource links only
	
	public static final String CONFLICTRULE_APPEND = "append";
	public static final String CONFLICTRULE_OVERRIDE = "override";

	/**
	 * Buffers for merged resources
	 */
	private ResourcesBuffer minimizedCache = new ResourcesBuffer();
	private ResourcesBuffer cssBuffer = new ResourcesBuffer();
	private ResourcesBuffer jsBuffer = new ResourcesBuffer();

	/**
	 * Parameters from the configuration file 
	 */
	private Boolean minimize;
	private Boolean minimizeCss;
	private boolean retention;
	private String location;
	private String timeStampPolicy;
	private String conflictRule;
	
	/**
	 * Groups referenced into this group
	 */
	private List subgroups = new ArrayList();

	/**
	 * List of resources name
	 */
	private List jsNames = new ArrayList();
	private List cssNames = new ArrayList();
	private List deepJsNames;
	private List deepCssNames;

	/**
	 * Name of the group
	 */
	private String name;
	
	/**
	 * Group Processors
	 */
	private ResourcesProcessor jsProcessor = MinimizeJSProcessor.getInstance();
	private ResourcesProcessor cssProcessor;
	
	private long lastLoadTime = 0;
	
	/**
	 * 
	 * @param name the name of the group
	 */
	public Group(String name) {
		this.name = name;
	}
	
	public void reset() {
		minimizedCache = new ResourcesBuffer();
		cssBuffer = new ResourcesBuffer();
		jsBuffer = new ResourcesBuffer();
		
		minimize = null;
		minimizeCss = null;
		retention = false;
		location = null;
		timeStampPolicy = null;
		conflictRule = null;
		
		subgroups = new ArrayList(); 
		
		jsNames = new ArrayList();
		cssNames = new ArrayList();
		
		jsProcessor = MinimizeJSProcessor.getInstance();
		cssProcessor = null;
		
		lastLoadTime = 0;	
	}
	
	public ResourcesProcessor getJSProcessor(){
		return jsProcessor;
	}
	public ResourcesProcessor getCSSProcessor(){
		return cssProcessor;
	}
	
	public ResourcesBuffer getJsBuffer() {
		return jsBuffer;
	}
	
	public ResourcesBuffer getCssBuffer() {
		return cssBuffer;
	}
	
	
	/**
	 * 
	 * @param webPath relative to context web path to a resource
	 * @param servletContext Application Context
	 * @return the last modification date of the file, as a long
	 */
	public long getResourceTimeStamp(String webPath, ServletContext servletContext){
		return  getResourceTimeStamp(this.getTimeStampPolicy(), webPath, servletContext);
	}
	
	/**
	 * 
	 * @param defaultTSPolicy Timestamp default policy. If group as no policy, this one will be applied
	 * @param webPath relative to context web path to a resource
	 * @param servletContext Application Context
	 * @return the last modification date of the file, as a long
	 */
	public long getResourceTimeStamp(String defaultTSPolicy, String webPath, ServletContext servletContext){
		String groupTSPolicy = (this.getTimeStampPolicy()==null)?defaultTSPolicy:this.getTimeStampPolicy();
		if (Group.TIMESTAMP_NONE.equals(groupTSPolicy)) {
			return 0;
			
		}
		long timestamp = 0;
		
		timestamp = URLUtils.getLocalFileTimeStamp(servletContext, webPath);
		if (timestamp == 0 && Group.TIMESTAMP_ALL.equals(groupTSPolicy)) {
			timestamp = URLUtils.getDistantFileTimeStamp(webPath);
		}
		
		return timestamp; 
	}

	/**
	 * Compute the maximum timestamp of a group of css.
	 * @param servletContext
	 * @return the more recent modification date of the css file of this group, as a long
	 * @throws MalformedURLException
	 */
	public long computeMaxCSSTimestamp(ServletContext servletContext) throws MalformedURLException {
		return computeMaxCSSTimestamp(this.getLocation(), this.getTimeStampPolicy(), servletContext);
	}
	/**
	 * @parentLocation location of englobing group.
	 * @param servletContext
	 * @return the more recent modification date of the css file of this group, as a long
	 * @throws MalformedURLException
	 */
	private long computeMaxCSSTimestamp(String parentLocation, String parentTSPolicy, ServletContext servletContext) throws MalformedURLException {
		String groupLocation = (this.location == null)?parentLocation:this.location;
		String groupTSPolicy = (this.getTimeStampPolicy()==null)?parentTSPolicy:this.getTimeStampPolicy();
		
		long maxCSSTimeStamp = cssBuffer.getTimestamp();

		if (! Group.TIMESTAMP_NONE.equals(getTimeStampPolicy())) {
			// check js files into the subgroups 
			for (int i = 0; i < subgroups.size(); i++) { 
				Group subGroup = (Group) subgroups.get(i); 
				long mx = subGroup.computeMaxCSSTimestamp(groupLocation, groupTSPolicy, servletContext); 
				if (mx> maxCSSTimeStamp) 
					maxCSSTimeStamp = mx; 
			} 
			
			List files = getCssNames();
	
			for (int i = 0; i < files.size(); i++) {
				String webPath = URLUtils.concatUrlWithSlaches(groupLocation,(String) files.get(i));
				long mx = getResourceTimeStamp(groupTSPolicy, webPath,servletContext);
				if (mx> maxCSSTimeStamp)
					maxCSSTimeStamp = mx;			
			}
		}
		return maxCSSTimeStamp;
	}
	
	/**
	 * 	 * Compute the maximum timestamp of a group of js.
	 * @param servletContext
	 * @return the more recent modification date of the css file of this group, as a long
	 * @throws MalformedURLException
	 */
	public long computeMaxJSTimestamp(ServletContext servletContext) throws MalformedURLException {
		return computeMaxJSTimestamp(this.getBestLocation(null), this.getBestTimestampPolicy(null), servletContext);
	}
	/**
	 * @parentLocation location of englobing group.
	 * @param servletContext
	 * @return the more recent modification date of the js file of this group and of its subgroups, as a long
	 * @throws MalformedURLException
	 */
	private long computeMaxJSTimestamp(String parentLocation, String parentTSPolicy, ServletContext servletContext) throws MalformedURLException {
		String groupLocation = (this.location == null)?parentLocation:this.location;
		String groupTSPolicy = (this.getTimeStampPolicy()==null)?parentTSPolicy:this.getTimeStampPolicy();
		
		long maxJSTimeStamp = 0;
		
		if (! Group.TIMESTAMP_NONE.equals(getTimeStampPolicy())) {
			// check js files into the subgroups
			for (int i = 0; i < subgroups.size(); i++) {
				Group subGroup = (Group) subgroups.get(i);
				long mx = subGroup.computeMaxJSTimestamp(groupLocation, groupTSPolicy, servletContext);
				if (mx> maxJSTimeStamp)
					maxJSTimeStamp = mx;
			}
	
			List files = getJsNames(); 
			//check js files into this group 
			for (int i = 0; i < files.size(); i++) { 
				String webPath = URLUtils.concatUrlWithSlaches(groupLocation,(String) files.get(i));
				long mx = getResourceTimeStamp(groupTSPolicy, webPath,servletContext); 
				if (mx> maxJSTimeStamp) 
					maxJSTimeStamp = mx;			
			}			
		}
		return maxJSTimeStamp;
	}


	/**
	 * return the most effective location.
	 * if group has a location, it will be returned.
	 * if group has no location (null) and parentLocation is not null then return parentLocation
	 * if group has no location (null) and parentLocation is not null then return default location
	 * @AbstractConfigurationLoader.getInstance().getDefaultLocation()
	 * @param parentLocation location of parent group
	 * @return
	 */
	public String getBestLocation(String parentLocation) {
		String bestLocation = this.getLocation();
		// If no location defined, use default one.
		if (parentLocation == null && bestLocation == null) {
			bestLocation = AbstractConfigurationLoader.getInstance().getDefaultLocation();
		}
		else if (bestLocation == null) {
			bestLocation = parentLocation;
		}
		// else if group has no location use parent one.
		return bestLocation;
		
	}
	
	/**
	 * 
	 * @return All the JavaScript files declared in this group and its subgroups referenced. 
	 */
	public List getDeepCssNames() {
		if (deepCssNames==null){
			List res = new LinkedList();
			for (Iterator iterator = getSubgroups().iterator(); iterator.hasNext();) {
				Group subGroup = (Group) iterator.next();
				res.addAll(subGroup.getCssNames());
			}
			res.addAll(getCssNames());
			deepCssNames = res;
		}
		return deepCssNames;
	}
	
	/**
	 * 
	 * @return All the JavaScript files declared in this group and its subgroups referenced. 
	 */
	public List getDeepJsNames() {
		if (deepJsNames==null){
			List res = new LinkedList();
			for (Iterator iterator = getSubgroups().iterator(); iterator.hasNext();) {
				Group subGroup = (Group) iterator.next();
				res.addAll(subGroup.getDeepJsNames());
			}
			res.addAll(getJsNames());
			deepJsNames = res;
		}
		return deepJsNames;
	}
	
	/**
	 * return the most effective TimestampPolicy.
	 * if group has a TimestampPolicy, it will be returned.
	 * if group has no TimestampPolicy (null) and parentTSPolicy is not null then return parentTSPolicy
	 * if group has no TimestampPolicy (null) and parentTSPolicy is not null then return default TimestampPolicy
	 * @AbstractConfigurationLoader.getInstance().getDefaultTimestampPolicy()
	 * @param parentTSPolicy Timestamp policy of parent group
	 * @return
	 */
	public String getBestTimestampPolicy(String parentTSPolicy) {
		String bestTimestampPolicy = this.getTimeStampPolicy();
		// If no location defined, use default one.
		if (parentTSPolicy == null && this.getTimeStampPolicy() == null) {
			bestTimestampPolicy = AbstractConfigurationLoader.getInstance().getDefaultTimestampPolicy();
		}
		else if (bestTimestampPolicy == null) {
			bestTimestampPolicy = parentTSPolicy;
		}
		// else if group has no location use parent one.
		return bestTimestampPolicy;
		
	}
	
	
	
	public Boolean isMinimize() {
		return minimize;
	}

	public void setMinimize(Boolean minimize) {
		if(Boolean.FALSE.equals(minimize))
			jsProcessor = MergeProcessor.getInstance();
		else
			jsProcessor = MinimizeJSProcessor.getInstance();
		this.minimize = minimize;
	}

	public List getSubgroups() {
		return subgroups;
	}

	public void setSubgroups(List subgroups) {
		this.subgroups = subgroups;
	}

	public List getJsNames() {
		return jsNames;
	}

	public void setJsNames(List jsNames) {
		this.jsNames = jsNames;
	}

	public List getCssNames() {
		return cssNames;
	}

	public void setCssNames(List cssNames) {
		this.cssNames = cssNames;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Boolean isMinimizeCss() {
		return minimizeCss;
	}

	public void setMinimizeCss(Boolean minimizeCss) {
		if(Boolean.FALSE.equals(minimizeCss)){
			cssProcessor = MergeProcessor.getInstance();
		}
		else
			cssProcessor = MergeProcessor.getInstance();//TODO
		this.minimizeCss = minimizeCss;
	}

	public boolean isRetention() {
		return retention;
	}

	public void setRetention(boolean retention) {
		this.retention = retention;
	}

	public ResourcesBuffer getMinimizedCache() {
		return minimizedCache;
	}

	/**
	 * @return 0 if not loaded
	 */
	public long getLastLoadTime() {
		return lastLoadTime;
	}

	public void setLastLoadTime(long lastLoadTime) {
		this.lastLoadTime = lastLoadTime;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public String getTimeStampPolicy() {
		return timeStampPolicy;
	}
	

	public void setTimeStampPolicy(String timeStampPolicy) {
		this.timeStampPolicy = timeStampPolicy;
	}	

	public String getConflictRule() {
		return conflictRule;
	}
	

	public void setConflictRule(String conflictRule) {
		this.conflictRule = conflictRule;
	}
	
}
