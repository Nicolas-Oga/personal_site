const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const ENVIRONMENT_VARS = {
  COMMENTS_API_URL: 'http://localhost:4040',
  GOOGLE_API_KEY: '',
  GOOGLE_OAUTH_KEY: '',
  FRONT_SOURCE_CODE_URL: 'https://github.com/Nicolas-Oga/personal_site'
}

const htmlPlugin = filename =>
  new HtmlWebpackPlugin({
    filename,
    title: 'Nicolas Oga',
    template: 'src/index.html'
  })

module.exports = {
  entry: path.resolve(__dirname, 'src/index.jsx'),
  devtool: 'source-maps',
  plugins: [
    htmlPlugin('index.html'),
    htmlPlugin('404.html'), // little trick to make SPA mode work in GitHub pages
    new webpack.EnvironmentPlugin(ENVIRONMENT_VARS)
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /^node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.svg$/,
        exclude: /node_modules/,
        use: {
          loader: 'svg-react-loader',
          options: {
            props: {
              width: 24,
              height: 24
            }
          }
        }
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      },
      {
        test: /\.(jpe?g|png|gif|jfif|webp)$/,
        use: [
          {
            loader: 'file-loader',
            options: { outputPath: 'images/' }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    historyApiFallback: true
  }
}
