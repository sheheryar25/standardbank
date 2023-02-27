({
	showToast: function (cmp, title, message, variant) {
		cmp.find('notifLib').showToast({
            "title": title,
            "message": message,
			"variant" : variant ? variant : 'info'
        });
	}
})