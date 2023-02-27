/**
 * Controller class for osbMiniMallFilter,osbCategoriesLwc  component
 *
 * @author Litha Nosekeleza (litha.nosekeleza@standardbank.co.za)
 * @date October 2021
 */
public class OSB_MiniMallCustomMetadata_CTRL {

    /**
     * Returns a list of categories from metadata of available categories
     *
	 * @param userId String of user ID
	 * 
     * @return List of OSB_MiniMall__mdt
     **/
    @AuraEnabled( cacheable=true )
    public static List<OSB_MiniMall__mdt> fetchMetaListLwc(Id userId) {       
        List<OSB_MiniMall__mdt> fetchMeta = OSB_MiniMall__mdt.getAll().values();
        List<OSB_MiniMall__mdt> result;
        List<Knowledge__kav> solutionsAvailable = OSB_SolutionShowcase_CTRL.getSolutionShowcase(userId);
        Set<OSB_MiniMall__mdt> availableCategories = new Set<OSB_MiniMall__mdt>();
        
        if(fetchMeta.size() > 0){
               for(OSB_MiniMall__mdt metaCategory : fetchMeta ){
                   if(solutionsAvailable != null){
                        for(Knowledge__kav solutions : solutionsAvailable){
                            if(solutions.Is_coming_soon__c == false){
                            	if(solutions.Categories__c == metaCategory.MasterLabel){
                                	availableCategories.add(metaCategory);
                            	}                                
                            }
                        }
                   }
            }
          	result  = new List<OSB_MiniMall__mdt>();
        	result.addAll(availableCategories); 
        }   
        return result;
    }

}