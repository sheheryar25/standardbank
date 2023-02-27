import { LightningElement, wire, track } from "lwc";
import Id from "@salesforce/user/Id";
import getSolutions from "@salesforce/apex/OSB_SolutionShowcase_CTRL.getSolutionShowcase";
import OSB_Images from "@salesforce/resourceUrl/OSB_Images_Two";
import getImageURL from "@salesforce/apex/OSB_SolutionCaseImage.getImageURL";


export default class osbMayBeInterestedInSolutions extends LightningElement {
  userId = Id;
  solIntroOne;
  solThirdOne;
  solTitleOne;
  solTMOne = false;
  solIntroTwo;
  solThirdTwo;
  solTitleTwo;
  solTMTwo = false;
  SolutionsRequest = true;
  SolutionRequestOne = false;
  solSiteOne;
  solSiteTwo;
  ImageName;
  ApplicationImageOne;
  ApplicationImageTwo;
  ImagePlaceholder = OSB_Images;
 

  @wire(getSolutions, { userId: "$userId" })
  getSolutions({ error, data }) {
    if (data) {
      let mySolutions = JSON.parse(JSON.stringify(data));
      let interestedSolutions = [];
      this.SolutionRequestOne = false;
      this.SolutionsRequest = true;
      for (let i = 0; i < mySolutions.length; i++) {
        if (!mySolutions[i].Is_coming_soon__c) {
          if (!(mySolutions[i].Title === "My support")) {
            interestedSolutions.push(mySolutions[i]);
          }
        }
      }
      if (interestedSolutions.length && interestedSolutions.length >= 2) {
        this.ApplicationImageOne = null;
        let randNumOne = Math.floor(Math.random() * interestedSolutions.length);
        let SolutionOne = interestedSolutions[randNumOne];
        this.solTitleOne = SolutionOne.Title;
        if (SolutionOne.Title === "AUTHENTIFI") {
          this.solTMOne = true;
        }
        let imageUrl = SolutionOne.Image__c;
        getImageURL({ url: imageUrl })
          .then((data) => {
            if (data) {
              this.ApplicationImageOne = data;
            }
          })
          .catch((error) => {
            this.error = error;
          });
        this.solIntroOne = SolutionOne.Introduction__c;
        if (SolutionOne.Application_Owner__c === "3rd Party") {
          this.solThirdOne = true;
        } else {
          this.solThirdOne = false;
        }
        this.solSiteOne = SolutionOne.Solution_URL__c;

        interestedSolutions.splice(randNumOne, 1);
        this.ApplicationImageTwo = null;
        let randNumTwo = Math.floor(Math.random() * interestedSolutions.length);
        let SolutionTwo = interestedSolutions[randNumTwo];
        this.solTitleTwo = SolutionTwo.Title;
        if (SolutionTwo.Title === "AUTHENTIFI") {
          this.solTMTwo = true;
        }else{
          this.solTMTwo = false;
        }
        let imageUrlTwo = SolutionTwo.Image__c;
        getImageURL({ url: imageUrlTwo })
          .then((data) => {
            if (data) {
              this.ApplicationImageTwo = data;
            }
          })
          .catch((error) => {
            this.error = error;
          });
        this.solIntroTwo = SolutionTwo.Introduction__c;
        if (SolutionTwo.Application_Owner__c === "3rd Party") {
          this.solThirdTwo = true;
        } else {
          this.solThirdTwo = false;
        }
        this.solSiteTwo = SolutionTwo.Solution_URL__c;
      } else {
        if (interestedSolutions.length && (interestedSolutions.length = 1)) {
          this.ApplicationImageOne = null;
          let randNumOne = Math.floor(
            Math.random() * interestedSolutions.length
          );
          let SolutionOne = interestedSolutions[randNumOne];
          this.solTitleOne = SolutionOne.Title;
          if (SolutionOne.Title === "AUTHENTIFI") {
            this.solTMOne = true;
          }
          this.solIntroOne = SolutionOne.Introduction__c;
          let imageUrl = SolutionOne.Image__c;
          getImageURL({ url: imageUrl })
            .then((data) => {
              if (data) {
                this.ApplicationImageOne = data;
              }
            })
            .catch((error) => {
              this.error = error;
            });
          if (SolutionOne.Application_Owner__c === "3rd Party") {
            this.solThirdOne = true;
          } else {
            this.solThirdOne = false;
          }
          this.solSiteOne = SolutionOne.Solution_URL__c;
          this.SolutionRequestOne = true;
          this.SolutionsRequest = false;
        } else {
          this.SolutionRequestOne = false;
          this.SolutionsRequest = false;
        }
      }
    } else if (error) {
      this.error = error;
    }
  }

  visitWebsiteOne() {
    window.open(this.solSiteOne);
  }

  visitWebsiteTwo() {
    window.open(this.solSiteTwo);
  }
}