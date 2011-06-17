package com.ideo.jso.util;

import java.io.IOException;
import java.net.URL;

import javax.servlet.ServletContext;

public class ResourceLoaderHelper {
	public static ResourceLoaderHelper instance = new ResourceLoaderHelper();
	private ResourceLoaderHelper(){}
	public static URL getResourceURL(ServletContext context, String path) throws IOException{
		return instance.loadResourceURL(context, path);
	}
	private URL loadResourceURL(ServletContext context, String path) throws IOException{
		URL resource = null;
		resource = context.getResource(path);
		if(resource == null)
			resource = getClass().getResource(path);
		if(resource == null)
			throw new IOException("");
		return resource;
	}
}
