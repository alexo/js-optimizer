package com.ideo.jso.junit.minimize;

import java.io.ByteArrayOutputStream;

import com.ideo.jso.conf.AbstractGroupBuilder;
import com.ideo.jso.conf.Group;
import com.ideo.jso.junit.JSOUnit;

public class JSOMergeUnit extends JSOUnit {
	protected void checkMergedJSFiles(Group group, String testFile, String encoding) throws Exception{
		
		// Recuperation du fichier minimize
		
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		AbstractGroupBuilder agb = AbstractGroupBuilder.getInstance();
		agb.buildGroupJsIfNeeded(group, baos, null);

		baos.flush();
		baos.close();
		
		testFile = "com/ideo/jso/junit/minimize/" + testFile;
		String testMerged = getFileContentAsString(testFile, encoding);
		
		System.out.println("---File " + testFile + ":");
		System.out.println(testMerged);
		System.out.println("--- Group " + group.getName() + ":" );
		System.out.println(baos.toString(encoding));
		System.out.println("---");
		
		
		assertEquals(manageUnixWindowNewLine(testMerged), manageUnixWindowNewLine(baos.toString(encoding)));

	}
	
	
	protected void checkMergedJSFiles(String generatedFile, String testFile, String encoding) throws Exception{
		
		// Recuperation du fichier minimize
		String generatedMerged = getFileContentAsString(generatedFile, encoding);
		testFile = "com/ideo/jso/junit/minimize/" + testFile;
		String testMerged = getFileContentAsString(testFile, encoding);
		
		System.out.println("---File " + testFile + ":");
		System.out.println(testMerged);
		System.out.println("--- File " + generatedFile + ":" );
		System.out.println(generatedMerged);
		System.out.println("---");
		
		
		assertEquals(manageUnixWindowNewLine(testMerged), manageUnixWindowNewLine(generatedMerged));

	}
	
	protected String manageUnixWindowNewLine(String text) {
		return text.replaceAll("\r\n", "\n");
	}

}
