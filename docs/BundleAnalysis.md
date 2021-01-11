# Bundle Analysis
------------------

Bundle Analysis is the method of examining the detailed structure of individual elements within your application output build files. This allows for visualize and analyse build statistics pinpointing areas that can optimized in the next iteration of your build output. This process becomes increasingly important as your bundle size grow which has a direct impact on the end users load time.

**Bundle Analyzer** allows for the creation of statistical data that is used for visualizing webpack outputs which helps in understanding the composition of your bundles.

**RDVUE and Bundle Analysis Using Webpack Bundle Analyser Plugin**

To generate build files for bundle analysis we run the following command

 `$ npm run build`

This will build production ready files for deployment, additionally spinning up the integrated webpack bundle analysis server:

 `Webpack Bundle Analyzer is started at http://127.0.0.1:8888`

Expected terminal output:

<image src="../images/bundle-image1.png">

Expected browser output Treemap:

<image src="../images/bundle-image2.png">

This module will help you:

1.  Realize what's _really_ inside your bundle
    
2.  Find out what modules make up the most of its size
    
3.  Find modules that got there by mistake
    
4.  Optimize it!
    

And the best thing is it supports minified bundles! It parses them to get real size of bundled modules. And it also shows their gzipped sizes!

?>For additional plugin options and configurations please visit: [https://www.npmjs.com/package/webpack-bundle-analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer)