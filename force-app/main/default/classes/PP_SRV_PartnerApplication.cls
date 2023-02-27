/**
 * Service Class for PP_PartnerApplication__c sObject
 *
 * @author Syed Ovais Ali (syed.ali@standardbank.co.za)
 * @date July 2021
 */
public with sharing class PP_SRV_PartnerApplication implements IService {
    
    /**
    * @description  : IService Instance
    *
    * @author Syed Ovais Ali (syed.ali@standardbank.co.za)
    * @return IService
    * @date July 2021
    */
    public static IService newInstance() {
        return (IService) ORG_Application.service.newInstance(IService.class);
    }
    
    /**
    * @description  : IService Interface
    *
    * @author Syed Ovais Ali (syed.ali@standardbank.co.za)
    * @date July 2021
    */
    public interface IService {
        /**
        * @description  : Save Partner Application Record
        * @param newPartnerApplications
     	* @param uow
        * @author Syed Ovais Ali (syed.ali@standardbank.co.za)
        * @date July 2021
        */
        void savePartnerApplication(List<PP_PartnerApplication__c> newPartnerships, fflib_ISObjectUnitOfWork uow);
    }    
    
     /**
     * Create Partner Application
     *
     * @param newPartnerApplications with filled fields
     * @param uow - unit of work used to register new Partner Application
     **/
    public void savePartnerApplication(List<PP_PartnerApplication__c> newPartnerApplications, fflib_ISObjectUnitOfWork uow) {
        for(PP_PartnerApplication__c partnerApplication : newPartnerApplications) {
            uow.registerNew(partnerApplication);
        }
        uow.commitWork();
    }
}