/**
 * CategoryMenu
 */
chapman.virtualtour.CategoryMenu = (function($)
{
	var _initialized = false;

	var _init = function()
	{
		if(!_initialized)
		{
			$('.virtualTour-categoryButton', '#virtualTour-categories').click(_categoryClicked);
			$('.virtualTour-subCategoryLink', '#virtualTour-categories').click(_subCategoryClicked);

			if(chapman.virtualtour.MissionControl.isDesktop())
			{
				$('.virtualTour-categoryCheckbox', '#virtualTour-categoryMenu').change(_checkboxChanged);
			}

			// deal with the query string
			var queryStringSelections = chapman.virtualtour.MissionControl.getQueryStringSelections();

			if(queryStringSelections.length > 0)
			{
				for(var i in queryStringSelections)
				{
					$('#' + queryStringSelections[i], '#virtualTour-categoryMenu').trigger('click');
				}
			}

			_initialized = true;
		}
		else
		{

		}
	};


	var _createMarkerObject = function(curTarget)
	{
		var data = curTarget.data();
		var group = curTarget.attr('name');
		var id = curTarget.attr('value');
		var primaryId = curTarget.data().primaryId;

		if(primaryId != undefined)
			id = primaryId;

		var isKML = curTarget.data().kmlUrl != undefined ? true : false;

		if(!isKML)
		{
			marker = {
				id: id,
				type: 'marker',
				value: curTarget.attr('value'),
				title: curTarget.next().next().text(),
				group: group,
				latitude: curTarget.data().latitude,
				longitude: curTarget.data().longitude
			};
		}
		else
		{
			var kmlLineId = data.kmlLineId;
			var kmlUrl = curTarget.data().kmlUrl;

			marker = {
				id: id,
				type: 'kml',
				value: curTarget.attr('value'),
				title: curTarget.next().next().text(),
				group: group,
				lineId: kmlLineId,
				url: kmlUrl
			};

		}

		return marker;
	};

	var _createMarkerObjectById = function(id)
	{
		return _createMarkerObject($('#' + id));
	};

	/**
	 * opens a parent category
	 */
	var _categoryClicked = function(e)
	{
		var curTarget = $(e.currentTarget);
		curTarget.toggleClass('active');

		var isLinked = curTarget.hasClass('linked');
		var parent = curTarget.parent();

		if(chapman.virtualtour.MissionControl.isDesktop())
		{
			if(!isLinked)
			{
				$('.virtualTour-subCategories', parent).slideToggle().promise().done(function()
				{
					chapman.virtualtour.MissionControl.updateScrollPanel();
				});
			}
			else
			{
				var cb = $('input.parent', parent);
				cb.trigger('click');
			}
		}
		else
		{
			$('.virtualTour-subCategories', parent).slideToggle().promise().done(function()
			{
				chapman.virtualtour.MissionControl.updateScrollPanel();
			});
		}

		return false;
	};

	/**
	 * called when a sub category link is clicked
	 */
	var _subCategoryClicked = function(e)
	{
		var curTarget = $(e.currentTarget);
		var id = curTarget.data().checkboxId;
		var checked = $('#' + id).is(':checked');

		if(!checked)
			$('#' + id).trigger('click'); // get the marker on the map

		chapman.virtualtour.Map.clickMarkerById(id);

		return false;
	};

	var _checkboxChanged = function(e)
	{
		var curTarget = $(e.currentTarget);
		var name = curTarget.attr('name');
		var value = curTarget.attr('value');

		// if this is the parent category checkbox
		if(curTarget.hasClass('parent'))
		{
			var markerObjects = [];
			var checkboxGroup = $(':checkbox[name=' + name + ']').each(function(index, value)
			{
				var checkbox = $(value);

				// loop through all of the checkboxes and create marker objects to send off to the map
				if(checkbox.data().longitude && checkbox.data().latitude || checkbox.data().kmlUrl)
				{
					var markerObject = _createMarkerObject($(checkbox));
					markerObjects.push(markerObject);
				}
			});

			var parentChecked = curTarget.is(':checked');

			if(parentChecked)
			{
				checkboxGroup.attr('checked', true);
				chapman.virtualtour.Map.addMarkers(markerObjects);
			}
			else
			{
				checkboxGroup.attr('checked', false);
				chapman.virtualtour.Map.removeMarkers(markerObjects);
			}

			// figure out if any of the boxes checked have duplicates in other groups
			_determineDuplicateAttractionState(checkboxGroup, parentChecked);
		}

		// if this is a sub category checkbox
		else
		{
			// determine if the box is checked or not and add or remove a marker based on the status
			var boxChecked = curTarget.is(':checked');
			var checkboxes = $('input[value=' + value + ']'); // when an item is in multiple categories
			//var isKML = curTarget.data().kmlUrl != undefined ? true : false;
			var markerObject = _createMarkerObject(curTarget);

			if(boxChecked)
			{
				checkboxes.attr('checked', true);
				chapman.virtualtour.Map.addMarker(markerObject);
			}
			else
			{
				checkboxes.attr('checked', false);
				chapman.virtualtour.Map.removeMarker(markerObject);
			}

			_determineParentCategoryState();
		}
	};


	/**
	 * Accepts a checkbox group and determines if there are any other checkboxes that need checked or not in other groups
	 */
	var _determineDuplicateAttractionState = function(group, state)
	{
		group.each(function(index, ele)
		{
			if(index != 0)
			{
				var value = $(ele).attr('value');
				var checkboxes = $('input[value=' + value + ']');

				if(checkboxes.length > 1)
				{
					checkboxes.attr('checked', state);
					_determineParentCategoryState();
				}
			}
		});

	};


	/**
	 * determines and sets the state of the parent category checkbox
	 */
	var _determineParentCategoryState = function()
	{
		$('.virtualTour-categoryCheckbox.parent', '#virtualTour-categoryMenu').each(function(index, value)
		{
			var parent = $(value).parent();
			var numSubs = $('.child', parent).length;
			var numCheckedSubs = $('.child:checked', parent).length;

			if(numCheckedSubs > 0 && numCheckedSubs < numSubs)
				$(value).prop('indeterminate', true).prop('checked', false);
			else if(numCheckedSubs == numSubs)
				$(value).prop('indeterminate', false).prop('checked', true);
			else
				$(value).prop('indeterminate', false).prop('checked', false);
		});
	};

	var _initWithSubCategory = function(id)
	{
		var cb = $('#' + id, '#virtualTour-categoryMenu');
		var a = $('.virtualTour-subCategoryLink', cb.parent());
		a.trigger('click');
	};

	var _getTitleById = function(id)
	{
		var title = $('#' + id).next().next().text();
		return title;
	};

	// expose public functions
	return {
		init: _init,
		initWithSubCategory: _initWithSubCategory,
		subCategoryClicked: _subCategoryClicked,
		getTitleById: _getTitleById,
		//resized: _resized
	};

})(jQuery);