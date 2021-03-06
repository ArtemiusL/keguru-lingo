const path = require('path');
const webpack = require('webpack');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const DotEnv = require('dotenv-webpack');

const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = (env, argv = { mode: 'development' }) => {
  const { mode } = argv;

  const isProduction = mode === 'production';
  const sourceMap = !isProduction;
  const localIdentName = isProduction
    ? '[hash:base64:5]'
    : '[folder]__[local]___[hash:base64:5]';

  return {
    entry: { main: './src/index.js' },

    output: {
      path: path.resolve(__dirname, 'build'),
      publicPath: '',
      filename: isProduction ? '[name].js' : '[name].[contenthash].js',
      chunkFilename: isProduction
        ? '[name].chunk.js'
        : '[name].[contenthash].chunk.js',
    },
    resolve: {
      alias: {
        '@context': path.resolve(process.cwd(), 'src/AppContext.js'),
        '@stores': path.resolve(process.cwd(), 'src/common/stores'),
        '@components': path.resolve(process.cwd(), 'src/common/components'),
        '@blocks': path.resolve(process.cwd(), 'src/common/blocks'),
        '@constants': path.resolve(process.cwd(), 'src/common/constants'),
        '@models': path.resolve(process.cwd(), 'src/common/models'),
        '@pages': path.resolve(process.cwd(), 'src/common/pages'),
        '@config': path.resolve(process.cwd(), 'src/common/config'),
        '@layouts': path.resolve(process.cwd(), 'src/common/layouts'),
        '@': path.resolve(process.cwd(), 'src/common'),
        '@stubs': path.resolve(process.cwd(), 'src/common/stubs'),
        '@utils': path.resolve(process.cwd(), 'src/common/utils'),
        '@hooks': path.resolve(process.cwd(), 'src/common/hooks'),
        '@assets': path.resolve(process.cwd(), 'src/assets'),
        '@styles': path.resolve(process.cwd(), 'src/common/stylesheets'),
      },
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
    },
    module: {
      rules: [
        {
          test: /\.(jsx|js)$/,
          exclude: /node_modules/,
          use: [
            { loader: 'babel-loader' },
            {
              loader: '@linaria/webpack-loader',
              options: {
                sourceMap: !isProduction,
              },
            }
          ],
        },
        {
          test: /\.css$/,
          use: [
            {
            loader: MiniCssExtractPlugin.loader,
              options: {
                hrm: !isProduction,
              },
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: !isProduction,
              },
            },
            {
              loader: 'postcss-loader',
            },
            {
              loader: 'resolve-url-loader',
            }
          ],
        },
        {
          test: /\.(png|jpg|gif)|(\.image.svg$)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[hash].[ext]',
              },
            },
          ],
        },
        {
          test: /\.(svg)$/,
          exclude: /(\.image.svg$)/,
          use: {
            loader: 'svg-inline-loader',
            options: {
              removeSVGTagAttrs: false,
            },
          },
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)(\?.*$|$)/,
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
          },
        },
        {
          test: /\.po$/,
          use: ['i18next-po-loader'],
        },
      ],
    },
    optimization: {
      minimizer: [new TerserJSPlugin()],
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'initial',
          },
          styles: {
            name: 'styles',
            test: '/.css$/',
            chunks: 'all',
            enforce: true,
          },
        },
      },
    },
    stats: {
      colors: true,
    },
    plugins: [
      new OptimizeCSSAssetsPlugin(),
      new webpack.ProvidePlugin({
        // make fetch available
        // fetch: 'exports-loader?self.fetch!whatwg-fetch'
        fetch: 'whatwg-fetch',
      }),
      new CleanWebpackPlugin('build', {}),
      new MiniCssExtractPlugin({
        filename: isProduction ? 'style.[contenthash].css' : '[name].css',
        chunkFilename: isProduction ? '[id].[contenthash].css' : '[id].css',
      }),
      new HtmlWebpackPlugin({
        inject: true,
        hash: true,
        minify: {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
        },
        template: './src/index.html',
        favicon: './src/favicons/favicon.ico',
        description:
          'Безусловно лучшее сообщество о звездах интернета и шоубизнеса на просторах русскоязычного интернета',
      }),
      new webpack.LoaderOptionsPlugin({
        options: {
          stylus: {
            import: [
              path.resolve(
                process.cwd(),
                './src/common/stylesheets/variables.styl',
              ),
              path.resolve(
                process.cwd(),
                './src/common/stylesheets/mixins.styl',
              ),
              path.resolve(
                process.cwd(),
                './src/common/stylesheets/global.styl',
              ),
            ],
          },
        },
      }),
      new DotEnv({
        path: './.env',
        safe: true,
        systemvars: true,
        silent: true,
        defaults: false,
      }),
      new CopyPlugin([
        {
          from: 'robots.txt',
          to: 'robots.txt',
          toType: 'file',
        },
        {
          from: './src/favicons',
          to: path.resolve(process.cwd(), 'build'),
          toType: 'dir',
        },
      ]),
    ],
    devtool: sourceMap && 'source-map',
    devServer: {
      host: '0.0.0.0',
      port: 3300,
      proxy: {
        '/api': 'http://localhost:3000'
      },
      contentBase: path.resolve(process.cwd(), 'build'),
      compress: true,
      historyApiFallback: true,
    },
  };
};
