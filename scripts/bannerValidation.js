import sciJSON from '../json/sci.json';
import disseminationJSON from '../json/dissemination.json';

function validateBanner(banner) {

    const allMarkings = banner.sci;

    // validate sci
    for (const sci of banner.sci) {
        for (const rule of sciJSON) {
            if (sci.name === rule.name) {
                for (const prohibited of rule['prohibitedWith']) {
                    if (banner.classification === prohibited) {
                        console.log("ERROR: Cannot use classification with this SCI.")
                        return banner.classification;
                    }
                }

                for (const requiredClass of rule['requiredClassification']) {
                    if (requiredClass !== "" && banner.classification !== requiredClass) {
                        console.log("ERROR: Required class is not included. [" + requiredClass + "]");
                        return banner.classification;
                    }
                }

                for (const requiredDissem of rule['requiredDissemination']) {
                    if (requiredDissem !== "" && banner.dissemination !== requiredDissem) {
                        console.log("ERROR: Required dissemination is not included. [" + requiredDissem + "]");
                        return banner.classification;
                    }
                }
            }
        }
    }

    // validate dissemination
    for(let i = 0; i < banner.dissemination.length; i++) {
        const dism = banner.dissemination[i];

        const foundDism = disseminationJSON.find(d => dism.getName().includes(d.classification));
        if(!foundDism){
            console.log("ERROR: Invalid dissemination found : [" + dism.getName() + "]");
            return banner.classification;
        }

        if(foundDism['prohibitedWith'].length > 0){
            let prohibitedTerm = null;
            const foundProhibited = allMarkings.some((term) => {
                const enemy = foundDism['prohibitedWith'].find(prohibited => term.getName().includes(prohibited.classification));

                if(enemy){
                    prohibitedTerm = enemy.classification;
                    return true;
                }
            })

            if(foundProhibited){
                console.log("ERROR: Prohibited marking found: [" + prohibitedTerm + "]");
                return banner.classification;
            }
        }

        if(foundDism['requiredWith'].length > 0){
            const foundReq = allMarkings.some((term) => {
                return foundDism['requiredWith'].some(req => term.getName().includes(req.classification));
            });

            if(!foundReq){
                console.log("ERROR: One of required markings not found: [" + foundDism['requiredWith'] + "]");
                return banner.classification;
            }
        }
    }

    return banner.classification;
}
