const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: './src/index.js',
	devServer: {
		open: true,
		openPage: 'index.html',
		contentBase: './dist',
		port: 9000
	},
	module: {
		rules: [
			{
				test: /\.(js)$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			},
			{
				test: /\.(ttf|stl)$/,
				use: [
					{
						loader: 'file-loader',
					}
				]
			}
		]
	},
	resolve: {
		extensions: ['*', '.js']
	},
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist'),
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: 'src/example.html',
			title: 'Example Dice Roller'
		})

	]
};