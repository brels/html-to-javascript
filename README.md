# html-to-javascript

A simple function to rebuild a DOM element purely in JavaScript. In other words, an 
HTML-to-JavaScript converter.

# Limitations:
	
* Page must be loaded with javascript disabled.
* The topmost element currently accepted is document.body
* Converts all attributes to string.
* Global counter variable shared among different types of elements.
* Creates event listeners by just stripping the initial "on" from the attribute name.
* Uses a best effort approach to convert style names (for example: "font-size" to "fontSize").

# Sample usage:

Given the following static page:

	<html><head>
		<title>Test</title>
	</head>
	<body>
		<h1>Header</h1>
		<button id="button" style="color: red" onclick="alert(&quot;Test&quot;);">Test</button>
	</body></html>

Running this javascript on the console or a webview:

	htmlToJavascript(document.body, variableNamesFromId=true, keepScripts=false, keepInlineEvents=false, keepInlineStyle=false);

Will return the following string containing javascript that will rebuild the page:

	let newHTMLBodyElement0=document.body;
	let newText1=document.createTextNode("\n\t");
	newHTMLBodyElement0.append(newText1);
	let newHTMLHeadingElement2=document.createElement("h1");
	newHTMLBodyElement0.append(newHTMLHeadingElement2);
	let newText3=document.createTextNode("Header");
	newHTMLHeadingElement2.append(newText3);
	let newText4=document.createTextNode("\n\t");
	newHTMLBodyElement0.append(newText4);
	let button=document.createElement("button");
	newHTMLBodyElement0.append(button);
	button.id="button";
	button.style.color="red";
	function onclick5(event) { alert("Test"); }
	button.addEventListener("click", event => { onclick5(event); });
	let newText6=document.createTextNode("Test");
	button.append(newText6);
	let newText7=document.createTextNode("\n");
	newHTMLBodyElement0.append(newText7);

Running this script on an empty page will render:

	<html><head></head><body>
		<h1>Header</h1>
		<button id="button" style="color: red;">Test</button>
	</body></html>
	

The inline event handler was converted to an event listener. Ideally, all the styling should be
done with CSS classes.
