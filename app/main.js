import Uppercase from './utils/uppercase.js';
import Lowercase from './utils/lowercase.js';

import 'bootstrap/scss/bootstrap.scss';
import '../scss/app.scss';

if (process.env.NODE_ENV === 'development') {
	console.log('Development Env.');
} else {
	console.log('Production Env.');
}

const u = new Uppercase('welison');
console.log(u.getUppercase());

const l = new Lowercase('WELISON');
console.log(l.getLowercase());