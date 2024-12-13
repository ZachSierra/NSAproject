
// appends the NSA.css file to the head of the document
const header = document.getElementsByTagName('head')[0];
const link = document.createElement('link');
link.rel = 'stylesheet';
link.type = 'text/css';
link.href = '../scripts/NSA.css';
header.appendChild(link);