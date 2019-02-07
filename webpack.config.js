const path = require('path');
const webpack = require('webpack');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const SpritesmithPlugin = require('webpack-spritesmith');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack');
const imageminGifsicle = require('imagemin-gifsicle');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminOptipng = require('imagemin-optipng');
const imageminSvgo = require('imagemin-svgo');

const mode = 'development'; // [development, production]
let SERVICE_URL = JSON.stringify('http://development-url-here/');
const minimizer = [];
const plugins = [];
const min = '.min';
let templateMinify = {};

plugins.push(new CleanWebpackPlugin('./dist', {}));

plugins.push(new CopyWebpackPlugin([
    {
        from:'img/*',
        to:'',
        ignore: [ 'img/icons/*' ]
    },
    {
        from:'fonts/*',
        to:'',
        ignore: []
    }
]));

plugins.push(new SpritesmithPlugin({
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
}));

plugins.push(new ExtractCssChunks(
    {
      filename: 'css/[name]' + min + '.css',
      chunkFilename: 'css/vendors' + min + '.css',
      hot: true,
      orderWarning: true,
      reloadAll: true,
      cssModules: true
    }
));

plugins.push(new webpack.ProvidePlugin({
    $: 'jquery/dist/jquery.js',
    jQuery: 'jquery/dist/jquery.js'
}));

plugins.push(new webpack.optimize.ModuleConcatenationPlugin());

if (mode === 'production') {

    SERVICE_URL = JSON.stringify('http://production-url-here/');

    templateMinify = {
        collapseWhitespace: true, 
        removeComments: true, 
        removeRedundantAttributes: true, 
        removeScriptTypeAttributes: true, 
        removeStyleLinkTypeAttributes: true, 
        useShortDoctype: true
    };

    minimizer.push(new UglifyJsPlugin({
        sourceMap: true,
        uglifyOptions: {
            compress: { 
                warnings: false 
            },
            output: {
                comments: false
            }
        }
    }));

    minimizer.push(new OptimizeCssAssetsPlugin({
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
    }));

    plugins.push(new ImageminPlugin({
        bail: false, // Ignore errors on corrupted images
        cache: false,
        name: 'img/[name].[ext]',
        test: /\.(jpe?g|png|gif|svg)$/i,
        exclude: [/node_modules/, /fonts/],
        imageminOptions: {
            plugins: [
                imageminGifsicle({
                    interlaced: true,
                    optimizationLevel: 3
                }),
                imageminJpegtran({
                    progressive: true
                }),
                imageminOptipng({
                    optimizationLevel: 5
                }),
                imageminSvgo({
                    removeViewBox: true
                })
            ]
        }
    }));
}

plugins.push(new webpack.DefinePlugin({
    SERVICE_URL: SERVICE_URL
}));

plugins.push(new HtmlWebpackPlugin({
    template: 'index.html',
    filename: 'index.html',
    minify: templateMinify
}));

plugins.push(new HtmlWebpackPlugin({
    template: 'about.html',
    filename: 'about.html',
    minify: templateMinify
}));

module.exports = {
	mode: mode,
    watch: false,
	entry: {
        bundle: ['./app/main.js'],
        vendors: ['jquery', 'bootstrap', 'popper.js'],
        plugins: ['slick-carousel']
	},
	output: {
		filename: 'js/[name]' + min + '.js',
		path: path.resolve(__dirname, 'dist'),
        publicPath: './',
	},
	module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['@babel/preset-env']
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
    plugins: plugins,
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
                    //filename: 'js/[name]' + min + '.js',
                    enforce: true,
                    priority: 3
                },
                plugins: {
                    name: 'plugins',
                    test: 'plugins',
                    //filename: 'js/[name]' + min + '.js',
                    enforce: true,
                    priority: 2
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