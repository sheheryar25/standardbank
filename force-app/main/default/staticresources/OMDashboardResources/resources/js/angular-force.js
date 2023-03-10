/**
 * AngularForce library provides glue b/w Angular.js and Saleforce's forcetk libraries to help easily build
 * AngularJS based Salesforce apps.
 *
 * It contains the following two Angular Modules.
 * 1. AngularForce - Helps with authentication with Salesforce
 * 2. AngularForceObjectFactory - Creates & returns different kind of AngularForceObject class based on the params.
 *
 * @author Raja Rao DV @rajaraodv
 */


/**
 * AngularForce Module helps with authentication with Salesforce. It internally depends on Cordova(Phonegap apps) and
 * forcetk.ui(web apps) to do so.
 *
 * @param SFConfig An AngularJS object that is used to store forcetk.client.
 */
angular.module('AngularForce', []).
    service('AngularForce', function (SFConfig) {

        this.inVisualforce = document.location.href.indexOf("visual.force.com") > 0;

        this.authenticated = function () {
            return SFConfig.client ? true : false;
        };

        this.login = function (callback) {
            if (SFConfig.client) { //already logged in
                return callback && callback();
            }

            if (location.protocol === 'file:' && cordova) { //Cordova / PhoneGap
                return this.setCordovaLoginCred(callback);
            } else if (SFConfig.sessionId) { //visualforce
                //(Have a global func. called getSessionId tht sets sessionId from VF to SFConfig.sessionId)
                return this.loginVF();
            } else { //standalone / heroku / localhost
                return this.loginWeb(callback);
            }
        };

        /**
         *  setCordovaLoginCred initializes forcetk client in Cordova/PhoneGap apps (not web apps).
         *  Usage: Import AngularForce module into your initial view and call AngularForce.setCordovaLoginCred
         *
         *  Note: This should be used when SalesForce *native-phonegap* plugin is used for logging in to SF
         */
        this.setCordovaLoginCred = function (callback) {
            if (!cordova) throw 'Cordova/PhoneGap not found.';

            //Call getAuthCredentials to get the initial session credentials
            cordova.require("salesforce/plugin/oauth").getAuthCredentials(salesforceSessionRefreshed, getAuthCredentialsError);

            //register to receive notifications when autoRefreshOnForeground refreshes the sfdc session
            document.addEventListener("salesforceSessionRefresh", salesforceSessionRefreshed, false);
            function salesforceSessionRefreshed(creds) {
                // Depending on how we come into this method, `creds` may be callback data from the auth
                // plugin, or an event fired from the plugin.  The data is different between the two.
                var credsData = creds;
                if (creds.data)  // Event sets the `data` object with the auth data.
                    credsData = creds.data;

                SFConfig.client = new forcetk.Client(credsData.clientId, credsData.loginUrl);
                SFConfig.client.setSessionToken(credsData.accessToken, apiVersion, credsData.instanceUrl);
                SFConfig.client.setRefreshToken(credsData.refreshToken);
                callback();
            }

            function getAuthCredentialsError(error) {
                logToConsole("getAuthCredentialsError: " + error);
            }
        };

        /**
         * Login using forcetk.ui (for non phonegap/cordova apps)
         * Usage: Import AngularForce and call AngularForce.login(callback)
         * @param callback A callback function (usually in the same controller that initiated login)
         */
        this.loginWeb = function (callback) {
            if (!SFConfig) throw 'Must set app.SFConfig where app is your AngularJS app';

            if (SFConfig.client) { //already loggedin
                return callback && callback;
            }
            var ftkClientUI = getForceTKClientUI();
            ftkClientUI.login(callback);
        };

        /**
         * Login to VF. Technically, you are already logged in when running the app, but we need this function
         * to set sessionId to SFConfig.client (forcetkClient)
         *
         * Usage: Import AngularForce and call AngularForce.login() while running in VF page.
         *
         * @param callback A callback function (usually in the same controller that initiated login)
         */
        this.loginVF = function () {
            SFConfig.client = new forcetk.Client();
            SFConfig.client.setSessionToken(SFConfig.sessionId);
        };


        this.oauthCallback = function (callbackString) {
            var ftkClientUI = getForceTKClientUI();
            ftkClientUI.oauthCallback(callbackString);
        };

        this.logout = function (callback) {
            if (SFConfig.client) {
                var ftkClientUI = getForceTKClientUI();
                ftkClientUI.client = SFConfig.client;
                ftkClientUI.instanceUrl = SFConfig.client.instanceUrl;
                ftkClientUI.proxyUrl = SFConfig.client.proxyUrl;
                ftkClientUI.logout(callback);

                //set SFConfig.client to null
                SFConfig.client = null;
            }
        };

        /**
         * Creates a forcetk.clientUI object using information from SFConfig. Please set SFConfig information
         * in init.js (or via environment variables).
         *
         * @returns {forcetk.ClientUI}
         */
        function getForceTKClientUI() {
            return new forcetk.ClientUI(SFConfig.sfLoginURL, SFConfig.consumerKey, SFConfig.oAuthCallbackURL,
                function forceOAuthUI_successHandler(forcetkClient) {
                    console.log('OAuth callback success!');
                    SFConfig.client = forcetkClient;
                    SFConfig.client.serviceURL = forcetkClient.instanceUrl
                        + '/services/data/'
                        + forcetkClient.apiVersion;
                },
                function forceOAuthUI_errorHandler() {
                },
                SFConfig.proxyUrl);
        }
    });

