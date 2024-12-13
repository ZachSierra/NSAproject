'use strict';
const bannerRegex = /\b(TOP SECRET|SECRET|CONFIDENTIAL|UNCLASSIFIED)(?:\/\/[A-Z\s-,]+(?:\/[A-Z\s-,]+)*)*\b/g;

/*
 * This is the main function that will parse the text elements, classify them based on the banner, and apply classes to the elements
 */
async function main() {
    const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div');
    let classification = "";
    for (const element of textElements) {
        // clean the text element
        const textContent = element.innerHTML.replace(/<br\s*\/?>/gi, ' ').replace(/\s+/g, ' ').trim();
        let banner;
        let response;

        if (textContent.match(bannerRegex)) {
            // capturing the banner
            banner = textContent.match(bannerRegex);
            banner = banner[0];

            //split banner into Classification, SCI and Dissemination
            const categories = banner.split('//');

            banner = createBanner(categories);

            response = await validateBanner(banner);
            classification = response.name;
        }
        if (classification === "TOP SECRET") {
            element.setAttribute('class', 'top-secret');
        }
        else if (classification === "SECRET") {
            element.setAttribute('class', 'secret');
        }
        else if (classification === "CONFIDENTIAL") {
            element.setAttribute('class', 'confidential');
        }
        else if (classification === "UNCLASSIFIED") {
            element.setAttribute('class', 'unclassified');
        }

    }
}

/*
 * This function creates a banner object based on the categories and returns a banner object
 */
function createBanner(categories){
    let banner;
    let sci;
    let sciArray = [];
    let dissemination;
    let disseminationArray = [];

    switch (categories.length) {
        case 1:
            banner = new Banner(new Classification(categories[0]), [], []);
            break;
        case 2:
            if (categories[1].match(/(HCS)|(COMINT)|(SI)|(-GAMMA)|(-G)|(-ECI)|(TALENT KEYHOLE)|(TK)/ig)) {
                sci = categories[1].split(/[-\/]/);

                sci.forEach(element => {
                    sciArray.push(new Sci(element));
                })

                banner = new Banner(new Classification(categories[0]), sciArray, []);
            } else {
                dissemination = categories[1].split('/');

                dissemination.forEach(element => {
                    disseminationArray.push(new Dissemination(element));
                })

                banner = new Banner(new Classification(categories[0]), [], disseminationArray);
            }
            break;
        case 3:
            sci = categories[1].split(/[-\/]/);
            dissemination = categories[2].split('/');

            sci.forEach(element => {
                sciArray.push(new Sci(element));
            })
            dissemination.forEach(element => {
                disseminationArray.push(new Dissemination(element));
            })

            banner = new Banner(new Classification(categories[0]), sciArray, disseminationArray);
            break;
        default:
            console.log("Invalid banner format");
    }
    return banner;

}

main().then(r => console.log("done"));