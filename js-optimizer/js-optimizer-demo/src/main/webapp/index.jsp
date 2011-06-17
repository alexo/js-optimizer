<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@ taglib uri="http://js-optimizer.sourceforge.net/" prefix="jso" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Insert title here</title>
</head>
<body>

<center><h2>The purpose of this page is to show some features provided by JavaScript Optimizer.</h2></center><hr/><br/>
To show how faster is the resources providing with JavaScript Optimizer, 3 kinds of resources inclusion have been written. <br/>You can test them and compare the results, the performances are twice better.
<br/>
<ul>
<li>
<a href="exploded.jsp">Include as exploded mode</a> : all files are included the basic way, one import per file.
</li>
<li>
<a href="complete.jsp">Include as concatenated mode</a> : all files are concatenated into a single one, without modification.
</li>
<li>
<a href="minimized.jsp">Include as minimized concatenated mode</a> : all files are concatenated into a single one, and the resulting content is minimized.
</li>
</ul>
<br/><hr/><br/>
An other feature is the debugging mode. Go to <a href="debugging.jsp">this page</a> and follow the instructions to have an overview of how it works.
<br/><hr/><br/>
<center><a href="http://www.javascript-optimizer.com">Back to <b>JavaScript Optimizer - JSO</b> web site.</a></center>
</body>
</html>