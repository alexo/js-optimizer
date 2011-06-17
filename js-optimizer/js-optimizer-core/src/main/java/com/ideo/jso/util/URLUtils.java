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

package com.ideo.jso.util;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;

import javax.servlet.ServletContext;

import org.apache.log4j.Logger;


/**
 * 
 * This class regroups all file operations, web path or system path construction
 * 
 * @author Raphael Agnel
 */
public class URLUtils {
	public static String DEFAULT_ENCODING;

	protected static String MOCK_WEB_URL = null;		// JUnit/test usage only
	protected static String MOCK_CONTEXT_URL = null;    // JUnit/test usage only
	
	private static final String DEFAULT_MIME_TYPE = "text/plain";
	private static final String JS_MIME_TYPE = "text/javascript";
	private static final String CSS_MIME_TYPE = "text/css";
	private static final Logger LOG = Logger.getLogger(URLUtils.class);
	private static final String ERROR_CLOSE_ERROR = "Can't close URL connexion : ";
	private static final String ERROR_MALFORMED_URL = "Cannot read timestamp of following file because URL is invalid : ";
	private static final String ERROR_IO_HTTP = "Cannot read timestamp of following file because URL (to HTTP Connection) is unreachable : ";
	private static final String ERROR_IO_LOCAL = "Cannot read timestamp of following file because URL (to Java Source) is unreachable : ";
	
	// NON EXPLODED-WAR MANAGEMENT
	private static String webRootSystemPath = null; // Local path to root of static resources for non exploded war
	private static boolean flagSimulateNonExplodedWar = false; // if true force URLUtils to look for local resources as if war wasn't exploded.
	
	
	/**
	 * Return the timestamp (Last Modified Time) of file which is located in the web content diretcory of the web application or
	 * into java sources. Return 0 if no file found.
	 * @param servletContext Servlet context of the Web application
	 * @param path path of the file within web content or jar package.
	 * @return The last modified file's date timestamp or 0 if file not found
	 */
	static public long getLocalFileTimeStamp(ServletContext servletContext, String path) {
		long timestamp = 0;
		URL url = null; // URL of file located into java sources.
		String realPath = getRealPath(null, servletContext, path);
	
		if (realPath != null) { // File is local to the application
			timestamp = new File(realPath).lastModified();
		
			if(timestamp==0){ // File is in a jar.
				url = getClassPathUrlResource(path);
				if (url != null) {
					try {
						timestamp = getURLLastModifiedTimeStamp(url);
					}
					catch(IOException e){
						LOG.warn(ERROR_IO_LOCAL + path, e);
					}
				}
			}
		}
		
		return timestamp;
	}
	
	
	
	
	/**
	 * Return a timestamp of a file accessed by a HTTP connection.
	 * Return 0 if file is unreachable
	 * @param webPath URL of the file
	 * @return The last modified file's date timestamp or 0 if file not found
	 */
	static public long getDistantFileTimeStamp(String webPath) {
		long timestamp = 0;
		URL url = null;
		
//		if (webPath == null || webPath.indexOf("://") < 0) {
//			// No protocol : not an "distant" URL.
//			return timestamp;
//		}

		try {
 			url = getWebUrlResource(webPath);
			timestamp = getURLLastModifiedTimeStamp(url);
		}
		catch (MalformedURLException e) {
			LOG.warn(ERROR_MALFORMED_URL + webPath, e);
		}
		catch (IOException e) {
			LOG.warn(ERROR_IO_HTTP + webPath, e);
		}
		
		return timestamp;
	}
	
	
	// Returns last modified timestamp of ressource pointed by URL.
	// Logs IOException and stop its progression to allow next ressources to be included.
	private static long getURLLastModifiedTimeStamp(URL path) 
	throws IOException {
		long timestamp = 0;
		URLConnection cnx = null;
		try {
			cnx = path.openConnection();
			timestamp = cnx.getLastModified();
		}
		finally {
			try {
				if (cnx != null && cnx.getInputStream() != null) {
					cnx.getInputStream().close();
				}
			} catch(IOException io) {
				LOG.error(ERROR_CLOSE_ERROR + path, io);
			}
		}
		
		return timestamp;
	}
	
	
	/**
	 * 
	 * @param path
	 * @param location
	 * @param servletContext
	 * @return
	 * @throws MalformedURLException
	 */
	public static URL getLocalURL(String path,ServletContext servletContext)
	throws MalformedURLException {
		URL url = null;
		
		if (!path.startsWith("/"))
			path = "/"+path;
		
		// load in a folder
		if(servletContext != null) {
			url = servletContext.getResource(path);
		}
		if(url == null) {
			//load in a jar
			url = URLUtils.class.getResource(path);
		}

		return url;
	}

		
	
