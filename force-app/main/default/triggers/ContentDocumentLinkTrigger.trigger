trigger ContentDocumentLinkTrigger on ContentDocumentLink (after insert) {
    TriggerManager.instance.execute();
}