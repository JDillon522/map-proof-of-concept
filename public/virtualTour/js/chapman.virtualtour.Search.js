/** 
 * Search
 */
chapman.virtualtour.Search = (function($)
{
	//_hasResults = false;

	var _init = function()
	{
		$('#virtualTour-searchField').keyup(function(e)
		{
			//chapman.virtualtour.ManagePanels.hideDetail();

			var text = $('#virtualTour-searchField').val();

			if(text.length > 0)
			{
				//_hasResults = true;

				var searchResults = '';

				var li = $('.virtualTour-subCategory[data-search-terms*="' + text.toLowerCase() + '"]').each(function(index, value)
				{
					var anchor = $('a', value);
					var title = anchor.text();
					var href = anchor.attr('href');
					var id = anchor.data().checkboxId;

					var searchResult = '<li class="virtualTour-searchResult"><a href="' + href + '" data-checkbox-id="' + id + '">' + title + '</a></li>';
					searchResults += searchResult;
				});

				$('#virtualTour-searchResultsList').empty().append(searchResults);
				$('#virtualTour-numItems').text(li.length);
				$('.virtualTour-searchResult a', '#virtualTour-searchResultsList').click(function(e)
				{
					chapman.virtualtour.CategoryMenu.subCategoryClicked(e);
					return false;
				});

				// update the ui
				$('#virtualTour-searchResults').slideDown().promise().done(function()
				{
					chapman.virtualtour.MissionControl.updateScrollPanel();						
				});

				chapman.virtualtour.MissionControl.updateScrollPanel();
			}
			else
			{
				$('#virtualTour-searchResultsList').empty();
				$('#virtualTour-numItems').text(0);

				/*
				$('#virtualTour-searchResults').slideUp().promise().done(function()
				{
					chapman.virtualtour.MissionControl.updateScrollPanel();
				});
				*/
				chapman.virtualtour.MissionControl.updateScrollPanel();
			}

			if(e.keyCode == 27)
			{
				$('#virtualTour-searchResults').slideUp().promise().done(function()
				{
					chapman.virtualtour.MissionControl.updateScrollPanel();
				});

				//_hasResults = false;
			}
		});
	};

	/*
	var _hasResults = function()
	{
		return _hasResults
	};
	*/

	return {
		init: _init,
		//hasResults: _hasResults
	}

})(jQuery);