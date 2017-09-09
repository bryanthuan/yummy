// const createDOMPurify = require('dompurify');
// const { JSDOM } = require('jsdom');

// const window = (new JSDOM('')).window;
// const DOMPurify = createDOMPurify(window);

const dirty = `Hoang Diep <img onload="alert('you are hacked')" src="http://media.tinmoitruong.vn/public/media/media/picture/07/e%201a.jpg" />`;

// const scriptss = `Hello <script>alert('Yoou are hacked')</script>`;

// const clean = DOMPurify.sanitize(dirty);
// const clean1 = DOMPurify.sanitize(scriptss);

// console.log(clean);
// console.log(clean1);

const { xss } = require('../handlers/xssHandlers');

const clean = xss(dirty);

console.log(clean);
console.log(dirty);