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
package com.ideo.jso;

/**
 * Bufferizes data computed by a group at a specific timestamp  
 * @author Julien Maupoux
 *
 */
public class ResourcesBuffer {
	private byte[] data;
	private long timestamp = -1;
	
	public ResourcesBuffer(){
		clean();
	}
	
	/**
	 * Updates this buffer's data for a timestamp
	 * @param data
	 * @param timestamp
	 */
	public void update(byte[] data, long timestamp) {
		this.data = data;
		this.timestamp = timestamp;
	}
	/**
	 * Clean this buffer's data, because of an out-of-dating for example
	 */
	public void clean(){
		data = null;
		timestamp = -1;
	}
	
	public byte[] getData() {
		return data;
	}
	public long getTimestamp() {
		return timestamp;
	}
}
