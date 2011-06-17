package com.ideo.jso.util;

import java.net.URL;

public class URLConf {

	private static String MOCK_WEB_URL;
	private static String MOCK_CONTEXT_URL;
	
	static public void setMockWebUrl(String url) {
		URLUtils.MOCK_WEB_URL = url;
		MOCK_WEB_URL = url;
	}

	static public void setMockContextUrl(String url) {
		URLUtils.MOCK_CONTEXT_URL = url;
		MOCK_CONTEXT_URL = url;
	}
	
	static public String getMockWebUrl() {
		return MOCK_CONTEXT_URL ;
	}

	static public String getMockContextUrl() {
		return MOCK_CONTEXT_URL ;
	}
	
	/**
	 * return th URL of a resource from the class loader.
	 * @param resourcePath
	 * @return
	 */
	public static URL getClassPathUrlResource(String resourcePath) {
		URL url = Thread.currentThread().getContextClassLoader().getResource(resourcePath);// JEE Context
		if (url == null) { // Stand alone
			url = URLUtils.class.getResource(resourcePath);
		}
		return url;
	}


}
