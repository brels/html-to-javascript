function htmlToJavascript(element, variableNamesFromId, keepScripts, keepInlineEvents, keepInlineStyle)
{
    let counter=0;
    let nativeProto = Object.getPrototypeOf(htmlToJavascript);
    let textHolder="";

    function __htmlToJavascript(root, rootname, child)
    {
        let attr = child.attributes;
        let oldChildName;
        let newChildName;
        let idRegex = /^[a-z0-9_$]+$/gi;
    
        if (!keepScripts && (child.tagName=="SCRIPT")) return;

        let useID = (
            variableNamesFromId && 
            ("id" in child) && child.id.match(idRegex) && 
            (Object.getPrototypeOf(window[child.id])==
            Object.getPrototypeOf(document.getElementById(child.id)))
        );

        newChildName = useID?child.id:"new" + child.constructor.name + counter++;

        if (child==document.body)
        {
            textHolder+="let " + newChildName+"=document.body;\n";
        }
        else
        {
            if (child.tagName)
                textHolder+="let " + newChildName + "=document.createElement(\"" + child.tagName.toLowerCase() + "\");\n";
            else
                textHolder+="let " + newChildName + "=document.createTextNode(" + JSON.stringify(child.data) + ");\n";
        }

        if (root) 
            textHolder+=rootname + ".append(" + newChildName +");\n";

        if (attr)
        {
            Array.from(attr).forEach(attribute=>
            {
                let eventName = attribute.name.replace(/^on/, "");
                let isEvent = child[eventName] && Object.getPrototypeOf(child[eventName])==nativeProto;
                let isStyle = (attribute.name=="style") && (Object.getPrototypeOf(child.style) == CSSStyleDeclaration.prototype);
                let finalName = attribute.name;
                if (finalName=="class") finalName="className"; // OH JAVASCRIPT
                if (finalName=="for") finalName="htmlFor"; // OH JAVASCRIPT

                if (!isEvent && !isStyle && finalName.match(idRegex))
                {
                    textHolder+=newChildName + "." + finalName + "=" + JSON.stringify(attribute.value) + ";\n";
                }
                else
                    if ((!isEvent || keepInlineEvents) && (!isStyle || keepInlineStyle))
                    {
                        textHolder+=newChildName + "[\"" + finalName + "\"]=" + JSON.stringify(attribute.value) + ";\n";
                    }
                    else
                    {
                        if (isEvent)
                        {
                            let handlerName = finalName + counter++;
                            textHolder+="function " + handlerName + "(event) { " + attribute.value + " }\n";
                            textHolder+=newChildName+".addEventListener(\"" + eventName + "\", event => { " + handlerName + "(event); });\n";
                        }
                        else if (isStyle)
                        {
                            Array.from(child.style).forEach(substyle=>
                            {
                                let variableSubName = substyle.match(idRegex);
                                let setter=substyle.replace(/[\-]+(.)/g, (m,p)=>{ if (p) return p.toUpperCase(); else return m;});
                                setter = (child.style[setter])?("."+setter):"[\""+substyle+"\"]";
                                textHolder+=newChildName+".style"+setter+"="+JSON.stringify(child.style[substyle])+";\n";
                            });
                        }
                    }
            }) ;
            Array.from(child.childNodes).forEach
            (subChild=>{
                __htmlToJavascript(child, newChildName, subChild);
            });
        }
    }

    __htmlToJavascript(null, null, element);

    return textHolder;
}

