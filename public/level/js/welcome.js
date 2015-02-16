/* Welcome My Shortcuts Popup
------------------------------------------------------------------------------------------------*/

$(function(){
  // Start personalization trac
  BREI.Personalization.init({subjRem: 'Chapman University - '});
}); 

$(function() {

   $('#welcome').load('/_files/level/js/welcome.txt', function() {
    // $('#welcome').load('js/welcome.txt', function() {

        // Initial state
        
        /*
        if ($.cookie('show_shortcuts_forever') != 1) {
            $.cookie('show_shortcuts_forever', 1, { expires: 365 });
            $.cookie('show_shortcuts_session', 1);
        } else {

            if ($.cookie('show_shortcuts_session') != 1) {

                if ($.cookie('hide_shortcuts_session') != 1 && $.cookie('hide_shortcuts_forever') != 1) {

                    $('#welcome').addClass('open');

                }

            }

        }

        */
        
        // Hide "Don't Show" button if cookie is set
        //if ($.cookie('hide_shortcuts_forever') == 1) {
            $('#welcome .control-links .dont-show').remove();

        //}

        // Toggle "Save/Unsave"
        if (BREI.Personalization.has(window.location.href)) {
            $('#welcome .control-links .save-btn, #welcome .control-links .unsave-btn').toggleClass('showme');
        }

        // Tab toggling
        var tabs = $('#welcome-tabs .tabs');
        var tabH2s = $('#welcome-tabs .tabs h2');
        var dTabs = $('#welcome-tabs .desk-tabs');
        var dTabLinks = $('#welcome-tabs .desk-tabs li');
        var bodies = $('#welcome-tabs .tabs .body');

        // Initial state of tabs
        tabs.find('h2:first-child').addClass('open');
        dTabs.find('li:first-child').addClass('open');

        $('#b-saved').toggleClass('closed-body open-body');

        // Load data    
        loadBlogPosts();
        loadRecentPages();
        loadRecentSearches();
        loadFavorites();        

        // Event binding
        tabs.find('h2').live('click',function() {

            var index = tabs.find('h2').index($(this));
            // console.log(index);

            if ($(this).hasClass('open')) {
                // // Close all
                // $(this).removeClass('open')
                // tabs.find('.body').removeClass('open-body').addClass('closed-body');

                // Keep open
            } else {
                tabs.find('.body').removeClass('open-body').addClass('closed-body');
                tabs.find('h2.open').removeClass('open');
                dTabs.find('li.open').removeClass('open');
                $(this).addClass('open');
                $(bodies.get(index)).toggleClass('closed-body open-body');
                $(dTabLinks.get(index)).toggleClass('open');
                
                _gaq ? _gaq.push(['_trackEvent', 'welcomeback', 'tab click', $(this).text()]) : ''; 
            }       

        });

        dTabs.find('li').live('click',function(e) {
            e.preventDefault();

            var index = dTabLinks.index($(this));
            // console.log(index);

            if ($(this).hasClass('open')) {
                // // Close all
                // $(this).removeClass('open')
                // tabs.find('.body').removeClass('open-body').addClass('closed-body');

                // Keep open
            } else {
                tabs.find('.body').removeClass('open-body').addClass('closed-body');
                dTabs.find('li.open').removeClass('open');
                tabs.find('h2.open').removeClass('open');
                $(this).addClass('open');
                $(bodies.get(index)).toggleClass('closed-body open-body');
                $(tabH2s.get(index)).toggleClass('open');               

                if (tabs.find('.open-body').attr('id') == 'b-blog') {
                    showBlog();
                } else {
                    hideBlog();
                }
                _gaq ? _gaq.push(['_trackEvent', 'welcomeback', 'tab click', $(this).text()]) : ''; 

            }   

            return false;   

        });

        // Save Button
        $('#welcome .control-links .save-btn').live('click', function() {

            var url = window.location.href;
            var sub = document.title;
            BREI.Personalization.pushToFavorites(url, sub);
            _gaq ? _gaq.push(['_trackEvent', 'welcomeback', 'save', 'page', url]) : ''; 
            

            $('#welcome .control-links .save-btn, #welcome .control-links .unsave-btn').toggleClass('showme');

            loadFavorites();
            rebuildPager('#b-saved', pagerOptions);
        });

        // Unsave Button
        $('#welcome .control-links .unsave-btn').live('click', function() {

            var url = window.location.href;
            var favorites = BREI.Personalization.getFavorites();

            for(var i=0; i<favorites.length;i++){    
                if(favorites[i].url === url){
                    favorites.splice(i, 1);                   
                }
            }

            BREI.Personalization.setFavorites(favorites);
            

            $('#welcome .control-links .save-btn, #welcome .control-links .unsave-btn').toggleClass('showme');

            loadFavorites();
            rebuildPager('#b-saved', pagerOptions);

        });

        // "Don't show" button
        $('#welcome .control-links .dont-show').live('click', function() {
            $('#welcome').removeClass('open');
            $.cookie('hide_shortcuts_forever', 1, {expires: 99999});
            $('#welcome .control-links .dont-show').remove();
            _gaq ? _gaq.push(['_trackEvent', 'welcomeback', 'do not show again']) : ''; 
        });

        // Bind to search keyword
        $('#cse-search-form form input.gsc-search-button').live('click', function(e) { 
            
            BREI.Personalization.pushToRecentSearches($('#cse-search-form form .gsc-input input').val());
            
        });

                // Bind to search keyword
        $('#cse-search-form-small form input.gsc-search-button').live('click', function(e) { 
            
            BREI.Personalization.pushToRecentSearches($('#cse-search-form-small form .gsc-input input').val());
            
        });

        






















        

        



        




























        var pagerOptions = {
            pageSize: 10,
            topPaging: false,
            bottomPaging: true,
            pageStatus: true,
            statusLocation: 'bottom'
        }

        $('#b-recent').superPager(pagerOptions);
        $('#b-searches').superPager(pagerOptions);
        $('#b-saved').superPager(pagerOptions);

        $('#welcome .body').find('.close').live('click', function(e) {

            if ($(this).hasClass('confirm')) {                

                var id = $(this).closest('.body').attr('id');
                $(this).parent('li').remove();

                var url = $(this).parent('li').find('a').attr('href');
                var favorites = BREI.Personalization.getFavorites();

                for(var i=0; i<favorites.length;i++){    
                    if(favorites[i].url === url){
                        favorites.splice(i, 1);                   
                    }
                }

                BREI.Personalization.setFavorites(favorites);

                rebuildPager('#'+id, pagerOptions);

                $('#welcome .control-links .save-btn, #welcome .control-links .unsave-btn').toggleClass('showme');

                
                
            } else {
                $(this).addClass('confirm');
                $(this).html('<img src="/_files/img/welcome/welcome_unsave.png"/>');
            }

        }); 

        $('#welcome .control-links .close').live('click', function() {
            $('#welcome').removeClass('open');
            $.cookie('hide_shortcuts_session', 1, {path: '/'});

            $('#welcome .overlay').css('height', '');
        });

        $('#welcome .control-links .my-shortcuts').live('click', function() {
            $('#welcome').addClass('open');
            _gaq ? _gaq.push(['_trackEvent', 'welcomeback', 'manual open', 'page', window.location.url]) : ''; 

            $('#welcome .overlay').height($('body').height());
        });

        $(window).resize(function() {

            if ($(window).width() >= 1024) {

                if (tabs.find('.open-body').attr('id') == 'b-blog') {
                    showBlog();
                } else {
                    hideBlog();
                }

            } else {

                $('#welcome #b-blog li').css('height','');

            }

        });

    });

});

