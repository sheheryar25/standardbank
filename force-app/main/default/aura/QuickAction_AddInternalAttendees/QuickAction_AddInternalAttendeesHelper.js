({
    showToast: function(type, title, message) {
        var toast = $A.get('e.force:showToast');

        toast.setParams({
            'type': type,
            'title': title,
            'message': message
        });

        toast.fire();
    }
})