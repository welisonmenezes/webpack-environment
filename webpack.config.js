const path = require('path');
module.exports = {
	entry: {
		main: './app/main.js'
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	}
};