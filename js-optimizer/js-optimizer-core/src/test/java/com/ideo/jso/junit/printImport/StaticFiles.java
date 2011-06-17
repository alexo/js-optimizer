package com.ideo.jso.junit.printImport;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import com.ideo.jso.junit.Util;

public class StaticFiles {
	String jsLocation = "resources/js/";
	String cssLocation = "resources/css/";
	
	List jsFiles = new ArrayList();
	List cssFiles = new ArrayList();

	String groupName;
	
	Map timestamps = new HashMap();
	boolean defaultTimestamp = false;
	
	public StaticFiles(String groupName) {
		this.groupName = groupName;
	}
	
	public StaticFiles(String groupName, boolean defaultTimestamp) {
		this.defaultTimestamp = defaultTimestamp;
		this.groupName = groupName;
	}
	
	public void addJsFile(String jsFile) {
		addJsFile(jsFile, null);
	}
	
	public void addCssFile(String cssFile) {
		addCssFile(cssFile, null);
	}
	
	
	public void addJsFile(String jsFile, String location) {
		addJsFile(jsFile, location, defaultTimestamp);
	}
	
	public void addCssFile(String cssFile, String location) {
		addCssFile(cssFile, location, defaultTimestamp);
	}
	
	public void addJsFile(String jsFile, String location, boolean timestamp) {
		if (location == null) {
			location = "/";
		}
		if (!location.endsWith("/")) {
			location = location + "/";
		}
		jsFiles.add(location + jsLocation + jsFile);
		
		if (timestamp)
			this.timestamps.put(location + jsLocation + jsFile, Boolean.TRUE);
		
	}
	
	public void addCssFile(String cssFile, String location, boolean timestamp) {
		if (location == null) {
			location = "/";
		}
		if (!location.endsWith("/")) {
			location = location + "/";
		}
		cssFiles.add(location + cssLocation + cssFile);
		if (timestamp)
			this.timestamps.put(location + cssLocation + cssFile, Boolean.TRUE);
	}
	
	
	public String computeJSScriptCalls(boolean exploded, String location) throws Exception {
		String importResult = "";		
		List files = this.jsFiles;
		if (files==null) return "";
		
		if (exploded) {
			Iterator i;
			i = files.iterator();
			while (i.hasNext()) {
				String file = (String) i.next();
				
				boolean addTS = Boolean.TRUE.equals(this.timestamps.get(file));
				
				long ts = (addTS)?Util.getFileTimeStamp(file, location):0;

				if (file.startsWith("http")) {
					importResult += computeJSScriptCall(file, ts);
				
				} else {
					importResult += computeJSScriptCall("/JSOTest" + file, ts);
				}
				
			}
		}
		else {
			String filePath = ((location != null)? location + "jso/" : "/JSOTest/jso/") + groupName + ".js";
			
			Iterator i;
			i = files.iterator();
			long maxTs = 0;
			while (i.hasNext()) {
				String file = (String) i.next();
				
				boolean addTS = Boolean.TRUE.equals(this.timestamps.get(file));
				long ts = (addTS)?Util.getFileTimeStamp(file, location):0;
				
				maxTs = Math.max(maxTs, ts);
			}
			importResult += computeJSScriptCall(filePath, maxTs);
		}

		
		return importResult;
	}
	
	public String computeCSSCalls(String location) throws Exception {
		String importResult = "";		
		List files = cssFiles;
		if (files==null) return "";
		Iterator i;
		
		i = files.iterator();
		while (i.hasNext()) {
			String file = (String) i.next();
			
			boolean addTS = Boolean.TRUE.equals(this.timestamps.get(file));
			long ts = (addTS)?Util.getFileTimeStamp(file, location):0;
			
			if (file.startsWith("http")) {
				importResult += computeCSSCall(file, ts);
			
			} else {
				importResult += computeCSSCall("/JSOTest" + file, ts);
			}

		}
		
		return importResult;
	}

	private String computeJSScriptCall(String filePath, long timestamp) {
		String fullpath = filePath;
		if (timestamp > 0) {
			fullpath = fullpath + "?timestamp=" + timestamp;
		}
		return "<script type=\"text/javascript\" src=\""+fullpath +"\"></script>\n";
	}

	private String computeCSSCall(String filePath, long timestamp) {
		String fullpath = filePath;
		if (timestamp > 0) {
			fullpath = fullpath + "?timestamp=" + timestamp;
		}
		return "<link rel=\"stylesheet\" type=\"text/css\" href=\""+fullpath +"\"/>\n";
	}
	

	
}
