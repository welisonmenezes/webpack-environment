const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SpritesmithPlugin = require('webpack-spritesmith');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');


let SERVICE_URL;
let minimizer;
if (process.env.NODE_ENV === 'development') {

    SERVICE_URL = JSON.stringify('http://localhost:3000');

} else {

    SERVICE_URL = JSON.stringify('http://production-url.com');

    minimizer = [
        new UglifyJsPlugin({
            sourceMap: true,
            uglifyOptions: {
                output: {
                    comments: false
                }
            }
        }),
        new OptimizeCssAssetsPlugin({
            cssProcessorOptions: {
                sourcemap: true,
                map: {
                    inline: false, // set to false if you want CSS source maps
                    annotation: true
                }
            },
            cssProcessorPluginOptions: {
                preset: ['default', { discardComments: { removeAll: true } }]
            }
        })
    ];
}

module.exports = {
	mode: 'production', // [development, production]
    watch: true,
	entry: {
		bundle: ['./app/main.js']
	},
	output: {
		filename: '[name].js',
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
          filename: '[name].css',
          chunkFilename: "vendor.css"
        }),
        new CopyWebpackPlugin([
            {
                from:'img/*',
                to:'',
                ignore: [ 'img/icons/*' ]
            },
            {
                from:'*.html',
                to:'',
                ignore: []
            }
        ]),
        new SpritesmithPlugin({
            src: {
                cwd: path.resolve(__dirname, 'img/icons'),
                glob: '*.png'
            },
            target: {
                image: path.resolve(__dirname, 'img/sprite.png'),
                css: path.resolve(__dirname, 'scss/sprite.scss')
            },
            apiOptions: {
                cssImageRef: '~sprite.png'
            }
        }),
        new webpack.DefinePlugin({
            SERVICE_URL: SERVICE_URL
        }),
        new webpack.ProvidePlugin({
            $: 'jquery/dist/jquery.js',
            jQuery: 'jquery/dist/jquery.js'
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.EvalSourceMapDevToolPlugin({
            filename: '[file].map'
        })
    ],
    optimization: {
        minimizer: minimizer,
        splitChunks: {
            chunks: 'all',
            maxInitialRequests: Infinity,
            minSize: 0,
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    enforce: true
                }
            }
        }
    },
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
    devtool: 'source-map',
    devServer: {
        contentBase: path.join(__dirname, '/'),
        publicPath: '/',
        compress: true,
        port: 9000
    }
};