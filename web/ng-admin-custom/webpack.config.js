var path = require("path");
var ExtractTextPlugin = require('../ng-admin/node_modules/extract-text-webpack-plugin');
var webpack = require('../ng-admin/node_modules/webpack');

function getEntrySources(sources) {
    return sources;
}

var customSources = [
    './src/javascripts/index.js',
    '../ng-admin/src/javascripts/ng-admin.js',
    './src/javascripts/custom.js',

    /*'../ng-admin/src/sass/ng-admin.scss',
    './src/sass/custom.scss',*/
];

var vendorSources = [
    '../ng-admin/src/javascripts/vendors.js',
    './src/javascripts/vendors.js',

    //'./node_modules/roboto-fontface/css/roboto-fontface.css',
    /*'../ng-admin/node_modules/font-awesome/scss/font-awesome.scss',
    '../ng-admin/node_modules/bootstrap-sass/assets/stylesheets/_bootstrap.scss',

    '../ng-admin/node_modules/nprogress/nprogress.css',
    '../ng-admin/node_modules/humane-js/themes/flatty.css',
    '../ng-admin/node_modules/textangular/src/textAngular.css',
    '../ng-admin/node_modules/codemirror/lib/codemirror.css',
    '../ng-admin/node_modules/codemirror/addon/lint/lint.css',
    '../ng-admin/node_modules/ui-select/dist/select.css'*/
];

module.exports = {
    entry: {
        'ng-admin-custom': getEntrySources(customSources.concat(vendorSources)),
        /*'ng-admin-custom-only': getEntrySources(customSources)*/
    },
    output: {
        publicPath: "http://control.local:9017/",
        filename: "build/[name].min.js"
    },
    resolveLoader: {
		root: [
			path.join(__dirname, "../ng-admin/node_modules")
		]
	},
    module: {
        loaders: [
            { test: /\.js/, loaders: ['babel'], exclude: /node_modules\/(?!admin-config)/ },
            { test: /\.js/, loaders: ['ng-annotate'] },
            { test: /\.html$/, loader: 'html' },
            { test: /\.(woff2?|svg|ttf|eot)(\?.*)?$/, loader: 'url' },
            { test: /\.css$/, loader: ExtractTextPlugin.extract('css') },
            { test: /\.scss$/, loader: ExtractTextPlugin.extract('css!sass') },
            {include: /\.json$/, loaders: ["json-loader"]}
        ]
    },
    plugins: [
        new ExtractTextPlugin('build/[name].min.css', {
            allChunks: true
        }),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /es|en/)
    ]
};
