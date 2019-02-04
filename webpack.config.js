const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
    plugins: [
        new MiniCssExtractPlugin({
          filename: 'styles.css'
        })
    ],
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
                test: /\.(css|sass|scss)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'sass-loader?includePaths[]=' + path.resolve(__dirname, "./node_modules/compass-mixins/lib")
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