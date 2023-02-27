/**
 * Created by tsobota on 09.08.2018.
 */
({
    submit : function (component) {
//        component.find("overlayLibFooter").notifyClose();
        component.get('v.parentHelper').submitAndRedirect(component.get('v.parentComponent'), component.get('v.parentHelper'));
    },
    cancel : function (component) {
        component.destroy();
//        component.get('v.parentComponent').find("overlayLib").notifyClose();
    }
})