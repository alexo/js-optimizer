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

package com.ideo.jso.filter;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Adds some data to resources to permits a more efficient caching on the user browser.
 * 
 * @author Julien Maupoux
 *
 */
public class BrowserCacheFilter implements Filter {

    private long lastExpiresCalculated = 0;
    private static final int EXPIRES_HEADER_PRECISION = 60*60*24*1000; // one day
    private String lastExpiresFormatted;

    public void init(FilterConfig filterConfig) throws ServletException {

    }

    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        String expiresFormatted = getExpiresFormatted();
        ((HttpServletResponse)servletResponse).addHeader("Expires", expiresFormatted);
        //TODO delete
        filterChain.doFilter(servletRequest, servletResponse);
        
        if(((HttpServletRequest)servletRequest).getRequestURI().endsWith(".gz")){
        	((HttpServletResponse)servletResponse).addHeader("content-encoding", "gzip");
        }
    }

    private String getExpiresFormatted() {
        long now = System.currentTimeMillis();
        if (lastExpiresCalculated + EXPIRES_HEADER_PRECISION > now)
            return lastExpiresFormatted;

        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("EEE, d MMM yyyy HH:mm:ss Z", java.util.Locale.ENGLISH);
        simpleDateFormat.setTimeZone(TimeZone.getTimeZone("GMT"));
        lastExpiresCalculated = now;
        lastExpiresFormatted = simpleDateFormat.format(new Date(System.currentTimeMillis() + 365L * 60 * 60 * 24 * 1000));
        return lastExpiresFormatted;
    }

    public void destroy() {

    }
}
