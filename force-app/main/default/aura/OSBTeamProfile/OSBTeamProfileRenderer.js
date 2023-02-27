({
	afterRender: function (component) {
        this.superAfterRender();
        var teamDetails = document.getElementById("teamDetails");
        var approvals = document.getElementById("approvals");
        var inviteMembers = document.getElementById("inviteMembers");
        var activeTab = component.get("v.section");
        if(activeTab === 'Team_Details'){
            if(inviteMembers.classList.contains("marketplace__navigation-item__selected")){
                inviteMembers.classList.remove("marketplace__navigation-item__selected");
            }
            teamDetails.classList.add("marketplace__navigation-item__selected");
        } else if(activeTab === 'Approvals'){
            if(inviteMembers.classList.contains("marketplace__navigation-item__selected")){
                inviteMembers.classList.remove("marketplace__navigation-item__selected");
            }
            approvals.classList.add("marketplace__navigation-item__selected");
        }
    }
})