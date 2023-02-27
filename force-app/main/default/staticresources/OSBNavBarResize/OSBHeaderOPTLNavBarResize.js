window.onscroll = function() {scrollFunction()};
header_acc
function scrollFunction() {
	if (document.body.scrollTop > 0 || document.documentElement.scrollTop > 0) {
        if(document.getElementById("header_acc") != undefined){
            document.getElementById("header_acc").style.marginRight = "13%";
        }
        if(document.getElementById("full_terms") != undefined){
            document.getElementById("full_terms").style.display = "none";
        }
        if(document.getElementById("part_terms") != undefined){
            document.getElementById("part_terms").style.display = "block";
        }
	    if(document.getElementById("headerFixedHeight") != undefined) {
	        document.getElementById("headerFixedHeight").style.position = "fixed";
	        document.getElementById("headerFixedHeight").style.top = 0;
	        document.getElementById("headerFixedHeight").style.left = 0;
	        document.getElementById("headerFixedHeight").style.width = "100%";
        }
        if(document.getElementById("banner-message") != undefined) {
            document.getElementById("banner-message").classList.add("mobile__banner-message");
        }
        if(document.getElementById("breadCrumbs") != undefined){
            document.getElementById("breadCrumbs").style.marginTop = "-20px";
        }
        if(document.getElementById("sbLogoContainer") != undefined){
            document.getElementById("sbLogoContainer").style.width = "160px";
        }
        if(document.getElementById("sbLogo") != undefined){
            document.getElementById("sbLogo").style.height = "35px";
        	document.getElementById("sbLogo").style.width = "140px";
        }
        if(document.getElementById("sbBageLogoContainer") != undefined){
            document.getElementById("sbBageLogoContainer").style.width = "160px";
        }
        if(document.getElementById("sbBadgeLogo") != undefined){
            document.getElementById("sbBadgeLogo").style.height = "35px";
        	document.getElementById("sbBadgeLogo").style.width = "140px";
        }
        if(document.getElementById("headerNav") != undefined){
            document.getElementById("headerNav").style.height = "20px";
        	document.getElementById("headerNav").style.padding = "20px 0px";
        }
        if(document.getElementById("contactUs") != undefined){
            document.getElementById("contactUs").style.paddingLeft = "0px";
        }
        if(document.getElementById("contactUsLink") != undefined){
            document.getElementById("contactUsLink").style.paddingLeft = "0px";
        }
        if(document.getElementById("headerWithMenu") != undefined){
            document.getElementById("headerWithMenu").style.height = "60px";
        }
        if(document.getElementById("headerButton") != undefined){
            document.getElementById("headerButton").style.fontSize = "8px";
            document.getElementById("headerButton").style.lineHeight = "16px";
            document.getElementById("headerButton").style.padding = "0px 0px 20px 34px";
            document.getElementById("headerButton").style.height = "60px";
            document.getElementById("headerButton").style.width = "90px";
            
            document.getElementById("headerButton").innerHTML = "<div class=\"header__button--right\"> <i style=\"margin-top:20px;\" class=\"header__button--icon ms-icn_profile_dashboard\"></i> </div>";
        }
	} 
    else {
        if(document.getElementById("header_acc") != undefined){
            document.getElementById("header_acc").style.marginRight = "20px";
        }
        if(document.getElementById("full_terms") != undefined){
            document.getElementById("full_terms").style.display = "block";
        }
        if(document.getElementById("part_terms") != undefined){
            document.getElementById("part_terms").style.display = "none";
        }
        if(document.getElementById("headerFixedHeight") != undefined) {
            document.getElementById("headerFixedHeight").style.position = "relative";
            document.getElementById("headerFixedHeight").style.top = "unset";
            document.getElementById("headerFixedHeight").style.left = "unset";
        }
        if(document.getElementById("banner-message") != undefined){
            document.getElementById("banner-message").classList.remove("mobile__banner-message");
        }
        if(document.getElementById("breadCrumbs") != undefined){
            document.getElementById("breadCrumbs").style.marginTop = "";
        }
        if(document.getElementById("sbLogoContainer") != undefined){
            document.getElementById("sbLogoContainer").style.width = "";
        }
        if(document.getElementById("sbLogo") != undefined){
            document.getElementById("sbLogo").style.height = "";
        	document.getElementById("sbLogo").style.width = "";
        }
        if(document.getElementById("sbBageLogoContainer") != undefined){
            document.getElementById("sbBageLogoContainer").style.width = "";
        }
        if(document.getElementById("sbBadgeLogo") != undefined){
            document.getElementById("sbBadgeLogo").style.height = "";
        	document.getElementById("sbBadgeLogo").style.width = "";
        }
        if(document.getElementById("headerNav") != undefined){
            document.getElementById("headerNav").style.height = "";
        	document.getElementById("headerNav").style.padding = "";
        }
        if(document.getElementById("contactUs") != undefined){
            document.getElementById("contactUs").style.paddingLeft = "";
        }
        if(document.getElementById("contactUsLink") != undefined){
            document.getElementById("contactUsLink").style.paddingLeft = "";
        }
        if(document.getElementById("headerWithMenu") != undefined){
            document.getElementById("headerWithMenu").style.height = "";
        }
        if(document.getElementById("headerButton") != undefined){
            document.getElementById("headerButton").style.fontSize = "";
            document.getElementById("headerButton").style.lineHeight = "";
            document.getElementById("headerButton").style.padding = "";
            document.getElementById("headerButton").style.height = "";
            document.getElementById("headerButton").style.width = "";
            
            document.getElementById("headerButton").innerHTML = "<div class=\"header__button--left\" id=\"buttonLeft\"> <span id=\"signIntoYour1\">Sign into your</span> <span id=\"signIntoYour2\">dashboard</span> </div><div class=\"header__button--right\"> <i class=\"header__button--icon ms-icn_profile_dashboard\"></i> </div>";
        }
        
	}
}