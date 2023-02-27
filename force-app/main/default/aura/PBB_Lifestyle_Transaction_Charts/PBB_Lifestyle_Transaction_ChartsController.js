/**
 * Created by Mykhailo Reznyk on 12.11.2019.
 */
({
    scriptLoaded : function(component, event, helper) {
        helper.fetchRollUpTransactions(component);
        helper.fetchNarrativeTransactions(component);
    }
})