function rebuildPager(el, options) {

    base = $(el);

    if ($('.result-holder', base).length > 0) {
        $('#bottomPaging',base).remove();
        $('.result-holder',base).before('<ul class="original"></ul>');
        $('.result-holder li.result', base).each(function(index) {
            $('.original',base).append($(this).removeAttr('class id'));
        });
        $('.result-holder',base).remove();
        $('.original li:odd',base).addClass('odd');
        $('.original',base).removeClass();

        // console.log(base.attr('id'));

        switch(base.attr('id')) {
            case "b-saved":
                loadFavorites();
                break;
            case "b-recent":
                loadRecentPages();
                break;
            case "b-searches":
                loadRecentSearches();
                break;
        }       

        base.superPager(options);
    } else {

        switch(base.attr('id')) {
            case "b-saved":
                loadFavorites();
                break;
            case "b-recent":
                loadRecentPages();
                break;
            case "b-searches":
                loadRecentSearches();
                break;
        }   

    }

}

function showBlog() {

    if ($(window).width() >= 1024) {

        $('#welcome #b-blog li').css('height','');

        $('#welcome .content-container').addClass('desk-blog');

        var height = 0;
        $('#welcome #b-blog li').each(function(index) {
            if ($(this).height() > height) {
                height = $(this).height();
            }
        });
        $('#welcome #b-blog li').height(height);

    }

}

function hideBlog() {

    if ($(window).width() >= 1024) {

        $('#welcome .content-container').removeClass('desk-blog');

    }

}

