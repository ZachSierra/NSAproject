'use strict';
class Banner{
    /**
     * 
     * @param {Classification} classification 
     * @param {Sci[]} sci 
     * @param {Dissemination[]} dissemination 
     */
    constructor(classification, sci, dissemination){
        this.classification = classification;
        this.sci = sci;
        this.dissemination = dissemination;
    }
    /**
     * 
     * @returns {Classification} classification
     */
    getClassification(){
        return this.classification;
    }
    /**
     * 
     * @returns {Sci[]} sci
     */
    getSci(){
        return this.sci;
    }
    /**
     * 
     * @returns {Dissemination[]} dissemination
     */
    getDissemination(){
        return this.dissemination;
    }
}