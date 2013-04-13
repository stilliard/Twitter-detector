// 
// Popup script which gets the accounts list back from the main extension
// 

// request the accounts found
chrome.extension.sendRequest({ action: 'getAccounts' }, function (response) {

    var container = document.getElementById('twitter-accounts-container'),
        template = document.getElementById('template-twitter-account').innerHTML,
        html = '',
        scriptTag,
        firstScriptTag;

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

})

