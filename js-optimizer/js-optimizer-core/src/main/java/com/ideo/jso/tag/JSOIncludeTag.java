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

package com.ideo.jso.tag;

import java.io.IOException;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.jsp.JspException;
import javax.servlet.jsp.JspWriter;
import javax.servlet.jsp.tagext.Tag;
import javax.servlet.jsp.tagext.TagSupport;


/**
 * JSP Tag class
 * @author Julien Maupoux
 *
 */
public class JSOIncludeTag extends TagSupport {
	private static final long serialVersionUID = 7376491819777043496L;

	private String groupNames;
    private boolean exploded;
    private static final String COOKIE_KEY = "jso.exploded";

    public String getGroupNames() {
        return groupNames;
    }

    public void setGroupNames(String groupNames) {
        this.groupNames = groupNames;
    }

    public boolean isExploded() {
        return exploded;
    }

    public void setExploded(boolean exploded) {
        this.exploded = exploded;
    }

    public int doStartTag() throws JspException {
    	// output writer
        JspWriter out = pageContext.getOut();
        try {
            HttpServletRequest request = (HttpServletRequest) pageContext.getRequest();
            Cookie[] cookies = request.getCookies();
            boolean debugCookie = false;
            if(!isExploded()){
	            for (int i = 0; cookies != null && i < cookies.length; i++) {
	                if (COOKIE_KEY.equals(cookies[i].getName()) && "true".equals(cookies[i].getValue())){
	                    debugCookie = true;
	                    break;
	                }
	            }
            }
            
            // writes the HTML import tag
            InclusionController.getInstance().
                    printImports(pageContext, out, getGroupNames(), isExploded() || debugCookie);            
            
        } catch (IOException e) {
            throw new JspException(e);
        }
        return Tag.EVAL_PAGE;
    }
}
