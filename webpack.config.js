'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
	context: path.resolve(__dirname, './app'),
	entry: {
		index: ['./entry.js', './styles/entry.scss']
	},
	devtool: 'inline-source-map',
	mode: 'development',
	devServer: {
		contentBase: path.join(__dirname, './app'),
		compress: true,
		hot: true,
		historyApiFallback: true,
		host: '0.0.0.0',
		port: 9006
	},
	module: {
		rules: [{
			test: /\.(js|jsx)$/,
			exclude: /node_modules/,
			use: {
				loader: 'babel-loader',
				query: {
					presets: ['@babel/env', '@babel/preset-react'],
					plugins: [],
				}
			}
		},
		{
			test: /\.css$/,
			use: [
				'style-loader',
				'css-loader'
			]
		},
		{
			test: /\.scss$/,
			use: [{
				loader: "style-loader"
			}, {
				loader: "css-loader"
			}, {
				loader: "sass-loader",
				options: {
					sourceMap: true
				} // compiles Sass to CSS
			}]
		},
		{
			test: /\.(eot|ttf|woff|woff2|svg)$/,
			exclude: [/images/],
			loader: 'file-loader?name=./fonts/[name].[ext]'
		},
		{
			test: /\.(png|jpe?g|gif|woff|ttf|svg|wav|mp3)$/,
			exclude: [/fonts/],
			use: [{
				loader: 'file-loader',
				options: {
					name: '[path][name].[ext]',
					publicPath: '/',
					outputPath: 'images/',
				}
			}, {
				loader: 'image-webpack-loader'
			}]
		},
		]
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/',
		filename: '[name].bundle.js',
		chunkFilename: '[id].bundle_[chunkhash].js',
		// hotUpdateChunkFilename: '.hot/[id].[hash].hot-update.js',
		// hotUpdateMainFilename: '.hot/[hash].hot-update.json'
	},
	resolve: {
		extensions: ['.js','.scss'],
		alias: {
			'imageAssets': path.resolve('app/images'),
			'appRoot': path.resolve('./app'),
			// 'jquery-ui': 'jquery-ui-dist/jquery-ui.js',
			// bind to modules;
			//modules: path.join(__dirname, "node_modules"),
		}
	},
	plugins: [
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			// Hammer: 'hammerjs',
			// Matter: 'matter-js'
		}),
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			inject: true,
			hash: true,
			template: 'index.html',
			chunks: ['index']
		}),
		new webpack.HotModuleReplacementPlugin(),
		new CopyWebpackPlugin([
		    {
		        from: '../app/images/',
		        to: '../dist/images/'
			}, 
			{
		        from: '../app/downloads/',
		        to: '../dist/downloads/'
			}, 
			{
				from: '../app/exported_individual.json',
		        to: '../dist/exported_individual.json'
			}
			, 
			{
				from: '../app/exported_product.json',
		        to: '../dist/exported_product.json'
			}
		])
	]
};
