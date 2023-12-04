// 
// Popup script which gets the accounts list back from the main extension
// 

// request the accounts found
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'getPageData' }, (response) => {

        var container = document.getElementById('twitter-accounts-container'),
            template = document.getElementById('template-twitter-account').innerHTML,
            html = '',
            scriptTag,
            firstScriptTag,
            links;

        // no response?
        if (! response || ! response.accounts) {
            container.innerHTML = '<p>Unable to get twitter accounts from this page.</p>';
            return;
        }

        // no accounts found?
        if (! response.accounts.length) {
            container.innerHTML = '<p>No twitter accounts found on this page.</p>';
            return;
        }

        // Build the html list of accounts found
        response.accounts.forEach(function (account) {
            html += template.replace(/\{account\}/g, account);
        });
        container.innerHTML = html;

        // link to twitter
        scriptTag = document.createElement('script');
        firstScriptTag = document.getElementsByTagName('script')[0];
        scriptTag.src = 'twitter-widgets.js'; // local copy of http://platform.twitter.com/widgets.js
        firstScriptTag.parentNode.insertBefore(scriptTag, firstScriptTag);

        // setup twitter profile links to actually link over
        links = document.getElementsByClassName('twitter-profile-link');
        [].forEach.call(links, function (link) {
            link.addEventListener('click', function () {
                // send a message back to the contentscript to redirect the page
                chrome.tabs.sendMessage(tabs[0].id, { action: 'setUrl', url: link.href });
            }, false);
        });

    });
});
