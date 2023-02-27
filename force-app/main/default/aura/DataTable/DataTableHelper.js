/**
 * Created by Emmanuel Nocks  on 2019/11/21.
 */

({


     resolveNestedData : function(cmp,data) {

        let result = {};
        let lookups = cmp.get('v.lookUps');
        let dates = cmp.get('v.dates');
        function recurse (cur, prop) {
            if (Object(cur) !== cur) {
                result[prop] = cur;
            } else if (Array.isArray(cur)) {

                for(var i=0, l=cur.length; i<l; i++)
                    recurse(cur[i], prop + "[" + i + "]");
                if (l == 0)
                    result[prop] = [];
            } else {
                let isEmpty = true;
                for (let p in cur) {
                    isEmpty = false;
                    recurse(cur[p], prop ? prop+"."+p : p);
                }
                if (isEmpty && prop)
                    result[prop] = {};
            }
        }
        recurse(data, ".");

        function mappedKeys(recdata) {

            let currentRecordIndex;
            let prevRecordIndex = '.[0]';
            let newObj = {};
            let records = [];
            let numOfRows = 0;
            let stringEnd =4;
            let stringstart = 5;
            try {
                    for (let key in recdata) {

                        currentRecordIndex = key.substring(0, stringEnd);
                        countDigitsInNumOfLoops(numOfRows);
                        if (currentRecordIndex == prevRecordIndex) {

                            newObj[key.substring(stringstart)] = recdata[key];

                            if (typeof newObj[key.substring(stringstart)] == 'boolean') {
                                newObj[key.substring(stringstart)] = newObj[key.substring(stringstart)] ? 'utility:check' : ''
                            }
                            let objData = isLookupAndObject(key.substring(stringstart));
                            if (objData.value && lookups.length > 0) {

                                newObj[key.substring(stringstart)] = getBaseURL() + objData.prefix + recdata[key];
                            } else {
                                if (isLookup(key.substring(stringstart)) && lookups.length > 0) {


                                    newObj[key.substring(stringstart)] = getBaseURL() + recdata[key];
                                }
                            }

                            if (isDate(key.substring(stringstart)) && dates.length > 0) {

                                let dateValue = newObj[key.substring(stringstart)];
                                dateValue = dateValue != null ? dateValue.split("T") : null;
                                newObj[key.substring(stringstart)] = dateValue.length > 0 ? dateValue[0] : null;
                            }


                        } else {

                            if (!isEmpty(newObj)) {
                                records.push(newObj);
                                newObj = {};
                                numOfRows++;
                            }
                            newObj[key.substring(stringstart)] = recdata[key];

                            if (typeof newObj[key.substring(stringstart)] == 'boolean') {
                                newObj[key.substring(stringstart)] = newObj[key.substring(stringstart)] ? 'utility:check' : ''
                            }

                            let objData = isLookupAndObject(key.substring(stringstart));

                            if (objData.value && lookups.length > 0) {

                                newObj[key.substring(stringstart)] = getBaseURL() + objData.prefix + recdata[key];
                            } else {

                                if (isLookup(key.substring(stringstart)) && lookups.length > 0) {


                                    newObj[key.substring(stringstart)] = getBaseURL() + recdata[key];
                                }
                            }

                            if (isDate(key.substring(stringstart)) && dates.length > 0) {

                                let dateValue = newObj[key.substring(stringstart)];
                                dateValue = dateValue != null ? dateValue.split("T") : null;
                                newObj[key.substring(stringstart)] = dateValue.length > 0 ? dateValue[0] : null;
                            }
                        }

                        prevRecordIndex = currentRecordIndex;

                        function countDigitsInNumOfLoops(numOfLoops) {

                            if (numOfLoops > 9 && numOfLoops <= 99) {
                                stringEnd = 5;
                                stringstart = 6;
                            } else if (numOfLoops > 99 && numOfLoops <= 999) {
                                stringEnd = 6;
                                stringstart = 7;
                            } else if (numOfLoops > 999 && numOfLoops <= 9999) {
                                stringEnd = 7;
                                stringstart = 8;
                            }

                        }
                    }

                    if (!isEmpty(newObj)) {
                        records.push(newObj);
                    }
                    return records;
            }
            catch (e) {
            }
        }
         function isLookupAndObject(field) {

             for (let i = 0; i < lookups.length; i++) {


                 if (typeof lookups[i] == 'object') {

                     if (field.toLowerCase() == lookups[i].field.toLowerCase()){
                         return {value:true,prefix:lookups[i].prefix};
                     }

                 }

             }
             return {value:false,prefix:''};
         }
        function isEmpty(obj) {
            for(let key in obj) {
                if(obj.hasOwnProperty(key))
                    return false;
            }
            return true;
        }
         function getBaseURL() {

             var url = location.href;  // entire url including querystring - also: window.location.href;
             var baseURL = url.substring(0, url.indexOf('/', 14));

             return baseURL + "/";
         }

         function isLookup(field){

            for (let i=0;i < lookups.length;i++ ){
                if (typeof lookups[i] != 'object') {
                    if (field.toLowerCase() == lookups[i].toLowerCase())
                        return true;
                }
            }

            return false;

         }

         function isDate(field){

             for (let i=0;i < dates.length;i++ ){

                 if(field.toLowerCase()==dates[i].toLowerCase())
                     return true;
             }

             return false;

         }


        return mappedKeys(result);
    },
    removeRow: function (cmp, row) {
        let rows = cmp.get('v.data');
        let rowIndex = rows.indexOf(row);

        rows.splice(rowIndex, 1);
        cmp.set('v.data', rows);
    }
});