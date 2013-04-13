// 
// Main extension script running in the browser
// 

var tabsToResponse = {};

// Select the current tab on load
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
    if (changeInfo.status === 'complete') {

        // Send a request to the content script to get the DOM
        chrome.tabs.sendRequest(tabId, { action: 'getPageData' }, function(response) {

            // found it?
            if (response && response.accounts && response.accounts.length) {

                // show the twitter icon
                chrome.pageAction.show(tabId);

                // Open a popup
                chrome.pageAction.setPopup({
                    tabId: tabId,
                    popup: 'popup/popup.html'
                });

                // wait for the popup to load, it will then request the accounts we found
                tabsToResponse[tabId] = response;
            }

        });
    }
});

// request handler for popup to request twitter accounts
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    chrome.tabs.getSelected(null, function(tab) {
        if (request.action == 'getAccounts') {
            sendResponse(tabsToResponse[tab.id]);
        }
    });
});