const path = require('path');
const webpack = require('webpack');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const SpritesmithPlugin = require('webpack-spritesmith');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');


let SERVICE_URL;
let minimizer;
let min = '.min';
if (process.env.NODE_ENV === 'development') {

    SERVICE_URL = JSON.stringify('http://development-url-here/');

} else {

    SERVICE_URL = JSON.stringify('http://production-url-here/');

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
                    inline: false,
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
	mode: 'development', // [development, production]
    watch: false,
	entry: {
        bundle: ['./app/main.js'],
        vendors: ['jquery', 'bootstrap', 'popper.js'],
        plugins: ['slick-carousel']
	},
	output: {
		filename: 'js/[name]' + min + '.js',
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
                    ExtractCssChunks.loader,
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
                            name: '../[path][name].[ext]',
                            publicPath: './'
                        }
                    }
                ]
            },
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '../[path][name].[ext]',
                        publicPath: './'
                    }
                }
            }
        ]
    },
    resolve: {
        modules: ['node_modules', 'img']
    },
    plugins: [
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
            },
            {
                from:'fonts/*',
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
                image: path.resolve(__dirname, '../img/sprite.png'),
                css: path.resolve(__dirname, 'scss/sprite.scss')
            },
            apiOptions: {
                cssImageRef: '../img/sprite.png'
            }
        }),
        new ExtractCssChunks(
            {
              filename: 'css/[name]' + min + '.css',
              chunkFilename: 'css/vendors' + min + '.css',
              hot: true,
              orderWarning: true,
              reloadAll: true,
              cssModules: true
            }
        ),
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
                vendors: {
                    name: 'vendors',
                    test: 'vendors',
                    filename: 'js/[name]' + min + '.js',
                    enforce: true,
                    priority: 2
                },
                plugins: {
                    name: 'plugins',
                    test: 'plugins',
                    filename: 'js/[name]' + min + '.js',
                    enforce: true,
                    priority: 3
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