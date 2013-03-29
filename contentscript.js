chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {

    var twitterAccountsList = [],
        mostLikelyAccount = '';
    
    // get the data we need from the page
    if (request.action == 'getPageData') {

        // gather all twitter links in page
        twitterAccountsList = document.body.innerHTML.match(/\/\/twitter\.com\/(.*?)(\"|\/)/g);

        // any found? (and not on twitter itself)
        if (twitterAccountsList && ! location.href.match('twitter.com')) {

            // clean up the urls to just the handle
            twitterAccountsList = twitterAccountsList.map(function(account) {
                var matches = account.match(/twitter\.com\/([A-Za-z0-9_]{1,15})\"?\/?/);
                return matches ? matches[1] : '';
            });

            // get the first one?
            mostLikelyAccount = twitterAccountsList[0];
        }

        // respond back
        sendResponse({
            url: location.href,
            twitterAccount: mostLikelyAccount
        });
    }

    // redirect?
    if (request.action == 'setUrl') {
        location.href = request.url;
    }

});