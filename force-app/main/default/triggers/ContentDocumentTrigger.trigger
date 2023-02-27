trigger ContentDocumentTrigger on ContentDocument (before delete) {
    TriggerManager.instance.execute();
}