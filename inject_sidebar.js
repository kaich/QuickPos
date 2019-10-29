var sidebar;
$('body').css({
'padding-right': '100px'
});
sidebar = $("<div id='qp_sidebar'></div>");
sidebar.css({
'position': 'fixed',
'right': '0px',
'top': '0px',
'z-index': 9999,
'width': '100px',
'height': '100%',
'background-color': 'white'  // Confirm it shows up
});
$('body').append(sidebar);

reloadKeywords()

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if(message.action == "reload_keywords") {
        reloadKeywords()
    }
})

function reloadKeywords() {
    $("#qp_sidebar").empty()
    chrome.storage.local.get('field_keywords', function(result) {
        let keywords = result.field_keywords
        if(keywords.length > 0) {
            $("#qp_sidebar").css('display', 'block')
            for(let key of keywords) {
                $("#qp_sidebar").append("<div><button class=\"qp_sidemenu\">" + key + "</button><button class=\"qp_remove\" name=\"" + key + "\">X</button></div>")
            }
            $(".qp_sidemenu").click(click_qp_menu)
            $(".qp_remove").click(click_qp_remove)
        } else {
            $("#qp_sidebar").css('display', 'none')
        }
    })
}

function click_qp_menu(event) {
    function searchAndHighlight(searchTerm, selector) {
        if (searchTerm) {
            $("#qp_sidebar").empty() 
            //var wholeWordOnly = new RegExp("\\g"+searchTerm+"\\g","ig"); //matches whole word only
            //var anyCharacter = new RegExp("\\g["+searchTerm+"]\\g","ig"); //matches any word with any of search chars characters
            var selector = selector || 'body'; //use body as selector if none provided
            var searchTermRegEx = new RegExp(searchTerm, 'ig');
            var matches = $(selector).text().match(searchTermRegEx);
            if (matches) {
                $('.qp_highlighted').removeClass('qp_highlighted'); //Remove old search highlights
                var index;
                for (index = 0; index < matches.length; ++index) {
                    var wordreg = new RegExp(matches[index]);
                    let html = $(selector).html().replace(wordreg, "<span class='qp_highlighted'>" + matches[index] + "</span>")
                    if(html.length > 0) {
                        $(selector).html(html);
                    }
                }
                debugger
                if ($('.qp_highlighted:first').length) { //if match found, scroll to where the first one appears
                    $(window).scrollTop($('.qp_highlighted:first').position().top);
                }
                return true;
            }
        }
        return false;
    }

    try {
        let value = $(event.target).text() 
        searchAndHighlight(value)
        reloadKeywords()
    } catch(error) {
        console.log(error);
    }
}

function click_qp_remove(event) {
    let keyword = $(event.target).attr("name")
    chrome.runtime.sendMessage({
        action: "remove_keyword",
        keyword: keyword
    })
}
