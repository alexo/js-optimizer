package com.ideo.jso.junit.confLoad;

import com.ideo.jso.conf.JarRestrictionManager;
import com.ideo.jso.junit.JSOUnit;

public class TestJarExclusion extends JSOUnit {

	public void testJarAllowed() {
		JarRestrictionManager jr = JarRestrictionManager.getInstance();
		jr.setCsvList("jarfile1.jar,jarfile2.jar,jarfile3.jar");
		assertTrue("jarfile1 allowed",  jr.isJarAllowed("jarfile1.jar"));
		assertTrue("jarfile2 allowed",  jr.isJarAllowed("jarfile2.jar"));
		assertTrue("jarfile3 allowed",  jr.isJarAllowed("jarfile3.jar"));
		assertFalse("jarfile4 allowed",  jr.isJarAllowed("jarfile4.jar"));
		
		jr.setCsvList(" jarfile1.jar,    jarfile2.jar,  jarfile3.jar    ");
		assertTrue("jarfile1 allowed",  jr.isJarAllowed("jarfile1.jar"));
		assertTrue("jarfile2 allowed",  jr.isJarAllowed("jarfile2.jar"));
		assertTrue("jarfile3 allowed",  jr.isJarAllowed("jarfile3.jar"));
		assertFalse("jarfile4 allowed",  jr.isJarAllowed("jarfile4.jar"));
		
		jr.setCsvList("   jarfile1.jar    ,  jarfile2.jar,   \njarfile3.jar   ");
		assertTrue("jarfile1 allowed",  jr.isJarAllowed("jarfile1.jar"));
		assertTrue("jarfile2 allowed",  jr.isJarAllowed("jarfile2.jar"));
		assertTrue("jarfile3 allowed",  jr.isJarAllowed("jarfile3.jar"));
		assertFalse("jarfile4 allowed",  jr.isJarAllowed("jarfile4.jar"));
	}




	public void testJarAllowedAll() {
		JarRestrictionManager jr = JarRestrictionManager.getInstance();
		jr.setCsvList("*");
		assertTrue("jarfile1 allowed",  jr.isJarAllowed("jarfile1.jar"));
		assertTrue("jarfile2 allowed",  jr.isJarAllowed("jarfile2.jar"));
		assertTrue("jarfile3 allowed",  jr.isJarAllowed("jarfile3.jar"));
		
		jr.setCsvList("    *   ");
		assertTrue("jarfile1 allowed",  jr.isJarAllowed("jarfile1.jar"));
		assertTrue("jarfile2 allowed",  jr.isJarAllowed("jarfile2.jar"));
		assertTrue("jarfile3 allowed",  jr.isJarAllowed("jarfile3.jar"));
				

	}
	
	
	
	
}
