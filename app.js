// Select the current tab on load
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
    if (changeInfo.status === 'complete') {
        chrome.tabs.getSelected(null, function(tab) {

            // Send a request to the content script to get the DOM
            chrome.tabs.sendRequest(tab.id, { action: 'getPageData' }, function(response) {

                // found it?
                if (response.twitterAccount) {

                    // show the twitter icon
                    chrome.pageAction.show(tab.id);

                    // set onclick to redirect
                    chrome.pageAction.onClicked.addListener(function(tab) {
                        chrome.tabs.sendRequest(tab.id, { action: 'setUrl', url: 'http://twitter.com/' + response.twitterAccount });
                    });

                }

            });

        });
    }
});