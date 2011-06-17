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
package com.ideo.jso.conf;

import java.net.URL;
import java.util.HashMap;
import java.util.Map;

import javax.naming.InitialContext;
import javax.naming.NamingException;

import org.apache.log4j.Logger;
import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.DefaultHandler;

public class JSODefaultHandler extends DefaultHandler  {

	final Map listGroups;

	private final static Logger LOG = Logger.getLogger(JSODefaultHandler.class); 

	private static String JNDI_URL_KEY="jndi:"; 
	private static String ENV_URL_KEY="env:"; 
	
	// JSO Element names
	/**
	 * XML element for group declaration.<br>
	 * <code>group</code>
	 */
	private static final String GROUP_EL = "group";
	/**
	 * XML element for default parameter declaration.<br>
	 * <code>default</code>
	 */
	private static final String DEFAULT_EL = "default";
	/**
	 * XML element for sub-group declaration.<br>
	 * <code>group-ref</code>
	 */
	private static final String GROUP_REF_EL = "group-ref";
	/**
	 * XML element for js file declaration.<br>
	 * <code>js</code>
	 */
	private static final String JS_EL = "js";
	/**
	 * XML element for css file declaration.<br>
	 * <code>css</code>
	 */
	private static final String CSS_EL = "css";
	
	// Element Group Attributes
	private static final String NAME_ATTR = "name";
	private static final String MINIMIZE_ATTR = "minimize";
	private static final String MINIMIZECSS_ATTR = "minimizeCss";
	private static final String RETENTION_ATTR = "retention";
	private static final String LOCATION_ATTR = "location";
	private static final String CONFLICT_ATTR = "conflictRule";
	private static final String TIMESTAMP_ATTR = "timeStampPolicy";
		
	// Element Default Attributes
	private static final String KEY_ATTR = "key";
	private static final String VALUE_ATTR = "value";

    private Group currentGroup = null;
    private StringBuffer tagContent;
    private HashMap jndiValues; // Store retrieved JNDI value 
    private HashMap defaultValues; // 
    
	public JSODefaultHandler() {
		listGroups = new HashMap();
		tagContent = new StringBuffer();
		jndiValues = new HashMap(); 
		defaultValues = new HashMap(); 
	}
	
    
    public Map getListGroups() {
    	return listGroups;
    }

    
    public Map getDefaultValues() {
    	return defaultValues;
    }

    /**
     * Assert the value of Conflict Rule is correct.
     * @param Conflict Rule value Value to be tested
     * @param origine Origin (Group / default element) from which the Conflict Rule come (for information purpose).
     * @throws SAXException Thrown if Conflict Rule isn't correct
     */    
    protected void assertConflictRule(String value, String origin) throws SAXException {
		if (	!Group.CONFLICTRULE_APPEND.equals(value) 
				&& !Group.CONFLICTRULE_OVERRIDE.equals(value) ) {
			throw new SAXException("ConflictRule value '" + value +"' from " + origin + " is not valide." +
									"Accepted values : " + Group.CONFLICTRULE_OVERRIDE +"," 
									+ Group.CONFLICTRULE_APPEND );
		}    	
    }
    
    /**
     * Assert the value of Timestamp Policy is correct.
     * @param Timestamp Policy value Value to be tested
     * @param origine Origin (Group / default element) from which the timestamp policy come (for information purpose).
     * @throws SAXException Thrown if Timestamp Policy isn't correct
     */
    protected void assertTimeStampPolicy(String value, String origine) throws SAXException {
		if (	!Group.TIMESTAMP_ALL.equals(value) 
				&& !Group.TIMESTAMP_LOCAL.equals(value)
				&& !Group.TIMESTAMP_NONE.equals(value)) {
			throw new SAXException("TimeStampPolicy value '" + value +"' from " + origine + " is not valide." +
									"Accepted values : " + Group.TIMESTAMP_ALL + "," 
									+ Group.TIMESTAMP_LOCAL + "," + Group.TIMESTAMP_NONE);
		}    	
    }
    
