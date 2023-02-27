({
    callCapture: function(component) {
        component.find('recaptureChild').doSubmit();
    },

    createCase: function(component) {
      component.set("v.subMittingCase",true); 
      let newCase = component.get('v.newCase');
      let action = component.get("c.createCaseWithContactId");
      action.setParams({
        caseRecord: newCase,
      });
      action.setCallback(this, function (response) {
        let state = response.getState();
        console.log("state" + state);
        if (component.isValid() && state === "SUCCESS") {
          component.set("v.subMittingCase", false);
          component.set("v.showToast", true);
          component.set("v.newCase", { sobjectType: "Case" });
          component.set("v.description", "");
          component.set("v.subject", "");
          component.set("v.fullname", "");
          component.set("v.email", "");
          component.set("v.phoneNumber", "");
          let LoginBoo = component.get("v.isUserLoggedIn");
          if (LoginBoo) {
            let cmpTarget = component.find("SuccessPos");
            $A.util.addClass(cmpTarget, "successChange");
          }
          let scrollOptions = {
            left: 0,
            top: 0,
            behavior: "smooth",
          };
          window.scrollTo(scrollOptions);
          setTimeout(function () {
            component.set("v.showToast", false);
          }, 10000);
        }
      });
      $A.enqueueAction(action);
    },

    getUserDetails: function(component) {
      let action = component.get("c.isUserLoggedIn");
        action.setCallback(this, function(response) {
          let state = response.getState();
            if (state === "SUCCESS") {
              let isLoggedIn = response.getReturnValue();
                component.set("v.isUserLoggedIn",response.getReturnValue());
                if(isLoggedIn) {
                  let action = component.get("c.getPingUserDetails");
                    action.setCallback(this, function(response) {
                      let state = response.getState();
                        if (state === "SUCCESS") {
                            console.log('state'+state);
                            component.set("v.userMap",response.getReturnValue());                            
                        }
                    })
                    $A.enqueueAction(action);
                }
            }
        });
        $A.enqueueAction(action);
    },

    setCountryCodes : function(component) {
        let countryCodes = [];
        countryCodes.push({name : "Afghanistan", code : "+93"});
        countryCodes.push({name : "Albania", code : "+355"});
        countryCodes.push({name : "Algeria", code : "+213"});
        countryCodes.push({name : "American Samoa", code : "+684"});
        countryCodes.push({name : "Andorra", code : "+376"});
        countryCodes.push({name : "Angola", code : "+244"});
        countryCodes.push({name : "Anguilla", code : "+809"});
        countryCodes.push({name : "Antigua", code : "+268"});
        countryCodes.push({name : "Argentina", code : "+54"});
        countryCodes.push({name : "Armenia", code : "+374"});
        countryCodes.push({name : "Aruba", code : "+297"});
        countryCodes.push({name : "Ascension Island", code : "+247"});
        countryCodes.push({name : "Australia", code : "+61"});
        countryCodes.push({name : "Australian External Territories", code : "+672"});
        countryCodes.push({name : "Austria", code : "+43"});
        countryCodes.push({name : "Azerbaijan", code : "+994"});
        countryCodes.push({name : "Bahamas", code : "+242"});
        countryCodes.push({name : "Barbados", code : "+246"});
        countryCodes.push({name : "Bahrain", code : "+973"});
        countryCodes.push({name : "Bangladesh", code : "+880"});
        countryCodes.push({name : "Belarus", code : "+375"});
        countryCodes.push({name : "Belgium", code : "+32"});
        countryCodes.push({name : "Belize", code : "+501"});
        countryCodes.push({name : "Benin", code : "+229"});
        countryCodes.push({name : "Bermuda", code : "+809"});
        countryCodes.push({name : "Bhutan", code : "+975"});
        countryCodes.push({name : "British Virgin Islands", code : "+284"});
        countryCodes.push({name : "Bolivia", code : "+591"});
        countryCodes.push({name : "Bosnia and Hercegovina", code : "+387"});
        countryCodes.push({name : "Botswana", code : "+267"});
        countryCodes.push({name : "Brazil", code : "+55"});
        countryCodes.push({name : "British V.I.", code : "+284"});
        countryCodes.push({name : "Brunei Darussalm", code : "+673"});
        countryCodes.push({name : "Bulgaria", code : "+359"});
        countryCodes.push({name : "Burkina Faso", code : "+226"});
        countryCodes.push({name : "Burundi", code : "+257"});
        countryCodes.push({name : "Cambodia", code : "+855"});
        countryCodes.push({name : "Cameroon", code : "+237"});
        countryCodes.push({name : "Canada", code : "+1"});
        countryCodes.push({name : "CapeVerde Islands", code : "+238"});
        countryCodes.push({name : "Caribbean Nations", code : "+1"});
        countryCodes.push({name : "Cayman Islands", code : "+345"});
        countryCodes.push({name : "Cape Verdi", code : "+238"});
        countryCodes.push({name : "Central African Republic", code : "+236"});
        countryCodes.push({name : "Chad", code : "+235"});
        countryCodes.push({name : "Chile", code : "+56"});
        countryCodes.push({name : "China (People's Republic)", code : "+86"});
        countryCodes.push({name : "China-Taiwan", code : "+886"});
        countryCodes.push({name : "Colombia", code : "+57"});
        countryCodes.push({name : "Comoros and Mayotte", code : "+269"});
        countryCodes.push({name : "Congo", code : "+242"});
        countryCodes.push({name : "Cook Islands", code : "+682"});
        countryCodes.push({name : "Costa Rica", code : "+506"});
        countryCodes.push({name : "Croatia", code : "+385"});
        countryCodes.push({name : "Cuba", code : "+53"});
        countryCodes.push({name : "Cyprus", code : "+357"});
        countryCodes.push({name : "Czech Republic", code : "+420"});
        countryCodes.push({name : "Denmark", code : "+45"});
        countryCodes.push({name : "Diego Garcia", code : "+246"});
        countryCodes.push({name : "Dominca", code : "+767"});
        countryCodes.push({name : "Dominican Republic", code : "+809"});
        countryCodes.push({name : "Djibouti", code : "+253"});
        countryCodes.push({name : "Ecuador", code : "+593"});
        countryCodes.push({name : "Egypt", code : "+20"});
        countryCodes.push({name : "El Salvador", code : "+503"});
        countryCodes.push({name : "Equatorial Guinea", code : "+240"});
        countryCodes.push({name : "Eritrea", code : "+291"});
        countryCodes.push({name : "Estonia", code : "+372"});
        countryCodes.push({name : "Ethiopia", code : "+251"});
        countryCodes.push({name : "Falkland Islands", code : "+500"});
        countryCodes.push({name : "Faroe (Faeroe) Islands (Denmark)", code : "+298"});
        countryCodes.push({name : "Fiji", code : "+679"});
        countryCodes.push({name : "Finland", code : "+358"});
        countryCodes.push({name : "France", code : "+33"});
        countryCodes.push({name : "French Antilles", code : "+596"});
        countryCodes.push({name : "French Guiana", code : "+594"});
        countryCodes.push({name : "Gabon (Gabonese Republic)", code : "+241"});
        countryCodes.push({name : "Gambia", code : "+220"});
        countryCodes.push({name : "Georgia", code : "+995"});
        countryCodes.push({name : "Germany", code : "+49"});
        countryCodes.push({name : "Ghana", code : "+233"});
        countryCodes.push({name : "Gibraltar", code : "+350"});
        countryCodes.push({name : "Greece", code : "+30"});
        countryCodes.push({name : "Greenland", code : "+299"});
        countryCodes.push({name : "Grenada/Carricou", code : "+473"});
        countryCodes.push({name : "Guam", code : "+671"});
        countryCodes.push({name : "Guatemala", code : "+502"});
        countryCodes.push({name : "Guinea", code : "+224"});
        countryCodes.push({name : "Guinea-Bissau", code : "+245"});
        countryCodes.push({name : "Guyana", code : "+592"});
        countryCodes.push({name : "Haiti", code : "+509"});
        countryCodes.push({name : "Honduras", code : "+504"});
        countryCodes.push({name : "Hong Kong", code : "+852"});
        countryCodes.push({name : "Hungary", code : "+36"});
        countryCodes.push({name : "Iceland", code : "+354"});
        countryCodes.push({name : "India", code : "+91"});
        countryCodes.push({name : "Indonesia", code : "+62"});
        countryCodes.push({name : "Iran", code : "+98"});
        countryCodes.push({name : "Iraq", code : "+964"});
        countryCodes.push({name : "Ireland (Irish Republic; Eire)", code : "+353"});
        countryCodes.push({name : "Israel", code : "+972"});
        countryCodes.push({name : "Italy", code : "+39"});
        countryCodes.push({name : "Ivory Coast (La Cote d'Ivoire)", code : "+225"});
        countryCodes.push({name : "Jamaica", code : "+876"});
        countryCodes.push({name : "Japan", code : "+81"});
        countryCodes.push({name : "Jordan", code : "+962"});
        countryCodes.push({name : "Kazakhstan", code : "+7"});
        countryCodes.push({name : "Kenya", code : "+254"});
        countryCodes.push({name : "Khmer Republic (Cambodia/Kampuchea)", code : "+855"});
        countryCodes.push({name : "Kiribati Republic (Gilbert Islands)", code : "+686"});
        countryCodes.push({name : "Korea, Republic of (South Korea)", code : "+82"});
        countryCodes.push({name : "Korea, People's Republic of (North Korea)", code : "+850"});
        countryCodes.push({name : "Kuwait", code : "+965"});
        countryCodes.push({name : "Kyrgyz Republic", code : "+996"});
        countryCodes.push({name : "Latvia", code : "+371"});
        countryCodes.push({name : "Laos", code : "+856"});
        countryCodes.push({name : "Lebanon", code : "+961"});
        countryCodes.push({name : "Lesotho", code : "+266"});
        countryCodes.push({name : "Liberia", code : "+231"});
        countryCodes.push({name : "Lithuania", code : "+370"});
        countryCodes.push({name : "Libya", code : "+218"});
        countryCodes.push({name : "Liechtenstein", code : "+423"});
        countryCodes.push({name : "Luxembourg", code : "+352"});
        countryCodes.push({name : "Macao", code : "+853"});
        countryCodes.push({name : "Macedonia", code : "+389"});
        countryCodes.push({name : "Madagascar", code : "+261"});
        countryCodes.push({name : "Malawi", code : "+265"});
        countryCodes.push({name : "Malaysia", code : "+60"});
        countryCodes.push({name : "Maldives", code : "+960"});
        countryCodes.push({name : "Mali", code : "+223"});
        countryCodes.push({name : "Malta", code : "+356"});
        countryCodes.push({name : "Marshall Islands", code : "+692"});
        countryCodes.push({name : "Martinique (French Antilles)", code : "+596"});
        countryCodes.push({name : "Mauritania", code : "+222"});
        countryCodes.push({name : "Mauritius", code : "+230"});
        countryCodes.push({name : "Mayolte", code : "+269"});
        countryCodes.push({name : "Mexico", code : "+52"});
        countryCodes.push({name : "Micronesia (F.S. of Polynesia)", code : "+691"});
        countryCodes.push({name : "Moldova", code : "+373"});
        countryCodes.push({name : "Monaco", code : "+33"});
        countryCodes.push({name : "Mongolia", code : "+976"});
        countryCodes.push({name : "Montserrat", code : "+473"});
        countryCodes.push({name : "Morocco", code : "+212"});
        countryCodes.push({name : "Mozambique", code : "+258"});
        countryCodes.push({name : "Myanmar (former Burma)", code : "+95"});
        countryCodes.push({name : "Namibia (former South-West Africa)", code : "+264"});
        countryCodes.push({name : "Nauru", code : "+674"});
        countryCodes.push({name : "Nepal", code : "+977"});
        countryCodes.push({name : "Netherlands", code : "+31"});
        countryCodes.push({name : "Netherlands Antilles", code : "+599"});
        countryCodes.push({name : "Nevis", code : "+869"});
        countryCodes.push({name : "New Caledonia", code : "+687"});
        countryCodes.push({name : "New Zealand", code : "+64"});
        countryCodes.push({name : "Nicaragua", code : "+505"});
        countryCodes.push({name : "Niger", code : "+227"});
        countryCodes.push({name : "Nigeria", code : "+234"});
        countryCodes.push({name : "Niue", code : "+683"});
        countryCodes.push({name : "North Korea", code : "+850"});
        countryCodes.push({name : "North Mariana Islands (Saipan)", code : "+1 670"});
        countryCodes.push({name : "Norway", code : "+47"});
        countryCodes.push({name : "Oman", code : "+968"});
        countryCodes.push({name : "Pakistan", code : "+92"});
        countryCodes.push({name : "Palau", code : "+680"});
        countryCodes.push({name : "Panama", code : "+507"});
        countryCodes.push({name : "Papua New Guinea", code : "+675"});
        countryCodes.push({name : "Paraguay", code : "+595"});
        countryCodes.push({name : "Peru", code : "+51"});
        countryCodes.push({name : "Philippines", code : "+63"});
        countryCodes.push({name : "Poland", code : "+48"});
        countryCodes.push({name : "Portugal (includes Azores)", code : "+351"});
        countryCodes.push({name : "Puerto Rico", code : "+1 787"});
        countryCodes.push({name : "Qatar", code : "+974"});
        countryCodes.push({name : "Reunion (France)", code : "+262"});
        countryCodes.push({name : "Romania", code : "+40"});
        countryCodes.push({name : "Russia", code : "+7"});
        countryCodes.push({name : "Rwanda (Rwandese Republic)", code : "+250"});
        countryCodes.push({name : "Saipan", code : "+670"});
        countryCodes.push({name : "San Marino", code : "+378"});
        countryCodes.push({name : "Sao Tome and Principe", code : "+239"});
        countryCodes.push({name : "Saudi Arabia", code : "+966"});
        countryCodes.push({name : "Senegal", code : "+221"});
        countryCodes.push({name : "Serbia and Montenegro", code : "+381"});
        countryCodes.push({name : "Seychelles", code : "+248"});
        countryCodes.push({name : "Sierra Leone", code : "+232"});
        countryCodes.push({name : "Singapore", code : "+65"});
        countryCodes.push({name : "Slovakia", code : "+421"});
        countryCodes.push({name : "Slovenia", code : "+386"});
        countryCodes.push({name : "Solomon Islands", code : "+677"});
        countryCodes.push({name : "Somalia", code : "+252"});
        countryCodes.push({name : "South Africa", code : "+27"});
        countryCodes.push({name : "Spain", code : "+34"});
        countryCodes.push({name : "Sri Lanka", code : "+94"});
        countryCodes.push({name : "St. Helena", code : "+290"});
        countryCodes.push({name : "St. Kitts/Nevis", code : "+869"});
        countryCodes.push({name : "St. Pierre &(et) Miquelon (France)", code : "+508"});
        countryCodes.push({name : "Sudan", code : "+249"});
        countryCodes.push({name : "Suriname", code : "+597"});
        countryCodes.push({name : "Swaziland", code : "+268"});
        countryCodes.push({name : "Sweden", code : "+46"});
        countryCodes.push({name : "Switzerland", code : "+41"});
        countryCodes.push({name : "Syrian Arab Republic (Syria)", code : "+963"});
        countryCodes.push({name : "Tahiti (French Polynesia)", code : "+689"});
        countryCodes.push({name : "Taiwan", code : "+886"});
        countryCodes.push({name : "Tajikistan", code : "+7"});
        countryCodes.push({name : "Tanzania (includes Zanzibar)", code : "+255"});
        countryCodes.push({name : "Thailand", code : "+66"});
        countryCodes.push({name : "Togo (Togolese Republic)", code : "+228"});
        countryCodes.push({name : "Tokelau", code : "+690"});
        countryCodes.push({name : "Tonga", code : "+676"});
        countryCodes.push({name : "Trinidad and Tobago", code : "+1 868"});
        countryCodes.push({name : "Tunisia", code : "+216"});
        countryCodes.push({name : "Turkey", code : "+90"});
        countryCodes.push({name : "Turkmenistan", code : "+993"});
        countryCodes.push({name : "Tuvalu (Ellice Islands)", code : "+688"});
        countryCodes.push({name : "Uganda", code : "+256"});
        countryCodes.push({name : "Ukraine", code : "+380"});
        countryCodes.push({name : "United Arab Emirates", code : "+971"});
        countryCodes.push({name : "United Kingdom", code : "+44"});
        countryCodes.push({name : "Uruguay", code : "+598"});
        countryCodes.push({name : "USA", code : "+1"});
        countryCodes.push({name : "Uzbekistan", code : "+7"});
        countryCodes.push({name : "Vanuatu (New Hebrides)", code : "+678"});
        countryCodes.push({name : "Vatican City", code : "+39"});
        countryCodes.push({name : "Venezuela", code : "+58"});
        countryCodes.push({name : "Viet Nam", code : "+84"});
        countryCodes.push({name : "Virgin Islands", code : "+1 340"});
        countryCodes.push({name : "Wallis and Futuna", code : "+681"});
        countryCodes.push({name : "Western Samoa", code : "+685"});
        countryCodes.push({name : "Yemen (People's Democratic Republic of)", code : "+381"});
        countryCodes.push({name : "Yemen Arab Republic (North Yemen)", code : "+967"});
        countryCodes.push({name : "Yugoslavia (discontinued)", code : "+381"});
        countryCodes.push({name : "Zaire", code : "+243"});
        countryCodes.push({name : "Zambia", code : "+260"});
        countryCodes.push({name : "Zimbabwe", code : "+263"});
        component.set("v.countryCodes", countryCodes);
    }
})