/**
 * AngularForceObjectFactory creates & returns different kind of AngularForceObject class based on the params.
 * Usage: Import AngularForceObjectFactory and pass params.
 * Where params are:
 * @params  type    String  An SF object type like: 'Opportunity', 'Contact' etc
 * @param   fields  Array An array of fields
 * @param   where   A SOQL Where clause for the object like 'Where IsWon = TRUE'
 *
 * var MySFObject = AngularForceObjectFactory({params})
 *
 * Example:
 * var Opportunity = AngularForceObjectFactory({type: 'Opportunity', fields:
 *          ['Name', 'ExpectedRevenue', 'StageName', 'CloseDate', 'Id'], where: 'WHERE IsWon = TRUE'});
 */
angular.module('AngularForceObjectFactory', []).factory('AngularForceObjectFactory', function (SFConfig) {
    function AngularForceObjectFactory(params) {
        params = params || {};
        var type = params.type;
        var fields = params.fields;
        var where = params.where;
        var limit = params.limit;
        var orderBy = params.orderBy;

        //Make it soql compliant
        fields = fields && fields.length > 0 ? fields.join(',') : '';
        where = where && where != '' ? ' where ' + where : '';
        limit = limit && limit != '' ? ' LIMIT ' + limit : 'LIMIT 25';
        orderBy = orderBy && orderBy != '' ? ' ORDER BY ' + orderBy : '';

        //Construct SOQL
        var soql = 'SELECT ' + fields + ' FROM ' + type + where + orderBy + limit;

        //Construct SOSL
        // Note: "__SEARCH_TERM_PLACEHOLDER__" will be replaced by actual search query just before making that query
        var sosl = 'Find {__SEARCH_TERM_PLACEHOLDER__*} IN ALL FIELDS RETURNING ' + type + ' (' + fields + ')';

        /**
         * AngularForceObject acts like a super-class for actual SF Objects. It provides wrapper to forcetk ajax apis
         * like update, destroy, query, get etc.
         * @param props JSON representing a single SF Object
         *
         * Usage:
         * 1. First import AngularForceObjectFactory into your AngularJS main app-module.
         *
         * 2. Create an SF Object Class from the factory like this:
         *      var Opportunity = AngularForceObjectFactory({type: 'Opportunity', fields: ['Name', 'CloseDate', 'Id'], where: 'WHERE IsWon = TRUE'});
         *
         * 3. Create actual object by passing JSON from DB like this:
         *      var myOpp = new Opportunity({fields: {'Name': 'Big Opportunity', 'CloseDate': '2013-03-03', 'Id': '12312'});
         */
        function AngularForceObject(props) {
            angular.copy(props || {}, this);
            this._orig = props || {};
        }

        /************************************
         * CRUD operations
         ************************************/
        AngularForceObject.prototype.update = function (successCB, failureCB) {
            return AngularForceObject.update(this, successCB, failureCB);
        };

        AngularForceObject.prototype.destroy = function (successCB, failureCB) {
            return AngularForceObject.remove(this, successCB, failureCB);
        };

        AngularForceObject.query = function (successCB, failureCB) {
            return SFConfig.client.query(soql, successCB, failureCB);
        };

        /*RSC And who doesn't love SOSL*/
        AngularForceObject.search = function (searchTerm, successCB, failureCB) {
            var fields = fields && fields.length > 0 ? '(' + fields.join(', ') + ')' : '';
            var limit = limit && limit != '' ? ' LIMIT ' + limit : '';

            //Replace __SEARCH_TERM_PLACEHOLDER__ from SOSL with actual search term.
            var s = sosl.replace('__SEARCH_TERM_PLACEHOLDER__', escape(searchTerm));
            return SFConfig.client.search(s, successCB, failureCB);
        };


        AngularForceObject.get = function (params, successCB, failureCB) {
            return SFConfig.client.retrieve(type, params.id, fields, function (data) {
                if (data && !angular.isArray(data)) {
                    return successCB(new AngularForceObject(data))
                }
                return successCB(data);
            }, failureCB);
        };

        AngularForceObject.save = function (obj, successCB, failureCB) {
            var data = AngularForceObject.getNewObjectData(obj);
            return SFConfig.client.create(type, data, function (data) {
                if (data && !angular.isArray(data)) {
                    //Salesforce returns "id" in lowercase when an object is
                    //created. Where as it returns id as "Id" for every other call.
                    // This might confuse people, so change "id" to "Id".
                    if (data.id) {
                        data.Id = data.id;
                        delete data.id;
                    }
                    return successCB(new AngularForceObject(data))
                }
                return successCB(data);
            }, failureCB);
        };

        AngularForceObject.update = function (obj, successCB, failureCB) {
            var data = AngularForceObject.getChangedData(obj);
            return SFConfig.client.update(type, obj.Id, data, function (data) {
                if (data && !angular.isArray(data)) {
                    return successCB(new AngularForceObject(data))
                }
                return successCB(data);
            }, failureCB);
        };

        AngularForceObject.remove = function (obj, successCB, failureCB) {
            return SFConfig.client.del(type, obj.Id, successCB, failureCB);
        };

        /************************************
         * HELPERS
         ************************************/
        AngularForceObject.getChangedData = function (obj) {
            var diff = {};
            var orig = obj._orig;
            if (!orig)  return {};
            angular.forEach(params.fields, function (field) {
                if (field != 'Id' && obj[field] !== orig[field]) diff[field] = obj[field];
            });
            return diff;
        };

        AngularForceObject.getNewObjectData = function (obj) {
            var newObj = {};
            angular.forEach(params.fields, function (field) {
                if (field != 'Id') {
                    newObj[field] = obj[field];
                }
            });
            return newObj;
        };

        return AngularForceObject;
    }
    return AngularForceObjectFactory;
});