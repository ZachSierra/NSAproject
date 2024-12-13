const sciUrl = chrome.runtime.getURL('../json/sci.json');
const dissemUrl = chrome.runtime.getURL('../json/dissemination.json');


async function getSciData(sciUrl) {
    try {
        const response = await fetch(sciUrl);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(error.message);
    }
    return null;
}

async function getDissemData(dissemUrl) {
    try {
        const response = await fetch(dissemUrl);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(error.message);
    }
    return null;
}

async function validateBanner(banner) {
    // grab json data
    const sciJSON = await getSciData(sciUrl);
    if (!sciJSON) {
        console.error('Failed to fetch or parse JSON.');
        return;
    }
    // grab json data
    const dissemJSON = await getDissemData(dissemUrl);
    if (!dissemJSON) {
        console.error('Failed to fetch or parse JSON.');
        return;
    }

    const allMarkings = banner.sci;

    // validate sci
    for (const sci of banner.sci) {
        for (const rule of sciJSON) {
            if (sci.name === rule.name) {
                for (const prohibited of rule['prohibitedWith']) {
                    if (banner.classification === prohibited) {
                        console.log("ERROR: Cannot use " + banner.classification + "with " + sci.name + ".");
                        console.log("Banner with error: " + banner.toString());
                        return banner.classification;
                    }
                }

                for (const requiredClass of rule['requiredClassification']) {
                    if (requiredClass !== "" && banner.classification !== requiredClass) {
                        console.log("ERROR: Required class " + requiredClass + " is not included in banner for " + sci.name + ".");
                        console.log("Banner with error: " + banner.toString());
                        return banner.classification;
                    }
                }

                for (const requiredDissem of rule['requiredDissemination']) {
                    if (requiredDissem !== "" && banner.dissemination !== requiredDissem) {
                        console.log("ERROR: Required dissemination " + requiredDissem + " is not included in banner for " + sci.name + "!!!");
                        console.log("Banner with error: " + banner.toString());
                        return banner.classification;
                    }
                }
            }
        }
    }

    // validate dissemination
    for(let i = 0; i < banner.dissemination.length; i++) {
        const dism = banner.dissemination[i];

        const foundDism = dissemJSON.find(d => dism.getName().includes(d.classification));
        if(!foundDism){
            console.log("ERROR: Invalid dissemination found: " + dism.getName() + ".");
            console.log("Banner with error: " + banner.toString());
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
                console.log("ERROR: Prohibited marking found: " + prohibitedTerm + ".");
                console.log("Banner with error: " + banner.toString());
                return banner.classification;
            }
        }

        if(foundDism['requiredWith'].length > 0){
            const foundReq = allMarkings.some((term) => {
                return foundDism['requiredWith'].some(req => term.getName().includes(req.classification));
            });

            if(!foundReq){
                console.log("ERROR: One of required markings not found: " + foundDism['requiredWith'] + ".");
                console.log("Banner with error: " + banner.toString());
                return banner.classification;
            }
        }
    }

    return banner.classification;
}

