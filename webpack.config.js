const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const IS_PROD = (process.env.NODE_ENV === 'production');

module.exports = {
  mode: IS_PROD ? 'production' : 'development',
  entry: {
    bundle: './src/js/index.js',
    // You can add more entry points here.
    // Each entry point will generate a separate JS and CSS file.
    //    external: './src/libraries/index.js',
  },
  module: {
    rules: [{
      // This loader might not be used right now. But let's say you want to reference an image in your CSS file, this will do the trick:
      test: /\.(png|svg|jpg|gif)$/,
      use: [{
        loader: 'file-loader',
        options: {
          name: 'media/[name].[ext]',
          publicPath: '../',
        },
      }],
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader'
      }, {
        loader: 'eslint-loader',
        options: {
          // This option makes ESLint automatically fix minor issues
          fix: true,
        },
      }]
    }, {
      // The "?" allows you use both file formats: .css and .scss
      test: /\.s?css$/,
      use: [{
          loader: MiniCssExtractPlugin.loader,
        },
        'css-loader',
        'sass-loader',
      ]
    }]
  },
  resolve: {
    extensions: ['*', '.js', '.scss']
  },
  output: {
    path: __dirname + '/dist/assets',
    publicPath: '/',
    filename: 'js/[name].js'
  },
  plugins: [
    new MiniCssExtractPlugin('css/[name].css'),
  ],
};
