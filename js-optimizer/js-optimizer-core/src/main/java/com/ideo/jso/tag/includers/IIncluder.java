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

import javax.servlet.jsp.PageContext;

import com.ideo.jso.conf.Group;

/**
 * This interface is a contract to implement for every HTML tag includer
 *  
 * @author Julien Maupoux
 *
 */
public interface IIncluder {
	public final static int EXPLODED = 0;
	public final static int BUFFER = 1;
	public final static int RETENTION = 2;
	public static final String JS_BEGIN_TAG = "<script type=\"text/javascript\" src=\"";
	public static final String JS_END_TAG = "\"></script>";
	public static final String CSS_BEGIN_TAG = "<link rel=\"stylesheet\" type=\"text/css\" href=\"";
	public static final String CSS_END_TAG = "\"/>";
	
	/**
	 * Include the JavaScript resources for a group, writing the HTML tags into out, according to the pageContext.
	 * @param group the group to include
	 * @param out the out writer
	 * @param pageContext the current pageContext to write the tags for
	 * @throws IOException
	 */
	public void includeJs(Group group, Writer out, PageContext pageContext) throws IOException;
	
	/**
	 * Include the CSS resources for a group, writing the HTML tags into out, according to the pageContext.
	 * @param group the group to include
	 * @param out the out writer
	 * @param pageContext the current pageContext to write the tags for
	 * @throws IOException
	 */
	public void includeCss(Group group, Writer out, PageContext pageContext) throws IOException;
}