    /**
     * @see DefaultHandler#startElement(String, String, String, Attributes)
     */
    public void startElement(String uri, String localName, String qName, Attributes attributes) throws SAXException {
    	if (DEFAULT_EL.equals(qName)) {
    		String key = getStringParam(attributes,KEY_ATTR);
    		String value = getStringParam(attributes,VALUE_ATTR);

    		if (LOCATION_ATTR.equals(key)) {
                LOG.debug("Default Location : " + value);
                value = getLocationAttribute(value);
    		} else if (CONFLICT_ATTR.equals(key)) {
    			assertConflictRule(value, "Default");
                LOG.debug("Default Conflict Rule : " + value);
    		} else if (TIMESTAMP_ATTR.equals(key)) {
    			assertTimeStampPolicy(value, "Default");
                LOG.debug("Default Timestamp Policy : " + value);
    		} else {
    			throw new SAXException ("Unknown key for tag Default : " + key);
    		}
    		
    		defaultValues.put(key, value);
    		
    	} else if ("group".equals(qName)) {
        	
    		this.currentGroup = null;
    		String name = getStringParam(attributes, NAME_ATTR);
            String conflictRule = getStringParam(attributes,CONFLICT_ATTR);
  
			// Group already defined ?
			this.currentGroup = (Group) listGroups.get(name);							

										
			if (currentGroup == null) {
				currentGroup = new Group(name);
				LOG.debug("Group " + name + " will be created.");
			} else if (shouldResetGroup(currentGroup, conflictRule)) {
				currentGroup.reset();
				LOG.debug("Group " + name + " will be overrided by a new configuration.");
			} else {
				LOG.debug("Group " + name + " will be updated with a new configuration.");
			}

        	
		    Boolean minimizeJs = getBooleanAttribute(attributes, MINIMIZE_ATTR);
		    Boolean minimizeCss = getBooleanAttribute(attributes, MINIMIZECSS_ATTR);
		    Boolean retention = getBooleanAttribute(attributes, RETENTION_ATTR);
            String timeStampPolicy = getStringParam(attributes,TIMESTAMP_ATTR);

            
    		if (timeStampPolicy != null) {
    			assertTimeStampPolicy(timeStampPolicy, "group " + name);
    		}
    		if (conflictRule != null) {
    			assertConflictRule(conflictRule, "group " + name);
    		}
            
            if (minimizeJs != null) currentGroup.setMinimize(minimizeJs);  // default: true
            if (minimizeCss != null) currentGroup.setMinimizeCss(minimizeCss); // default false
            if (retention != null) currentGroup.setRetention(Boolean.TRUE.equals(retention)); // default false
            if (timeStampPolicy != null) currentGroup.setTimeStampPolicy(timeStampPolicy); // default "local"
            if (conflictRule != null) currentGroup.setConflictRule(conflictRule);
            
            String newLocation = getLocationAttribute(getStringParam(attributes,LOCATION_ATTR));
            String previousLocation = currentGroup.getLocation();
            // Manage location conflict
            if (previousLocation!=null) {
            	if (newLocation != null && !previousLocation.equals(newLocation)) {
            		// location conflict.
            		// Warning on the situation, but continue processing
            		String errMsg = "Location conflict for group " + name + ".\n" +
            						"A same group is defined in different jso config file with different location.\n" +
            						"Locations of same group should be null or equals! \n" + 
            						"New location attribute '" + newLocation + 
            						"' is in conflict with previous Location '" + previousLocation +"'.";
            		LOG.warn(errMsg);
            	} 

            }
            
            if (newLocation != null) currentGroup.setLocation(newLocation);
            
        } else if (JS_EL.equals(qName) || CSS_EL.equals(qName) || GROUP_REF_EL.equals(qName)) {
            tagContent.setLength(0);
        }
    }
    
    /**
     * Return a Boolean value of an element attribute.
     * @param attributes
     * @param key
     * @return Boolean value of an element attribute
     */
    protected Boolean getBooleanAttribute(Attributes attributes, String key) {
     	String value = attributes.getValue(key);
    	return (value == null)?null:Boolean.valueOf(value);
    }
    
    /**
     * Return a String value of an element attribute.
     * @param attributes
     * @param key
     * @return String value of an element attribute
     */
    protected String getStringParam(Attributes attributes, String key) {
     	String value = attributes.getValue(key);
     	if (value == null || value.trim().equals("")) {
     		return null;
     	}
    	return value;
    }
    
    
    /**
     * Return true|false if a group, dependant on conflictRule should be reseted.
     * @param loadedGroup
     * @param newConflictRule
     * @return boolean. True if actual group instance should be reseted
     */
    protected boolean shouldResetGroup(Group loadedGroup, String newConflictRule)  {
    	if (loadedGroup == null) {
    		return true;
    	}
    	
    	// If actual Conflict Rule is CONFLICTRULE_OVERRIDE or CONFLICTRULE_FIRST
    	// Then discard previous configuration.
    	if (Group.CONFLICTRULE_OVERRIDE.equals(newConflictRule)) {
    		return true;
    	}

    	if (Group.CONFLICTRULE_APPEND.equals(newConflictRule)) {
    		return false;
    	}
    	
    	if (Group.CONFLICTRULE_OVERRIDE.equals(getGroupOrDefaultConflictcRule(loadedGroup))) {
    		return true;
    	}

		
    	return false;
    }
    

