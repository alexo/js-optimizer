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

import javax.servlet.http.HttpServletRequest;
import javax.servlet.jsp.PageContext;

import com.ideo.jso.conf.Group;
import com.ideo.jso.servlet.JsoServlet;
import com.ideo.jso.util.URLUtils;

/**
 * Include the tags that will get their data into the server buffer.
 * 
 * @author Julien Maupoux
 *
 */
class BufferIncluder implements IIncluder{
	public void includeJs(Group group, Writer out, PageContext pageContext) throws IOException{
		String groupLocation = group.getBestLocation(null);
		if (groupLocation == null) { 
			// Define by default
			groupLocation = ((HttpServletRequest)pageContext.getRequest()).getContextPath();
		}
		String groupTSPolicy = group.getBestTimestampPolicy(null);
		
		String src = URLUtils.concatUrlWithSlaches(groupLocation, "jso", group.getName()) + ".js";
		
		if (!Group.TIMESTAMP_NONE.equals(groupTSPolicy)) {
			long maxJSTimestamp = group.computeMaxJSTimestamp(pageContext.getServletContext());
			if (maxJSTimestamp > 0) {
				src = URLUtils.addParamToUrl(src, JsoServlet.TIMESTAMP, Long.toString(maxJSTimestamp));
			}
		}
		out.write(JS_BEGIN_TAG + src +JS_END_TAG + "\n");
	}
	
	public void includeCss(Group group, Writer out, PageContext pageContext) throws IOException {
		throw new IOException("Can keep CSS in buffer as the background:url() is not managed yet.");
	}
}
