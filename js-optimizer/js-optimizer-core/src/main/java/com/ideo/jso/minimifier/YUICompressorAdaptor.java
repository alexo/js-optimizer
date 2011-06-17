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
package com.ideo.jso.minimifier;

import java.io.IOException;
import java.io.Reader;
import java.io.StringWriter;

import org.apache.log4j.Logger;
import org.mozilla.javascript.ErrorReporter;
import org.mozilla.javascript.EvaluatorException;

import com.yahoo.platform.yui.compressor.CssCompressor;
import com.yahoo.platform.yui.compressor.JavaScriptCompressor;

public class YUICompressorAdaptor {
	//adds a line break after X chars
	private final static int LINE_BREAK_POS = 1000;
	private static final Logger log = Logger.getLogger(YUICompressorAdaptor.class);

	public static String compressCSS(Reader in) throws IOException{
		CssCompressor compressor = new CssCompressor(in);
		StringWriter out = new StringWriter();
		compressor.compress(out, LINE_BREAK_POS);
		return out.toString();
	}
	public static String compressJS(Reader in) throws IOException{
		StringWriter out = new StringWriter();
		try {
			JavaScriptCompressor compressor = new JavaScriptCompressor(in, new ErrorReporter() {
				public void warning(String message, String sourceName,
						int line, String lineSource, int lineOffset) {
					log.warn("[JAVASCRIPT COMPRESSOR WARN] in file : "+sourceName+"\n"+message+"\n"+line+":"+lineOffset);
				}

				public void error(String message, String sourceName,
						int line, String lineSource, int lineOffset) {
					log.warn("[JAVASCRIPT COMPRESSOR ERROR] in file : "+sourceName+"\nLine : "+lineSource+"\n"+message+"\n"+line+":"+lineOffset);
				}

				public EvaluatorException runtimeError(String message, String sourceName,
						int line, String lineSource, int lineOffset) {
					error(message, sourceName, line, lineSource, lineOffset);
					return new EvaluatorException(message);
				}
			});

			compressor.compress(out, LINE_BREAK_POS, true, true,
					true, true);

		} catch (EvaluatorException e) {
			e.printStackTrace();
		}
		return out.toString();
	}
}