import { LightningElement, track, wire, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getOSBDocumentURL from '@salesforce/apex/OSB_RequestPage_CTRL.getOSBDocumentURL';
import getUserDetails from '@salesforce/apex/OSB_RequestPage_CTRL.getUserDetails';
import CaseCheck from '@salesforce/apex/OSB_RequestPage_CTRL.caseCheck';
import createCaseWithContactId from '@salesforce/apex/OSB_RequestPage_CTRL.createCaseWithContactId';

export default class osbSolutionSignUp extends LightningElement {

    @api solutionLogo;
    @api solutionName;
    @api termsConditionsDoc;
    @api Email = "true";
    @api Company = "true";
    @api Mobile = "true";
    @api sendEmailCheck = "false";
    @api backgroundColor = '#000524';
    @api parentFont = 'Roboto,Brenton,sans-serif';
    @track RequestNotComplete = true;
    tncDownload;
    Logo;
    email ='';

    renderedCallback(){
        this.Logo = this.solutionLogo;
        getOSBDocumentURL({
            "docName": this.termsConditionsDoc
        }).then(result => {
            this.tncDownload = window.location.origin+result;
        })
        this.template.querySelector('[data-id="right-image"]').style.backgroundColor = this.backgroundColor;
        this.template.querySelector('[data-id="SignUpRequestSol"]').style.fontFamily = this.parentFont;
        this.checkForCase();
    }

    @wire(getUserDetails) 
    contacts;
    
    @wire(getUserDetails) 
    getContact({error,data}){
        if(data){
         this.email = data[0] ?  data[0].Email : '';
        }
    };

    checkForCase(){
        let sub = 'OneHub - '+this.solutionName;
        CaseCheck({email: this.email, subject: sub})
        .then((data) => {
            if (data) {
                if(data[0]){                    
                    this.RequestNotComplete = false;
                }
                this.error = undefined;
            }
        })
    }

    requestAccess() { 
        let contacts = getUserDetails();
        let fullNameField = this.template.querySelector(`[data-id="Fullname"]`);
        let fullName = fullNameField ? fullNameField.value : "";
        let emailField = this.template.querySelector(`[data-id="EmailAddress"]`);
        let email = emailField ? emailField.value : ""; 
        let companyNameField = this.template.querySelector(`[data-id="Company"]`);
        let companyName = companyNameField ? companyNameField.value : "";
        let cellphoneField = this.template.querySelector(`[data-id="MobileNumber"]`);
        let cellphone = cellphoneField ? cellphoneField.value : "";               
        if(fullName && email && companyName && cellphone && this.RequestNotComplete ){           
                let origin = "Web";
                let status = "New";        
                let newCase ={
                Origin : origin,
                Status : status,
                SuppliedEmail :email,
                SuppliedName :fullName,
                SuppliedPhone :cellphone,
                SuppliedCompany : companyName,
                Description :   this.solutionName+' sign up request',
                Type :'OneHub ' + this.solutionName + ' Registration',   
                Subject : 'OneHub - '+this.solutionName
            }   
            this.createCase(newCase);     
            if(this.sendEmailCheck){
                this.sendEmail(contacts);
            }          
        }
    }

    sendEmail(contact){
        sendEmail({contactRecord:contact,"solutionName":this.solutionName});              
    }

    createCase(newCase){
        let regURLName = this.solutionName+'_Registration_URL';
        createCaseWithContactId({caseRecord:newCase,urlName: regURLName})
        this.RequestNotComplete = false;                      
    }

    returnToOneHub(){
        this[NavigationMixin.Navigate]({
            type:'standard__namedPage',
            attributes: {
                pageName: 'Home'
            },
        });        
    }             
}