# s10ck

My submission for the [10k Apart Challenge](https://a-k-apart.com/). A slack clone in 10k of js/html/css that works well in all modern browsers and without clientside javascript. 

## Dev

#### Server

 - Serving of index.html
 - Populating of index.html with current messages
 - Long polling enpoint that updates clients that support clientside javascript
 - Form submission endpoint for sending messages both through an ajax call and through regular form submission.
 - New messages from other users is still difficult. Might need to take some inspiraiton from here: [http://blog.johnkrauss.com/html-only-live-chat-No-JS/](http://blog.johnkrauss.com/html-only-live-chat-No-JS/). Annoying that the message window would have to be an open request to all users. 

#### Client

 - Minimal slack style implementation
 - Single #general chat view
 - Anchor tags in messages for correct seeking after page reload. 
 - 