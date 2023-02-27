({
    handleSuccess : function(component, response, helper) { 
        const value = response.getReturnValue();
        if(value) {
            component.set("v.apiProductVersion",value.info.version);
            component.set("v.apiProductTitle",value.info.title);
            component.set("v.apiProductIntro",value.info.description);
            let paths = Object.keys(value.paths);
            let methodsArr = [];
            let definitions = value.definitions;
            let defValues = Object.keys(definitions);
            for(let index in paths) {
                let path = value.paths[paths[index]];
                let m = {};
                let methodName = Object.keys(path)[0];
                m.method = methodName[0].toUpperCase() + methodName.slice(1);
                m.path = paths[index];
                m.tag = m.path.split('/')[1];
                helper.addParameters(m, path, definitions, methodName);
                let responsePath;
                m.responses = [];
                for(let index in path[methodName].responses) {
                    let response = {};
                    response.code = index;
                    response.output = path[methodName].responses[index].schema ? path[methodName].responses[index].schema['$ref'].replace('#/definitions/', '') : '';   
                    let description = path[methodName].responses[index].description;
                    let literalIndex = description.search(/[A-Za-z]/);
                    response.description = description.slice(literalIndex, description.length);
                    m.responses.push(response);
                }
                if(path[methodName].responses['200']) {
                    responsePath = path[methodName].responses['200'];
                } else if (path[methodName].responses['201']) {
                    responsePath = path[methodName].responses['201'];
                }
                let responseTag = responsePath.schema ? responsePath.schema['$ref'].replace('#/definitions/', '') : '';
                if(responseTag){
                    m.responseJSON = helper.colorJson(definitions[responseTag], helper);
                } 
                methodsArr.push(m);  
            }
            let processedDefinitions = [];
            for(let index in definitions) {
                let def = {};
                def.body = helper.colorJson(definitions[index], helper);
                def.name = helper.transformToSentenceCase(index);
                def.href = index;
                processedDefinitions.push(def);
            }
            component.set("v.definitions", processedDefinitions);
            component.set("v.methods", methodsArr); 
            let navEle = document.querySelectorAll('.apidetails__navigation');
            navEle[0].classList.remove('hidden-class');
            component.set("v.isLoading", false);
        }
    },
    
    addParameters : function(method, path, definitions, methodName) {
        let pathParams;
        if(path.parameters) {
            pathParams = path.parameters;
        } else {
            pathParams = path[methodName].parameters;
        }
        let transformedParameters = [];
        for(let index in pathParams) {
            let parameter = pathParams[index];
            if(parameter.schema) {
                transformedParameters.push( definitions[parameter.schema['$ref'].replace('#/definitions/', '')].properties);
            } else {
                transformedParameters.push(parameter);
            }
        }
        
        method.parameters = [];
        for(let index in transformedParameters) {
            let params = transformedParameters[index];
            if (params.name) {
                method.parameters.push({
                    'name' : params.name,
                    'type' : params.type,
                });
            } else {
                for(let param in params) {
                    if(params[param].type) {
                        method.parameters.push({
                            'name' : param,
                            'type' : params[param].type,
                        });
                    }
                }
            }
        }
    },
    
    colorJson : function(obj, helper) {
        let jsonString = '{';
        let nestedLevels = 1;
        const interspace = '\t';
        jsonString += helper.processNestedElement(obj, nestedLevels, interspace, helper);
        jsonString = jsonString.slice(0, -2);
        jsonString += '<div></div>}';
        return jsonString;
    },
    
    processNestedElement : function(element, level, interspace, helper) {
        let jsonString = '';
        let keys = Object.keys(element);
        for (let key in keys) {
            jsonString += '<div class="json-tab">';
            jsonString += '"<span class="json-key">' + keys[key] + '</span>" : ';
            if (typeof element[keys[key]] =="number") {
                jsonString += '<span class="json-value">' + element[keys[key]] + '</span>';
            } else if (typeof element[keys[key]] =="string") {
                jsonString += '"<span class="json-string">' + element[keys[key]] + '</span>"';
            } else if (typeof element[keys[key]] =="boolean") {
                jsonString += '<span class="json-boolean">' + element[keys[key]] + '</span>';
            } else if (typeof element[keys[key]] =="date") {
                jsonString += '<span class="json-value">' + element[keys[key]] + '</span>';
            } else if (typeof element[keys[key]] == "object") {
                jsonString += '{' + helper.processNestedElement(element[keys[key]], level+1, interspace, helper);
                jsonString = jsonString.slice(0, -2);
                jsonString += '<div></div>}';
            } else {
                jsonString += '<span class="json-value">' + element[keys[key]] + '</span>';
            }
            if(key == keys.length -1) {
                jsonString += '</div>';
            } else {
                jsonString += ',</div>';
            }
        }
        return jsonString;
    },
    
    getSpacing : function(level, interspace) {
        let spacing = '';
        for(let i = 0; i < level; i++ ) {
            spacing += interspace;
        }
        return spacing;
    },
    
    modifyLinesLength : function(jsonString, helper) {
        const limit = 90;
        let shortenedJson = '';
        let linesArr = jsonString.split('\n');
        for (let line in linesArr) {
            shortenedJson += helper.breakLongLines(linesArr[line], limit, helper);
        }
        return shortenedJson;
    },
    
    breakLongLines : function(line, limit, helper) {
        if(line.length > limit) {
            let wrappedLine = '';
            let spaceIndex = line.lastIndexOf(' ', limit);
            let quoteIndex = line.search(/\S/);
            let lines = [line.slice(0, spaceIndex), line.slice(spaceIndex+1)];
            wrappedLine += lines[0] + '\n';
            let newLine = '';
            for(let i = 0; i < quoteIndex; i++) {
                newLine += ' ';
            }
            newLine += lines[1];
            if(newLine.length > limit) {
                wrappedLine += helper.breakLongLines(newLine, limit, helper);
            } else {
                wrappedLine += newLine + '\n';
            }
            return wrappedLine;
        } else {
            return line + '\n';
        }
    },
    
    transformToSentenceCase : function(items) {
        let transformedItems = [];
        if(typeof items == "string") {
            let result = items.replace( /([A-Z])/g, " $1" );
            let finalResult = result.charAt(0).toUpperCase() + result.slice(1);
            if(finalResult.charAt(0) === ' ') {
                finalResult = finalResult.slice(1);
            }
            transformedItems = finalResult;
        } else {
            for(let index in items) {
                let item = items[index];
                let result = item.replace( /([A-Z])/g, " $1" );
                let finalResult = result.charAt(0).toUpperCase() + result.slice(1);
                if(finalResult.charAt(0) === ' ') {
                    finalResult = finalResult.slice(1);
                }
                transformedItems.push(finalResult);
            }
        }
        return transformedItems;
    },
    
    getApis : function(component,product) {        
        return new Promise(
            $A.getCallback((resolve, reject) => {
                let action = component.get("c.getSubApis");
                action.setParams({
                knowledgeParent: product.Id
            });
            action.setCallback(this, function(response) {
            let state = response.getState();
            let mainTitle = component.get("v.apiProduct").Title;
                if (state === "SUCCESS") {
                    const value = response.getReturnValue();
                    value.forEach(function(item){
                        if(item.Title__c == mainTitle){
                            value.unshift(item);
                        }                             
                    });
                    component.set("v.childApis",value);
                    resolve();
                }
        	});
        $A.enqueueAction(action);
        })
        );
    }, 
     
 })