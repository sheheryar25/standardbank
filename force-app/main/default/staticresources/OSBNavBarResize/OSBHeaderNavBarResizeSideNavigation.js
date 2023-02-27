window.onscroll = function() {scrollFunction()};

function scrollFunction() {

	var navMenu = document.getElementsByClassName('apidetails__method');
	let fromTop = window.scrollY + 200;
	console.log('NavMenu ' + navMenu);
	if(navMenu){
		if(navMenu.dataset){
			navMenu.forEach(menuItem => {
				let section = document.getElementById(menuItem.dataset.href);
				if(section.offsetTop <= fromTop && section.offsetTop + section.offsetHeight > fromTop) {
					 menuItem.classList.add("apidetails__method__selected");
				} else {
					 menuItem.classList.remove("apidetails__method__selected");
				}
			});
		}
	}

	if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
        if(document.getElementById("header") != undefined){
            document.getElementById("header").style.height = "60px";
			document.getElementById("header").style.padding = "10px 0px 5px 0px";
        }
        if(document.getElementById("sbLogoContainer") != undefined){
            document.getElementById("sbLogoContainer").style.width = "141px";
        }
        if(document.getElementById("sbLogo") != undefined){
            document.getElementById("sbLogo").style.height = "35px";
        	document.getElementById("sbLogo").style.width = "140px";
        }
        if(document.getElementById("headerButton") != undefined){
            document.getElementById("headerButton").style.height = "60px";
        	document.getElementById("headerButton").style.margin = "0px";
            document.getElementById("headerButton").innerHTML = "<div class=\"header__button--right\"> <i class=\"header__button--icon ms-icn_profile_dashboard\"></i> </div>";
        }
        if(document.getElementById("buttonContainer") != undefined){
            document.getElementById("buttonContainer").style.height = "60px";
        	document.getElementById("buttonContainer").style.width = "90px";
        }
        if(document.getElementById("headerNav") != undefined){
            document.getElementById("headerNav").style.width = "992px";
        }

        //document.getElementById("buttonContainer").style.marginLeft = "162px";


	}
    else {
		if(document.getElementById("header") != undefined){
            document.getElementById("header").style.height = "";
			document.getElementById("header").style.padding = "";
        }
        if(document.getElementById("sbLogoContainer") != undefined){
            document.getElementById("sbLogoContainer").style.width = "";
        }
        if(document.getElementById("sbLogo") != undefined){
            document.getElementById("sbLogo").style.height = "";
        	document.getElementById("sbLogo").style.width = "";
        }
        if(document.getElementById("headerButton") != undefined){
            document.getElementById("headerButton").style.height = "";
        	document.getElementById("headerButton").style.margin = "";
            document.getElementById("headerButton").innerHTML = "<div class=\"header__button--left\"> <span>Sign into your</span> <span>dashboard</span> </div> <div class=\"header__button--right\"> <i class=\"header__button--icon ms-icn_profile_dashboard\"></i> </div>";
        }
        if(document.getElementById("buttonContainer") != undefined){
            document.getElementById("buttonContainer").style.height = "";
        	document.getElementById("buttonContainer").style.width = "";
        }
        if(document.getElementById("headerNav") != undefined){
            document.getElementById("headerNav").style.width = "";
        }
	}
}