	/**
	 * Return a file name requested by Request object.
	 * @param path a file path (e.g. : /folder1/.../filename[.extension])
	 * @return the file name. Null if path points to a directory (path ending by a "/").
	 */
	public static String getFileName(String path){

		if (path.endsWith("/")) {
			// This is not a file but a directory.
			return null;
		}
		
		int lastSlash = path.lastIndexOf("/");
		if (lastSlash!=-1) {
			// remove path from file name.
			path = path.substring(lastSlash+1);
		}

		return path;
	}
	
	/**
	 * Return a file name extension
	 * @param filename : a filename without its path (e.g. : filename.extension)
	 * @return the filename extension. null if no extension.
	 */
	public static String getFileExtension(String fileName) {
		int lastDot = fileName.lastIndexOf(".");
		if (lastDot == -1){
			// no extension - return null.
			return null;
		}
		// return only the extension.
		return fileName.substring(lastDot + 1);
	}
	
	/**
	 * Return the strict filename without its extension.
	 * @param filename : a filename or a file path.
	 * @return The file name witout its extension. null if filename if a path to a directory (ends by "/");
	 */
	public static String getStrictFileName(String fileName) {
		if (fileName.endsWith("/")) {
			// This is not a file but a directory.
			return null;
		}
		
		int lastSlash = fileName.lastIndexOf("/");
		if (lastSlash!=-1) {
			// remove path from file name.
			fileName = fileName.substring(lastSlash+1);
		}

		// Check if an extension exist
		// and remove it
		int lastDot = fileName.lastIndexOf(".");
		if (lastDot == -1){
			lastDot = fileName.length();
		}
		return fileName.substring(0, lastDot);
	}
	
	/**
	 * 
	 * @param extension
	 * @return
	 */
	public static String getMimeTypeByExtension(String extension) {
		String mimeType = DEFAULT_MIME_TYPE;
		if (extension != null) {
			if ("js".equals(extension.toLowerCase())) {
				mimeType = JS_MIME_TYPE;
			}
			if ("css".equals(extension.toLowerCase())) {
				mimeType = CSS_MIME_TYPE;
			}
		}
		return mimeType;
	}

	
	
	/**
	 * Concat two part of an url into one.
	 * Check that this two part are separated with "/".
	 * Check that there no double "/" separating the two part
	 * <ul>
	 * <li>"firstpart/" + "/secondpart" -> "firstpart/secondpart"
	 * <li>"firstpart" + "/secondpart" -> "firstpart/secondpart"
	 * <li>"firstpart/" + "secondpart" -> "firstpart/secondpart"
	 * <li>"firstpart" + "secondpart" -> "firstpart/secondpart"
	 * </ul>
	 * @param firstPart
	 * @param secondPart
	 * @return 
	 */
	public static String concatUrlWithSlaches(String firstPart, String secondPart) {
		if (firstPart == null) 
			firstPart = "";	
		if (secondPart == null) 
			secondPart = "";
		if (! firstPart.endsWith("/") && ! secondPart.startsWith("/")) {
			return firstPart+ "/" + secondPart;
		} else if (firstPart.endsWith("/") && secondPart.startsWith("/")) {
			return firstPart + secondPart.substring(1);
		} 
		return firstPart + secondPart;
	}
	
	
	/**
	 * Concat three part of an url into one.
	 * @see #concatUrlWithSlaches(String, String)
	 * @param firstPart
	 * @param secondPart
	 * @param thirdPart
	 * @return 
	 */
	public static String concatUrlWithSlaches(String firstPart, String secondPart, String thirdPart) {

		return concatUrlWithSlaches(concatUrlWithSlaches(firstPart, secondPart), thirdPart);
	}
	
	
	/**
	 * Add a GET parameter to the url. Check if parameters already exists.
	 * This function do not encode paramName or paramValue. This has to been done before if necessary.
	 * <ul>
	 * <li> return "url?paramName=paramValue", if url has no previous paramteers
	 * <li> return "url?[previous parameters]&paramName=paramValue", if url has previous parameters
	 * <li> return "url?paramName=paramValue", if url has no previous parameters
	 * <li> return "url?[previous parameters]&paramName=paramValue", if url has previous parameters
	 * <li> return "url", if paramName is null.
	 * @param url
	 * @param paramName Name of the parameter. Could not be null.
	 * @param paramValue
	 * @return
	 */
	public static String addParamToUrl(String url, String paramName, String paramValue) {
		
		if (paramName == null)
			return url;
		
		if (paramValue == null) {
			if(url.indexOf("?")!=-1)
				return url+"&"+paramName;
			else
				return url+"?"+paramName;
		}
		
		if(url.indexOf("?")!=-1)
			return url+"&"+paramName+"="+paramValue;
		else
			return url+"?"+paramName+"="+paramValue;

	}
	
