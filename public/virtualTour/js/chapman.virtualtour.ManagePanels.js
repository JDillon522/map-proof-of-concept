/**
 * ManagePanels
 *	Send all requests to change the state of the panels through this class.
 */
chapman.virtualtour.ManagePanels = (function($)
{
	var SEARCH_OPEN_CLASS_NAME = 'searchOpen';
	var CATEGORY_MENU_OPEN_CLASS_NAME = 'categoryMenuOpen';

	// parking templates
	var _allSpaces = '<div class="line-item"><span class="left-text"><strong>SPACES AVAILABLE:</strong></span><span class="right-text"><strong>{spaces}</strong></span></div>';
	var _levelSpaces = '<div class="line-item"><span class="left-text">{title}:</span><span class="right-text">{spaces}</span></div>';
	
	var _navigation;

	var _init = function()
	{
		_navigation = $('#virtualTour-mainNavigation');

		$('#virtualTour-categoryMenu').show()
		$('#virtualTour-search').show();
	};

	var _toggleCategoryMenu = function(action)
	{
		_hideSearch();

		if(_navigation.hasClass(CATEGORY_MENU_OPEN_CLASS_NAME))
		{
			_hideCategoryMenu();
		}
		else
		{
			_navigation.addClass(CATEGORY_MENU_OPEN_CLASS_NAME);

			$('#virtualTour-categoryMenu').slideDown().promise().done(function(e)
			{
				chapman.virtualtour.MissionControl.updateScrollPanel();
			});
		}

		chapman.virtualtour.MainNavigation.updateMainMenu('categoryMenu');
		_toggleDetail();
	};

	var _hideCategoryMenu = function()
	{
		_navigation.removeClass(CATEGORY_MENU_OPEN_CLASS_NAME);

		$('#virtualTour-categoryMenu').slideUp().promise().done(function(e)
		{
			chapman.virtualtour.MissionControl.updateScrollPanel();
		});
	};

	var _toggleSearch = function(action)
	{
		_hideCategoryMenu();

		if(_navigation.hasClass(SEARCH_OPEN_CLASS_NAME))
		{
			_hideSearch();
		}
		else
		{
			_navigation.addClass(SEARCH_OPEN_CLASS_NAME);

			$('#virtualTour-search').slideDown().promise().done(function(e)
			{
				chapman.virtualtour.MissionControl.updateScrollPanel();
			});
		}

		chapman.virtualtour.MainNavigation.updateMainMenu('search');
		_toggleDetail();
	};

	var _hideSearch = function()
	{
		_navigation.removeClass(SEARCH_OPEN_CLASS_NAME);

		$('#virtualTour-search').slideUp().promise().done(function(e)
		{
			chapman.virtualtour.MissionControl.updateScrollPanel();
		});
	};

	var _showDetail = function(contentId)
	{
		_hideCategoryMenu();
		_hideSearch();
		
		$('#virtualTour-backButton').fadeIn();

		// give the wrapper a class that will change the ui
		$('#virtualTour-wrapper').addClass('virtualTour-wrapperDetail');

		// destroy anything that is in the detail panel
		$('#virtualTour-detail').empty().append('<img src="' + chapman.virtualtour.imgFilePath + '/loader.gif" width="16" height="16" />').show();

		$('.flexslider', '#virtualTour-detail').removeData("flexslider");

		// find the href to load and load it
		var cb = $('#' + contentId, '#virtualTour-categoryMenu');
		var a = $('.virtualTour-subCategoryLink', cb.parent());
		var detailHref = a.attr('href');

		// update the google maps link
		var lat = cb.data().longitude;
		var lon = cb.data().latitude;
		$('#virtualTour-mainNavigationViewOnMapButton').attr('href', 'https://maps.google.com/maps?q=' + lon + ',' + lat + '&z=20');

		// load the content
		$('#virtualTour-detail').load(detailHref + ' #virtualTour-attractionContent', function(response, status, xhr)
		{
			var detailPanel = $(this);

			switch(status)
			{
				case 'success' :
				{
					var hasFlexslider = $('.flex-container', detailPanel).length > 0 ? true : false;
					var attractionContent = $('#virtualTour-attractionContent');

					//$('.flexslider', '#virtualTour-detail').removeData("flexslider");
					$('.flexslider').eq(0).flexslider('destroy');

					if(attractionContent.length > 0)
					{
						var hasParking = attractionContent.data().parking;
						var parkingName = attractionContent.data().parkingName;

						detailPanel.hide().fadeIn(600).promise().done(function()
						{
							if(hasFlexslider)
							{
								var slideOptions = $('.slideOptions');
								var autoRotate = $('.autoRotate', slideOptions).text() == 'on' ? true : false;
								var startingSlide = $('.startingSlideNumber', slideOptions).text();
								var speed = $('.speed', slideOptions).text();

								$('.flexslider', '#virtualTour-detail').flexslider(
								{
									animation: 'slide',
									minItems: 1,
        							maxItems: 1,
									animationLoop: true,
									controlNav: false,
									directionNav: true,
									//slideshow: autoRotate,
									slideshow: false,
									//useCSS: false, // fixes bugs in Safari and Firefox
									//touchSwipe: true,
									//pauseOnHover: true,
									//pauseOnAction: true,
									//pausePlay: true,
									//randomize: false,
									slideshowSpeed: speed,										
									start: function (slider) 
									{
							            var currentSlide = slider.slides[slider.currentSlide],
							            	$currentSlide = $(currentSlide);								

							            if ($('html').hasClass("opacity"))
							            {
							            	setTimeout(function()
							            	{
							            		$('.slide').not(currentSlide).fadeTo(0, .2);
							            		$currentSlide.fadeTo(0, 1);
							            	}, 200);						                
							            }
							            else 
							            {
							                if ($(".ie7").length) {
							                    $('.rotatorContainer').css('overflow', 'hidden');
							                    $('.slide').not(currentSlide).css('margin-top', '-9999999px');
							                }
							                else {
							                    $('.slide').not(currentSlide).css('visibility', 'hidden');
							                }
							            }
							        },							        
							        before: function (slider) 
							        {
							            var nextSlide = slider.slides[slider.animatingTo],
							                $nextSlide = $(nextSlide),
							                difference = (parseInt(slider.currentSlide) - parseInt(slider.animatingTo)),
							                offset = '100px',
							                currentSlide = slider.slides[slider.currentSlide],
							                $currentSlide = $(currentSlide);

							            if (difference === 1 || difference === -4) {
							                offset = '-100px';
							            }
							            
							            if ($('html').hasClass("opacity"))
							            {
							                $('.slide').not(nextSlide).stop().fadeTo(500, .1);
							                $nextSlide.stop().fadeTo(500, 1);
							            }							            
							        },
							        after: function (slider)
							        {
							            var currentSlide = slider.slides[slider.currentSlide],
							                $currentSlide = $(currentSlide);

							            $currentSlide.css({'opacity': 1})

							            if (!$('html').hasClass("opacity")) 
							            {
							                if ($('.ie7').length)
							                {
							                    $('.slide').not(currentSlide).css('margin-top', '-99999999px');
							                    $currentSlide.css('margin-top', '0px');
							                }
							                else 
							                {
							                    $('.slide').not(currentSlide).css('visibility', 'hidden');
							                    $currentSlide.css('visibility', 'visible');
							                }
							            }
							        }					        
								});
							}
							else
							{
								$('.flexslider', '.slide').fadeTo(0, 1);
							}

							if(hasParking)
							{
								var parkingInfo = $('#virtualTour-parkingInfo');

								$.ajax (
								{ 
									url: 'http://webfarm.chapman.edu/ParkingService/ParkingService/counts',
									dataType: 'jsonp'
								}).done(function(data)
								{
									$.each(data.Structures, function(index, value)
									{
										if (value.Name == parkingName)
										{
											var parkingInfoHtml = '';

											// loop through your levels
											$.each(value.Levels, function(index, value)
											{
												if(index == 0)
												{
													parkingInfoHtml += t(_allSpaces, 
													{
														spaces: value.CurrentCount
													});
												}
												else
												{
													parkingInfoHtml += t(_levelSpaces, 
													{
														title: value.FriendlyName,
														spaces: value.CurrentCount
													});
												}
											});

											parkingInfo.empty().append(parkingInfoHtml);

											// stop looping
											return false;
										}
									});
								}).fail(function()
								{
									parkingInfo.html('<p>Sorry, but we weren\'t able to download parking availability.</p>');
								});
							}

							chapman.virtualtour.MissionControl.updateScrollPanel();
						});
					}
					else
					{
						_errorHandler();
					}

					break;
				}
				default :
				{
					_errorHandler();
				}
			}
		});

		chapman.virtualtour.MainNavigation.updateMainMenu('detail');
	};

	var _toggleDetail = function()
	{
		if(_navigation.hasClass(CATEGORY_MENU_OPEN_CLASS_NAME) || _navigation.hasClass(SEARCH_OPEN_CLASS_NAME))
		{
			$('#virtualTour-backButton').fadeOut();
			$('#virtualTour-detail').fadeOut();
		}
		else
		{
			$('#virtualTour-backButton').fadeIn();
			$('#virtualTour-detail').fadeIn();	
		}
	};

	var _errorHandler = function()
	{
		var errorMessage = '<h2>We Can\'t Find Your Page</h2><p>Please let us know of any issues that you\'ve run into, or if you\'re feeling positive we appreciate the good comments as well. <a href="/feedback-form.aspx">Feedback Form</a></p>';
		$('#virtualTour-detail').html(errorMessage);
	};

	return {
		init: _init,
		toggleCategoryMenu: _toggleCategoryMenu,
		toggleSearch: _toggleSearch,
		showDetail: _showDetail
	};

})(jQuery);