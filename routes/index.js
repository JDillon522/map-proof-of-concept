var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var data = [
		{
			"value":"https://www.google.com/maps/@33.791987,-117.85301,3a,75y,95.74h,90.43t/data=!3m5!1e1!3m3!1sj4k3D85QPKcAAAQZEC4OzA!2e0!3e2",
			"name": "Memorial Hall / Bert Williams Mall",
			"icon" : "pano"

		},{
			"value": "https://www.google.com/maps/@33.793314,-117.852358,3a,75y,91.15h,97.16t/data=!3m5!1e1!3m3!1sMiMKPen4hNwAAAQZDk8vCQ!2e0!3e2",
			"name" : "C.C. Chapman Statue Entrance",
			"icon" : "pano"
		},{
			"value": "https://www.google.com/maps/@33.794312,-117.850837,3a,75y,269.29h,77.43t/data=!3m5!1e1!3m3!1sXcxLPzVzLM8AAAQZEC4O1w!2e0!3e2",
			"name" : "Wilson Field / Earnie Chapman Stadium",
			"icon" : "pano"
		},{
			"value": "https://www.google.com/maps/@33.793062,-117.851816,3a,75y,103.79h,84.37t/data=!3m5!1e1!3m3!1sLufrHk-GzWEAAAQZDbTxCA!2e0!3e2",
			"name" : "Attallah Piazza / Leatherby Libraries",
			"icon" : "pano"
		},{
			"value": "https://www.google.com/maps/@33.791444,-117.856274,3a,75y,138.27h,93.25t/data=!3m5!1e1!3m3!1s90fxT3nZrCMAAAQZDbYaeQ!2e0!3e2",
			"name" : "Dodge College",
			"icon" : "pano"
		},{
			"value": "https://www.google.com/maps/@33.79294,-117.850921,3a,75y,92.89h,97.99t/data=!3m5!1e1!3m3!1slZiJF3hpSMEAAAQZEC4Owg!2e0!3e2",
			"name" : "Argyros Forum ",
			"icon" : "pano"
		},{
			"value": "https://www.google.com/maps/@33.792655,-117.852043,3a,75y,183.11h,86.82t/data=!3m5!1e1!3m3!1sNbwVAHhXjM8AAAQZEC4Ozw!2e0!3e2",
			"name" : "Liberty Plaza / Berlin Wall Statue",
			"icon" : "pano"
		},{
			"value": "https://www.google.com/maps/@33.793288,-117.851959,3a,75y,235.13h,104.23t/data=!3m5!1e1!3m3!1sWG8dSqcf2VkAAAQZDk8u_g!2e0!3e2",
			"name" : "Beckman Hall",
			"icon" : "pano"
		},{
			"value": "https://www.google.com/maps/@33.796079,-117.849849,3a,75y,340.25h,103.97t/data=!3m5!1e1!3m3!1sxxKSrOQgYA0AAAQZEDr0bw!2e0!3e2",
			"name" : "Sandhu Residence Hall",
			"icon" : "pano"
		},{
			"value": "https://www.google.com/maps/@33.792355,-117.851735,3a,75y,114.29h,92.43t/data=!3m5!1e1!3m3!1sksYR0YX7xIoAAAQZDdrsYA!2e0!3e2",
			"name" : "Oliphant Hall",
			"icon" : "pano"
		},{
			"value": "https://www.google.com/maps/@33.792542,-117.850929,3a,90y,212.68h,97.87t/data=!3m5!1e1!3m3!1syp5TJxid2_UAAAQZDbZhcw!2e0!3e2",
			"name" : "Gentle Springs",
			"icon" : "pano"
		},{
			"value": "https://www.google.com/maps/@33.795736,-117.849363,3a,75y,265.5h,87.55t/data=!3m5!1e1!3m3!1s50vQ5RIG3LUAAAQZDbTxFw!2e0!3e2",
			"name" : " Student Recreation Area",
			"icon" : "pano"
		},{
			"value": "https://www.google.com/maps/@33.790349,-117.856451,3a,75y,230.27h,92.24t/data=!3m5!1e1!3m3!1sJoJVR88CcbgAAAQZEC4O0w!2e0!3e2",
			"name" : "Digital Media Arts Center",
			"icon" : "pano"
		},{
			"value": "https://www.google.com/maps/@33.79408,-117.8519,3a,90y,51.93h,81.62t/data=!3m5!1e1!3m3!1s7JheYivwB6IAAAQZDaUpHw!2e0!3e2",
			"name" : "Allred Aquatics Center",
			"icon" : "pano"
		},{
			"value": "https://www.google.com/maps/@33.792355,-117.851735,3a,75y,30.68h,98.62t/data=!3m5!1e1!3m3!1sksYR0YX7xIoAAAQZDdrsYA!2e0!3e2",
			"name" : "Wilkinson Hall",
			"icon" : "pano"
		}
	];

  res.render('index', data);
});

module.exports = router;
