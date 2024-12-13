'use strict';


const bannerRegex = /\b(TOP SECRET|SECRET|CONFIDENTIAL|UNCLASSIFIED)(?:\/\/[A-Z\s-,]+(?:\/[A-Z\s-,]+)*)*\b/g;


async function main() {
    const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div');
    let classification = "";
    for (const element of textElements) {
        const textContent = element.innerHTML.replace(/<br\s*\/?>/gi, ' ').replace(/\s+/g, ' ').trim();
        let banner;
        let response;


        if (textContent.match(bannerRegex)) {
            banner = textContent.match(bannerRegex);
            banner = banner[0];
            const categories = banner.split('//');
            let newBanner;
            let sci;
            let sciArray = [];
            let dissemination;
            let disseminationArray = [];

            switch (categories.length) {
                case 1:
                    newBanner = new Banner(new Classification(categories[0]), [], []);
                    break;
                case 2:
                    if (categories[1].match(/(HCS)|(COMINT)|(SI)|(-GAMMA)|(-G)|(-ECI)|(TALENT KEYHOLE)|(TK)/ig)) {
                        sci = categories[1].split(/[-\/]/);

                        sci.forEach(element => {
                            sciArray.push(new Sci(element));
                        })

                        newBanner = new Banner(new Classification(categories[0]), sciArray, []);
                    } else {
                        dissemination = categories[1].split('/');

                        dissemination.forEach(element => {
                            disseminationArray.push(new Dissemination(element));
                        })

                        newBanner = new Banner(new Classification(categories[0]), [], disseminationArray);
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

                    newBanner = new Banner(new Classification(categories[0]), sciArray, disseminationArray);
                    break;
                default:
                    console.log("Invalid banner format");
            }

            response = await validateBanner(newBanner);
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

main().then(r => console.log("done"));