	/**
	 * Return the resources path of the resource at 'path'.
	 * With exploded WAR, root directory is computed with <code>servletContext.getRealPath("/")</code>.
	 * With non-exploded WAR, root directory  is computed with <code>caller.getClass().getResource("").getFile()</code>.
	 * @param caller			(Object) Instance calling the static method getRealPath
	 * @param servletContext	(ServletContext) Servlet Context
	 * @param path 				(String) path of the resource
	 * @return (String) the resources path of the resource at 'path'.
	 */
	static public String getRealPath(Object caller, ServletContext servletContext, String path) {		
		// Try to compute the real path from de Servlet Context
		String rootDir = (servletContext != null)?servletContext.getRealPath("/"):null;
				
		if (flagSimulateNonExplodedWar || rootDir == null) {
			// Mode "non-exploded war"
			// was root dir already computed ?
			if (webRootSystemPath == null) { // No, do it now.
				rootDir =   URLUtils.convertRealPath(caller.getClass().getResource("").getFile(), "/");
				webRootSystemPath = rootDir;
			} else { // yes
				rootDir = webRootSystemPath;
			}
		}

		return rootDir + path;
	}

	
	
	/**
	 * Convert web path of a resource into a file system web path.
	 * @param resourcePath Path of a resource contained into WEB-INF directory of a Web-Application.<br>
	 * 			This web path will be used as a reference to determine the file system path of the server.
	 * @param webPath file path of the web root (should contains "/WEB-IN") !
	 * @return (String) A file system path
	 */
	public static String convertRealPath(String resourcePath, String webPath) {

		String resourcePathEdit = null;
		if (resourcePath != null && resourcePath.length() > 0) {
			resourcePathEdit = resourcePath;
			int endIndex = resourcePathEdit.indexOf("/WEB-INF");

			if (endIndex > 0) {
				resourcePathEdit = resourcePathEdit.substring(0, endIndex);
			} else {
				return null;
			}

			if (webPath != null) {
				resourcePathEdit += webPath;
			}

			if (resourcePathEdit.startsWith("file:")) {
				resourcePathEdit = resourcePathEdit.substring(6);
			}
		}
		
		webRootSystemPath = resourcePathEdit;
		
		return resourcePathEdit;
	}
	
	/**
	 * Return the jjar name containing the resource linked byt the URL.
	 * return null if no Jar.
	 * @param url
	 * @return
	 */
	public static String extractJarNameFromUrl(URL url) {
		final String START = "/";
		final String END = ".jar!";
		String file = url.getFile();
		
		int endJar = file.indexOf(END);
		if (endJar < 0) return null;
		
		file = file.substring(0, endJar + END.length() - 1);
		int startJar = file.lastIndexOf(START);
		if (startJar < 0) return null;
		file = file.substring(startJar + START.length());
		return file;
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
	
	/**
	 * return the URL of a resource from web.
	 * @param resourcePath
	 * @return
	 * @throws MalformedURLException 
	 */
	public static URL getWebUrlResource(String wwwPath) throws MalformedURLException {
		// Begin of JUNIT Bridge
		if (MOCK_WEB_URL != null && wwwPath != null && wwwPath.startsWith(MOCK_WEB_URL)) {
			LOG.warn("JUnit MOCK_WEB_URL parameter has been activated with value :" + MOCK_WEB_URL + ".");
			LOG.warn("Method getWebUrlResource(String wwwPath) will return a mock response value .");
			String mockPath = wwwPath.substring(MOCK_WEB_URL.length());
			LOG.debug("Mock response value : " + mockPath);
			return getClassPathUrlResource(mockPath);
		}
		// End of JUNIT Bridge
		
		return new URL(wwwPath);
	}
	
}
