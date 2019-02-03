const path = require('path');
module.exports = {
	mode: 'development',
	entry: {
		main: './app/main.js'
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
        publicPath: 'dist',
	},
	module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            },
            { 
                test: /\.scss$/, 
                use: [
                    {
                        loader : 'style-loader'
                    },
                    {
                        loader : 'css-loader'
                    },
                    {
                        loader : 'sass-loader'
                    }
                ]
            }
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, '/'),
        compress: true,
        port: 9000
    }
};