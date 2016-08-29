# Taut

My submission for the [10k Apart Challenge](https://a-k-apart.com/). A slack clone in 10k of js/css/html that works well in all modern browsers and without clientside javascript.

The limitations of this project are slightly different than the project rules. `gulp build` runs a build script that outputs files in the `/dist` directory. This directory contains all coded needed to run the application and its total size is less than 10 Kilobytes. The contest specifies that the 10k limitation just applies to files delivered to the browser, but I enjoyed the constraint of keeping the server code dependency-free and within the size constraint as well. 

Outside of the build process no external libraries are used other than what is natively provided by the browser and nodejs. 

## Development

### Install

Run `npm install` to install dev dependencies.

### Build

Run `gulp build` to build project in build directory. Final folder contents should be less than 10k.

### Run

Run `gulp watch` to run locally.

## Resources

 - http://codeflow.org/entries/2010/aug/25/javascript-compression-madness/
 - http://js1k.com/2010-first/details/704