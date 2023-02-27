/**
 * Created by mrzepinski on 24.08.2020.
 */

({
    showToast: function (cmp, title, message, variant) {
    		cmp.find('notifLib').showToast({
                "title": title,
                "message": message,
    			"variant" : variant ? variant : 'info'
            });
    	}
});