Number.prototype.formatMoney = function(c, t){
    var n = Math.round(this),
    c = isNaN(c = Math.abs(c)) ? 2 : c, 
    t = t == undefined ? "," : t, 
    s = n < 0 ? "-" : "", 
    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
    j = (j = i.length) > 3 ? j % 3 : 0;
return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t);
};

function updateCache(){
  $(document).ready(function(){
    $('#main-modal .modal-title').html('Update availabe');
    $('#main-modal .modal-body').html('An update is available. Please update.');
    $('#main-modal .modal-body').after('<div class="modal-footer"><button class="btn btn-primary" onclick="javascript:window.location.reload();">Update</button></div>');
    $('#main-modal').modal({
        show: true,
        backdrop: 'static'
    });
  });
}

var app = angular.module('OMDashboard', ['ngRoute', 'AngularForce', 'AngularForceObjectFactory']);
app.constant('SFConfig', getSFConfig());

app.config(function ($routeProvider) {
    $routeProvider.
        when('/', {controller: HomeCtrl, templateUrl: 'apex/OMDashboardHome'}).
        when('/login', {controller: LoginCtrl, templateUrl: 'apex/OMDashboardLogin'}).
        when('/dashboard', {controller: HomeCtrl, templateUrl: 'apex/OMDashboardHome'}).
        otherwise({redirectTo: '/'});
});

app.provider('AppConfiguration', function () {
    // default values
    var values = {
      allOpportunitiesFranco: '',
      allOpportunitiesSector : '',
      allOpportunityPipelineDivlst: '',
      allOpportunityPipelineSectorDivlst: '',
      allClosedOpportunitylst: '',
      allClosedOpportunitySeclst: '',
      topOp : '',
      sectorTopOpp : '',
      allOpportunityPipelineFrancolst : '',
      allOpportunityClosedFrancolst : '',
      topOppClosedLostDrillDownFranco : '',
      topOppClosedWonDrillDownFranco : '',
      topOppClosedWonPipelineDrillDownSector : '',
      topOppClosedLostPipelineDrillDownSector : '',
      topOppPipelineDrillDownSector : '',
      topOppPipelineDrillDownFranco : ''
    };
    return {
      set: function (constants) {
        angular.extend(values, constants);
      },
      $get: function () {
        return values;
      }
    };
  });
  
  app.run(function ($rootScope, AppConfiguration) {
    $rootScope.allOpportunitiesFranco = AppConfiguration.allOpportunitiesFranco;
    $rootScope.allOpportunitiesSector = AppConfiguration.allOpportunitiesSector;
    $rootScope.allOpportunityPipelineDivlst = AppConfiguration.allOpportunityPipelineDivlst;
    $rootScope.allOpportunityPipelineSectorDivlst = AppConfiguration.allOpportunityPipelineSectorDivlst;
    $rootScope.allClosedOpportunitylst = AppConfiguration.allClosedOpportunitylst;
    $rootScope.allClosedOpportunitySeclst = AppConfiguration.allClosedOpportunitySeclst;
    $rootScope.topOpp = AppConfiguration.topOpp;
    $rootScope.sectorTopOpp = AppConfiguration.sectorTopOpp;
    $rootScope.allOpportunityPipelineFrancolst = AppConfiguration.allOpportunityPipelineFrancolst;
    $rootScope.allOpportunityClosedFrancolst = AppConfiguration.allOpportunityClosedFrancolst;
    $rootScope.topOppClosedLostDrillDownFranco = AppConfiguration.topOppClosedLostDrillDownFranco;
    $rootScope.topOppClosedWonDrillDownFranco = AppConfiguration.topOppClosedWonDrillDownFranco;
    $rootScope.topOppPipelineDrillDownSector = AppConfiguration.topOppPipelineDrillDownSector;
    $rootScope.topOppClosedWonPipelineDrillDownSector = AppConfiguration.topOppClosedWonPipelineDrillDownSector;
    $rootScope.topOppClosedLostPipelineDrillDownSector = AppConfiguration.topOppClosedLostPipelineDrillDownSector;
    $rootScope.topOppPipelineDrillDownFranco = AppConfiguration.topOppPipelineDrillDownFranco;

    var offliner = (function() {
      return {
        addCachingIframe: function() {
          $(document.body).prepend(
            '<iframe id="cache-frame" src="/apex/OMDashboardCache" style="position:absolute;top:-999em;visibility:hidden"></iframe>'
          );
        }
      };
    })();    
    offliner.addCachingIframe();
  });

  angular.forEach('hmTap:tap hmDoubletap:doubletap hmHold:hold hmTransformstart:transformstart hmTransform:transform hmTransforend:transformend hmDragstart:dragstart hmDrag:drag hmDragend:dragend hmSwipe:swipe hmRelease:release'.split(' '), function(name) {
      var directive = name.split(':');
      var directiveName = directive[0];
      var eventName = directive[1];
      angular.module('OMDashboard').directive(directiveName, 
      ['$parse', function($parse) {
        return function(scope, element, attr) {
          var fn = $parse(attr[directiveName]);
          var opts = $parse(attr[directiveName + 'Opts'])(scope, {});
          element.hammer(opts).bind(eventName, function(event) {
            scope.$apply(function() {
              fn(scope, {$event: event});
            });
          });
        };
      }]);
    });

function getSFConfig() {
    var location = document.location;
    var href = location.href;
    if (href.indexOf('file:') >= 0) { //Phonegap 
        return {};
    } else {
        if (configFromEnv.sessionId) {
            return {
                sessionId: configFromEnv.sessionId
            }
        } else {
            if (!configFromEnv || configFromEnv.client_id == "" || configFromEnv.client_id == "undefined"
                || configFromEnv.app_url == "" || configFromEnv.app_url == "undefined") {
                throw 'Environment variable client_id and/or app_url is missing. Please set them before you start the app';
            }
            return {
                sfLoginURL: 'https://login.salesforce.com/',
                consumerKey: configFromEnv.client_id,
                oAuthCallbackURL: removeTrailingSlash(configFromEnv.app_url) + '/#/callback',
                proxyUrl: removeTrailingSlash(configFromEnv.app_url) + '/proxy/'
            }
        }
    }
}

//Helper
function removeTrailingSlash(url) {
    return url.replace(/\/$/, "");
}