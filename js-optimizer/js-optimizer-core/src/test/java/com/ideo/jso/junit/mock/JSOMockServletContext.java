package com.ideo.jso.junit.mock;

import java.net.URL;

import org.apache.struts.mock.MockServletContext;

public class JSOMockServletContext extends MockServletContext {

	String mockSiteUrl;
	


	public JSOMockServletContext(String mockSiteUrl) {
		this.mockSiteUrl = mockSiteUrl;
	}
	

	public String getRealPath(String path) {
		try {
			if (path == null) return null;
			if (path.startsWith("/")) {
				path = path.substring(1, path.length());
			} else if (this.mockSiteUrl != null && path.startsWith(this.mockSiteUrl)) {
				return null;
			}
			URL url = Thread.currentThread().getContextClassLoader().getResource(path);
			return url.getFile();
		}
		catch (Exception e) {
			e.printStackTrace();
			return null;
		}
		
	}


}
