const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const window = (new JSDOM('')).window;
const DOMPurify = createDOMPurify(window);

exports.xss = dirtyHtml => {
    if (!dirtyHtml) return;
    let cleanText;
    cleanText = DOMPurify.sanitize(dirtyHtml);
    return cleanText;
}