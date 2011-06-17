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
package com.ideo.jso.servlet;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Map;
import java.util.Properties;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;

import com.ideo.jso.conf.AbstractConfigurationLoader;
import com.ideo.jso.conf.AbstractGroupBuilder;
import com.ideo.jso.conf.Group;
import com.ideo.jso.util.URLUtils;
import com.ideo.jso.util.Initializer;
import com.ideo.jso.util.ResourcesBuffer;

/**
 * JSO Servlet handling request for resources for a specific timestamp.
 * 
 * @author Julien Maupoux
 *
 */
public class JsoServlet extends HttpServlet {
	private static final long serialVersionUID = 444281561398023573L;

	public final static String FILENAME_PARAM = "JSO_FILENAME";
	public final static String RETENTION_PARAM = "JSO_RETENTION";
	
	public final static String TIMESTAMP = "timestamp";
	private final static int OUT_BUFFER_SIZE = 1000; // Initialz size of outstream buffer.

	
	private ServletConfig servletConfig;
	private final static Logger LOG = Logger.getLogger(JsoServlet.class); 


	
	/**
	 * 
	 */
	public void init() throws ServletException {
		super.init();
	}
	
	/**
	 * @param config
	 */
	public void init(ServletConfig config) throws ServletException {
		servletConfig = config;
		
		Properties properties = new Properties();
		try {
			properties.load(Thread.currentThread().getContextClassLoader().getResourceAsStream("jso.properties"));
		} catch (IOException e) {
			LOG.error("Could not find a jso.properties file. JsoServlet Initialization failure!", e);
			throw new ServletException(e);
		}
		
		try {
			Initializer.initialize(properties, null, getRealPath(config));
		} catch (Exception e) {
			LOG.error("JsoServlet Initialisation failure!", e);
			throw new ServletException(e);
		}
	}

	// Retrieve server file system path
	private String getRealPath(ServletConfig config) {

		String realPath = URLUtils.getRealPath(this, config.getServletContext(), "");
		return realPath;
	}
	
	
	/**
	 * @return ServletConfig
	 */
	public ServletConfig getServletConfig() {
		return servletConfig;
	}


	/**
	 * @param req
	 * @param res
	 */
	public void service(ServletRequest req, ServletResponse res) throws ServletException, IOException {
		
		HttpServletRequest request = (HttpServletRequest) req;
		HttpServletResponse response = (HttpServletResponse) res;

		//timestamp requested
		String sTimeStamp = (String)req.getParameter(TIMESTAMP);
		long timestamp = (sTimeStamp!=null)?Long.parseLong(sTimeStamp):0;
		// file request info
		String fileName = URLUtils.getFileName(request.getPathInfo());
		String extension = URLUtils.getFileExtension(fileName);

		// filename requested is a minimized js file and its strict name correspond to a group name.
		String grpName = URLUtils.getStrictFileName(fileName);
		
		Map groups = AbstractConfigurationLoader.getInstance().getUpdatedGroups();
		
		Group group = (Group)groups.get(grpName);
		
		// Starting to build js-minimized
		if (group != null) {
			ByteArrayOutputStream bufferOut = new ByteArrayOutputStream(OUT_BUFFER_SIZE);
			try {
				if( AbstractGroupBuilder.getInstance().buildGroupJsIfNeeded(group, bufferOut, getServletContext()) ){
					group.getJsBuffer().update(bufferOut.toByteArray(), timestamp);
				}
				bufferOut.flush();
			} finally {
				bufferOut.close();
			}
		}
		
		// Add content-type to response flow
		response.setContentType(URLUtils.getMimeTypeByExtension(extension) + "; CHARSET=" + URLUtils.DEFAULT_ENCODING);
		
		ResourcesBuffer buffer = null;
		if(extension != null && extension.toLowerCase().equals("js"))
			buffer = group.getJsBuffer();
		else
			buffer = group.getCssBuffer();
		
		response.getOutputStream().write(buffer.getData(), 0, buffer.getData().length);
	}

	/**
	 * @return
	 */
	public String getServletInfo() {
		return null;
	}

	/**
	 * 
	 */
	public void destroy() {
	}




	

}