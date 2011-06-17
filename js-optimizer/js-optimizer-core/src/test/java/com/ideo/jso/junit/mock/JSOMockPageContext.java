package com.ideo.jso.junit.mock;

import javax.servlet.ServletConfig;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts.mock.MockPageContext;

public class JSOMockPageContext extends MockPageContext {

	public JSOMockPageContext(ServletConfig config, HttpServletRequest request, HttpServletResponse response) {
		super(config, request, response);
		// TODO Auto-generated constructor stub
	}

}