    /**
     * Return either the conflictRule attribute value of the group or the conflictRule of default parameters
     * @param loadedGroup
     * @return
     */
    protected String getGroupOrDefaultConflictcRule(Group loadedGroup) {
    	
    	String loadedGroupConflictRule = (loadedGroup == null)?null:loadedGroup.getConflictRule();
    	
    	if (loadedGroupConflictRule != null) {
    		return loadedGroupConflictRule;
    	}
    	
		String defaultConflictRule = (defaultValues.containsKey(CONFLICT_ATTR))
										?(String)defaultValues.get(CONFLICT_ATTR)
										:Group.CONFLICTRULE_OVERRIDE; // default value 
		return defaultConflictRule;

    }

    
    /**
     * @see DefaultHandler#characters(char[], int, int)
     */
    public void characters(char ch[], int start, int length) throws SAXException {
        tagContent.append(ch, start, length);
        
    }

    
    /**
     * @see DefaultHandler#endElement(String, String, String)
     */
    public void endElement(String uri, String localName, String qName) throws SAXException {
    	if (currentGroup == null) {
    		// No group defined (could be in conflict rule 'freeze' case)
    		return;
    	}
        if (GROUP_EL.equals(qName)) {
        	LOG.debug("Adding group " + currentGroup.getName() + " to configuration.");
        	listGroups.put(currentGroup.getName(), currentGroup);
        } else if ("js".equals(qName)) {
        	LOG.debug("Adding js file " + tagContent.toString() + " to group " + currentGroup.getName());
        	currentGroup.getJsNames().add(tagContent.toString());
        } else if (CSS_EL.equals(qName)) {
        	LOG.debug("Adding css file " + tagContent.toString() + " to group " + currentGroup.getName());
        	currentGroup.getCssNames().add(tagContent.toString());       	
        } else if (GROUP_REF_EL.equals(qName)) {
            String name = tagContent.toString();
            Group subGroup = (Group) listGroups.get(name);
            if (subGroup == null)
                throw new SAXException("Error parsing " + uri.toString() + 
                						" <group-ref>" + name + "</group-ref> is unknown!");
                        
            // If sub-group already exists two situations
            // 1) The reference to instance is the same (conflict rule is 'append' or 'freeze')
            // 2) The reference is different then this new object must override previous one  (conflict rule is 'append' or 'freeze')
            // TODO GERER CES CAS LA.
         
        	LOG.debug("Adding group " + subGroup.getName() + " to group " + currentGroup.getName());
            currentGroup.getSubgroups().add(subGroup);
        }
    }
    
	/**
	 * Return the resources location stored either directly or with JNDI or in the environment
	 * @param attributeValue The attribute value
	 * @return The path to the resources
	 */
	private String getLocationAttribute(String attributeValue) {
		String value = attributeValue;
		if(attributeValue != null){
			if (attributeValue.indexOf(JNDI_URL_KEY) >= 0) {
				if (jndiValues.containsKey(attributeValue)) {
					value = (String) jndiValues.get(attributeValue);
				} else {
					try {
						InitialContext ctx = new InitialContext();
						String jndiName = attributeValue.substring(attributeValue.indexOf(JNDI_URL_KEY)
								+ JNDI_URL_KEY.length());
		
						URL realLocation = (URL) ctx.lookup(jndiName);
						if (realLocation == null)
							LOG.error("Cannot retrieve JNDI variable " + attributeValue);
  						value = realLocation.toExternalForm();
						jndiValues.put(attributeValue, value);
						
						
					} catch (NamingException e) {
						LOG.error("Cannot retrieve JNDI variable " + attributeValue, e);
					}
				}
			}
			else if(attributeValue.indexOf(ENV_URL_KEY) >= 0) { 
                String envName = attributeValue.substring(attributeValue.indexOf(ENV_URL_KEY) + ENV_URL_KEY.length()); 
                String realLocation = System.getProperty(envName); 
                if (realLocation == null) LOG.error("Cannot retrieve environment variable " + attributeValue); 
                value = realLocation; 
			}
		}

		return value;
	}
	
	
	
}
