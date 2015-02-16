var chapman = chapman || {};
chapman.virtualtour = chapman.virtualtour || {};
chapman.virtualtour.imgFilePath = './_files/virtualTour/img/';

function updateLocation(key, value, url)
{
    if (!url) url = window.location.href;
    var re = new RegExp("([?|&])" + key + "=.*?(&|#|$)(.*)", "gi");

    if (re.test(url)) 
    {
        if (value)
            return url.replace(re, '$1' + key + "=" + value + '$2$3');
        else
            return url.replace(re, '$1$3').replace(/(&|\?)$/, '');
    }
    else 
    {
        if (value) 
        {
            var separator = url.indexOf('?') !== -1 ? '&' : '?',
                hash = url.split('#');
            url = hash[0] + separator + key + '=' + value;
            if (hash[1]) url += '#' + hash[1];
            return url;
        }
        else
        {
            return url;
        }
    }
};