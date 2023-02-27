/**
 * @description       : 
 * @author            : Chibuye Kunda
 * @group             : 
 * @last modified on  : 10-14-2021
 * @last modified by  : Chibuye Kunda
**/
import {LightningElement, api, wire} from 'lwc';
import loadData from '@salesforce/apex/AOB_CTRL_ACPicklist.loadData';


export default class Aob_comp_acpicklist extends LightningElement {
    @api helpText = null; 
    @api values = null; 
    @api label = null;
    @api sapfield = null;
    @api name = null;
    @api value = null;
    @api missingValueMessage = null;
    @api placeholder = null;

    @api required = null;
    currentValues;
  
    /**
     * This is the connected callback which will load 
     */
    connectedCallback(){
        //call the backend
        loadData({targetValue:this.sapfield}).then((result)=>{
            this.values = result;

            //check if we have values
            if(this.values){
                this.currentValues = [...this.values];
            }
        }).catch((error=>{
            console.log(error);
        }));
    }

    /**
     * This will fire handle change 
     * @param {*} event 
     */
    handleChange(event) {
        this.currentValues = this.values.filter(elem => elem.Name.toLowerCase().includes(event.target.value.toLowerCase()));
        this.fireChangeEvent(event.target.value);
    }

    /**
     * This will be called on focus
     */
    handleFocus() {
        this.isBlured = false;
        const datalistElem = this.template.querySelector('.aob_datalist');
        const inputElem = this.template.querySelector('lightning-input');
        datalistElem.style.width = inputElem.offsetWidth + 'px';
        datalistElem.style.left = inputElem.offsetLeft + 'px';
        datalistElem.style.top = inputElem.offsetTop + inputElem.offsetHeight + 'px';
        datalistElem.style.display = 'block';
    }

    /**
     * This will be called on blur
     */
    handleBlur() {
        this.template.querySelector('.aob_datalist').style.display = 'none';
    }

    /**
     * This will handle mouse down
     * @param {*} event 
     */
    handleMouseDown(event) {
        const newValue = event.target.dataset.value;
        this.template.querySelector('lightning-input').value = newValue;
        this.template.querySelector('.aob_datalist').style.display = 'none';
        this.fireChangeEvent(newValue);
    }

    /**
     * This will handle the change event
     * @param {*} newValue 
     */
    fireChangeEvent(newValue) {
        this.value = newValue;
        this.dispatchEvent(new CustomEvent('change', {
            bubbles: false,
            detail: {
                value: newValue,
                target: this.name
            }
        }));
    }
}