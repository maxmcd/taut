# Taut

My submission for the [10K Apart Challenge](https://a-k-apart.com/). A Slack clone in 10K of js/css/html that works well in all modern browsers and is functional without clientside javascript.

The limitations of this project are slightly different than the contest rules. `gulp build` runs a build script that outputs files in the `/dist` directory. This directory contains all coded needed to run the application and its total size is less than 10 Kilobytes. The contest specifies that the 10K limitation just applies to files delivered to the browser, but I enjoyed the constraint of keeping the server code dependency-free and within the size constraint as well. 

Outside of the build process no external libraries are used other than what is natively provided by the browser and Node.js. 

This project is not created by, affiliated with, or supported by Slack Technologies, Inc. Although they have been kind enough to [confirm](/notes/slack-email.txt) that this project is acceptable and does not violate their ToS. 

## Features

 - Group chat
 - Persisting Login/Signup/Signout
 - List of active users (5min timeout)
 - Colorful user icons
 - Text formatting (bold, italic, strikethrough, blockquote, code)
 - Link detection
 - Browser reconnect and network status with exponential backoff
 - Visual message grouping
 - Chat and user list can work without javascript
 - Login sessions
 - Persisted data on server restart
 - Formatted timestamps

**Possible future features:**

 - Channels or private messages
 - Better emoji support :ghost:
 - Media uploads
 - Link scraping

## Development

### Install

Run `npm install` to install dev dependencies.

### Build

Run `gulp build` to build project in build directory. Final folder contents should be less than 10K. You can check by running `./bin/size.sh`

### Run

Run `gulp watch` to run locally. 

## Contributing

I would be honored to receive any contributions. This is the first time I've built a web application with a size constraint in mind. I'm sure there's much that could be improved upon and am open to any and all suggestions. Feel free to email me or open a PR.

## Resources
 - http://blog.johnkrauss.com/html-only-live-chat-No-JS/
 - http://codeflow.org/entries/2010/aug/25/javascript-compression-madness/
 - http://js1k.com/2010-first/details/704
 - https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet
 - http://wonko.com/post/html-escaping
 - http://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
 - and many more that I have forgotten...
