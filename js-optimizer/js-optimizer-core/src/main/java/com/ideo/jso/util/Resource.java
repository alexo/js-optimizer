package com.ideo.jso.util;

import java.net.URL;

public class Resource {
	String source;
	URL url;
	
	public Resource() {
		super();
	}
	
	public Resource(String source, URL url) {
		super();
		this.source = source;
		this.url = url;
	}

	public String getSource() {
		return source;
	}

	public void setSource(String source) {
		this.source = source;
	}

	public URL getUrl() {
		return url;
	}

	public void setUrl(URL url) {
		this.url = url;
	}
}
