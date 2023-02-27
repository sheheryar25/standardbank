/*************************************************************************************************************************************************************************
    @ Author        : Nitish Kumar
    @ Date          : May 2014
    @ Test File     : ClientPlanDashboardClass_Test
    @ Description   : Controller class for ClientPlanDashboard page.
    
     ** Modification Log****************************
  
   @Modified By : Nitish Kumar
   @Date :              July 2014
   Description :  Includes the UAT feedback Enhancement

    @ Last Modified By  : Petr Svestka
    @ Last Modified On  : Aug 11, 2015
    @ Modification Description : Force.com reviewer - Blocker and Critical issues - 20150608.xlsx
*************************************************************************************************************************************************************************/

public with sharing class ClientPlanDashboardClass {

    // Standard Account Object
    private final Account acct;
    public final WRP_Account accountObj {get;set;}
     //Global variables
    public String currentId; // Stores the Account Id
    public String currentUserId; // Stores the running user Id
   
   
   
    public String ISO { get;
        set;
    }  // Stores the Currency ISO code of Client Plan Object
    
    // Stores the viewing date of Client plan object
    public date crtDate {
        get;
        set;
    } 
    
     // Stores the viewing date of Client plan object
    public date viewDate {
        get;
        set;
    } 
    
    //Stores the client name
    public String ClientName {
        get;
        set;
    } 
    
    public list<string> countryLst {
    	get;
    	set;
    }
    
    // Stores the Client Plan name for an Account
    public String ClientPlanName {
        get;
        set;
    } 
    
    public integer countrySize {get ; set;}
    
    public map<String ,Integer> pieChartDivMap  {
    	get;
    	set;
    }
    
     public map<String ,Integer> pieChartCountryMap  {
    	get;
    	set;
    }
    
    public Integer totalCountrySum  {
    	get;
    	set;
    }
    
    public Integer totalDivSum  {
    	get;
    	set;
    }
    
    public list<sowDataGM> SoWGCRDataGM {
    	get;
    	set;
    }
    
    public list<sowDataTPS> SoWGCRDataTPS {
    	get;
    	set;
    }
    
    public list<sowDataIB> SoWGCRDataIB {
    	get;
    	set;
    }
    
    public list<pieChartDiv> DataPieChartByDiv {
    	get;
    	set;
    }
    
    
    public list<pieChartCountry> DataPieChartByCountry {
    	get;
    	set;
    }
    
    public list<gaugeDataGM> gaugeDataGM {
    	get ;
    	set;
    }
    
     public list<gaugeDataIB> gaugeDataIB {
    	get ;
    	set;
    }
    
     public list<gaugeDataTPS> gaugeDataTPS {
    	get ;
    	set;
    }
    
    public List<barData> DataTotal {
    	get ;
    	set ;
    }
    
    public list<sowData> SoWGCRTotal {
    	get ;
    	set ;
    	
    }
    
    public list<historyData> barHistoryData {
    	get ;
    	set;
    }
    
    public List<creditData> CreditTotal{
    	get ;
    	set ;
    }
    
    public list<sowDataAll> lstsowDataTotal {
    	get;
    	set;
    }
    
    public List<cPlanOpportunity> OpportunitylstAll {get;set;}
    public List<cPlanOpportunity> OpportunitylstGlobalMarkets {get;set;}
    public List<cPlanOpportunity> OpportunitylstTPS           {get;set;}
    public List<cPlanOpportunity> OpportunitylstIB            {get;set;}
    public String UserDivision                               {get;set;}
    
    public decimal CROCZAR {get;set;}
    public decimal capUtilization {get;set;}
    public Boolean barChartOne {get;set;}
    public Boolean barChartTwo {get;set;}
    public Boolean barChartThree {get;set;}
    public Boolean barChartFour {get;set;}
    public Boolean barChartFive {get;set;}
    public Boolean barChartSix {get;set;}
    public Boolean barChartSeven {get;set;}
    public Boolean barChartEight {get;set;}
    public Boolean barChartNine {get;set;}
    public Boolean barChartTen {get;set;}
    public Boolean barChartEleven {get;set;}
    public Boolean barChartTwelve {get;set;}
    public Boolean barChartThirteen {get;set;}
   

     public String cPlanCurrency = ''; // Default Currency picklist value 
     public String cPlanCurrencyTop = ''; // Default Currency picklist value
         
    //Storing the Client Plan Object 
    public Client_Plan__c[] cPlan = new Client_Plan__c[1];
    
    /*public Map < String, Double > RateMap = new Map < String, Double > (); // Map for storing Currency code as key and rate of conversion as value
    public List < CurrencyType > CurrTable = new List < CurrencyType > (); //List of object used in Currency conversion
    */
    CurrencyConverter converter;

    public Boolean disableEdit {get;set;}

    // Constructor    
    Public ClientPlanDashboardClass(ApexPages.StandardController controller) {
       
        Apexpages.currentPage().getHeaders().put('X-UA-Compatible', 'IE=9');
     
        if (!Test.isRunningTest()) {
            //Adding these fields to avoid additional SOQL query.
            controller.addFields(new List < String > {
                'name', 'CurrencyIsoCode'
            });
        }

        //Setting the public variables       
        this.acct = (Account) controller.getRecord();
        this.currentId = this.acct.Id;

        list<Account> acc = [Select Id
                              , Name 
                              , Economic_Group_Parent_Client_Name__c 
                        FROM Account WHERE Id =: this.currentId 
                        LIMIT 1];

        if(acc.isEmpty())
            return;

        accountObj = new WRP_Account(acc[0]);

        this.currentUserId = UserInfo.getUserId();
        this.ClientName = this.acct.Name;
        ClientPlanName = 'Client Plan Dashboard : ' + ClientName;
         
        this.cPlan = [Select Id, LastModifiedDate, CurrencyIsoCode from Client_Plan__c where Client_Name__c = : currentId order By LastModifiedDate desc limit 1];
       
         Global_Client_Revenue__c[] gcRecord = [SELECT Snapshot_Date__c FROM Global_Client_Revenue__c  WHERE Client__c =: currentId AND RecordType.Name = 'Current & Previous Year' limit 1] ;
         
         if (!gcRecord.isEmpty())
            crtDate = gcRecord[0].Snapshot_Date__c ;
       
        if (!cPlan.isEmpty()){
            this.ISO = cPlan[0].CurrencyIsoCode ;
        }
        else{
            this.ISO = 'ZAR';
        }
        
        
        
        disableEdit= false;
        viewDate= date.today();
        
        //Get the currency conversion rates
        //snapCurrencyTable();
        converter = new CurrencyConverter();
        
        SoWGCRGMTotal();
        Opportunitylst();
        DataPieChart();
        crocCapitalUtilization();
        DataPieChartByDiv = PieChartDataByDiv();
        DataPieChartByCountry  =  PieChartDataByCountry();
        DataTotal = DataTotalBarChart();
        SoWGCRTotal = SoWGCRAll();
        barHistoryData = HistoryBarData();
        CreditTotal = CreditLineTotal();
        sowDataTotal() ;
       
    }
    
    /**
     * @author :- Nitish Kumar
     * @date  :-  May-2014
     * @description :- Public String method which gets the Client Plan currency Iso code.
     * @param :- N/A
     * @return :- String
     **/
    
    public String getcPlanCurrency() {
         if (ISO != null){
        return ISO;
        }
        else {
                return 'ZAR' ;
        }
       }
    
    /**
     * @author :- Nitish Kumar
     * @date  :-  May -2014
     * @description :- Public String method which gets the Client Plan Dashboard currency Iso code.
     * @param :- N/A
     * @return :- String
     **/
    
    public String getcPlanCurrencyTop() {
           if (ISO != null){
        return ISO;
        }
        else {
                return 'ZAR' ;
        }
    }
    
     /**
     * @author :- Nitish Kumar
     * @date  :-  May -2014
     * @description :- Public String method which sets the Client Plan Dashboard currency Iso code.
     * @param :- N/A
     * @return :- null
     **/
    public void setcPlanCurrency(String iso) {
        
          cPlanCurrency = iso;
          
    }
    
    /**
     * @author :- Nitish Kumar
     * @date  :-  May -2014
     * @description :- Public String method which sets the Client Plan Dashboard currency Iso code.
     * @param :- N/A
     * @return :- null
     **/
    public void setcPlanCurrencyTop(String iso) {
          cPlanCurrencyTop = iso;
          
    }
   
    /**
     * @author :- Nitish Kumar
     * @date  :-  May -2014
     * @description :- Public list method which builds and returns the list of Options of Currency (ZAR and USD) .
     * @param :- N/A
     * @return :- List of options.
     **/
    public List < SelectOption > getCurrencies() {
        List < SelectOption > currencies = new List < SelectOption > ();
        currencies.add(new SelectOption('USD', 'U.S. Dollar'));
        currencies.add(new SelectOption('ZAR', 'South African Rand'));
        return currencies;
    }
    
     /**
     * @author :- Nitish Kumar
     * @date  :-  May -2014
     * @description :- Public pagerefrence method which refreshes the Client Plan Dashboard page and changes the currency .
     * @param :- N/A
     * @return :- Pagereference
     **/
    public PageReference refreshPage() {
        setcPlanCurrencyTop(cPlanCurrencyTop);
        setcPlanCurrency(cPlanCurrencyTop);
        this.ISO = cPlanCurrencyTop ;
        DataTotal = DataTotalBarChart();
        SoWGCRGMTotal();
        Opportunitylst();
        DataPieChart();
        crocCapitalUtilization();
        DataPieChartByDiv = PieChartDataByDiv();
        DataPieChartByCountry  =  PieChartDataByCountry();
        SoWGCRTotal = SoWGCRAll();
        barHistoryData = HistoryBarData();
        CreditTotal = CreditLineTotal();
        sowDataTotal();
        return null;
    }
    
     /**
     * @author :- Nitish Kumar
     * @date  :-  May -2014
     * @description :- Public pagerefrence method which refreshes the Client Plan Dashboard page and changes the currency .
     * @param :- N/A
     * @return :- Pagereference
     **/
    public PageReference refreshPage1() {
    	 setcPlanCurrency(cPlanCurrency);
        setcPlanCurrencyTop(cPlanCurrency);
        this.ISO = cPlanCurrency ;
        DataTotal = DataTotalBarChart();
        SoWGCRGMTotal();
        Opportunitylst();
        DataPieChart();
        crocCapitalUtilization();
        DataPieChartByDiv = PieChartDataByDiv();
        DataPieChartByCountry  =  PieChartDataByCountry();
        SoWGCRTotal = SoWGCRAll();
        barHistoryData = HistoryBarData();
        CreditTotal = CreditLineTotal();
        sowDataTotal();
        return null;
    }
     
     /**
     * @author :- Nitish Kumar
     * @date  :-  May -2014
     * @description :- Public List<barData> method which contains the data which will be shown on the dashboard.
     * @param :- N/A
     * @return :- List<barData>
     **/
     public List<barData> DataTotalBarChart() {
        
         
             if(currentId != null || currentId != ''){
         
           //Querying all the Global Client Revenue for the account
                    Global_Client_Revenue__c[] globalClientRevenueForClient = [SELECT 
                                                                        Snapshot_Date__c,
                                                                        Reporting_Country__c, 
                                                                        Trading_Division__c, 
                                                                        Budget_ZAR_Next_Year__c , 
                                                                        Client_Value_ZAR_Current_Year__c , 
                                                                        Client_Value_ZAR_Previous_Year__c ,
                                                                        Budget_USD_Next_Year__c , 
                                                                        Client_Value_USD_Current_Year__c, 
                                                                        Client_Value_USD_Previous_Year__c 
                                                                      FROM 
                                                                        Global_Client_Revenue__c 
                                                                      WHERE 
                                                                        Client__c =: currentId
                                                                      AND RecordType.Name = 'Current & Previous Year'
                                                                      ORDER BY Client_Value_ZAR_Current_Year__c DESC NULLS LAST ];
               
               //USD Values   
               Decimal totalCurrentYearUsdGM = 0;
               Decimal totalPreviousYearUsdGM = 0;
               Decimal totalCurrentYearUsdTPS = 0;
               Decimal totalPreviousYearUsdTPS = 0;
               Decimal totalCurrentYearUsdIB = 0;
               Decimal totalPreviousYearUsdIB = 0;
               Decimal totalCurrentYearUsdOTHER = 0;
               Decimal totalPreviousYearUsdOTHER = 0;                                                    
               List<barData> dataUSD = new List<barData>();
                            
               
               //ZAR Values
               Decimal totalCurrentYearZARGM = 0;
               Decimal totalPreviousYearZARGM = 0;
               Decimal totalCurrentYearZARTPS = 0;
               Decimal totalPreviousYearZARTPS = 0;
               Decimal totalCurrentYearZARIB = 0;
               Decimal totalPreviousYearZARIB = 0;
               Decimal totalCurrentYearZAROTHER = 0;
               Decimal totalPreviousYearZAROTHER = 0;                                                    
               List<barData> dataZAR = new List<barData>();   
               
               if (globalClientRevenueForClient.size() >0 ){
                
                // Looping the records to do the calculation for Current Year Revenue and Previous year revenue 
               for(Global_Client_Revenue__c gCRFCR : globalClientRevenueForClient ){
                 
                 //Calculation for GM Division
                 if(gCRFCR.Trading_Division__c == 'GM'){
                    totalCurrentYearUsdGM = totalCurrentYearUsdGM + Math.roundToLong((double)(gCRFCR.Client_Value_USD_Current_Year__c/1000));
                    totalPreviousYearUsdGM = totalPreviousYearUsdGM + Math.roundToLong((double)(gCRFCR.Client_Value_USD_Previous_Year__c/1000));
                    totalCurrentYearZARGM = totalCurrentYearZARGM +  Math.roundToLong((double)(gCRFCR.Client_Value_ZAR_Current_Year__c/1000));
                    totalPreviousYearZARGM = totalPreviousYearZARGM + Math.roundToLong((double)(gCRFCR.Client_Value_ZAR_Previous_Year__c/1000));
                 }
                 
                  //Calculation for TPS Division
                  if(gCRFCR.Trading_Division__c == 'TPS'){
                    totalCurrentYearUsdTPS = totalCurrentYearUsdTPS + Math.roundToLong((double)(gCRFCR.Client_Value_USD_Current_Year__c/1000));
                    totalPreviousYearUsdTPS = totalPreviousYearUsdTPS + Math.roundToLong((double)(gCRFCR.Client_Value_USD_Previous_Year__c/1000));
                    totalCurrentYearZARTPS = totalCurrentYearZARTPS + Math.roundToLong((double)(gCRFCR.Client_Value_ZAR_Current_Year__c/1000));
                    totalPreviousYearZARTPS = totalPreviousYearZARTPS + Math.roundToLong((double)(gCRFCR.Client_Value_ZAR_Previous_Year__c/1000));
                 }
                 
                  //Calculation for IB Division
                  if(gCRFCR.Trading_Division__c == 'IB'){
                    
                    totalCurrentYearUsdIB = totalCurrentYearUsdIB + Math.roundToLong((double)(gCRFCR.Client_Value_USD_Current_Year__c/1000));
                    totalPreviousYearUsdIB = totalPreviousYearUsdIB + Math.roundToLong((double)(gCRFCR.Client_Value_USD_Previous_Year__c/1000));
                    totalCurrentYearZARIB = totalCurrentYearZARIB + Math.roundToLong((double)(gCRFCR.Client_Value_ZAR_Current_Year__c/1000));
                    totalPreviousYearZARIB = totalPreviousYearZARIB + Math.roundToLong((double)(gCRFCR.Client_Value_ZAR_Previous_Year__c/1000));
                 }
                 
                 
                 
                  //Calculation for Other Division
                  if(gCRFCR.Trading_Division__c == 'OTHER'){
                    totalCurrentYearUsdOTHER = totalCurrentYearUsdOTHER +  Math.roundToLong((double)(gCRFCR.Client_Value_USD_Current_Year__c/1000));
                    totalPreviousYearUsdOTHER = totalPreviousYearUsdOTHER +  Math.roundToLong((double)(gCRFCR.Client_Value_USD_Previous_Year__c/1000));
                    totalCurrentYearZAROTHER = totalCurrentYearZAROTHER +  Math.roundToLong((double)(gCRFCR.Client_Value_ZAR_Current_Year__c/1000));
                    totalPreviousYearZAROTHER = totalPreviousYearZAROTHER +  Math.roundToLong((double)(gCRFCR.Client_Value_ZAR_Previous_Year__c/1000));
                 }
                
                 } 
               }
               // Creating the wrapper list for USD values
               if(Integer.valueOf(totalPreviousYearUsdOTHER) != 0 || Integer.valueOf(totalCurrentYearUsdOTHER) != 0){
               dataUSD.add(new barData('OTHERS', Integer.valueOf(totalCurrentYearUsdOTHER) ,Integer.valueOf(totalPreviousYearUsdOTHER) ));  
               }
               if(Integer.valueOf(totalPreviousYearUsdTPS) != 0 || Integer.valueOf(totalCurrentYearUsdTPS) != 0){
               dataUSD.add(new barData('TPS', Integer.valueOf(totalCurrentYearUsdTPS) ,Integer.valueOf(totalPreviousYearUsdTPS) ));
               }
               if(Integer.valueOf(totalCurrentYearUsdIB) != 0 || Integer.valueOf(totalPreviousYearUsdIB) != 0){
               dataUSD.add(new barData('IB', Integer.valueOf(totalCurrentYearUsdIB) ,Integer.valueOf(totalPreviousYearUsdIB) ));
               }
               if(Integer.valueOf(totalCurrentYearUsdGM) != 0 || Integer.valueOf(totalPreviousYearUsdGM) != 0){
               dataUSD.add(new barData('GM', Integer.valueOf(totalCurrentYearUsdGM) ,Integer.valueOf(totalPreviousYearUsdGM) ));
               }
               
               // Creating the wrapper list for ZAR values
               if(Integer.valueOf(totalCurrentYearZAROTHER) != 0 || Integer.valueOf(totalPreviousYearZAROTHER) != 0){
               dataZAR.add(new barData('OTHERS', Integer.valueOf(totalCurrentYearZAROTHER) ,Integer.valueOf(totalPreviousYearZAROTHER) )); 
               }
               if(Integer.valueOf(totalCurrentYearZARTPS) != 0 || Integer.valueOf(totalPreviousYearZARTPS) != 0){
               dataZAR.add(new barData('TPS', Integer.valueOf(totalCurrentYearZARTPS) ,Integer.valueOf(totalPreviousYearZARTPS) ));
               }
               if(Integer.valueOf(totalCurrentYearZARIB) != 0 || Integer.valueOf(totalPreviousYearZARIB) != 0){
               dataZAR.add(new barData('IB', Integer.valueOf(totalCurrentYearZARIB) ,Integer.valueOf(totalPreviousYearZARIB) ));
               }
               if(Integer.valueOf(totalCurrentYearZARGM) != 0 || Integer.valueOf(totalPreviousYearZARGM) != 0){
               dataZAR.add(new barData('GM', Integer.valueOf(totalCurrentYearZARGM) ,Integer.valueOf(totalPreviousYearZARGM) ));
               }
               
               barChartOne = false ;
               
              // Return the list based on the selected currency 
              if (this.ISO == 'ZAR'){
              	if (dataZAR.size() == 0){
              		barChartOne = true ;
              		dataZAR.add(new barData('', 0 ,0));
              	}
                return dataZAR ;
               }
              else{
              	if (dataUSD.size() == 0){
              		barChartOne = true ;
              		dataUSD.add(new barData('', 0 ,0));
              	}
              return dataUSD ;
                }                                                    
               }
               else{
               	return null ;
               }
             
         }
         
         
        /**
         * @author :- Nitish Kumar
         * @date  :-  May -2014
         * @description :- Public List<creditData> method which contains the data which will be shown on the dashboard.
         * @param :- N/A
         * @return :- List<creditData>
         **/
         
         public List<creditData> CreditLineTotal() {
            
             if(currentId != null || currentId != ''){
                
                 //Calling the Currency convertor method
                //currencyConverter converter = new currencyConverter();
                
                //local variables used in currency conversion
                Decimal cLim = 0.0;
                Decimal tUtl = 0.0;
                
                list<creditData> creditlst = new list<creditData>();
                barChartTwelve = false ;
                
                //Querying all the Credit Line Record for the account
                Boolean isEconomicGroupParent = accountObj.getIsEconomicGroupParent();
                AggregateResult[] creditLinesByProduct = StdBank_Ltn_ClientsStatisticsController.getCreditLineInfo(currentId,
                                                  true, isEconomicGroupParent);

                for (AggregateResult productCreditLine : creditLinesByProduct){
                    
                    cLim = converter.convertCorporateCurrency((Double)productCreditLine.get('creditLimit'), this.ISO);
                    cLim = cLim.divide(1000, 2);
                    tUtl = converter.convertCorporateCurrency((Double)productCreditLine.get('totalUtilisation'), this.ISO);
                    tUtl = tUtl.divide(1000, 2);
                    creditData cData = new creditData((String)productCreditLine.get('Product__c') ,Integer.valueOf(cLim), Integer.valueOf(tUtl));
                    creditlst.add(cData);
                }
                
                if(creditlst.size() == 0){
                	barChartTwelve = true ;
                	creditlst.add(new creditData('' ,0, 0));
                }
                
                return creditlst ;
                
             }
             
            else{
                return null ;
            }
            
         }
         
         
          /**
         * @author :- Nitish Kumar
         * @date  :-  May -2014
         * @description :- Public List<sowData> method which contains the data which will be shown on the dashboard.
         * @param :- N/A
         * @return :- List<sowData>
         **/
         
         public List<sowData> SoWGCRAll() {
         	
         	if(currentId != null || currentId != ''){
                
                 //Calling the Currency convertor method
                //currencyConverter converter = new currencyConverter();
                
                String current_Financial_Year = string.valueof(system.today());
                current_Financial_Year = current_Financial_Year.substringBefore('-');
                
                //local variables used in currency conversion
                Decimal wallet = 0.0;
                Decimal budget = 0.0;
                Decimal revenue = 0.0;
                
                //Querying all the Global Client Revenue for the account
                    Global_Client_Revenue__c[] globalClientRevenueForClient = [SELECT 
                                                                        Snapshot_Date__c,
                                                                        Reporting_Country__c, 
                                                                        Trading_Division__c, 
                                                                        Client_Value_ZAR_Current_Year__c , 
                                                                        Client_Value_ZAR_Previous_Year__c ,
                                                                        Budget_USD_Next_Year__c , 
                                                                        Budget_ZAR_Next_Year__c,
                                                                        Client_Value_USD_Current_Year__c, 
                                                                        Client_Value_USD_Previous_Year__c 
                                                                      FROM 
                                                                        Global_Client_Revenue__c 
                                                                      WHERE 
                                                                        Client__c =: currentId
                                                                      AND RecordType.Name = 'Current & Previous Year'
                                                                      ORDER BY Client_Value_ZAR_Current_Year__c DESC NULLS LAST ];
                                                                      
                // Querying all the Share of Wallet record
                 Share_Wallet__c [] shareofWalletForClient = [Select Budget__c,Division__c,Revenue__c,Financial_Year__c,Total_Wallet_Size__c,CurrencyIsoCode from Share_Wallet__c where  Client__c =: currentId 
                                                                       AND    Financial_Year__c = :current_Financial_Year
													                   AND    Division__c NOT IN ('Wealth','Business Banking')
													                   ORDER BY Division__c];
													                   
			     Map<String, Decimal> mapDivWalletCUR = new Map<String, Decimal>();
			     
				  for (Share_Wallet__c sOW : shareofWalletForClient){
				  	  wallet = converter.convertCurrency(Double.valueOf(sOW.Total_Wallet_Size__c), String.valueOf(sOW.CurrencyIsoCode), this.ISO);
                      wallet = wallet.divide(1000, 2);
                      if(sOW.Division__c == 'Transactional Products and Services'){
				  	  mapDivWalletCUR.put('TPS', wallet);
				  	  }
				  	  if(sOW.Division__c == 'Investment Banking'){
				  	  mapDivWalletCUR.put('IB', wallet);
				  	  }
				  	  if(sOW.Division__c == 'Global Markets'){
				  	  mapDivWalletCUR.put('GM', wallet);
				  	 }
				  }
				  
				  
				   //USD Values   
               Decimal totalCurrentYearUsdGM = 0;
               Decimal totalBudgetUsdGM = 0;
               Decimal totalCurrentYearUsdTPS = 0;
               Decimal totalBudgetUsdTPS = 0;
               Decimal totalCurrentYearUsdIB = 0;
               Decimal totalBudgetUsdIB = 0;
               List<sowData> sowDataUSD = new List<sowData>();
              
               //ZAR Values
               Decimal totalCurrentYearZARGM = 0;
               Decimal totalBudgetZARGM = 0;
               Decimal totalCurrentYearZARTPS = 0;
               Decimal totalBudgetZARTPS = 0;
               Decimal totalCurrentYearZARIB = 0;
               Decimal totalBudgetZARIB = 0;
               List<sowData> sowDataZAR = new List<sowData>();
               
                
				  // Looping the records to do the calculation for Current Year Revenue and Previous year revenue 
                 for(Global_Client_Revenue__c gCRFCR : globalClientRevenueForClient ){
               	  
               	    //Calculation for GM Division
                 if(gCRFCR.Trading_Division__c == 'GM'){
                    totalCurrentYearUsdGM = totalCurrentYearUsdGM + Math.roundToLong((double)(gCRFCR.Client_Value_USD_Current_Year__c/1000));
                    totalBudgetUsdGM = totalBudgetUsdGM + Math.roundToLong((double)(gCRFCR.Budget_USD_Next_Year__c/1000));
                    totalCurrentYearZARGM = totalCurrentYearZARGM +  Math.roundToLong((double)(gCRFCR.Client_Value_ZAR_Current_Year__c/1000));
                    totalBudgetZARGM = totalBudgetZARGM + Math.roundToLong((double)(gCRFCR.Budget_ZAR_Next_Year__c/1000));
                 }
                 
                  //Calculation for TPS Division
                  if(gCRFCR.Trading_Division__c == 'TPS'){
                    totalCurrentYearUsdTPS = totalCurrentYearUsdTPS + Math.roundToLong((double)(gCRFCR.Client_Value_USD_Current_Year__c/1000));
                    totalBudgetUsdTPS = totalBudgetUsdTPS + Math.roundToLong((double)(gCRFCR.Budget_USD_Next_Year__c/1000));
                    totalCurrentYearZARTPS = totalCurrentYearZARTPS + Math.roundToLong((double)(gCRFCR.Client_Value_ZAR_Current_Year__c/1000));
                    totalBudgetZARTPS = totalBudgetZARTPS + Math.roundToLong((double)(gCRFCR.Budget_ZAR_Next_Year__c/1000));
                 }
                 
                  //Calculation for IB Division
                  if(gCRFCR.Trading_Division__c == 'IB'){
                    
                    totalCurrentYearUsdIB = totalCurrentYearUsdIB + Math.roundToLong((double)(gCRFCR.Client_Value_USD_Current_Year__c/1000));
                    totalBudgetUsdIB = totalBudgetUsdIB + Math.roundToLong((double)(gCRFCR.Budget_USD_Next_Year__c/1000));
                    totalCurrentYearZARIB = totalCurrentYearZARIB + Math.roundToLong((double)(gCRFCR.Client_Value_ZAR_Current_Year__c/1000));
                    totalBudgetZARIB = totalBudgetZARIB + Math.roundToLong((double)(gCRFCR.Budget_ZAR_Next_Year__c/1000));
                   }
                 }
                 
				  // Creating the wrapper list for USD and ZAR values
				  if(mapDivWalletCUR.containsKey('TPS')){
				   sowDataUSD.add(new sowData('TPS', Integer.valueOf(mapDivWalletCUR.get('TPS')) ,Integer.valueOf(totalBudgetUsdTPS),Integer.valueOf(totalCurrentYearUsdTPS) ));
                   sowDataZAR.add(new sowData('TPS', Integer.valueOf(mapDivWalletCUR.get('TPS')) ,Integer.valueOf(totalBudgetZARTPS),Integer.valueOf(totalCurrentYearZARTPS) ));
                 }
                 else{
                 	if (totalBudgetUsdTPS != 0 || totalCurrentYearUsdTPS != 0){
                 	   sowDataUSD.add(new sowData('TPS', 0 ,Integer.valueOf(totalBudgetUsdTPS),Integer.valueOf(totalCurrentYearUsdTPS) ));
                       sowDataZAR.add(new sowData('TPS', 0 ,Integer.valueOf(totalBudgetZARTPS),Integer.valueOf(totalCurrentYearZARTPS) ));
                 	}
                 }
                 
                  if(mapDivWalletCUR.containsKey('IB')){
                  	sowDataUSD.add(new sowData('IB', Integer.valueOf(mapDivWalletCUR.get('IB')) ,Integer.valueOf(totalBudgetUsdIB),Integer.valueOf(totalCurrentYearUsdIB) ));
                    sowDataZAR.add(new sowData('IB', Integer.valueOf(mapDivWalletCUR.get('IB')) ,Integer.valueOf(totalBudgetZARIB),Integer.valueOf(totalCurrentYearZARIB) ));
                  }
                   else{
                 	if (totalBudgetUsdIB != 0 || totalCurrentYearUsdIB != 0){
                 		sowDataUSD.add(new sowData('IB', 0 ,Integer.valueOf(totalBudgetUsdIB),Integer.valueOf(totalCurrentYearUsdIB) ));
                        sowDataZAR.add(new sowData('IB', 0 ,Integer.valueOf(totalBudgetZARIB),Integer.valueOf(totalCurrentYearZARIB) ));
                   }
                 }
                  
				  if(mapDivWalletCUR.containsKey('GM')){
                   sowDataUSD.add(new sowData('GM', Integer.valueOf(mapDivWalletCUR.get('GM')) ,Integer.valueOf(totalBudgetUsdGM),Integer.valueOf(totalCurrentYearUsdGM) ));
                   sowDataZAR.add(new sowData('GM', Integer.valueOf(mapDivWalletCUR.get('GM')) ,Integer.valueOf(totalBudgetZARGM),Integer.valueOf(totalCurrentYearZARGM) ));
				  }
				  else{
                 	if (totalBudgetUsdGM != 0 || totalCurrentYearUsdGM != 0){
                 	   sowDataUSD.add(new sowData('GM', 0 ,Integer.valueOf(totalBudgetUsdGM),Integer.valueOf(totalCurrentYearUsdGM) ));
                       sowDataZAR.add(new sowData('GM', 0 ,Integer.valueOf(totalBudgetZARGM),Integer.valueOf(totalCurrentYearZARGM) ));
				    }
				  }								                   
		        barChartTwo = false ;
		     
		       // Return the list based on the selected currency 
              if (this.ISO == 'ZAR'){
              	if(sowDataZAR.size() == 0){
              	 barChartTwo = true ;
              	 sowDataZAR.add(new sowData('', 0,0,0));
              	}
                return sowDataZAR ;
               }
              else{
              	if(sowDataUSD.size() == 0){
              	 barChartTwo = true ;
              	 sowDataUSD.add(new sowData('', 0,0,0));
              	}
                return sowDataUSD ;
                }                                                    
               }     
         	
         	else{
         		return null ;
         	}
         	
         }
         
         /**
         * @author :- Nitish Kumar
         * @date  :-  May -2014
         * @description :- Public List<sowDataGM> method which contains the data which will be shown on the dashboard.
         * @param :- N/A
         * @return :- List<sowDataGM>
         **/
         public void SoWGCRGMTotal() {
         	
         	if(currentId != null || currentId != ''){
         		
         		 //Calling the Currency convertor method
                //currencyConverter converter = new currencyConverter();
                
                SoWGCRDataGM = new list<sowDataGM>();
                SoWGCRDataTPS = new list<sowDataTPS>();
                SoWGCRDataIB = new list<sowDataIB>();
                
                // Getting the current year for querying the Share of Wallet Products record
                String current_Financial_Year = string.valueof(system.today());
                current_Financial_Year = current_Financial_Year.substringBefore('-');
                
               
                 //Querying all the Global Client Revenue for the account
                    AggregateResult[] globalClientRevenueGMForClient = [SELECT 
                                                                        Grouping(Division_Product_Subsets__c) productTotalled,
                                                                        Division_Product_Subsets__c,
                                                                        SUM(Client_Value_ZAR_Current_Year__c) totalCurrYearZAR, 
                                                                        SUM(Budget_USD_Next_Year__c) budgetUSD, 
                                                                        SUM(Budget_ZAR_Next_Year__c) budgetZAR,
                                                                        SUM(Client_Value_USD_Current_Year__c) totalCurrYearUSD 
                                                                        
                                                                      FROM 
                                                                        Global_Client_Revenue__c 
                                                                      WHERE 
                                                                        Client__c =: currentId
                                                                      AND RecordType.Name = 'Current & Previous Year'
                                                                      AND Trading_Division__c IN ('GM','TPS','IB')
                                                                      AND Division_Product_Subsets__c != null
                                                                      AND Division_Product_Subsets__c NOT IN ('T.P.S. OTHER','INVESTMENT BANKING - OTHER')
                                                                      GROUP BY CUBE
                                                                        (Division_Product_Subsets__c)];
               
               // Local map which will store the products as key and value as Revenue and Budget for GM division
               Map<String,Decimal> currentYearGMMapUSD = new Map<String,Decimal>();
               Map<String,Decimal> totalBugetGMMapUSD = new Map<String,Decimal>();
               Map<String,Decimal> currentYearGMMapZAR = new Map<String,Decimal>();
               Map<String,Decimal> totalBugetGMMapZAR = new Map<String,Decimal>();
               
               // Local map which will store the products as key and value as Revenue and Budget for TPS division
               Map<String,Decimal> currentYearTPSMapUSD = new Map<String,Decimal>();
               Map<String,Decimal> totalBugetTPSMapUSD = new Map<String,Decimal>();
               Map<String,Decimal> currentYearTPSMapZAR = new Map<String,Decimal>();
               Map<String,Decimal> totalBugetTPSMapZAR = new Map<String,Decimal>();
               
               // Local map which will store the products as key and value as Revenue and Budget for IB division
               Map<String,Decimal> currentYearIBMapUSD = new Map<String,Decimal>();
               Map<String,Decimal> totalBugetIBMapUSD = new Map<String,Decimal>();
               Map<String,Decimal> currentYearIBMapZAR = new Map<String,Decimal>();
               Map<String,Decimal> totalBugetIBMapZAR = new Map<String,Decimal>();
               
               // Set which will store the share of wallet product names
               Set<String> productSet = new Set<String>();
               
            	// Querying all the Share of Wallet Product record 
				 Share_of_Wallet_Product__c[] shareofWalletProductGM = [Select Estimated_Total_Wallet_Size__c,Share_of_Wallet__r.Division__c,Product_Subset__c,CurrencyIsoCode from Share_of_Wallet_Product__c 
				                                                               where Share_of_Wallet__r.Financial_Year__c =: current_Financial_Year
				                                                               AND   Share_of_Wallet__r.Division__c  IN ('Global Markets','Investment Banking','Transactional Products and Services')
				                                                               AND   Share_of_Wallet__r.Client__c =: currentId];
				                                                               
				 for(Share_of_Wallet_Product__c sowP : shareofWalletProductGM){
				 	 productSet.add(sowP.Product_Subset__c.toUpperCase());
				 }
				    
				  // Getting the mapping between products and division from the custom setting									                   
                  Map<String,CRT_to_Salesforce_Product_Mapping__c> crtProductsMapping = new  Map<String,CRT_to_Salesforce_Product_Mapping__c>();
                  crtProductsMapping = CRT_to_Salesforce_Product_Mapping__c.getAll();
                 
                  // List which will store the collection of wrapper objects for GM division
                  list<sowDataGM> sowDataGMUSD = new list<sowDataGM>();
                  list<sowDataGM> sowDataGMZAR = new list<sowDataGM>();
                  
                  // List which will store the collection of wrapper objects for TPS division
                  list<sowDataTPS> sowDataTPSUSD = new list<sowDataTPS>();
                  list<sowDataTPS> sowDataTPSZAR = new list<sowDataTPS>();
                  
                  // List which will store the collection of wrapper objects for IB division
                  list<sowDataIB> sowDataIBUSD = new list<sowDataIB>();
                  list<sowDataIB> sowDataIBZAR = new list<sowDataIB>();
                  
                  for (AggregateResult gCRGM : globalClientRevenueGMForClient){
                  	
                  	String product = (String)gCRGM.get('Division_Product_Subsets__c'); // Getting the product name from the Global Client Revenue record
                  	
                  	if(product != null){
                  	
                  	String sfdcProduct = crtProductsMapping.get(product.toUpperCase()).SFDC_Product__c ;
                  	
                  	// Checking if the product exists in the custom setting map
                  	if(crtProductsMapping.containsKey(product.toUpperCase())){
                  	
                  	// Populating the variables for GM division	
                  	if(crtProductsMapping.get(product.toUpperCase()).CRT_Division__c == 'GM'){
                  	
                  	//Populating the USD Values
                  	currentYearGMMapUSD.put(crtProductsMapping.get(product.toUpperCase()).SFDC_Product__c,gCRGM.get('totalCurrYearUSD') == null ? 0 : Math.roundToLong((double)gCRGM.get('totalCurrYearUSD')/1000));
                  	totalBugetGMMapUSD.put(crtProductsMapping.get(product.toUpperCase()).SFDC_Product__c, gCRGM.get('budgetUSD') == null ? 0 : Math.roundToLong((double)gCRGM.get('budgetUSD')/1000));
                  	
                  	//Populating the ZAR Values
                  	currentYearGMMapZAR.put(crtProductsMapping.get(product.toUpperCase()).SFDC_Product__c, gCRGM.get('totalCurrYearZAR') == null ? 0 : Math.roundToLong((double)gCRGM.get('totalCurrYearZAR')/1000));
                  	totalBugetGMMapZAR.put(crtProductsMapping.get(product.toUpperCase()).SFDC_Product__c,  gCRGM.get('budgetZAR') == null ? 0 : Math.roundToLong((double)gCRGM.get('budgetZAR')/1000));
                  	
                  	// Populating the wrapper list if there is no Share of wallet product record for that product
                  	if(!productSet.contains(crtProductsMapping.get(product.toUpperCase()).SFDC_Product__c.toUpperCase())){
                  	 if(Integer.valueOf(totalBugetGMMapUSD.get(sfdcProduct)) != 0 || Integer.valueOf(currentYearGMMapUSD.get(sfdcProduct)) != 0){
                  		sowDataGMUSD.add(new sowDataGM(crtProductsMapping.get(product.toUpperCase()).SFDC_Product__c, 0 ,Integer.valueOf(totalBugetGMMapUSD.get(sfdcProduct)),Integer.valueOf(currentYearGMMapUSD.get(sfdcProduct)) ));
                  		}
                  		if(Integer.valueOf(totalBugetGMMapZAR.get(sfdcProduct)) != 0 || Integer.valueOf(currentYearGMMapZAR.get(sfdcProduct)) != 0){
                  		sowDataGMZAR.add(new sowDataGM(crtProductsMapping.get(product.toUpperCase()).SFDC_Product__c, 0 ,Integer.valueOf(totalBugetGMMapZAR.get(sfdcProduct)),Integer.valueOf(currentYearGMMapZAR.get(sfdcProduct)) ));
                         }
                  	    }
                  	  }
                  	  
                  	// Populating the variables for TPS division
                  	 if(crtProductsMapping.get(product.toUpperCase()).CRT_Division__c == 'TPS'){
                  	
                  	//Populating the USD Values
                  	currentYearTPSMapUSD.put(crtProductsMapping.get(product.toUpperCase()).SFDC_Product__c,gCRGM.get('totalCurrYearUSD') == null ? 0 : Math.roundToLong((double)gCRGM.get('totalCurrYearUSD')/1000));
                  	totalBugetTPSMapUSD.put(crtProductsMapping.get(product.toUpperCase()).SFDC_Product__c, gCRGM.get('budgetUSD') == null ? 0 : Math.roundToLong((double)gCRGM.get('budgetUSD')/1000));
                  	
                  	//Populating the ZAR Values
                  	currentYearTPSMapZAR.put(crtProductsMapping.get(product.toUpperCase()).SFDC_Product__c, gCRGM.get('totalCurrYearZAR') == null ? 0 : Math.roundToLong((double)gCRGM.get('totalCurrYearZAR')/1000));
                  	totalBugetTPSMapZAR.put(crtProductsMapping.get(product.toUpperCase()).SFDC_Product__c,  gCRGM.get('budgetZAR') == null ? 0 : Math.roundToLong((double)gCRGM.get('budgetZAR')/1000));
                  	
                  	// Populating the wrapper list if there is no Share of wallet product record for that product
                  	if(!productSet.contains(crtProductsMapping.get(product.toUpperCase()).SFDC_Product__c.toUpperCase())){
                  		if(Integer.valueOf(totalBugetTPSMapUSD.get(sfdcProduct)) != 0 || Integer.valueOf(currentYearTPSMapUSD.get(sfdcProduct)) != 0){
                  		sowDataTPSUSD.add(new sowDataTPS(crtProductsMapping.get(product.toUpperCase()).SFDC_Product__c, 0 ,Integer.valueOf(totalBugetTPSMapUSD.get(sfdcProduct)),Integer.valueOf(currentYearTPSMapUSD.get(sfdcProduct)) ));
                  		}
                  		if(Integer.valueOf(totalBugetTPSMapZAR.get(product.toUpperCase())) != 0 || Integer.valueOf(currentYearTPSMapZAR.get(product.toUpperCase())) != 0){
                  		sowDataTPSZAR.add(new sowDataTPS(crtProductsMapping.get(product.toUpperCase()).SFDC_Product__c, 0 ,Integer.valueOf(totalBugetTPSMapZAR.get(sfdcProduct)),Integer.valueOf(currentYearTPSMapZAR.get(sfdcProduct)) ));
                          }
                  	    } 
                  	  }
                  	
                  	// Populating the variables for IB division
                   if(crtProductsMapping.get(product.toUpperCase()).CRT_Division__c == 'IB'){
                  	
                  	//Populating the USD Values
                  	currentYearIBMapUSD.put(crtProductsMapping.get(product.toUpperCase()).SFDC_Product__c,(double)gCRGM.get('totalCurrYearUSD') == null ? 0 : Math.roundToLong((double)gCRGM.get('totalCurrYearUSD')/1000));
                  	totalBugetIBMapUSD.put(crtProductsMapping.get(product.toUpperCase()).SFDC_Product__c,(double)gCRGM.get('budgetUSD') == null ? 0 : Math.roundToLong((double)gCRGM.get('budgetUSD')/1000));
                  	
                  	//Populating the ZAR Values
                  	currentYearIBMapZAR.put(crtProductsMapping.get(product.toUpperCase()).SFDC_Product__c, (double)gCRGM.get('totalCurrYearZAR') == null ? 0 : Math.roundToLong((double)gCRGM.get('totalCurrYearZAR')/1000));
                  	totalBugetIBMapZAR.put(crtProductsMapping.get(product.toUpperCase()).SFDC_Product__c, (double)gCRGM.get('budgetZAR') == null ? 0 : Math.roundToLong((double)gCRGM.get('budgetZAR')/1000));
                   	
                   	// Populating the wrapper list if there is no Share of wallet product record for that product
                  	if(!productSet.contains(crtProductsMapping.get(product.toUpperCase()).SFDC_Product__c.toUpperCase())){
                  	   if(Integer.valueOf(totalBugetIBMapUSD.get(sfdcProduct)) != 0 || Integer.valueOf(currentYearIBMapUSD.get(sfdcProduct)) != 0){
                  		sowDataIBUSD.add(new sowDataIB(crtProductsMapping.get(product.toUpperCase()).SFDC_Product__c, 0 ,Integer.valueOf(totalBugetIBMapUSD.get(sfdcProduct)),Integer.valueOf(currentYearIBMapUSD.get(sfdcProduct)) ));
                  	   }
                  	   if(Integer.valueOf(totalBugetIBMapZAR.get(sfdcProduct)) != 0 || Integer.valueOf(currentYearIBMapZAR.get(sfdcProduct)) != 0){
                  	    sowDataIBZAR.add(new sowDataIB(crtProductsMapping.get(product.toUpperCase()).SFDC_Product__c, 0 ,Integer.valueOf(totalBugetIBMapZAR.get(sfdcProduct)),Integer.valueOf(currentYearIBMapZAR.get(sfdcProduct)) ));
                         }
                  	    }
                   	  }
                   	 }
                   }
                  }
                  
                 // Looping through the list of share of wallet product 
                 for (Share_of_Wallet_Product__c sowP : shareofWalletProductGM){
                 	  
                 	  //local variable which stores the converted wallet size based on the currency selected
                 	  Decimal wallet = 0;
                 	  wallet = converter.convertCurrency(Double.valueOf(sowP.Estimated_Total_Wallet_Size__c), String.valueOf(sowP.CurrencyIsoCode), this.ISO);
                      wallet = wallet.divide(1000, 2);
                     
                     if (sowP.Share_of_Wallet__r.Division__c == 'Global Markets'){
                      // Checking if there is a Global Client revnue record for that product
                      if(currentYearGMMapUSD.containsKey(sowP.Product_Subset__c) || totalBugetGMMapUSD.containsKey(sowP.Product_Subset__c)){
                 	 	if(Integer.valueOf(wallet) != 0 || Integer.valueOf(totalBugetGMMapUSD.get(sowP.Product_Subset__c)) != 0 || Integer.valueOf(currentYearGMMapUSD.get(sowP.Product_Subset__c)) != 0 ){
                 	 	sowDataGMUSD.add(new sowDataGM(sowP.Product_Subset__c, Integer.valueOf(wallet) ,Integer.valueOf(totalBugetGMMapUSD.get(sowP.Product_Subset__c)),Integer.valueOf(currentYearGMMapUSD.get(sowP.Product_Subset__c)) ));
                 	 	}
                 	 	if(Integer.valueOf(wallet) != 0 || Integer.valueOf(totalBugetGMMapZAR.get(sowP.Product_Subset__c)) != 0 || Integer.valueOf(currentYearGMMapZAR.get(sowP.Product_Subset__c)) != 0 ){
                 	 	sowDataGMZAR.add(new sowDataGM(sowP.Product_Subset__c, Integer.valueOf(wallet) ,Integer.valueOf(totalBugetGMMapZAR.get(sowP.Product_Subset__c)),Integer.valueOf(currentYearGMMapZAR.get(sowP.Product_Subset__c)) ));
                 	 	}
                 	   }
                 	 else{
                 	 	// If there is no CRT product then only show the wallet size from Share of wallet Product
                 	 	if (Integer.valueOf(wallet) != 0){
                 	     sowDataGMUSD.add(new sowDataGM(sowP.Product_Subset__c, Integer.valueOf(wallet) ,0,0));
                 	     sowDataGMZAR.add(new sowDataGM(sowP.Product_Subset__c, Integer.valueOf(wallet) ,0,0));
                 	 	 }
                 	   }
                   }
                   
                   if (sowP.Share_of_Wallet__r.Division__c == 'Investment Banking'){
                   // Checking if there is a Global Client revnue record for that product
                    if(currentYearIBMapUSD.containsKey(sowP.Product_Subset__c) || totalBugetIBMapUSD.containsKey(sowP.Product_Subset__c)){
                 	 	if(Integer.valueOf(wallet) != 0 || Integer.valueOf(totalBugetIBMapUSD.get(sowP.Product_Subset__c)) != 0 || Integer.valueOf(currentYearIBMapUSD.get(sowP.Product_Subset__c)) != 0 ){
                 	 	sowDataIBUSD.add(new sowDataIB(sowP.Product_Subset__c, Integer.valueOf(wallet) ,Integer.valueOf(totalBugetIBMapUSD.get(sowP.Product_Subset__c)),Integer.valueOf(currentYearIBMapUSD.get(sowP.Product_Subset__c)) ));
                 	 	}
                 	 	if(Integer.valueOf(wallet) != 0 || Integer.valueOf(totalBugetIBMapZAR.get(sowP.Product_Subset__c)) != 0 || Integer.valueOf(currentYearIBMapZAR.get(sowP.Product_Subset__c)) != 0 ){
                 	    sowDataIBZAR.add(new sowDataIB(sowP.Product_Subset__c, Integer.valueOf(wallet) ,Integer.valueOf(totalBugetIBMapZAR.get(sowP.Product_Subset__c)),Integer.valueOf(currentYearIBMapZAR.get(sowP.Product_Subset__c)) ));
                 	 	}
                 	   }
                 	 else{
                 	 	// If there is no CRT product then only show the wallet size from Share of wallet Product
                 	 	 if (Integer.valueOf(wallet) != 0){
                 	     sowDataIBUSD.add(new sowDataIB(sowP.Product_Subset__c, Integer.valueOf(wallet) ,0,0));
                 	     sowDataIBZAR.add(new sowDataIB(sowP.Product_Subset__c, Integer.valueOf(wallet) ,0,0));
                 	 	 }
                 	  }
                   }
                   
                    if (sowP.Share_of_Wallet__r.Division__c == 'Transactional Products and Services'){
                    // Checking if there is a Global Client revnue record for that product
                 	 if(currentYearTPSMapUSD.containsKey(sowP.Product_Subset__c) || totalBugetTPSMapUSD.containsKey(sowP.Product_Subset__c)){
                 	 	if(Integer.valueOf(wallet) != 0 || Integer.valueOf(totalBugetTPSMapUSD.get(sowP.Product_Subset__c)) != 0 || Integer.valueOf(currentYearTPSMapUSD.get(sowP.Product_Subset__c)) != 0 ){
                 	 	sowDataTPSUSD.add(new sowDataTPS(sowP.Product_Subset__c, Integer.valueOf(wallet) ,Integer.valueOf(totalBugetTPSMapUSD.get(sowP.Product_Subset__c)),Integer.valueOf(currentYearTPSMapUSD.get(sowP.Product_Subset__c)) ));
                 	 	}
                 	 	if(Integer.valueOf(wallet) != 0 || Integer.valueOf(totalBugetTPSMapZAR.get(sowP.Product_Subset__c)) != 0 || Integer.valueOf(currentYearTPSMapZAR.get(sowP.Product_Subset__c)) != 0 ){
                 	 	sowDataTPSZAR.add(new sowDataTPS(sowP.Product_Subset__c, Integer.valueOf(wallet) ,Integer.valueOf(totalBugetTPSMapZAR.get(sowP.Product_Subset__c)),Integer.valueOf(currentYearTPSMapZAR.get(sowP.Product_Subset__c)) ));
                 	 	}
                 	 }
                 	 else{
                 	 	// If there is no CRT product then only show the wallet size from Share of wallet Product
                 	   if (Integer.valueOf(wallet) != 0){
                 	   sowDataTPSUSD.add(new sowDataTPS(sowP.Product_Subset__c, Integer.valueOf(wallet) ,0,0));
                 	   sowDataTPSZAR.add(new sowDataTPS(sowP.Product_Subset__c, Integer.valueOf(wallet) ,0,0));
                 	   }
                 	 }
                   }
                 } 
                 
                 barChartThree = false;
                 barChartFour = false;
                 barChartFive = false;
                 
               // Return the list based on the selected currency 
              if (this.ISO == 'ZAR'){
              	 if (sowDataGMZAR.size() == 0){
              	 	barChartThree = true;
              	 	sowDataGMZAR.add(new sowDataGM('', 0 ,0,0));
              	 }
              	 SoWGCRDataGM = sowDataGMZAR;
              	 if (sowDataTPSZAR.size() == 0){
              	 	barChartFour = true;
              	 	sowDataTPSZAR.add(new sowDataTPS('', 0 ,0,0));
              	 }
              	 SoWGCRDataTPS = sowDataTPSZAR;
              	 if (sowDataIBZAR.size() == 0){
              	 	barChartFive = true;
              	 	sowDataIBZAR.add(new sowDataIB('', 0 ,0,0));
              	 }
              	 SoWGCRDataIB = sowDataIBZAR;
               }
              else{
              	if (sowDataGMUSD.size() == 0){
              	 	barChartThree = true;
              	 	sowDataGMUSD.add(new sowDataGM('', 0 ,0,0));
              	 }
                SoWGCRDataGM = sowDataGMUSD;
                
                if (sowDataTPSUSD.size() == 0){
              	 	barChartFour = true;
              	 	sowDataTPSUSD.add(new sowDataTPS('', 0 ,0,0));
              	 }
              	SoWGCRDataTPS = sowDataTPSUSD;
              	
              	 if (sowDataIBUSD.size() == 0){
              	 	barChartFive = true;
              	 	sowDataIBUSD.add(new sowDataIB('', 0 ,0,0));
              	 }
              	SoWGCRDataIB = sowDataIBUSD;
               }
               
            	
         	}
          }
          
          
           /**
         * @author :- Nitish Kumar
         * @date  :-  May -2014
         * @description :- Public List<historyData> method which contains the history data which will be shown on the dashboard.
         * @param :- N/A
         * @return :- Void
         **/
         public list<historyData> HistoryBarData() {
         	
         	if(currentId != null || currentId != ''){
         		
         		 //Calling the Currency convertor method
                //currencyConverter converter = new currencyConverter();
                
                list<historyData> hisDataUSD = new list<historyData>();
                list<historyData> hisDataZAR = new list<historyData>();
                
                 	  // USD variables
		                Decimal currMonthGMUSD = 0 ;
		                Decimal currMonthTPSUSD = 0 ;
		                Decimal currMonthIBUSD = 0 ;
		                Decimal currMonthOtherUSD = 0 ;
		              
		               //ZAR Variables
		                Decimal currMonthGMZAR = 0 ;
		                Decimal currMonthTPSZAR = 0 ;
		                Decimal currMonthIBZAR = 0 ;
		                Decimal currMonthOtherZAR = 0 ;
                        
                
                
                 //Querying all the Global Client Revenue for the account
                    Global_Client_Revenue__c[] gcrHistoryForClient =   [SELECT 
                                                                        Snapshot_Date__c, 
                                                                        Trading_Division__c, 
                                                                       Client_Value_USD_Current_Month__c , 
                                                                       Client_Value_ZAR_Current_Month__c
                                                                      FROM 
                                                                        Global_Client_Revenue__c 
                                                                      WHERE 
                                                                        Client__c =: currentId
                                                                      AND RecordType.Name = 'Historical Revenue'
                                                                      AND Trading_Division__c != null
                                                                      order by Snapshot_Date__c desc];
                        
                     	Integer position = 0 ; 
                     	Integer counter = 0 ;
                     	Integer size  =  gcrHistoryForClient.size();                                          
                                                                        
                      for (Global_Client_Revenue__c gCRHis : gcrHistoryForClient){
                     
                        String division = gCRHis.Trading_Division__c;
                        
                        Date sdate = gCRHis.Snapshot_Date__c;
                        
                           
                           String mon = String.valueOf(gCRHis.Snapshot_Date__c.month());
                           String yea = String.valueOf(gCRHis.Snapshot_Date__c.year());
                           String dat = showDateFormat(mon , yea);
                           
                           if (division == 'GM'){
                           	currMonthGMUSD = currMonthGMUSD + (double)gCRHis.Client_Value_USD_Current_Month__c == null ? 0 : Math.roundToLong((double)gCRHis.Client_Value_USD_Current_Month__c/1000);
                            currMonthGMZAR = currMonthGMZAR + (double)gCRHis.Client_Value_ZAR_Current_Month__c == null ? 0 : Math.roundToLong((double)gCRHis.Client_Value_ZAR_Current_Month__c/1000);
                           }
                           
                           else if (division == 'TPS'){
                           	currMonthTPSUSD = currMonthTPSUSD + (double)gCRHis.Client_Value_USD_Current_Month__c == null ? 0 : Math.roundToLong((double)gCRHis.Client_Value_USD_Current_Month__c/1000);
                            currMonthTPSZAR = currMonthTPSZAR + (double)gCRHis.Client_Value_ZAR_Current_Month__c == null ? 0 : Math.roundToLong((double)gCRHis.Client_Value_ZAR_Current_Month__c/1000);
                           }
                           
                           else if (division == 'IB'){
                           	currMonthIBUSD = currMonthIBUSD + (double)gCRHis.Client_Value_USD_Current_Month__c == null ? 0 : Math.roundToLong((double)gCRHis.Client_Value_USD_Current_Month__c/1000);
                            currMonthIBZAR = currMonthIBZAR + (double)gCRHis.Client_Value_ZAR_Current_Month__c == null ? 0 : Math.roundToLong((double)gCRHis.Client_Value_ZAR_Current_Month__c/1000);
                           }
                           
                           else if (division == 'Other'){
                           	currMonthOtherUSD = currMonthOtherUSD + (double)gCRHis.Client_Value_USD_Current_Month__c == null ? 0 : Math.roundToLong((double)gCRHis.Client_Value_USD_Current_Month__c/1000);
                            currMonthOtherZAR = currMonthOtherZAR + (double)gCRHis.Client_Value_ZAR_Current_Month__c == null ? 0 : Math.roundToLong((double)gCRHis.Client_Value_ZAR_Current_Month__c/1000);
                           }
                           
                           else{
                           	//Skip record
                           }
                           
                           if (position < size - 1){
	                      	   position = position + 1;
	                      	 }
                          	
	                        
                            if (sDate != (Date)gcrHistoryForClient[position].get('Snapshot_Date__c')){
                            if(counter < 12){
                            hisDataUSD.add(new historyData(dat,Integer.valueOf(currMonthGMUSD),Integer.valueOf(currMonthTPSUSD),Integer.valueOf(currMonthIBUSD),Integer.valueOf(currMonthOtherUSD))); 
                            hisDataZAR.add(new historyData(dat,Integer.valueOf(currMonthGMZAR),Integer.valueOf(currMonthTPSZAR),Integer.valueOf(currMonthIBZAR),Integer.valueOf(currMonthOtherZAR))); 
                            
                             // USD variables
				             currMonthGMUSD = 0 ;
				             currMonthTPSUSD = 0 ;
				             currMonthIBUSD = 0 ;
				             currMonthOtherUSD = 0 ;
				              
				             //ZAR Variables
				             currMonthGMZAR = 0 ;
				             currMonthTPSZAR = 0 ;
				             currMonthIBZAR = 0 ;
				             currMonthOtherZAR = 0 ;
				             counter = counter + 1 ;
				             
                            }
                           }
                      	
                      }
                      
                       
                      barChartSix = false ;
                     
                      
                        	 // Return the list based on the selected currency 
			              if (this.ISO == 'ZAR'){
			              	
			              	list<historyData> hisDataZARorder = new list<historyData>();
			              	for (Integer i =hisDataZAR.size() - 1 ; i >=0 ; i--){
			              		hisDataZARorder.add(hisDataZAR[i]);
			              	}
			              	
			              	if (hisDataZARorder.size() == 0){
			              	 barChartSix = true ;
			              	 hisDataZARorder.add(new historyData('',0,0,0,0));
			              	}
			              	
			                return hisDataZARorder ;
			               }
			              else{
			               
			                list<historyData> hisDataUSDorder = new list<historyData>();
			              	for (Integer i =hisDataUSD.size() -1 ; i >=0 ; i--){
			              		hisDataUSDorder.add(hisDataUSD[i]);
			              	}
			              	
			              	if (hisDataUSDorder.size() == 0){
			              	 barChartSix = true ;
			              	 hisDataUSDorder.add(new historyData('',0,0,0,0));
			              	}
			              	
			                return hisDataUSDorder ;
			                } 
                
         	         }
         	         
         	     else{
         	     	return null ; 
         	     }
         	
         }
         
         public list<pieChartDiv> PieChartDataByDiv() {
         	
         	if(currentId != null || currentId != ''){
         		
         		 //Calling the Currency convertor method
                //currencyConverter converter = new currencyConverter();
                
                list<pieChartDiv> pieDataUSD = new list<pieChartDiv>();
                list<pieChartDiv> pieDataZAR = new list<pieChartDiv>();
                
                //USD Variables
                Decimal cYearGMUSD = 0;
                Decimal cYearTPSUSD = 0;
                Decimal cYearOtherUSD = 0;
                Decimal cYearIBUSD = 0; 
               
                //ZAR Variables
                Decimal cYearGMZAR = 0;
                Decimal cYearTPSZAR = 0;
                Decimal cYearOtherZAR = 0;
                Decimal cYearIBZAR = 0; 
                
                pieChartDivMap = new map<String ,Integer>();
                pieChartDivMap.put('GM', 0);
                pieChartDivMap.put('IB', 0);
                pieChartDivMap.put('TPS', 0);
                pieChartDivMap.put('Other', 0);
                totalDivSum = 0 ;
               
                
                 //Querying all the Global Client Revenue for the account
                    AggregateResult[] globalClientRevenueForClient = [SELECT 
                                                                        Grouping(Trading_Division__c) divisionTotalled,
                                                                        Trading_Division__c,
                                                                        SUM(Client_Value_ZAR_Current_Year__c) totalCurrYearZAR, 
                                                                        SUM(Client_Value_USD_Current_Year__c) totalCurrYearUSD 
                                                                        
                                                                      FROM 
                                                                        Global_Client_Revenue__c 
                                                                      WHERE 
                                                                        Client__c =: currentId
                                                                      AND RecordType.Name = 'Current & Previous Year'
                                                                      GROUP BY CUBE
                                                                       (Trading_Division__c)];
                      
                      for (AggregateResult gCRAgg : globalClientRevenueForClient){
                      	
                      	
                      	   
                      	   if((String)gCRAgg.get('Trading_Division__c') == 'GM'){
                      	   	 
                      	   	  cYearGMUSD = gCRAgg.get('totalCurrYearUSD') == null ? 0 : Math.roundToLong((double)gCRAgg.get('totalCurrYearUSD')/1000);
                      	   	  cYearGMZAR = gCRAgg.get('totalCurrYearZAR') == null ? 0 : Math.roundToLong((double)gCRAgg.get('totalCurrYearZAR')/1000);
                      	   	 
                      	   	  If (cYearGMUSD != 0){
                      	   	  pieDataUSD.add(new pieChartDiv('GM',Integer.valueOf(cYearGMUSD)));
                      	   	  }	
                      	   	  If (cYearGMZAR != 0){
                      	   	  pieDataZAR.add(new pieChartDiv('GM',Integer.valueOf(cYearGMZAR)));
                      	   	  }	
                      	   }
                      	   
                      	    if((String)gCRAgg.get('Trading_Division__c') == 'TPS'){
                      	   	 
                      	   	  cYearTPSUSD = gCRAgg.get('totalCurrYearUSD') == null ? 0 : Math.roundToLong((double)gCRAgg.get('totalCurrYearUSD')/1000);
                      	   	  cYearTPSZAR = gCRAgg.get('totalCurrYearZAR') == null ? 0 : Math.roundToLong((double)gCRAgg.get('totalCurrYearZAR')/1000);
                      	   	 
                      	   	  If (cYearTPSUSD != 0){
                      	   	  pieDataUSD.add(new pieChartDiv('TPS',Integer.valueOf(cYearTPSUSD)));
                      	   	  }	
                      	   	  If (cYearTPSZAR != 0){
                      	   	  pieDataZAR.add(new pieChartDiv('TPS',Integer.valueOf(cYearTPSZAR)));
                      	   	  }	
                      	   }
                      	   
                      	   if((String)gCRAgg.get('Trading_Division__c') == 'IB'){
                      	   	 
                      	   	  cYearIBUSD = (double)gCRAgg.get('totalCurrYearUSD') == null ? 0 : Math.roundToLong((double)gCRAgg.get('totalCurrYearUSD')/1000);
                      	   	  cYearIBZAR = (double)gCRAgg.get('totalCurrYearZAR') == null ? 0 : Math.roundToLong((double)gCRAgg.get('totalCurrYearZAR')/1000);
                      	   	 
                      	   	  If (cYearIBUSD != 0){
                      	   	  pieDataUSD.add(new pieChartDiv('IB',Integer.valueOf(cYearIBUSD)));
                      	   	  }	
                      	   	  If (cYearIBZAR != 0){
                      	   	  pieDataZAR.add(new pieChartDiv('IB',Integer.valueOf(cYearIBZAR)));
                      	   	  }	
                      	   }
                      	   
                      	   if((String)gCRAgg.get('Trading_Division__c') == 'OTHER'){ 
                      	   	 
                      	   	  cYearOtherUSD = (double)gCRAgg.get('totalCurrYearUSD') == null ? 0 : Math.roundToLong((double)gCRAgg.get('totalCurrYearUSD')/1000);
                      	   	  cYearOtherZAR = (double)gCRAgg.get('totalCurrYearZAR') == null ? 0 : Math.roundToLong((double)gCRAgg.get('totalCurrYearZAR')/1000);
                      	   	 
                      	   	  If (cYearOtherUSD != 0){
                      	   	  pieDataUSD.add(new pieChartDiv('Other',Integer.valueOf(cYearOtherUSD)));
                      	   	  }	
                      	   	  If (cYearOtherZAR != 0){
                      	   	  pieDataZAR.add(new pieChartDiv('Other',Integer.valueOf(cYearOtherZAR)));
                      	   	  }	
                      	   }
                      }                                                  
                        
                        barChartSeven = false ;
                     
                     	 // Return the list based on the selected currency 
			              if (this.ISO == 'ZAR'){
			              	for (pieChartDiv pD : pieDataZAR){
			              	pieChartDivMap.put(pD.name , pD.cYearRev);
			              	totalDivSum = totalDivSum + pD.cYearRev ;
			              	}
			              	if (totalDivSum == 0){
			              		totalDivSum = 1 ;
			              	}
			              	if(pieDataZAR.size() ==0){
			              		barChartSeven = true ;
			              	}
			              	  return pieDataZAR ;
			               }
			               
			               
			              else{
			              	for (pieChartDiv pD : pieDataUSD){
			              	pieChartDivMap.put(pD.name , pD.cYearRev);
			              	totalDivSum = totalDivSum + pD.cYearRev ;
			              	}
			              	if (totalDivSum == 0){
			              		totalDivSum = 1 ;
			              	}
			              	if(pieDataUSD.size() ==0){
			              		barChartSeven = true ;
			              	}
			              	
			                return pieDataUSD ;
			                } 
                
                       }
         	
                      else{
                      return null ;
                      }
                  }
                  
                  
         public list<pieChartCountry> PieChartDataByCountry() {
         	
         	if(currentId != null || currentId != ''){
         		
         		 //Calling the Currency convertor method
                //currencyConverter converter = new currencyConverter();
                
                list<pieChartCountry> pieDataUSD = new list<pieChartCountry>();
                list<pieChartCountry> pieDataZAR = new list<pieChartCountry>();
                
               pieChartCountryMap = new map<String , Integer>();
               totalCountrySum = 0;
               countryLst = new list<String>();
               countrySize = 0;
               Integer countryNumber = 0 ;
               Decimal totalOtherUSD = 0 ;
               Decimal totalOtherZAR = 0 ;
                 
                 //Querying all the Global Client Revenue for the account
                    AggregateResult[] globalClientRevenueForClient = [SELECT 
                                                                        Grouping(Reporting_Country__c) countryTotalled,
                                                                        Reporting_Country__c,
                                                                        SUM(Client_Value_ZAR_Current_Year__c) totalCurrYearZAR, 
                                                                        SUM(Client_Value_USD_Current_Year__c) totalCurrYearUSD 
                                                                        
                                                                      FROM 
                                                                        Global_Client_Revenue__c 
                                                                      WHERE 
                                                                        Client__c =: currentId
                                                                      AND RecordType.Name = 'Current & Previous Year'
                                                                      GROUP BY CUBE
                                                                       (Reporting_Country__c)
                                                                       ORDER BY SUM(Client_Value_ZAR_Current_Year__c) DESC NULLS LAST];
                      
                        for (AggregateResult gCRAgg : globalClientRevenueForClient){
                      	
                      	 Decimal cYearUSD = 0 ;
                      	 Decimal cYearZAR = 0 ;
                      	   
                      	   if((String)gCRAgg.get('Reporting_Country__c') != null){
                      	   	
                      	   	 if(countryNumber < 5) {
                      	   	  cYearUSD = gCRAgg.get('totalCurrYearUSD') == null ? 0 : Math.roundToLong((double)gCRAgg.get('totalCurrYearUSD')/1000);
                      	   	  cYearZAR = gCRAgg.get('totalCurrYearZAR') == null ? 0 : Math.roundToLong((double)gCRAgg.get('totalCurrYearZAR')/1000);
                      	   	 
                      	   	   If (cYearUSD != 0){
                      	   	   pieDataUSD.add(new pieChartCountry((String)gCRAgg.get('Reporting_Country__c'),Integer.valueOf(cYearUSD)));
                      	   	   }	
                      	   	   If (cYearZAR != 0){
                      	   	   pieDataZAR.add(new pieChartCountry((String)gCRAgg.get('Reporting_Country__c'),Integer.valueOf(cYearZAR)));
                      	   	   }
                      	   	   countryNumber = countryNumber + 1 ;
                      	     }
                      	     else{
                      	      totalOtherUSD = totalOtherUSD + (gCRAgg.get('totalCurrYearUSD') == null ? 0 : Math.roundToLong((double)gCRAgg.get('totalCurrYearUSD')/1000));
                      	      totalOtherZAR = totalOtherZAR + (gCRAgg.get('totalCurrYearZAR') == null ? 0 : Math.roundToLong((double)gCRAgg.get('totalCurrYearZAR')/1000));
                      	     }
                      	   }
                        }
                        
                           If (totalOtherUSD != 0){
                      	   	pieDataUSD.add(new pieChartCountry('OTHER',Integer.valueOf(totalOtherUSD)));
                      	   	}	
                      	   If (totalOtherZAR != 0){
                      	   pieDataZAR.add(new pieChartCountry('OTHER',Integer.valueOf(totalOtherZAR)));
                      	   }
                        
                        
                         barChartEight = false ;                                                  
                        
                        // Return the list based on the selected currency 
			              if (this.ISO == 'ZAR'){
			              	for (pieChartCountry pC : pieDataZAR){
			              		countryLst.add(pC.name);
			              		pieChartCountryMap.put(pC.name ,pC.cYearRev);
			              		totalCountrySum = totalCountrySum + pC.cYearRev ;
			              	} 
			              	countrySize = countryLst.size();
			              	for (integer i = 0 ; i < 6-countrySize ; i++ ){
			                  	countryLst.add('Test' + i);	
			                  	pieChartCountryMap.put('Test' + i ,0);
			              	}
			              	
			              	if (totalCountrySum == 0){
			              		totalCountrySum = 1 ;
			              	}
			              	if(pieDataZAR.size() == 0){
			              		barChartEight = true ;  
			              	}
			              	
			               return pieDataZAR ;
			               }
			              else{
			              	for (pieChartCountry pC : pieDataUSD){
			              		pieChartCountryMap.put(pC.name ,pC.cYearRev);
			              		countryLst.add(pC.name);
			              		totalCountrySum = totalCountrySum + pC.cYearRev ;
			              	}
			              	countrySize = countryLst.size();
			                for (integer i = 0 ; i < 6-countrySize ; i++ ){
			                  	countryLst.add('Test' + i);	
			                  	pieChartCountryMap.put('Test' + i ,0);
			              	}
			              	
			              	if (totalCountrySum == 0){
			              		totalCountrySum = 1 ;
			              	}
			              	
			              	if(pieDataUSD.size() == 0){
			              		barChartEight = true ;  
			              	}
			              	 
			                return pieDataUSD ;
			                } 
                
                       }
         	
                      else{
                      return null ;
                      }
                  }
                  
       public void DataPieChart() {
         
         if(currentId != null || currentId != ''){
                    AggregateResult[] globalClientRevenueForClient = [SELECT 
                                                                        Grouping(Trading_Division__c) divisionTotalled, 
                                                                        Trading_Division__c, 
                                                                        SUM(Budget_ZAR_Next_Year__c) budgetZAR, 
                                                                        SUM(Client_Value_ZAR_Current_Year__c) totalCurrYearZAR, 
                                                                        SUM(Budget_USD_Next_Year__c) budgetUSD, 
                                                                        SUM(Client_Value_USD_Current_Year__c) totalCurrYearUSD 
                                                                      FROM 
                                                                        Global_Client_Revenue__c 
                                                                       WHERE 
                                                                        Client__c =: currentId
                                                                        AND RecordType.Name = 'Current & Previous Year'
                                                                      GROUP BY CUBE
                                                                        (Trading_Division__c) 
                                                                          ];
         
    
              
              gaugeDataGM = new list<gaugeDataGM>();
      
     	      Decimal totalCurrentYearUsdGM = 0;
		      Decimal totalBudgetUSDGM = 0;
		      Decimal totalCurrentYearZARGM = 0;
		      Decimal totalBudgetZARGM = 0;
		      
		      Decimal totalPipelineGM = getSumGM();
		      Decimal totalPipelineTPS = getSumTPS();
		      Decimal totalPipelineIB = getSumIB();
		      
		      
		      List<gaugeDataGM> gaugeDataUSDGM = new List<gaugeDataGM>();
		      List<gaugeDataGM> gaugeDataZARGM = new List<gaugeDataGM>();
		       
		      gaugeDataIB = new list<gaugeDataIB>();
      
     	      Decimal totalCurrentYearUsdIB = 0;
		      Decimal totalBudgetUSDIB = 0;
		      Decimal totalCurrentYearZARIB = 0;
		      Decimal totalBudgetZARIB = 0;
		      
		      List<gaugeDataIB> gaugeDataUSDIB = new List<gaugeDataIB>();
		      List<gaugeDataIB> gaugeDataZARIB = new List<gaugeDataIB>();
		       
		      gaugeDataTPS = new list<gaugeDataTPS>();
      
     	      Decimal totalCurrentYearUsdTPS = 0;
		      Decimal totalBudgetUSDTPS = 0;
		      Decimal totalCurrentYearZARTPS = 0;
		      Decimal totalBudgetZARTPS = 0;
		      
		       List<gaugeDataTPS> gaugeDataUSDTPS = new List<gaugeDataTPS>();
		       List<gaugeDataTPS> gaugeDataZARTPS = new List<gaugeDataTPS>();
		      
		       for(AggregateResult gCRFCR : globalClientRevenueForClient ){
		       	
		        
		        if((String)gCRFCR.get('Trading_Division__c') == 'GM'){
		        	
		        	totalCurrentYearUsdGM = (double)gCRFCR.get('totalCurrYearUSD') == null ? 0 : Math.roundToLong((double)gCRFCR.get('totalCurrYearUSD')/1000);
		            totalBudgetUSDGM = (double)gCRFCR.get('budgetUSD') == null ? 0 : Math.roundToLong((double)gCRFCR.get('budgetUSD')/1000);
		            
		            totalCurrentYearZARGM = (double)gCRFCR.get('totalCurrYearZAR') == null ? 0 : Math.roundToLong((double)gCRFCR.get('totalCurrYearZAR')/1000);
		            totalBudgetZARGM = (double)gCRFCR.get('budgetZAR') == null ? 0 : Math.roundToLong((double)gCRFCR.get('budgetZAR')/1000);
		      
		      
		              if(totalCurrentYearUsdGM != 0 || totalBudgetUSDGM != 0 || totalPipelineGM != 0){
		                gaugeDataUSDGM.add(new gaugeDataGM('GM', Integer.valueOf(totalCurrentYearUsdGM) ,Integer.valueOf(totalBudgetUSDGM) , Integer.valueOf(totalPipelineGM)));
		               }
				       
				       if(totalCurrentYearZARGM != 0 || totalBudgetZARGM != 0 || totalPipelineGM != 0){  
				        gaugeDataZARGM.add(new gaugeDataGM('GM', Integer.valueOf(totalCurrentYearZARGM) ,Integer.valueOf(totalBudgetZARGM),Integer.valueOf(totalPipelineGM) ));
				        }     
		             }
		           
		        
		        if((String)gCRFCR.get('Trading_Division__c') == 'IB'){
		        	
		        	totalCurrentYearUsdIB = (double)gCRFCR.get('totalCurrYearUSD') == null ? 0 : Math.roundToLong((double)gCRFCR.get('totalCurrYearUSD')/1000);
		            totalBudgetUSDIB = (double)gCRFCR.get('budgetUSD') == null ? 0 : Math.roundToLong((double)gCRFCR.get('budgetUSD')/1000);
		            
		            totalCurrentYearZARIB = (double)gCRFCR.get('totalCurrYearZAR') == null ? 0 : Math.roundToLong((double)gCRFCR.get('totalCurrYearZAR')/1000);
		            totalBudgetZARIB = (double)gCRFCR.get('budgetZAR') == null ? 0 : Math.roundToLong((double)gCRFCR.get('budgetZAR')/1000);
		          
		             if(totalCurrentYearUsdIB != 0 || totalBudgetUSDIB != 0 || totalPipelineIB != 0){    
				       gaugeDataUSDIB.add(new gaugeDataIB('IB', Integer.valueOf(totalCurrentYearUsdIB) ,Integer.valueOf(totalBudgetUSDIB) ,Integer.valueOf(totalPipelineIB)));
				       }
				       
				       if(totalCurrentYearZARIB != 0 || totalBudgetZARIB != 0 || totalPipelineIB != 0){
				        gaugeDataZARIB.add(new gaugeDataIB('IB', Integer.valueOf(totalCurrentYearZARIB) ,Integer.valueOf(totalBudgetZARIB),Integer.valueOf(totalPipelineIB) ));
				        }
		             }
		           
		      
		        
		         if((String)gCRFCR.get('Trading_Division__c') == 'TPS'){
		        	
		        	totalCurrentYearUsdTPS = (double)gCRFCR.get('totalCurrYearUSD') == null ? 0 : Math.roundToLong((double)gCRFCR.get('totalCurrYearUSD')/1000);
		            totalBudgetUSDTPS = (double)gCRFCR.get('budgetUSD') == null ? 0 : Math.roundToLong((double)gCRFCR.get('budgetUSD')/1000);
		            
		            totalCurrentYearZARTPS = (double)gCRFCR.get('totalCurrYearZAR') == null ? 0 : Math.roundToLong((double)gCRFCR.get('totalCurrYearZAR')/1000);
		            totalBudgetZARTPS = (double)gCRFCR.get('budgetZAR') == null ? 0 : Math.roundToLong((double)gCRFCR.get('budgetZAR')/1000);
		            
			           if(totalCurrentYearUsdTPS != 0 || totalBudgetUSDTPS != 0 || totalPipelineTPS != 0){    
				        gaugeDataUSDTPS.add(new gaugeDataTPS('TPS', Integer.valueOf(totalCurrentYearUsdTPS) ,Integer.valueOf(totalBudgetUSDTPS),Integer.valueOf(totalPipelineTPS) ));
				        }
				       
				       if(totalCurrentYearZARTPS != 0 || totalBudgetZARTPS != 0 || totalPipelineTPS != 0){    
				       gaugeDataZARTPS.add(new gaugeDataTPS('TPS', Integer.valueOf(totalCurrentYearZARTPS) ,Integer.valueOf(totalBudgetZARTPS),Integer.valueOf(totalPipelineTPS) ));
				       }
		            
		              
		           }
		       }
		       
		       barChartNine = false ;
		       barChartTen = false ;
		       barChartEleven = false ; 
                
               // Return the list based on the selected currency 
			      if (this.ISO == 'ZAR'){
			       if(gaugeDataZARGM.size() == 0){
			       	barChartNine = true ;
			       	gaugeDataZARGM.add(new gaugeDataGM('',0,0,0));
			       }
			       gaugeDataGM = gaugeDataZARGM ;
			       
			       if(gaugeDataZARTPS.size() == 0){
			       	barChartTen = true ;
			       	gaugeDataZARTPS.add(new gaugeDataTPS('',0,0,0));
			       }
			       gaugeDataTPS = gaugeDataZARTPS ;
			       
			       if(gaugeDataZARIB.size() == 0){
			       	barChartEleven = true ;
			       	gaugeDataZARIB.add(new gaugeDataIB('',0,0,0));
			       }
			       gaugeDataIB = gaugeDataZARIB ;
		           }
	              else{
	              	if(gaugeDataUSDGM.size() == 0){
			       	barChartNine = true ;
			       	gaugeDataUSDGM.add(new gaugeDataGM('',0,0,0));
			       }
			       gaugeDataGM = gaugeDataUSDGM ;
			       
			       if(gaugeDataUSDTPS.size() == 0){
			       	barChartTen = true ;
			       	gaugeDataUSDTPS.add(new gaugeDataTPS('',0,0,0));
			       }
			       gaugeDataTPS = gaugeDataUSDTPS ;
			       
			       if(gaugeDataUSDIB.size() == 0){
			       	barChartEleven = true ;
			       	gaugeDataUSDIB.add(new gaugeDataIB('',0,0,0));
			       }
			       gaugeDataIB = gaugeDataUSDIB ;
			       } 
               
		       }
		     }
       
        public void Opportunitylst() {
        
        OpportunitylstAll   = new List<cPlanOpportunity>();	
        OpportunitylstGlobalMarkets = new List<cPlanOpportunity>();
        OpportunitylstTPS = new List<cPlanOpportunity>();
        OpportunitylstIB  = new List<cPlanOpportunity>();
        
        //Calling the Currency convertor method
        //currencyConverter converter = new currencyConverter();
            
           
        for(List<Opportunity> lstOpp :[Select Name, Owner.Name, Owner.User_Division__c, Account.ParentId, Probability, ExpectedRevenue,
                                        Current_Year_Revenue_Num__c, AccountId, Account.name, Account.Owner.Name,
                                        Account.CRT_Client_Types__c, Account.CIF__c, StageName, Current_Year_Revenue_Currency__c,
                                        Priority__c, Opportunity_Sector__c, CloseDate, Amount, Short_Summary__c, OwnerId, Opportunity_Owner_Lookup__r.Name,
                                        Actual_Close_Date__c, CurrencyIsoCode, Type, Current_Year_Revenue__c, Total_Revenue_Num__c,
                                                                                (Select Id, Name, Opportunity__c,Opportunity__r.Id, Grand_Parent_Product__c from Products__r)
                                        FROM 
                                        Opportunity where(Account.Id = : currentId OR Account.ParentId = : currentId OR Account.Group_Parent__c = : currentId)
                                        AND
                                        (IsClosed = False AND StageName NOT IN('4 - Closed Lost','3 - Closed Won','1 - Lead'))                                        
                                        ORDER BY  
                                        Current_Year_Revenue__c desc nulls last limit 500
                                       ]){
                        for(Opportunity opp : lstOpp){
                                String productName = '';
                                for(SB_Product__c sBProduct : opp.Products__r){
                                        if(sBProduct.Grand_Parent_Product__c!=null && sBProduct.Grand_Parent_Product__c!=''){
                                                if(productName=='')
                                                        productName = sBProduct.Grand_Parent_Product__c;
                                                else
                                                        productName = productName + ', ' + sBProduct.Grand_Parent_Product__c;
                                        }
                                }
                                if(opp.Owner.User_Division__c == 'Global Markets'){
                                        cPlanOpportunity cp = new cPlanOpportunity(opp);
                                        cp.currentRev = converter.convertCurrency(Double.valueOf(opp.Current_Year_Revenue__c), String.valueOf(opp.CurrencyIsoCode), this.ISO).divide(1000, 2);
                                        cp.grandProductName = productName;
                                        OpportunitylstGlobalMarkets.add(cp);
                                        OpportunitylstAll.add(cp);
                                }
                                else if(opp.Owner.User_Division__c == 'Transactional Products and Services'){
                                        cPlanOpportunity cp = new cPlanOpportunity(opp);
                                        cp.currentRev = converter.convertCurrency(Double.valueOf(opp.Current_Year_Revenue__c), String.valueOf(opp.CurrencyIsoCode), this.ISO).divide(1000, 2);
                                        cp.grandProductName = productName;
                                        OpportunitylstTPS.add(cp);
                                        OpportunitylstAll.add(cp);
                                }
                                else if(opp.Owner.User_Division__c == 'Investment Banking' || opp.Owner.User_Division__c == 'Real Estate'){
                                        cPlanOpportunity cp = new cPlanOpportunity(opp);
                                        cp.currentRev = converter.convertCurrency(Double.valueOf(opp.Current_Year_Revenue__c), String.valueOf(opp.CurrencyIsoCode), this.ISO).divide(1000, 2);
                                        cp.grandProductName = productName;
                                        OpportunitylstIB.add(cp);
                                        OpportunitylstAll.add(cp);
                                }
                                else{
                                	    cPlanOpportunity cp = new cPlanOpportunity(opp);
                                        cp.currentRev = converter.convertCurrency(Double.valueOf(opp.Current_Year_Revenue__c), String.valueOf(opp.CurrencyIsoCode), this.ISO).divide(1000, 2);
                                        cp.grandProductName = productName;
                                        OpportunitylstAll.add(cp);
                                }       
                        }
                }
         }
         
         public void sowDataTotal(){
         	
         	   Decimal cYearRevUSD = 0 ;
         	   Decimal cYearRevZAR = 0 ;
         	   Decimal budgetUSD = 0 ;
         	   Decimal budgetZAR = 0 ;
         	   
         	   list<sowDataAll> lstsowDataUSD = new list<sowDataAll>();
         	   list<sowDataAll> lstsowDataZAR = new list<sowDataAll>();
         	   
         	   Decimal totalPipeline = getSumAll();
         	   
         	   lstsowDataTotal = new list<sowDataAll>();
         	   
         	   barChartThirteen = false ;
         	
         	 //Querying all the Global Client Revenue for the account
                    AggregateResult[] globalClientRevenueForClient = [SELECT 
                                                                        Grouping(Trading_Division__c) divisionTotalled,
                                                                        Trading_Division__c,
                                                                        SUM(Client_Value_ZAR_Current_Year__c) totalCurrYearZAR, 
                                                                        SUM(Client_Value_USD_Current_Year__c) totalCurrYearUSD,
                                                                        SUM(Budget_ZAR_Next_Year__c) totalbudgetZAR, 
                                                                        SUM(Budget_USD_Next_Year__c) totalbudgetUSD
                                                                        
                                                                      FROM 
                                                                        Global_Client_Revenue__c 
                                                                      WHERE 
                                                                        Client__c =: currentId
                                                                      AND RecordType.Name = 'Current & Previous Year'
                                                                      GROUP BY CUBE
                                                                       (Trading_Division__c)];
                                                                       
                    for (AggregateResult gCRAgg : globalClientRevenueForClient){
                    	
                         if((String)gCRAgg.get('Trading_Division__c') == 'GM'){
                      	   	 cYearRevUSD = cYearRevUSD + (gCRAgg.get('totalCurrYearUSD') == null ? 0 : Math.roundToLong((double)gCRAgg.get('totalCurrYearUSD')/1000));
                      	   	 cYearRevZAR = cYearRevZAR + (gCRAgg.get('totalCurrYearZAR') == null ? 0 : Math.roundToLong((double)gCRAgg.get('totalCurrYearZAR')/1000));
                      	   	 
                      	   	 budgetUSD = budgetUSD + (gCRAgg.get('totalbudgetUSD') == null ? 0 : Math.roundToLong((double)gCRAgg.get('totalbudgetUSD')/1000));
                      	   	 budgetZAR = budgetZAR + (gCRAgg.get('totalbudgetZAR') == null ? 0 : Math.roundToLong((double)gCRAgg.get('totalbudgetZAR')/1000));
                      	  }
                      	  
                      	 if((String)gCRAgg.get('Trading_Division__c') == 'TPS'){
                      	   	 cYearRevUSD = cYearRevUSD + (gCRAgg.get('totalCurrYearUSD') == null ? 0 : Math.roundToLong((double)gCRAgg.get('totalCurrYearUSD')/1000));
                      	   	 cYearRevZAR = cYearRevZAR + (gCRAgg.get('totalCurrYearZAR') == null ? 0 : Math.roundToLong((double)gCRAgg.get('totalCurrYearZAR')/1000));
                      	   	 
                      	   	 budgetUSD = budgetUSD + (gCRAgg.get('totalbudgetUSD') == null ? 0 : Math.roundToLong((double)gCRAgg.get('totalbudgetUSD')/1000));
                      	   	 budgetZAR = budgetZAR + (gCRAgg.get('totalbudgetZAR') == null ? 0 : Math.roundToLong((double)gCRAgg.get('totalbudgetZAR')/1000));
                      	}
                      	  
                      	 if((String)gCRAgg.get('Trading_Division__c') == 'IB'){
                      	   	 cYearRevUSD = cYearRevUSD + (gCRAgg.get('totalCurrYearUSD') == null ? 0 : Math.roundToLong((double)gCRAgg.get('totalCurrYearUSD')/1000));
                      	   	 cYearRevZAR = cYearRevZAR + (gCRAgg.get('totalCurrYearZAR') == null ? 0 : Math.roundToLong((double)gCRAgg.get('totalCurrYearZAR')/1000));
                      	   	 
                      	   	 budgetUSD = budgetUSD + (gCRAgg.get('totalbudgetUSD') == null ? 0 : Math.roundToLong((double)gCRAgg.get('totalbudgetUSD')/1000));
                      	   	 budgetZAR = budgetZAR + (gCRAgg.get('totalbudgetZAR') == null ? 0 : Math.roundToLong((double)gCRAgg.get('totalbudgetZAR')/1000));
                      	 }
                      	  
                      	 if((String)gCRAgg.get('Trading_Division__c') == 'OTHER'){
                      	   	 cYearRevUSD = cYearRevUSD + (gCRAgg.get('totalCurrYearUSD') == null ? 0 : Math.roundToLong((double)gCRAgg.get('totalCurrYearUSD')/1000));
                      	   	 cYearRevZAR = cYearRevZAR + (gCRAgg.get('totalCurrYearZAR') == null ? 0 : Math.roundToLong((double)gCRAgg.get('totalCurrYearZAR')/1000));
                      	   	 
                      	   	 budgetUSD = budgetUSD + (gCRAgg.get('totalbudgetUSD') == null ? 0 : Math.roundToLong((double)gCRAgg.get('totalbudgetUSD')/1000));
                      	   	 budgetZAR = budgetZAR + (gCRAgg.get('totalbudgetZAR') == null ? 0 : Math.roundToLong((double)gCRAgg.get('totalbudgetZAR')/1000));
                      	} 
                    	}
               
               	       If (cYearRevUSD != 0){
                       lstsowDataUSD.add(new sowDataAll('Total Pipeline',Integer.valueOf(cYearRevUSD),Integer.valueOf(budgetUSD),Integer.valueOf(totalPipeline)));
                       }
                       else{
                       lstsowDataUSD.add(new sowDataAll('Total Pipeline',0,0,Integer.valueOf(totalPipeline)));
                       barChartThirteen = true ;
                       }
                       	
                       If (cYearRevZAR != 0){
                       lstsowDataZAR.add(new sowDataAll('Total Pipeline',Integer.valueOf(cYearRevZAR),Integer.valueOf(budgetZAR),Integer.valueOf(totalPipeline)));
                       }
                       else{
                       	lstsowDataZAR.add(new sowDataAll('Total Pipeline',0,0,Integer.valueOf(totalPipeline)));
                       	barChartThirteen = true ;
                       }
                       
                        if (this.ISO == 'ZAR'){
                         lstsowDataTotal = lstsowDataZAR ;
                        }
                        else{
                         lstsowDataTotal = lstsowDataUSD ;
                        }
         	
          } 
         
       // Total Current Year Weighted Revenue of all records
	    public Decimal getSumAll(){
	            Decimal sumTotalAll =0;
	            for(cPlanOpportunity opp: OpportunitylstAll){
	                sumTotalAll = sumTotalAll + opp.currentRev;
	                }
	            return sumTotalAll;
	    }
	    
	    // Total Current Year Weighted Revenue of Top All records
	     public Decimal getSumFiveAll(){
	                Decimal sumFiveAll =0;
	                Integer count = 0;
	                for(cPlanOpportunity opp1: OpportunitylstAll){
	                    
	                    if(count >= 5)
	                        break;
	                    else
	                        count++;
	                        
	                    sumFiveAll = sumFiveAll + opp1.currentRev;
	                    
	                }
	                return sumFiveAll;
	    }
	    
        // Total Current Year Weighted Revenue of all GM records
	    public Decimal getSumGM(){
	            Decimal sumTotalGM =0;
	            for(cPlanOpportunity opp: OpportunitylstGlobalMarkets){
	                sumTotalGM = sumTotalGM + opp.currentRev;
	                }
	            return sumTotalGM;
	    }
	    
	    // Total Current Year Weighted Revenue of Top 5 GM records
	
	     public Decimal getSumFiveGM(){
	                Decimal sumFiveGM =0;
	                Integer count = 0;
	                for(cPlanOpportunity opp1: OpportunitylstGlobalMarkets){
	                    
	                    if(count >= 5)
	                        break;
	                    else
	                        count++;
	                        
	                    sumFiveGM = sumFiveGM + opp1.currentRev;
	                    
	                }
	                return sumFiveGM;
	    }
	    
       
    // Total Current Year Weighted Revenue of all TPS records
    
    public Decimal getSumTPS(){
                Decimal sumTotalTPS = 0;
            for(cPlanOpportunity opp: OpportunitylstTPS){
                sumTotalTPS = sumTotalTPS + opp.currentRev;
                }
            return sumTotalTPS;
    }  
    
    // Total Current Year Weighted Revenue of Top 5 TPS records
     public Decimal getSumFiveTPS(){
                Decimal sumFiveTPS =0;
                Integer count = 0;
                for(cPlanOpportunity opp1: OpportunitylstTPS){
                    
                    if(count >= 5)
                        break;
                    else
                        count++;
                        
                    sumFiveTPS = sumFiveTPS + opp1.currentRev;
                    
                }
                return sumFiveTPS;
            
      }
    
        
    // Total Current Year Weighted Revenue of all IB records
    public Decimal getSumIB(){
            Decimal sumTotalIB =0;
            for(cPlanOpportunity opp: OpportunitylstIB){
                sumTotalIB = sumTotalIB + opp.currentRev;
                }
            return sumTotalIB;
     } 
    
    // Total Current Year Weighted Revenue of Top 5 IB records

       public Decimal getSumFiveIB(){
                Decimal sumFiveIB =0;
                Integer count = 0;
                for(cPlanOpportunity opp1: OpportunitylstIB){
                    
                    if(count >= 5)
                        break;
                    else
                        count++;
                        
                    sumFiveIB = sumFiveIB + opp1.currentRev;
                    
                }
                return sumFiveIB;
       }
       
       
       public void crocCapitalUtilization () {
       	
       	 list<Client_Capital_and_Revenue__c> clientCapRevenuelst = [select Id ,Capital_Utilisation_ZAR__c,Capital_Utilisation_USD__c, CROC_ZAR__c from Client_Capital_and_Revenue__c where  Client__c =: currentId limit 1];
       
       	  if(clientCapRevenuelst.size() >0){
                 if(this.ISO == 'ZAR'){
                     capUtilization =  clientCapRevenuelst[0].Capital_Utilisation_ZAR__c ;
                     CROCZAR = clientCapRevenuelst[0].CROC_ZAR__c ;
                  }
                     if(this.ISO == 'USD'){
                         capUtilization =  clientCapRevenuelst[0].Capital_Utilisation_USD__c ;
                         CROCZAR = clientCapRevenuelst[0].CROC_ZAR__c ;
                     }
          else{
             capUtilization =  clientCapRevenuelst[0].Capital_Utilisation_ZAR__c ;
             CROCZAR = clientCapRevenuelst[0].CROC_ZAR__c ;
            }
          }
       }
       
       
        //Wrapper Object for GCR Revenue and soW
        public class sowDataAll {
        public string name {get ; set;} // wrapper fields
        public Integer tBudget {get ; set;} // wrapper fields
        public Integer tRevenue {get ; set;} // wrapper fields
        public Integer tpipeline {get ; set;} // wrapper fields
        
        public sowDataAll (String name, Integer data1 ,Integer data2 , Integer data3){
            this.name = name ;
            this.tRevenue = data1;
            this.tBudget = data2 ;
            this.tpipeline = data3 ;
        }
    }
        
       //Wrapper Object for GCR Revenue
        public class barData {
        public string name {get ; set;} // wrapper fields
        public Integer cYearYTD  {get ; set;} // wrapper fields
        public Integer pYearYTD {get ; set;} // wrapper fields
        
        public barData (String name, Integer data1 ,Integer data2){
            this.name = name ;
            this.cYearYTD = data1;
            this.pYearYTD = data2;
        }
    }
    
     //Wrapper Object for GCR Revenue and soW
        public class sowData {
        public string name {get ; set;} // wrapper fields
        public Integer tWallet  {get ; set;} // wrapper fields
        public Integer tBudget {get ; set;} // wrapper fields
        public Integer tRevenue {get ; set;} // wrapper fields
        
        public sowData (String name, Integer data1 ,Integer data2,Integer data3){
            this.name = name ;
            this.tWallet = data1;
            this.tBudget = data2;
            this.tRevenue = data3 ;
        }
    }
    
     //Wrapper Object for GCR Revenue and soW GM
        public class sowDataGM {
        public string name {get ; set;} // wrapper fields
        public Integer tWallet  {get ; set;} // wrapper fields
        public Integer tBudget {get ; set;} // wrapper fields
        public Integer tRevenue {get ; set;} // wrapper fields
        
        public sowDataGM (String name, Integer data1 ,Integer data2,Integer data3){
            this.name = name ;
            this.tWallet = data1;
            this.tBudget = data2;
            this.tRevenue = data3 ;
        }
    }
    
     //Wrapper Object for GCR Revenue and soW TPS
        public class sowDataTPS {
        public string name {get ; set;} // wrapper fields
        public Integer tWallet  {get ; set;} // wrapper fields
        public Integer tBudget {get ; set;} // wrapper fields
        public Integer tRevenue {get ; set;} // wrapper fields
        
        public sowDataTPS (String name, Integer data1 ,Integer data2,Integer data3){
            this.name = name ;
            this.tWallet = data1;
            this.tBudget = data2;
            this.tRevenue = data3 ;
        }
    }
    
     //Wrapper Object for GCR Revenue and soW
        public class sowDataIB {
        public string name {get ; set;} // wrapper fields
        public Integer tWallet  {get ; set;} // wrapper fields
        public Integer tBudget {get ; set;} // wrapper fields
        public Integer tRevenue {get ; set;} // wrapper fields
        
        public sowDataIB (String name, Integer data1 ,Integer data2,Integer data3){
            this.name = name ;
            this.tWallet = data1;
            this.tBudget = data2;
            this.tRevenue = data3 ;
        }
    }
    
    
     //Wrapper Object for Credit Line
        public class creditData {
        public string name {get ; set;} // wrapper fields
        public Integer cLimit  {get ; set;} // wrapper fields
        public Integer tUtiliz {get ; set;} // wrapper fields
        
        public creditData (String name, Integer data1 ,Integer data2){
            this.name = name ;
            this.cLimit = data1;
            this.tUtiliz = data2;
        }
    }
    
    //Wrapper Object for GCR Historical Revenue
        public class historyData {
        public string name {get ; set;} // wrapper fields
        public Integer cmonthGMYTD  {get ; set;} // wrapper fields
        public Integer cmonthTPSYTD  {get ; set;} // wrapper fields
        public Integer cmonthIBYTD  {get ; set;} // wrapper fields
        public Integer cmonthOtherYTD  {get ; set;} // wrapper fields
        public Integer total  {get ; set;} // wrapper fields
        
        public historyData (String name, Integer data1 ,Integer data2 ,Integer data3 ,Integer data4){
            this.name = name ;
            this.cmonthGMYTD = data1;
            this.cmonthTPSYTD = data2;
            this.cmonthIBYTD = data3;
            this.cmonthOtherYTD = data4;
            this.total = data1 + data2 + data3 + data4 ;
        }
    }
    
     //Wrapper Object for Pie Chart 
      public class pieChartDiv {
      	public string name {get ; set;}
      	public Integer cYearRev {get ; set;}
      	
      	public pieChartDiv (String name, Integer data1){
      	 this.name = name ;
         this.cYearRev = data1;
       	}
      	
      }
      
      //Wrapper Object for Pie Chart 
      public class pieChartCountry {
      	public string name {get ; set;}
      	public Integer cYearRev {get ; set;}
      	
      	public pieChartCountry (String name, Integer data1){
      	 this.name = name ;
         this.cYearRev = data1;
       	}
      	
      }
      
       //Wrapper Object for Pie Chart 
        public class gaugeDataGM {
        public String name { get; set; }
        public Integer size { get; set; }
        public Integer limitSize { get; set; }
        public Integer tpipeline {get ; set;}

        public gaugeDataGM(String name, Integer data, Integer lsize , Integer pipeline) {
            this.name = name;
            this.size = data;
            this.limitSize = lsize ;
            this.tpipeline = pipeline ;
        }
    }
    
    //Wrapper Object for Pie Chart 
        public class gaugeDataTPS {
        public String name { get; set; }
        public Integer size { get; set; }
        public Integer limitSize { get; set; }
        public Integer tpipeline {get ; set;}

        public gaugeDataTPS(String name, Integer data, Integer lsize , Integer pipeline) {
            this.name = name;
            this.size = data;
            this.limitSize = lsize ;
            this.tpipeline = pipeline ;
        }
    }
    
      //Wrapper Object for Open Opportunity
    
    public class cPlanOpportunity {
        
        public Opportunity opp {
            get;
            set;
        }
      
        public Decimal currentRev {
            get;
            set;
        }
        
        public String grandProductName {
                get;
                set;
        } 
        public cPlanOpportunity() {
            opp = new Opportunity();
        }
    
        public cPlanOpportunity(Opportunity o) {
            opp = o;
        }
    }
    
    //Wrapper Object for Pie Chart 
        public class gaugeDataIB {
        public String name { get; set; }
        public Integer size { get; set; }
        public Integer limitSize { get; set; }
        public Integer tpipeline {get ; set;}

        public gaugeDataIB(String name, Integer data, Integer lsize , Integer pipeline) {
            this.name = name;
            this.size = data;
            this.limitSize = lsize ;
            this.tpipeline = pipeline ;
        }
    }
     
     //CURRENCY CONVERSION CLASS
    /*public class CurrencyConverter {

        public currencyConverter() {}

        public Decimal convert(Decimal val, String oldCurr, Map < String, Double > RateMap, String newCurr) {
            //NOTE ON CALCULATION:
            //(current curr / current rate) = USD(1:1) 
            //(USD * new rate) = new curr value

            // No point in trying to convert a null.
            if (val == null) return 0;
            Decimal displayVal;


            if ((oldCurr != newCurr) || (val != 0)) {

                Double oldrate = RateMap.get(oldCurr);
                Decimal usdval = (val / oldrate);
                Double newrate = RateMap.get(newCurr);

                displayVal = (usdval * newrate);

            } else {
                displayVal = val;
            }
            return displayVal;
        }

    }*/
    
    public String showDateFormat (String month , String Year){
    	 
    	 Map<String,String> monthMap = new map<String, String>();
    	 monthMap.put('1' , 'Jan');
    	 monthMap.put('2' , 'Feb');
    	 monthMap.put('3' , 'Mar');
    	 monthMap.put('4' , 'Apr');
    	 monthMap.put('5' , 'May');
    	 monthMap.put('6' , 'Jun');
    	 monthMap.put('7' , 'Jul');
    	 monthMap.put('8' , 'Aug');
    	 monthMap.put('9' , 'Sep');
    	 monthMap.put('10' , 'Oct');
    	 monthMap.put('11' , 'Nov');
    	 monthMap.put('12' , 'Dec');
    	 
    	 return  monthMap.get(month) + '/' + Year ;
    	
    }
    
     //Method that pulls the latest currency conversion rates.
    /*public void snapCurrencyTable() {

        this.CurrTable = [Select cur.IsoCode, cur.ConversionRate From CurrencyType cur LIMIT 300];

        for (CurrencyType c: CurrTable) {
            RateMap.put(c.IsoCode, c.ConversionRate);
        }
    }*/
    
      

}