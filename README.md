#Proof of concept for some fun map action.

To run, clone the repo, and in the directory type `npm start`.
Navigate to "localhost:3000"

Relevant files:

HTML
> ./views/bar.hbs

Class to create the slider
> ./public/javascripts/mapbar.js

Class to create the map
> ./public/javascripts/mapGen.js

Concept: each slide is generated from a hidden input containing the url of a google street view.
The fist slide is the default location. Clicking on a slide will take you to that location with a marker on the location.
Clicking on that marker opens an overlay box with a link to view the street view. To exit the street view you just click on another slide.


###Random Known Bugs:
- I think the bx-slider is affecting how click event listeners are applied. Sometimes clicking on a slide doesnt work but if you move the slides around it does. Stumped.  
