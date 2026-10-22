function parseHtmlContent(htmlContent,pwdValue){if(pwdValue===undefined)pwdValue="";var dataToUrlParams=function(dataStr){if(!dataStr)return"";var result="";var content=dataStr.replace(/^\{|\}$/g,"");var pairs=content.split(",");var i;var pair;var colonIndex;var key;var value;for(i=0;i<pairs.length;i++){pair=pairs[i].replace(/^\s+|\s+$/g,"");if(pair==="")continue;colonIndex=pair.indexOf(":");if(colonIndex===-1)continue;key=pair.substring(0,colonIndex).replace(/^\s+|\s+$/g,"");value=pair.substring(colonIndex+1).replace(/^\s+|\s+$/g,"");key=key.replace(/^[\'\"`]|[\'\"`]$/g,"");value=value.replace(/^[\'\"`]|[\'\"`]$/g,"");if(result!==""){result+="&";}
result+=key+"="+value;}
return result;};var extractVariables=function(html){var variables={};var match;var varPattern=/var\s+(\w+)\s*=\s*['"]([^'"]*)['"]/g;match=varPattern.exec(html);while(match!=null){if(!variables[match[1]]){variables[match[1]]=match[2];}
match=varPattern.exec(html);}
var numPattern=/var\s+(\w+)\s*=\s*(\d+)/g;match=numPattern.exec(html);while(match!=null){if(!variables[match[1]]){variables[match[1]]=match[2];}
match=numPattern.exec(html);}
var assignPattern=/(\w+)\s*=\s*(\d+)/g;match=assignPattern.exec(html);while(match!=null){if(!variables[match[1]]){variables[match[1]]=match[2];}
match=assignPattern.exec(html);}
var conditionalPattern=/dom_ajaxs\s*=\s*(\w+)/g;match=conditionalPattern.exec(html);while(match!=null){var value=match[1];if(!variables['dom_ajaxs']&&variables[value]){variables['dom_ajaxs']=variables[value];}
match=conditionalPattern.exec(html);}
if(variables['pgs']){variables['pg']=variables['pgs'];}
return variables;};var resolveData=function(dataStr,variables){if(!dataStr)return null;var Data=dataStr;var varNames=[];var key;var i;var varName;var varValue;var regex;if(pwdValue!==undefined&&pwdValue!==''){Data=Data.replace(/'pwd'\s*:\s*'pwd'/g,"'pwd':'"+pwdValue+"'");Data=Data.replace(/'p'\s*:\s*'p'/g,"'p':'"+pwdValue+"'");Data=Data.replace(/'pwd'\s*:\s*pwd(\s|,|})/g,"'pwd':'"+pwdValue+"'$1");Data=Data.replace(/'pwd'\s*:\s*pwd$/g,"'pwd':'"+pwdValue+"'");Data=Data.replace(/'p'\s*:\s*pwd(\s|,|})/g,"'p':'"+pwdValue+"'$1");Data=Data.replace(/'p'\s*:\s*pwd$/g,"'p':'"+pwdValue+"'");}else{Data=Data.replace(/'pwd'\s*:\s*'pwd'/g,"'pwd':''");Data=Data.replace(/'p'\s*:\s*'p'/g,"'p':''");Data=Data.replace(/'pwd'\s*:\s*pwd(\s|,|})/g,"'pwd':''$1");Data=Data.replace(/'pwd'\s*:\s*pwd$/g,"'pwd':''");Data=Data.replace(/'p'\s*:\s*pwd(\s|,|})/g,"'p':''$1");Data=Data.replace(/'p'\s*:\s*pwd$/g,"'p':''");}
for(key in variables){if(key==='pwd'){continue;}
varNames.push(key);}
for(i=0;i<varNames.length;i++){varName=varNames[i];varValue=variables[varName];if(varValue!==undefined&&varValue!==''){regex=new RegExp("([:\\\\s,])"+varName+"([\\\\s,}])","g");Data=Data.replace(regex,"$1'"+varValue+"'$2");}else{regex=new RegExp("([:\\\\s,])"+varName+"([\\\\s,}])","g");Data=Data.replace(regex,"$1''$2");}}
return Data;};var resolveUrl=function(urlStr,variables){if(!urlStr)return null;var url=urlStr.replace(/^\s+|\s+$/g,"");var concatPattern;var concatMatch;var prefix;var varName;var suffix;var varValue;var key;url=url.replace(/^[\'\"`]|[\'\"`]$/g,"");if(variables[url]){return variables[url];}
concatPattern=/(.*)\+\s*(\w+)(.*)/;concatMatch=url.match(concatPattern);if(concatMatch!=null){prefix=concatMatch[1].replace(/^[\'\"`]|[\'\"`]$/g,"");varName=concatMatch[2];suffix=concatMatch[3].replace(/^[\'\"`]|[\'\"`]$/g,"");varValue=variables[varName];if(varValue===undefined){varValue=varName;}
return prefix+varValue+suffix;}
for(key in variables){if(url===key){url=variables[key]||url;}}
return url;};var parsePostRequests=function(html){var requests=[];var variables=extractVariables(html);var ajaxPattern=/\$\s*\.ajax\s*\(\s*\{([\s\S]*?)\}\s*\)/g;var match=ajaxPattern.exec(html);var ajaxContent;var urlMatch;var dataMatch;var url;var data;var request;while(match!=null){ajaxContent=match[1];urlMatch=ajaxContent.match(/url\s*:\s*([^,]+)/);dataMatch=ajaxContent.match(/data\s*:\s*(\{[\s\S]*?\})/);url=null;if(urlMatch!=null){url=resolveUrl(urlMatch[1],variables);}
data=null;if(dataMatch!=null){data=resolveData(dataMatch[1],variables);}
if(url||data){request={url:url,data:data};requests.push(request);}
match=ajaxPattern.exec(html);}
return requests;};var requests=parsePostRequests(htmlContent);var result="";var req;var url;var dataParams;if(requests.length>0){req=requests[0];url=req.url;if(url==null)url="";dataParams=dataToUrlParams(req.data);result=url+"|"+dataParams;}
return result;}
