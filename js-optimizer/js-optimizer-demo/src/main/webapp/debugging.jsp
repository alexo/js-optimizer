<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@ taglib uri="http://js-optimizer.sourceforge.net/" prefix="jso" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Insert title here</title>
<jso:include exploded="false" groupNames="demo-full-complete"></jso:include>
</head>
<body>

This page includes the scripts as complete mode by default. By the way, if a problem occurs, you can easily switch as exploded mode to debug without modifying the jsp.<br/>
To proceed, enter the following line into your browser's url field :<br/>
<b><font color="red">javascript:alert(document.cookie="jso.exploded=true")</font></b><br/><br/>
Really easy. You can now reload the page and see that the script loading method has changed.<br/><br/>
It is obvious that to disable that debugging mode, the command is the same than the previous one, setting the cookie to false :<br/>
<b><font color="red">javascript:alert(document.cookie="jso.exploded=false")</font></b><br/> 
<br/>
<jsp:include page="/getScripts.html"></jsp:include>

</body>
</html>