/**
 * MainNavigation
 */
chapman.virtualtour.MainNavigation = (function($)
{
	var enabled = false;
	var initialized = false;
	var thing = 'thing2';

	var _init = function()
	{
		if(!initialized)
		{
			$('#virtualTour-mainNavigationMenuButton').click(_mainMenuClicked);
			$('#virtualTour-mainNavigationSearchButton').click(_mainMenuClicked);

			initialized = true;
		}
	};

	var _mainMenuClicked = function(e)
	{
		var curTarget = $(e.currentTarget);
		var action = curTarget.data().action;

		switch (action)
		{
			case 'menu' :
			{
				chapman.virtualtour.ManagePanels.toggleCategoryMenu('menu');
				break;
			}
			case 'search' :
			{
				chapman.virtualtour.ManagePanels.toggleSearch('menu');
				break;
			}
		}

		return false;
	};

	/**
	 * Public functions
	 */

	var _updateMainMenu = function(action, status)
	{
		var action = action;
		var status = status;

		if(!enabled)
		{
			$('#virtualTour-mainNavigation').show();
			enabled = true;
		}

		switch (action)
		{
			case 'categoryMenu' :
			{
				$('#virtualTour-mainNavigationMenuButton').toggleClass('active');
				$('#virtualTour-mainNavigationSearchButton').removeClass('active');
				break;
			}
			case 'search' :
			{
				$('#virtualTour-mainNavigationMenuButton').removeClass('active');
				$('#virtualTour-mainNavigationSearchButton').toggleClass('active');
				break;
			}
			default :
			{
				$('#virtualTour-mainNavigationMenuButton').removeClass('active');
				$('#virtualTour-mainNavigationSearchButton').removeClass('active');
			}
		}

		return false;
	};


	// var _updateMapLink = function(lat, lon)
	// {
	// 	$('#virtualTour-mainNavigationViewOnMapButton').attr('href', 'https://maps.google.com/maps?q=' + lat + '+' + lon + '&z=20');
	// };

	// expose public functions
	return {
		init: _init,
		updateMainMenu: _updateMainMenu,
		//updateMapLink: _updateMapLink
	};

})(jQuery);