function loadRecentPages() {

    var recent = BREI.Personalization.getRecentPages();
    if (recent.length != 0 && recent[0] != null) {
        $('#b-recent ul li').remove();

        recent = recent.reverse();
    
        for (var i in recent) {
            var li = '<li><a href="' + recent[i].url + '">' + recent[i].sub + '</a></li>';
            $('#b-recent ul').append(li);
            $('#b-recent ul li').each(function(index) {
                $(this).removeClass();
                if (index % 2 !== 0) {
                    $(this).addClass('odd');
                }
            })
            var li = '';
        }
    } else {
        $('#b-recent ul li').remove();
        $('#b-recent ul').append('<li class="none">No results found</li>');
    }

}

function loadRecentSearches() {
    
    var search = BREI.Personalization.getRecentSearches();
    if (search.length != 0) {
        $('#b-searches ul li').remove();

        search = search.reverse();
    
        for (var i in search) {
            var li = $("<li></li>").append(
                $("<a></a>").attr('href','http://www.chapman.edu/search-results/index.aspx?q=' + escape(search[i])).html(search[i])
            );
            $('#b-searches ul').append(li);
            $('#b-searches ul li').each(function(index) {
                $(this).removeClass();
                if (index % 2 !== 0) {
                    $(this).addClass('odd');
                }
            })
            var li = '';
        }
    } else {
        $('#b-searches ul li').remove();
        $('#b-searches ul').append(
            $('<li></li>').addClass('none').html('No results found')
        );
    }

}

function loadFavorites() {
    
    var faves = BREI.Personalization.getFavorites();
    if (faves.length != 0 && faves[0] != null) {
        $('#b-saved ul li').remove();
    
        for (var i in faves) {
            var li = $("<li></li>").append(
                $("<a></a>").attr('href',faves[i].url).html(faves[i].sub)
            );
            li.append($('<div class="close"><img src="/_files/img/welcome/welcome_close.png"/></div>'));
            $('#b-saved ul').append(li);
            $('#b-saved ul li').each(function(index) {
                $(this).removeClass();
                if (index % 2 !== 0) {
                    $(this).addClass('odd');
                }
            })
            var li = '';
        }
    } else {
        $('#b-saved ul li').remove();
        $('#b-saved ul').append(
            $('<li></li>').addClass('none').html('No results found')
        );
    }

}

function loadBlogPosts() {




























    var feedUrl = "http://www.chapman.edu/getFeed.ashx?name=blogAggregate",
        yqlUrl =  "//query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%3D'" + feedUrl + "'&format=json&diagnostics=true";

    $('#welcome #b-blog .first-col li.none').html('Loading...');

    $.ajax({
        url: yqlUrl,
        dataType: 'jsonp',
        timeout: 15000,
        success: function(data) {

            data.query = data.query.results.query;

            if (data.query.count > 0) {

                $('#welcome #b-blog .first-col li.none').remove();

                if (data.query.count > 6) {
                    $('#welcome #b-blog .second-col li.none').remove();
                }

                var results = data.query.results.item;

                for (var i in results) {

                    month = results[i].pubDate.substr(8,3);
                    day = results[i].pubDate.substr(5,2);
                    year = results[i].pubDate.substr(12,4);     

                    var li = $("<li></li>");
                    if (i % 2 != 0) {
                        li.addClass('odd');
                    } else {
                        li.addClass('even');
                    }       

                    var time = $("<time></time>");
                    time.attr('datetime', results[i].pubDate).html(day + ' ' + month + ', ' + year);

                    var content = $("<p></p>");
                    var link = $("<a></a>");
                    link.attr('href', results[i].link).html(results[i].title);

                    content.append(link);

                    li.append(time).append(content);

                    if (i < 6) {
                        $('#welcome #b-blog .first-col').append(li);
                    } else {
                        $('#welcome #b-blog .second-col').append(li);
                    }

                }

                if ($('#welcome .content-container').hasClass('desk-blog')) {
                    var height = 0;
                    $('#welcome #b-blog li').each(function(index) {
                        if ($(this).height() > height) {
                            height = $(this).height();
                        }
                    });
                    $('#welcome #b-blog li').height(height);
                }

            } else { // if (data.query.count > 0)

                $('#welcome #b-blog .first-col li.none').html('Could not load blog posts...');

            } // if (data.query.count > 0)

        },
        error: function(obj, status, http) {
            $('#welcome #b-blog .first-col li.none').html("Unable to load posts...");
        },
        statusCode: {
            404: function() {
                $('#welcome #b-blog .first-col li.none').html("404: Could not find posts feed");
            },
            403: function() {
                $('#welcome #b-blog .first-col li.none').html("403: Posts refused to load, due to permissions error");
            }
        }

    }); 

}