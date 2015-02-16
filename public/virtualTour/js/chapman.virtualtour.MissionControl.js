/**
 */
chapman.virtualtour.MissionControl = (function($)
{
	var base = this;

	var _browserTitle = document.title;
	var _isIE8 = $.browser.msie && +$.browser.version === 8;

	var _qs = (function(a) {
	    if (a == "") return {};
	    var b = {};
	    for (var i = 0; i < a.length; ++i)
	    {
	        var p=a[i].split('=');
	        if (p.length != 2) continue;
	        b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
	    }
	    return b;
	})(window.location.search.substr(1).split('&'));

	var _desktopMediaQuery = 'screen and (min-width: 767px)';
	var _mobileMediaQuery = 'screen and (min-width: 320px)';
	var _pane;
	var _jScrollPaneAPI;
	var _print = false;
	var _staticPrintURL = '';
	var _screenSize;

	var _initialized = false;

	var _init = function(print)
	{
		_print = print;

		$('#virtualTour-deepLinkDialog').dialog(
		{
			autoOpen: false,
			draggable: false,
			modal: true,
			title: 'Copy to Clipboard',
			buttons: [
			{
				text: "Close",
				click: function()
				{
					$(this).dialog('close');
				}
			}]
		});

		$(window).on('debouncedresize', _resized);
		$('#virtualTour-deepLink').click(_createDeepLink);
		$('#virtualTour-backButton').click(function(e)
		{
			$.History.trigger();
		});

		if(Modernizr.mq(_desktopMediaQuery) || _isIE8)
			_desktopEntry();
		else if(Modernizr.mq(_mobileMediaQuery))
			_desktopExit();
		else
			_desktopEntry();
	};

	/**
	 * triggered when #virtualTour-deepLink is clicked which displays a url to copy
	 */
	var _createDeepLink = function(e)
	{
		$('#virtualTour-deepLinkDialog').dialog('open');
		$('#virtualTour-deepLinkTextField').val($(e.currentTarget).attr('href')).select();
		return false;
	};

	var _mapReady = function()
	{
		chapman.virtualtour.MainNavigation.init();
		chapman.virtualtour.CategoryMenu.init();
		chapman.virtualtour.ManagePanels.init();
		chapman.virtualtour.Search.init();

		_updateScrollPanel();

		$.History.bind(function(state)
		{
			var title = _browserTitle;

			if(state != '')
			{
				if(!_initialized)
				{
					_initialized = true;

					//$('#' + state).trigger('click'); // this was causing the checkbox to uncheck when a marker was clicked from a sub  category link

					// no markers have been added to the map and we need to create the marker
					//chapman.virtualtour.CategoryMenu.initWithSubCategory(state);
				}

				// markers will have been created by this point
				chapman.virtualtour.Map.updateMapById(state);
				chapman.virtualtour.ManagePanels.showDetail(state);

				var activeMarker = $('#' + state);
				var activeMarkerData = activeMarker.data();

				var markerTitle = chapman.virtualtour.CategoryMenu.getTitleById(state);
				title = markerTitle + ' | ' + _browserTitle;

				//chapman.virtualtour.MainNavigation.updateMapLink(activeMarkerData.latitude, activeMarkerData.longitude);
			}
			else
			{
				chapman.virtualtour.ManagePanels.toggleCategoryMenu();
			}

	        // Update the page's title with our current state on the end
	        document.title = title;
	    });

		// deep link this
		var hash = window.location.hash;
		var id = hash.substr(1, hash.length);
		if(hash != '')
			$.History.go(id);
	};

	var _resized = function()
	{
		if(Modernizr.mq(_desktopMediaQuery) || _isIE8)
			_desktopEntry();
		else
			_desktopExit();

		_updateScrollPanel();
	};

	var _desktopEntry = function()
	{
		if(_screenSize != 'big')
		{
			_pane = $('#virtualTour-scrollPane').jScrollPane(
			{
				horizontalDragMaxWidth: 0
			});
			_jScrollPaneAPI = _pane.data('jsp');

			_screenSize = 'big';

			chapman.virtualtour.Map.init();
		}
	};

	var _desktopExit = function()
	{
		if(_screenSize != 'small')
		{
			if(_jScrollPaneAPI)
				_jScrollPaneAPI.destroy();

			_mapReady();

			_screenSize = 'small';
		}
	};

	var _isDesktop = function()
	{
		var isDesktop = false;

		if(Modernizr.mq(_desktopMediaQuery) || _isIE8)
			return true;

		return isDesktop;
	};

	var _isPrint = function()
	{
		return _print;
	};

	var _mouseOrFinger = function()
	{
		var mouseOrFinger;

		if('ontouchstart' in document.documentElement)
			mouseOrFinger = 'finger';

		return mouseOrFinger;
	};

	var _updateScrollPanelHeight = function()
	{
		var scrollPaneHeight = $(window).height() - $('#virtualTour-scrollPane').offset().top;
		$('#virtualTour-scrollPane').height(scrollPaneHeight);
	}

	var _updateScrollPanel = function()
	{
		if(_jScrollPaneAPI != undefined)
		{
			_updateScrollPanelHeight();
			_jScrollPaneAPI.reinitialise();
		}
	};

	/**
	 * Updates window.location
	 */
	var _updateQueryString = function(markers)
	{
		var queryString = '';
		var len = markers.length;

		for(var i in markers)
		{
			var markerId = markers[i].id;
			var type = markers[i].type;

			if(type === 'kml')
				markerId = markers[i].obj.id;

			if(i < len - 1)
				queryString += markerId + ','
			else
				queryString += markerId
		}

		var url = updateLocation('s', queryString);
		$('#virtualTour-deepLink').attr('href', url).fadeIn();

		if(_staticPrintURL == '')
			_staticPrintURL = $('#virtualTour-printButton').data().url;

		var printUrl = updateLocation('s', queryString, _staticPrintURL + '.aspx');
		$('#virtualTour-printButton').attr('href', printUrl);
	};

	var _getQueryStringSelections = function()
	{
		var selections = {};

		if(_qs.s != undefined)
			selections = _qs.s.split(',');

		return selections;
	};

	return {
		init: _init,
		updateScrollPanel: _updateScrollPanel,
		isDesktop: _isDesktop,
		isPrint: _isPrint,
		mouseOrFinger: _mouseOrFinger,
		updateQueryString: _updateQueryString,
		getQueryStringSelections: _getQueryStringSelections,
		mapReady: _mapReady,
	}

})(jQuery);