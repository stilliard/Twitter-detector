// 
// Script added to each page to check for twitter links
// 

// await requests from parent extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    var accounts = [],
        pageHtml;

    // get the data we need from the page
    if (message.action == 'getPageData') {

        pageHtml = document.body.innerHTML;

        // gather all twitter links in page
        accounts = pageHtml.match(/\/\/(www\.)?twitter.com\/(([A-z0-9_-]{1,15}).*?)(\'|\"|\s)/g);
        accounts2 = pageHtml.match(/\/\/(www|platform\.)?twitter.com\/(.*?)screen_name=(([A-z0-9_-]{1,15}).*?)(&|\'|\"|\s)/g);
        accounts = [].concat(accounts, accounts2);

        // any found? (and not on twitter itself)
        if (accounts && ! location.href.match('twitter.com')) {

            // clean up the urls to just the handles
            accounts = accounts.filter(function (account) {
                // Only strings please
                return typeof account === 'string';
            }).map(function(account) {
                var matches = account.match(/\/\/(www\.)?twitter.com\/([A-z0-9_-]{1,15})/);
                if (matches) {
                    return matches ? matches[2] : '';
                }
                matches = account.match(/\/\/(www|platform\.)?twitter.com\/(.*?)screen_name=([A-z0-9_-]{1,15})/);
                return matches ? matches[3] : '';
            }).filter(function (account) {
                // remove non account keywords
                return ['intent', 'statuses', 'share', 'home'].indexOf(account) === -1;
            }).filter(function (account) {
                // remove when its all numbers as thats just a status
                return ! ( ! isNaN(parseFloat(account)) && isFinite(account));
            }).filter(function(elem, pos, self) {
                // remove duplicates or blanks
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
    if (message.action == 'setUrl') {
        location.href = message.url;
    }

});