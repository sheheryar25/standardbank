/**
 * @description US-4418 The class validates values added to Product and recalculates Revenue Values on Product
 * @author jmilosz@deloittece.com
 * @date Jan 2020
*/
@SuppressWarnings('PMD.StdCyclomaticComplexity, PMD.CyclomaticComplexity, PMD.NcssMethodCount')
public with sharing class DMN_SB_Product extends fflib_SObjectDomain{

    public static final String GPP_CASH_MANAGEMENT = 'Cash Management';
    public static final String GPP_INVESTOR_SERVICES = 'Investor Services';
    public static final String GPP_LOANS = 'Loans';
    public static final String GPP_EQUITY_FINANCE = 'Equity Finance';
    public static final String GPP_ADVISORY_FEES = 'Advisory Fees';
    public static final String PP_GUARANTEES = 'Guarantees';
    public static final String OBJ_NAME = SB_Product__c.SObjectType.getDescribe().getName();
    public static final String RT_ADVISORY = 'Advisory';
    public static final String RT_CAPITAL_MARKETS = 'Capital_Markets';
    public static final String RT_COMMB_LENDING = 'CommB_Lending';
    public static final String RT_COMMB = 'Commercial_Banking';
    public static final String RT_LENDING_COMMIT = 'Lending_Deposits';
    public static final String RT_PRIM_ARRANGE_ADV = 'Primary_Arranging_Advisory';
    public static final String RT_TRADING_FLOW = 'Trading_Flow';
    public static final String RT_TRADING_STRUCTURE = 'Trading';
    public static final String RT_TRANSACTIONAL_2014 = 'Transactional_New';
    public static final String RT_TRANSACTIONAL_LEGACY = 'Transactional';
    public static final String RT_INSURANCE = 'Insurance';
    public static final String RT_TPS2022 = 'TPS_2022';
    public static final String FREQ_ONCE_OFF = 'Once off';
    public static final String FREQ_MONTHLY = 'Monthly';
    public static final String FREQ_QUARTERLY = 'Quarterly';
    public static final String FREQ_ANNUAL = 'Annual';
    public static final String FREQ_BIANNUAL = 'Bi-annual';

    public static final Set<Id> CIB_RECORDTYPE_IDS = new Set<Id>{
            UTL_RecordType.getRecordTypeId(OBJ_NAME, RT_PRIM_ARRANGE_ADV),
            UTL_RecordType.getRecordTypeId(OBJ_NAME, RT_TRADING_FLOW),
            UTL_RecordType.getRecordTypeId(OBJ_NAME, RT_TRANSACTIONAL_2014),
            UTL_RecordType.getRecordTypeId(OBJ_NAME, RT_CAPITAL_MARKETS),
            UTL_RecordType.getRecordTypeId(OBJ_NAME, RT_LENDING_COMMIT),
            UTL_RecordType.getRecordTypeId(OBJ_NAME, RT_TRADING_STRUCTURE),
            UTL_RecordType.getRecordTypeId(OBJ_NAME, RT_TPS2022)
    };

    private static Boolean isFirstTimeTrigger = true;
    private static Boolean isNotYetValidated = true;
    @TestVisible private final static String ERROR = 'You cannot add or make changes to a Product on an Opportunity that is in Closed - Lost or Cancel stages.';
    

    /**
     * @description class for constructing SB_Product__c Domain instance
     *
     * @author Konrad Bruszewski
     * @date june 2021
     */
    public class Constructor implements fflib_SObjectDomain.IConstructable {

        /**
         * Constructs and returns new DMN_SB_Product instance with given records
         *
         * @param records
         *
         * @return New DMN_SB_Product instance
         */
        public fflib_SObjectDomain construct(List<SObject> records) {
            return new DMN_SB_Product(records);
        }
    }

    /**
     * DMN_SB_Product constructor
     *
     * @param records - set of records on which domain will be performing operations
     */
    public DMN_SB_Product(List<SObject> records) {
        super(records);
    }

    /**
	* Method to validate parent Opportunity
	*
	* @param products List of updated Product records.
	* @param id2OldRecords Map of old Product records before the update.
	*/
    public static void validateOpportunity (SB_Product__c[] products, Map<Id, SB_Product__c> id2OldRecords) {
        Set<Id> parentsIds = new Set<Id>();
        for (SB_Product__c prod : products){
            parentsIds.add(prod.Opportunity__c);
        }
        Map<Id, Opportunity> parentOpps = new Map<Id, Opportunity>([SELECT Id, StageName, IsClosed, IsWon FROM Opportunity WHERE Id IN :parentsIds]);
        if (!isNotYetValidated) {
            return;
        }
        for (SB_Product__c prod : products){
            Opportunity opp = parentOpps.get(prod.Opportunity__c);
            if (opp.StageName == DMN_Opportunity.ST_CLOSED_CANCEL ||
                    opp.StageName == DMN_Opportunity.ST_CLOSED_LOST   ) {
                if (id2OldRecords != null && id2OldRecords.get(prod.Id).ExchangeRate__c == prod.ExchangeRate__c) {
                    prod.Opportunity__c.addError(ERROR);
                } else if (id2OldRecords == null) {
                    prod.Opportunity__c.addError(ERROR);
                }
            }

        }
        isNotYetValidated = false;
    }

    /**
	* Method to calculate exchange rates
	*
	* @param products List of inserted Product records.
	* @return List of Product records to be updated.
	*/
    public static List<SB_Product__c> calculateExchangeRate (SB_Product__c[] products) {

        List<CurrencyType> conversion = new List<CurrencyType>([SELECT ConversionRate, IsoCode FROM CurrencyType]);
        Map<String, Decimal> isoCode2CurrencyType = new Map<String, Decimal>();
        for (CurrencyType curType : conversion){
            isoCode2CurrencyType.put(curType.IsoCode, curType.ConversionRate);
        }
        List<SB_Product__c> productsToUpdate = new List<SB_Product__c>();

        for (SB_Product__c prod : products){
            if (prod.ExchangeRate__c != isoCode2CurrencyType.get(prod.CurrencyIsoCode)) {
            prod.ExchangeRate__c = isoCode2CurrencyType.get(prod.CurrencyIsoCode);
                productsToUpdate.add(prod);
            }
        }
        return productsToUpdate;
    }

    /**
	* Method to recalculate exchange rates
	*
	* @param products List of updated Product records.
	* @param id2OldRecords Map of Id to Product records before update.
	*/
    public static void recalculateExchangeRate (SB_Product__c[] products, Map<Id, SB_Product__c> id2OldRecords) {
        Set<Id> parentsIds = new Set<Id>();
        List<SB_Product__c> siblingProductsToProcess = new List<SB_Product__c>();
        for (SB_Product__c prod : products){
            parentsIds.add(prod.Opportunity__c);
        }
        Map<Id, Opportunity> parentOpps = new Map<Id, Opportunity>([
                SELECT StageName,
                        IsClosed,
                        IsWon,
                        (SELECT ExchangeRate__c, CurrencyIsoCode FROM Products__r)
                FROM Opportunity
                WHERE Id IN :parentsIds]);
        if (isFirstTimeTrigger) {
            isFirstTimeTrigger = false;
            for (SB_Product__c prod : products){
                Opportunity opp = parentOpps.get(prod.Opportunity__c);
                    if (prod.Opportunity__c == opp.Id) {
                        if (!opp.IsClosed) {
                            siblingProductsToProcess.addAll(opp.Products__r);
                        }
                    }
            }
        }

        if (!siblingProductsToProcess.isEmpty()) {
            List<SB_Product__c> prds = calculateExchangeRate(siblingProductsToProcess);
            update prds;
        }

    }

    /**
    * Method to process SB Product records and create related estimated revenue schedule records accordingly.
    * SGPRT-1937 - Revenue Forecasting: Updated calculation of Fee Amount
    * @param id2OldRecords Map of old SB_Product records before the update.
    * @param newRecords List of updated SB_Product records.
    */
    public static void updateEstimatedRevenueSchedule(Map<Id, SB_Product__c> id2OldRecords, List<SB_Product__c> newRecords) {

        Map<Id, SB_Product__c> id2ProductsToProcess = new Map<Id, SB_Product__c>();
        Set<Id> relatedOppsIds = new Set<Id>();
        for (Integer i = 0, j = newRecords.size(); i < j; i++) {
            relatedOppsIds.add(newRecords[i].Opportunity__c);
        }
        Map<Id, Opportunity> relatedOpps = new Map<Id, Opportunity>([
                SELECT Id, Actual_Close_Date__c, StageName
                FROM Opportunity
                WHERE Id IN :relatedOppsIds
        ]);

        for (Integer i = 0, j = newRecords.size(); i < j; i++) {
            if (shouldCalculateERS(newRecords[i], id2OldRecords.get(newRecords[i].Id), relatedOpps.get(newRecords[i].Opportunity__c))) {
                id2ProductsToProcess.put(newRecords[i].Id, newRecords[i]);
            }
        }

        if (id2ProductsToProcess.keySet().size() == 0) {
            return ;
        }
        if (!System.isBatch()){
            createEstimatedRevenueSchedule(id2ProductsToProcess.keySet());
        }
    }

    /**
    * Future method to update (delete and insert) estimated revenue schedule records.
    * SGPRT-1937 - Revenue Forecasting: Updated calculation of Fee Amount
    * @param productIds Set of SB_Product Ids for which estimated revenue schedule records will be created.
    */
    @Future
    public static void createEstimatedRevenueSchedule(Set<Id> productIds) {

        Set<Id> cibRecordTypeIds = new Set<Id>{
                UTL_RecordType.getRecordTypeId(DMN_EstimatedRevenueSchedule.OBJ_NAME, DMN_EstimatedRevenueSchedule.RT_ESR_NII_NIR),
                UTL_RecordType.getRecordTypeId(DMN_EstimatedRevenueSchedule.OBJ_NAME, DMN_EstimatedRevenueSchedule.RT_ESR_NIR)

        };

        List<Estimated_Revenue_Schedule__c> relatedErs = [
                SELECT Id
                FROM Estimated_Revenue_Schedule__c
                WHERE Product__c IN :productIds
                AND RecordTypeId IN :cibRecordTypeIds
        ];
        if (relatedErs.size() > 0) {
            delete relatedErs;
        }

        List<SB_Product__c> prodsToProcess = [
                SELECT
                        Id, Opportunity__r.StageName,
                        Opportunity__r.CloseDate,
                        Opportunity__r.Actual_Close_Date__c,
                        Term_Tenor__c, CurrencyIsoCode,
                        Total_Fees__c, RecordTypeId,
                        Finance_Approved_Fee_Recognition__c,
                        Client__r.Client_Sector__c
                FROM SB_Product__c
                WHERE Id IN :productIds
                AND RecordTypeId IN :CIB_RECORDTYPE_IDS
        ];

        Id nirRecordTypeId = UTL_RecordType.getRecordTypeId(DMN_EstimatedRevenueSchedule.OBJ_NAME,
                DMN_EstimatedRevenueSchedule.RT_ESR_NIR);
        Id niiNirRecordTypeId = UTL_RecordType.getRecordTypeId(DMN_EstimatedRevenueSchedule.OBJ_NAME,
                DMN_EstimatedRevenueSchedule.RT_ESR_NII_NIR);

        Map<Id, List<Id>> esrRtId2ProdRtdIds = new Map<Id, List<Id>>{
                nirRecordTypeId => new List<Id>{
                        UTL_RecordType.getRecordTypeId(OBJ_NAME, RT_PRIM_ARRANGE_ADV),
                        UTL_RecordType.getRecordTypeId(OBJ_NAME, RT_TRADING_FLOW),
                        UTL_RecordType.getRecordTypeId(OBJ_NAME, RT_TRANSACTIONAL_2014)
                },
                niiNirRecordTypeId => new List<Id>{
                        UTL_RecordType.getRecordTypeId(OBJ_NAME, RT_CAPITAL_MARKETS),
                        UTL_RecordType.getRecordTypeId(OBJ_NAME, RT_LENDING_COMMIT),
                        UTL_RecordType.getRecordTypeId(OBJ_NAME, RT_TRADING_STRUCTURE),
                        UTL_RecordType.getRecordTypeId(OBJ_NAME, RT_TRADING_FLOW),
                        UTL_RecordType.getRecordTypeId(OBJ_NAME, RT_TPS2022)
                }
        };

        Date oppDate = System.today();
        Decimal feeAmount = 0.0;
        List<Estimated_Revenue_Schedule__c> esrsToInsert = new List<Estimated_Revenue_Schedule__c>();

        for (Integer i = 0, j = prodsToProcess.size(); i < j; i++) {
            SB_Product__c prod = prodsToProcess[i];
            oppDate =
                    prod.Opportunity__r.StageName == DMN_Opportunity.ST_DEVELOP || prod.Opportunity__r.StageName == DMN_Opportunity.ST_LEAD ?
                            prod.Opportunity__r.CloseDate :
                            prod.Opportunity__r.StageName == DMN_Opportunity.ST_CLOSED_WON ?
                                    prod.Opportunity__r.Actual_Close_Date__c :
                                    null;
            if (prod.Term_Tenor__c != null && oppDate != null) {
                if (prod.Term_Tenor__c > 1) {
                    oppDate = oppDate.addDays(1);
                    feeAmount = (prod.Total_Fees__c != null && prod.Finance_Approved_Fee_Recognition__c != null) ?
                            prod.Total_Fees__c * (prod.Finance_Approved_Fee_Recognition__c / 100) : 0;
                    esrsToInsert.add(
                            new Estimated_Revenue_Schedule__c(
                                    Fee_Amount__c = feeAmount,
                                    Estimated_Revenue_Date__c = oppDate,
                                    Product__c = prod.Id,
                                    CurrencyIsoCode = prod.CurrencyIsoCode,
                                    Updated_by_LEX__c = false,
                                    RecordTypeId = esrRtId2ProdRtdIds.get(nirRecordTypeId)
                                            .contains(prod.RecordTypeId) ? nirRecordTypeId : niiNirRecordTypeId
                            )
                    );

                    feeAmount = prod.Total_Fees__c != null ? (prod.Total_Fees__c - feeAmount) / (prod.Term_Tenor__c - 1) : 0;
                    for (Integer x = 1, y = (Integer) prod.Term_Tenor__c; x < y; x++) {
                        oppDate = oppDate.addMonths(1);
                        esrsToInsert.add(
                                new Estimated_Revenue_Schedule__c(
                                        Fee_Amount__c = feeAmount,
                                        Estimated_Revenue_Date__c = oppDate,
                                        Product__c = prod.Id,
                                        CurrencyIsoCode = prod.CurrencyIsoCode,
                                        Updated_by_LEX__c = false,
                                        RecordTypeId = esrRtId2ProdRtdIds.get(nirRecordTypeId)
                                                .contains(prod.RecordTypeId) ? nirRecordTypeId : niiNirRecordTypeId
                                )
                        );
                    }
                } else if (prod.Term_Tenor__c == 1){
                    esrsToInsert.add(
                            new Estimated_Revenue_Schedule__c(
                                    Fee_Amount__c = prod.Total_Fees__c,
                                    Estimated_Revenue_Date__c = oppDate.addDays(1),
                                    Product__c = prod.Id,
                                    CurrencyIsoCode = prod.CurrencyIsoCode,
                                    Updated_by_LEX__c = false,
                                    RecordTypeId = esrRtId2ProdRtdIds.get(nirRecordTypeId)
                                            .contains(prod.RecordTypeId) ? nirRecordTypeId : niiNirRecordTypeId
                            )
                    );
                }
            }
        }
        if (esrsToInsert.size() > 0) {
            insert esrsToInsert;
        }
    }

    /** @description
    * Method to calculate the CY Fees and CY Margin upon insert/update.
    * SGPRT-2153 - Revenue Forecasting: Update of CY Fees and CY Margin
    * @param products List of SB_Product records to be inserted/updated.
    * @param id2OldProducts Map of old SB_Product records before the update.
    */
    public static void calculateCYFeesAndMargin(List<SB_Product__c> products, Map<Id, SB_Product__c> id2OldProducts) {
        Map<Integer, Decimal> year2EsrMarginAmount = new Map<Integer, Decimal>();
        Map<Integer, Decimal> year2EsrFeeAmount = new Map<Integer, Decimal>();
        Date oppDate = System.today();
        Decimal feeAmount = 0.0;
        Decimal totalFeeAmount = 0.0;
        Decimal totalMarginAmount = 0.0;
        Decimal totalMargin = 0.0;

        Set<Id> oppIds = new Set<Id>();

        for (Integer i = 0, j = products.size(); i < j; i++) {
            oppIds.add(products[i].Opportunity__c);
        }

        Map<Id, Opportunity> relatedOpps = new Map<Id, Opportunity>();
        if (!oppIds.isEmpty()) {
            relatedOpps = new Map<Id, Opportunity>([
                SELECT StageName,
                    CloseDate,
                    Actual_Close_Date__c
                FROM Opportunity
                WHERE Id IN :oppIds
            ]);
        }

        List<SB_Product__c> prodsToProcess = new List<SB_Product__c>();
        for (Integer i = 0, j = products.size(); i < j; i++) {
            if (isCibRecordType(products[i].RecordTypeId)
                    && (id2OldProducts == null
                    || shouldCalculateERS(products[i],
                    id2OldProducts.get(products[i].Id),
                    relatedOpps.get(products[i].Opportunity__c)))) {
                prodsToProcess.add(products[i]);
            }
        }

        for (Integer i = 0, j = prodsToProcess.size(); i < j; i++) {
            SB_Product__c prod = prodsToProcess[i];
            oppDate =
                    relatedOpps.get(prod.Opportunity__c).StageName == DMN_Opportunity.ST_DEVELOP || 
                	relatedOpps.get(prod.Opportunity__c).StageName == DMN_Opportunity.ST_LEAD ?
                            relatedOpps.get(prod.Opportunity__c).CloseDate :
                            relatedOpps.get(prod.Opportunity__c).StageName == DMN_Opportunity.ST_CLOSED_WON ?
                                    relatedOpps.get(prod.Opportunity__c).Actual_Close_Date__c :
                                    null;
            if (prod.Term_Tenor__c != null && oppDate != null) {
                if (prod.Term_Tenor__c > 1) {
                    oppDate = oppDate.addDays(1);
                    totalMargin = prod.Total_Margin__c == null ? 0 : prod.Total_Margin__c;
                    year2EsrMarginAmount.put(oppDate.year(), totalMargin / prod.Term_Tenor__c);
                    feeAmount = (prod.Total_Fees__c != null && prod.Finance_Approved_Fee_Recognition__c != null) ?
                            prod.Total_Fees__c * (prod.Finance_Approved_Fee_Recognition__c / 100) : 0;
                    year2EsrFeeAmount.put(oppDate.year(), feeAmount);

                    feeAmount = prod.Total_Fees__c != null ? (prod.Total_Fees__c - feeAmount) / (prod.Term_Tenor__c - 1) : 0;
                    for (Integer x = 1, y = (Integer) prod.Term_Tenor__c; x < y; x++) {
                        oppDate = oppDate.addMonths(1);
                        totalFeeAmount = year2EsrFeeAmount.get(oppDate.year()) != null ? year2EsrFeeAmount.get(oppDate.year()) + feeAmount : feeAmount;
                        year2EsrFeeAmount.put(oppDate.year(), totalFeeAmount);
                        totalMargin = prod.Total_Margin__c == null ? 0 : prod.Total_Margin__c;
                        totalMarginAmount = year2EsrMarginAmount.get(oppDate.year()) != null ? year2EsrMarginAmount.get(oppDate.year()) + (totalMargin / prod.Term_Tenor__c) : (totalMargin / prod.Term_Tenor__c);
                        year2EsrMarginAmount.put(oppDate.year(), totalMarginAmount);
                    }
                    if (relatedOpps.get(prod.Opportunity__c).StageName == DMN_Opportunity.ST_DEVELOP || relatedOpps.get(prod.Opportunity__c).StageName == DMN_Opportunity.ST_LEAD) {
                        prod.Current_Year_Margin__c = year2EsrMarginAmount.get(System.today().year()) == null ? 0.0 : year2EsrMarginAmount.get(System.today().year());
                        prod.Current_Year_Fees__c = year2EsrFeeAmount.get(System.today().year()) == null ? 0.0 : year2EsrFeeAmount.get(System.today().year());
                    } else if (relatedOpps.get(prod.Opportunity__c).StageName == DMN_Opportunity.ST_CLOSED_WON) {
                        Integer currentYearOpp = relatedOpps.get(prod.Opportunity__c).Actual_Close_Date__c.year();
                        prod.Current_Year_Margin__c = year2EsrMarginAmount.get(currentYearOpp) == null ? 0.0 : year2EsrMarginAmount.get(currentYearOpp);
                        prod.Current_Year_Fees__c = year2EsrFeeAmount.get(currentYearOpp) == null ? 0.0 : year2EsrFeeAmount.get(currentYearOpp);
                    }
                } else if (prod.Term_Tenor__c == 1){
                    oppDate = oppDate.addDays(1);
                    totalMargin = prod.Total_Margin__c == null ? 0 : prod.Total_Margin__c;
                    year2EsrMarginAmount.put(oppDate.year(), totalMargin / prod.Term_Tenor__c);
                    feeAmount = prod.Total_Fees__c;
                    year2EsrFeeAmount.put(oppDate.year(), feeAmount);
                    if (relatedOpps.get(prod.Opportunity__c).StageName == DMN_Opportunity.ST_DEVELOP || relatedOpps.get(prod.Opportunity__c).StageName == DMN_Opportunity.ST_LEAD) {
                        prod.Current_Year_Margin__c = year2EsrMarginAmount.get(System.today().year()) == null ? 0.0 : year2EsrMarginAmount.get(System.today().year());
                        prod.Current_Year_Fees__c = year2EsrFeeAmount.get(System.today().year()) == null ? 0.0 : year2EsrFeeAmount.get(System.today().year());
                    } else if (relatedOpps.get(prod.Opportunity__c).StageName == DMN_Opportunity.ST_CLOSED_WON) {
                        Integer currentYearOpp = relatedOpps.get(prod.Opportunity__c).Actual_Close_Date__c.year();
                        prod.Current_Year_Margin__c = year2EsrMarginAmount.get(currentYearOpp) == null ? 0.0 : year2EsrMarginAmount.get(currentYearOpp);
                        prod.Current_Year_Fees__c = year2EsrFeeAmount.get(currentYearOpp) == null ? 0.0 : year2EsrFeeAmount.get(currentYearOpp);
                    }
                }
            }
            year2EsrFeeAmount.clear();
            year2EsrMarginAmount.clear();
        }
    }

    /**@description
    * Method to default Finance Approved Fee Recognition based on Client Sector value on Product Insert.
    * SGPRT-1703 - Revenue Forecasting: Creation of new product revenue fields
    * @param products SB_Products to be Inserted.
    */
    public static void defaultFinanceApprovedFeeRecognition(List<SB_Product__c> products) {
        Set<Id> relatedAccountIds = new Set<Id>();
        List<SB_Product__c> productsToProcess = new List<SB_Product__c>();

        for (Integer i = 0, j = products.size(); i < j; i++) {
            if (isCibRecordType(products[i].RecordTypeId)) {
                productsToProcess.add(products[i]);
                relatedAccountIds.add(products[i].Client__c);
            }
        }

        if (relatedAccountIds.size() == 0 || productsToProcess.size() == 0) {
            return;
        }

        Map<Id, Account> relateId2AccountsMap = new Map<Id, Account>([
                SELECT Client_Sector__c
                FROM Account
                WHERE Id IN :relatedAccountIds
        ]);

        setFinanceApprovedFeeRecognition(productsToProcess, relateId2AccountsMap);
    }

    /**@description
    * Method to default Finance Approved Fee Recognition based on Client Sector value
    * (Helper method and used in other DMN classes).
    * SGPRT-1703 - Revenue Forecasting: Creation of new product revenue fields
    * @param products List of SB_Product records to be inserted/updated.
    * @param id2AccountMap Map of Account records related to the products.
    */
    public static void setFinanceApprovedFeeRecognition(List<SB_Product__c> products, Map<Id, Account> id2AccountMap) {

        List<Product_Fee_Rec_Client_Sector_Map__c> mappingCustomSetting = Product_Fee_Rec_Client_Sector_Map__c.getAll().values();

        Map<String, Double> clientSector2Percents = new Map<String, Double>();

        for (Product_Fee_Rec_Client_Sector_Map__c mapping : mappingCustomSetting) {
            clientSector2Percents.put(mapping.Client_Sector__c, mapping.Product_Total_Revenue_Percentage__c);
        }

        for (Integer i = 0, j = products.size(); i < j; i++) {
            if (products[i].Grand_Parent_Product__c == GPP_CASH_MANAGEMENT
                    || products[i].Grand_Parent_Product__c == GPP_INVESTOR_SERVICES
                    || products[i].Parent_Product__c == PP_GUARANTEES) {
                products[i].Finance_Approved_Fee_Recognition__c = 1 / (products[i].Term_Tenor__c) * 100;
            } else if (products[i].Grand_Parent_Product__c == GPP_LOANS
                    || products[i].Grand_Parent_Product__c == GPP_EQUITY_FINANCE) {
                if (id2AccountMap.get(products[i].Client__c).Client_Sector__c == null
                        || id2AccountMap.get(products[i].Client__c).Client_Sector__c == '') {
                    products[i].Finance_Approved_Fee_Recognition__c = clientSector2Percents.get(DMN_Account.UNKNOWN_SECTOR);
                } else {
                    products[i].Finance_Approved_Fee_Recognition__c = id2AccountMap.get(products[i].Client__c) != null ?
                            clientSector2Percents.get(id2AccountMap.get(products[i].Client__c).Client_Sector__c) : 0;
                }
            } else {
                products[i].Finance_Approved_Fee_Recognition__c = 100;
            }
        }

    }
    
    private static Boolean shouldCalculateERS(SB_Product__c newProd, SB_Product__c oldProd, Opportunity opp) {
        return ((newProd!= null && oldProd != null && opp != null)
                && (((opp.StageName != null && opp.StageName == DMN_Opportunity.ST_CLOSED_WON
                            && opp.Actual_Close_Date__c != null
                            && opp.Actual_Close_Date__c.year() == System.today().year())
                        || opp.StageName != null && opp.StageName == DMN_Opportunity.ST_DEVELOP)
                    && ((newProd.Term_Tenor__c != null && oldProd.Term_Tenor__c != null
                            && newProd.Term_Tenor__c != oldProd.Term_Tenor__c)
                        || (newProd.Total_Fees__c != null && oldProd.Total_Fees__c != null
                            && newProd.Total_Fees__c != oldProd.Total_Fees__c)
                        || (newProd.Total_Margin__c != null && oldProd.Total_Margin__c != null
                            && newProd.Total_Margin__c != oldProd.Total_Margin__c)
                        || (newProd.Finance_Approved_Fee_Recognition__c != null
                            && oldProd.Finance_Approved_Fee_Recognition__c != null
                            && newProd.Finance_Approved_Fee_Recognition__c != oldProd.Finance_Approved_Fee_Recognition__c)
                        || (newProd.CurrencyIsoCode != null && oldProd.CurrencyIsoCode != null && newProd.CurrencyIsoCode != oldProd.CurrencyIsoCode))
                    && (newProd.SA_Net_P_L_Amount_in_R__c != null
                        && oldProd.SA_Net_P_L_Amount_in_R__c != null
                        && newProd.SA_Net_P_L_Amount_in_R__c == oldProd.SA_Net_P_L_Amount_in_R__c)
                    && (newProd.SA_Gross_P_L_Amount_in_R__c != null
                        && oldProd.SA_Gross_P_L_Amount_in_R__c != null
                        && newProd.SA_Gross_P_L_Amount_in_R__c == oldProd.SA_Gross_P_L_Amount_in_R__c)));
    }

    /**@description
    * Method to check for CIB record types.
    * SGPRT-1703 - Revenue Forecasting: Creation of new product revenue fields
    * @param recordTypeId recordType Id to compare against
     * @return Boolean indicating if recordtype belongs to CIB
    */
    public static Boolean isCibRecordType(Id recordTypeId) {
        return CIB_RECORDTYPE_IDS.contains(recordTypeId);
    }

    /**@description
    * Method to lock records which have approved fee recongition updated
    * SGPRT-2885 - Update to Finance Approved Fee field
    * @param products list of updated product records
    * @param oldProductsMap map of product records before update
    */
    public static void lockFinanceApprovedFeeRecognition(List<SB_Product__c> products, Map<Id, SB_Product__c> oldProductsMap) {
        for (SB_Product__c prod : products) {
            if (isWorkflowNotUpdating(prod, oldProductsMap.get(prod.Id))
                    && prod.Finance_Approved_Fee_Recognition__c != oldProductsMap.get(prod.Id).Finance_Approved_Fee_Recognition__c
                    && CIB_RECORDTYPE_IDS.contains(prod.RecordTypeId)) {
                prod.Locked_Fee_Recognition__c = true;
            }
        }
    }
    /**@description
    * Method to recalculate finance approved fee based on grand parent product
    * SGPRT-3051 - Fix for Finance Approved Fee Recognition
    * @param products list of updated product records
    * @param oldProductsMap map of product records before update
    */
    public static void updateFinanceApprovedFeeRecognition(List<SB_Product__c> products, Map<Id, SB_Product__c> oldProductsMap) {
        for (SB_Product__c prod : products) {
            if (isWorkflowNotUpdating(prod, oldProductsMap.get(prod.Id))
                    && (prod.Term_Tenor__c != oldProductsMap.get(prod.Id).Term_Tenor__c
                    || prod.Parent_Product__c != oldProductsMap.get(prod.Id).Parent_Product__c
                    || prod.Grand_Parent_Product__c != oldProductsMap.get(prod.Id).Grand_Parent_Product__c)
                    && prod.Term_Tenor__c != null
                    && prod.Term_Tenor__c >= 1
                    && CIB_RECORDTYPE_IDS.contains(prod.RecordTypeId)
                    && !prod.Locked_Fee_Recognition__c) {
                defaultFinanceApprovedFeeRecognition(products);
            }
        }
    }

    private static Boolean isWorkflowNotUpdating(SB_Product__c newProd, SB_Product__c oldProd) {
        return (newProd.SA_Net_P_L_Amount_in_R__c != null
                && oldProd.SA_Net_P_L_Amount_in_R__c != null
                && newProd.SA_Net_P_L_Amount_in_R__c == oldProd.SA_Net_P_L_Amount_in_R__c)
                && (newProd.SA_Gross_P_L_Amount_in_R__c != null
                && oldProd.SA_Gross_P_L_Amount_in_R__c != null
                && newProd.SA_Gross_P_L_Amount_in_R__c == oldProd.SA_Gross_P_L_Amount_in_R__c);
    }

    /**@description
    * Method to populate Bank Role field on Product Distribution every time Bank Role on related Product changes.
    * SGPRT-624
    * @param products list of updated product records
    * @param oldProductsMap map of product records before update
    */
    public static void populateBankRoleOnProdDistr(Map<Id, SB_Product__c> products, Map<Id, SB_Product__c> oldProductsMap) {
        SEL_ProductDistributions selProductsDistr = SEL_ProductDistributions.newInstance();
        List<Product_Distribution__c> prodDistr = selProductsDistr.selectByProductId(products.keySet());

        for (Product_Distribution__c pd : prodDistr){
            if (oldProductsMap.get(pd.Product__c).Bank_Role__c != products.get(pd.Product__c).Bank_Role__c){
                pd.Bank_Role__c = products.get(pd.Product__c).Bank_Role__c;
            }
        }
        if (!prodDistr.isEmpty()) {
            update prodDistr;
        }
    }

    /**@description
     * Trigger recalculation of fields from Risk and Distribution Management section on Business Assessments
     *
     * @param products
     * @param oldProductsMap
     * @param unitOfWork
     */
    public void populateDistributionAndRiskOnBusinessAssessment(Map<Id, SB_Product__c> products, Map<Id, SB_Product__c> oldProductsMap, fflib_ISObjectUnitOfWork unitOfWork) {
        Map<Id, Set<SB_Product__c>> businessAssessmentId2Products = new Map<Id, Set<SB_Product__c>>();
        Set<Id> opportunityIds = getOpportunityIdsOfModifiedProducts(products, oldProductsMap);

        if (opportunityIds.size() == 0 || !Assessment_Opportunity__c.SObjectType.getDescribe().isAccessible()
                || !Business_Assessment__c.SObjectType.getDescribe().isAccessible() || !Business_Assessment__c.SObjectType.getDescribe().isUpdateable()) {
            return;
        }
        // get assessment opportunities with business assessment ids and opportunity ids where opportunities are parents of modified products
        SEL_AssessmentOpportunities assessmentOpportunitiesSelector = SEL_AssessmentOpportunities.newInstance().withCrudAssert(false).withFlsEnforced(false);
        List<Assessment_Opportunity__c> assessmentOpportunities = assessmentOpportunitiesSelector.selectByOpportunityId(opportunityIds, false);
        if(assessmentOpportunities.isEmpty()){
            return;
        }
        //get ids of business assessments
        Set<Id> businessAssessmentIds = new Set<Id>();
        for (Assessment_Opportunity__c aop : assessmentOpportunities) {
            businessAssessmentIds.add(aop.Business_Assessment__c);
        }
        SEL_BusinessAssessments baSelector = SEL_BusinessAssessments.newInstance().withCrudAssert(false).withFlsEnforced(false);
        List<Business_Assessment__c> baRecords = baSelector.selectByIds(businessAssessmentIds, false);
        DMN_BusinessAssessment_Injectable baDomain = (DMN_BusinessAssessment_Injectable)ORG_Application.domain.newInstance(baRecords);
        baDomain.recalculateDistributionAndRiskManagementFields(unitOfWork);
    }

    private Set<Id> getOpportunityIdsOfModifiedProducts(Map<Id, SB_Product__c> products, Map<Id, SB_Product__c> oldProductsMap){
        Set<Id> opportunityIds = new Set<Id>();
        if(Trigger.isDelete) {
            for (Id productId : oldProductsMap.keySet()) {
                if (isDistributionAndRiskModified(products.get(productId), oldProductsMap.get(productId))) {
                    opportunityIds.add(oldProductsMap.get(productId).Opportunity__c);
                }
            }
        } else {
            for (Id productId : products.keySet()) {
                if (isDistributionAndRiskModified(products.get(productId), oldProductsMap.get(productId))) {
                    opportunityIds.add(products.get(productId).Opportunity__c);
                }
            }
        }
        return opportunityIds;
    }

    private static Boolean isDistributionAndRiskModified(SB_Product__c productNew, SB_Product__c productOld){
        return (productOld == null
                || productNew == null
                || productNew.Bank_Role__c != productOld.Bank_Role__c
                || productNew.SB_Gross_Participation__c != productOld.SB_Gross_Participation__c
                || productNew.SB_Hold__c != productOld.SB_Hold__c
                || productNew.SB_Sell_Down__c != productOld.SB_Sell_Down__c
                || productNew.Facility_Size__c != productOld.Facility_Size__c
                || productNew.Transaction_Type__c != productOld.Transaction_Type__c
        );
    }
}