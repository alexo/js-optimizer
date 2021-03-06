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


public class IncluderFactory {
	private static IncluderFactory instance = new IncluderFactory();
	
	private IIncluder includers[];
	
	public static synchronized IncluderFactory getInstance(){
		if(instance == null)
			instance = new IncluderFactory();
		return instance;
	}
	
	private IncluderFactory() {
		includers = new IIncluder[3];
		includers[IIncluder.EXPLODED] = new ExplodedIncluder();
		includers[IIncluder.BUFFER] = new BufferIncluder();
		includers[IIncluder.RETENTION] = new RetentionIncluder();
	}
	
	public IIncluder getIncluder(int iincluder){
		if(iincluder<0 || iincluder>includers.length)
			throw new IllegalArgumentException("Bad includer requested. Check for IIncluder class properties.");
		return includers[iincluder];
	}
}
