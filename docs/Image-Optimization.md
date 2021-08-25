# Image Optimization
------------------

Image Optimization is the process of compressing the file size of an image, using either a plugin or a script, which in turn speeds up the load time of web pages.

***RDVUE Image Optimization Using Webpack Imagemin Plugin***

**Imagemin** is an excellent tool used for image compression. It supports a wide variety of image formats and integrates easily with build scripts and build tools. Imagemin is available as both a CLI and a npm module. Imagemin is built around plugins.

**Implementation of the Imagemin PlugIn**<br>
Initialize the Imagemin plugin by adding the below code at the top of the config.js file:<br>
`const {default: ImageminPlugin} = require('imagemin-webpack-plugin');`
`const CopyWebpackPlugin = require('copy-webpack-plugin');`

Next add Imagemin to the list of plugins that webpack uses in the plugins array. **NB.** Imagemin should be added last in the plugins array to ensure that it is the last plugin that runs.
```js
module.exports = {
    plugins: [
        new ImageminPlugin({
            test: /\.(jpe?g|png|gif|svg)$/i,
            pngquant: {
                quality: '80-90'
            }
        })
    ]
}
```

`{pngquant: ({quality: [80, 90]})}`<br>
This line tells Imagemin to compress PNGs using the Pngquant plugin. The quality field uses a min and max range of values to determine the compression level—0 is the lowest and 1 is the highest. To force all images to be compressed at say 50% quality, pass 0.5 as both the min and max value.

**Customize Imagemin using the imagemin-mozjpeg plugin**<br> 
The imagemin-mozjpeg plugin can be used to compress JPG compression (imagemin-jpegtran) instead of using imagemin-webpack-plugin's default plugin. Mozjpeg allows you to indicate a compression quality for JPG compression.

Add the following code at the top of config.js to initialize the imagemin-mozjpeg plugin:
`const imageminMozjpeg = require('imagemin-mozjpeg');` 

Next add a plugins property to the object passed to ImageminPlugin():
```js
plugins: [
    imageminMozjpeg({
        quality: 80,
        progressive: false
    })
]
```
The 80 here, tells Webpack to compress JPGs to a quality of 80 (0 is the worst; 100 is the best) using the Mozjpeg plugin.

**Code After Adding Mozjpeg plugin**
```js
module.exports = {
    plugins: [
        new ImageminPlugin({
            test: /\.(jpe?g|png|gif|svg)$/i,
            pngquant: {
                quality: '80-90'
            },
            plugins: [
                imageminMozjpeg({
                    quality: 80,
                    progressive: false
                })
            ]
        })
    ]
}
```
**Note-**
To add settings for a default plugin of imagemin-webpack-plugin, they can be added as a key-object pair on the object passed to ImageminPlugin(). The settings for Pnquant are an example of this.
To add settings for non-default plugins (for example, Mozjpeg), they should be added by including them in the array corresponding to the plugins property.