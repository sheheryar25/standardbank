({
	init : function() {
		document.body.style.overflow = 'hidden';
	},

    handleDestroy: function() {
		document.body.style.overflow = 'inherit';
    }
})