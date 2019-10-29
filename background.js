(function(){
    chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){

    })
 })();

function getKeywords(callback) {
    chrome.storage.local.get('field_keywords', function(result) {
        callback(result.field_keywords)
    })
}

function addKeyword(keyword) {
    getKeywords(function(keywords) {
        var finalKeywords = keywords || new Array()
        finalKeywords.push(keyword)
        chrome.storage.local.set({"field_keywords": finalKeywords})
    })
}

function removeKeyword(keyword) {
     getKeywords(function(keywords) {
         let finalKeywords = keywords.filter(function(value, index, arr) {
             return keyword != value
         })
         chrome.storage.local.set({field_keywords: finalKeywords})
     })
}


chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if(message.action == "add_keyword") {
        addKeyword(message.keyword)
    }
    if(message.action == "remove_keyword") {
        removeKeyword(message.keyword)
    }
    if(message.action == "clear_keywords") {
        chrome.storage.local.set({field_keywords: []})
    }
    if(message.action == "get_keywords") {
        var finalResult = []
        getKeywords(function(result) {
            finalResult = result
        })
        sendResponse(finalResult)
    }

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {action: "reload_keywords"}, function(response) {});  
    });
})
