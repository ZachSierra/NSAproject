export class Classification{
    /**
     * @param {String} name 
     */
    constructor(name){
        this.name = name;
    }

    /**
     * Returns the name of the Classification
     * @returns {String} name 
     */
    getName(){
        return this.name;
    }
}

export class Dissemination{
    /**
     * @param {String} name 
     */
    constructor(name){
        this.name = name;
    }
    /**
     * Returns the name of the Dissemination
     * @returns {String} name 
     */
    getName(){
        return this.name;
    }
}

export class Sci{
    /**
     * @param {String} name 
     */
    constructor(name){
        this.name = name;
    }
    /**
     * Returns the name of the Sci
     * @returns {String} name 
     */
    getName(){
        return this.name;
    }
}

export class Banner{
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