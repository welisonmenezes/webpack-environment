import 'bootstrap/scss/bootstrap.scss';

import 'popper.js';
import 'bootstrap/dist/js/bootstrap.js';

import '../scss/app.scss';

import Uppercase from './utils/uppercase.js';
import Lowercase from './utils/lowercase.js';


if (process.env.NODE_ENV === 'development') {
	console.log('Development Env.');
} else {
	console.log('Production Env.');
}

const u = new Uppercase('welison');
console.log(u.getUppercase());

const l = new Lowercase('WELISON');
console.log(l.getLowercase());

$('h1').css('color', 'red');