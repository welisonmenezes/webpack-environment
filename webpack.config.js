const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
var SpritesmithPlugin = require('webpack-spritesmith');

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
                test: /\.(css|sass|scss)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'sass-loader?includePaths[]=' + path.resolve(__dirname, './node_modules/compass-mixins/lib')
                    }
                ]
            },
            {
                test: /\.(jpg|png|gif|jpeg|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {  
                            name: '[path][name].[hash].[ext]',
                            publicPath: './'
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        modules: ['node_modules', 'img']
    },
    plugins: [
        new MiniCssExtractPlugin({
          filename: 'styles.css'
        }),
        new SpritesmithPlugin({
            src: {
                cwd: path.resolve(__dirname, 'img/icons'),
                glob: '*.png'
            },
            target: {
                image: path.resolve(__dirname, 'dist/img/sprite.png'),
                css: path.resolve(__dirname, 'scss/sprite.scss')
            },
            apiOptions: {
                cssImageRef: '~sprite.png'
            }
        })
    ],
    devServer: {
        contentBase: path.join(__dirname, '/'),
        compress: true,
        port: 9000
    }
};