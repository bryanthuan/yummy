const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const { window } = (new JSDOM(''));
const DOMPurify = createDOMPurify(window);

exports.xss = dirtyHtml => ((!dirtyHtml) ? null : DOMPurify.sanitize(dirtyHtml));

