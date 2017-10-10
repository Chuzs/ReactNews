const webpack = require('webpack');
const path    = require('path');

const vendors = [
    'react',
    'react-dom',
    'react-router',
    'antd'
];

module.exports = {
    output: {
        path: path.join(__dirname, 'src'),
        filename: '[name].js',
        library: '[name]',
    },
    entry: {
        "lib": vendors,
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.join(__dirname, 'manifest.json'),
            name: '[name]',
            context: __dirname,
        }),
    ],
};