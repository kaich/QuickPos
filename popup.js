$(function() {
   $("#form").submit(function() {
       let keyword = $("#keyword").val()
       if(keyword.length > 0) {
            chrome.runtime.sendMessage({
                    action: "add_keyword",
                    keyword: keyword
            })
        }
   })
   $("#clear_qp_keywords").click(function() {
        chrome.runtime.sendMessage({
            action: "clear_keywords",
            keyword: keyword
        })
   })
})