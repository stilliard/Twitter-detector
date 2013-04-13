// 
// Script added to each page to check for twitter links
// 

// await requests from parent extension
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {

    var accounts = [];

    // get the data we need from the page
    if (request.action == 'getPageData') {

        // gather all twitter links in page
        accounts = document.body.innerHTML.match(/\/\/twitter.com\/(([A-z0-9_-]{1,15}).*?)(\'|\"|\s)/g);

        // any found? (and not on twitter itself)
        if (accounts && ! location.href.match('twitter.com')) {

            // clean up the urls to just the handles
            accounts = accounts.filter(function (account) {
                return ! account.match(/(intent|statuses)\//);
            }).map(function(account) {
                var matches = account.match(/\/\/twitter.com\/(([A-z0-9_-]{1,15}).*?)/);
                return matches ? matches[1] : '';
            });

            // remove duplicates or blanks
            accounts = accounts.filter(function(elem, pos, self) {
                return self.indexOf(elem) == pos && elem !== '';
            });

            // respond back
            sendResponse({
                accounts: accounts
            });

        } else {
            sendResponse({
                accounts: []
            });
        }
    }

    // redirect?
    if (request.action == 'setUrl') {
        location.href = request.url;
    }

});