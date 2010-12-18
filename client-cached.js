/*
 * client-cached.js: An object to cache data on the client side
 *
 * (C) 2010 Alberto Zaccagni - http://www.lazywithclass.com
 * MIT LICENSE
 */

var resultsLocalStorageKey = 'query-results';
var resultsCountLocalStorageKey = 'count';
var storedResultsCountLocalStorageKey = 'stored-count';

$('#clearLocalStorage').click(function(){
    clientCached.initLocalStorage();
});

//fixme: what about avoiding to call clientCached.PROPERTY every single time? Hm?
var clientCached = {
	
    init : function(parameter){
        if (!clientCached.hasLocalStorage()) {
            return;
        }   
		//fixme: isn't there a cleaner way?
		clientCached.resultsDivId = parameter.resultsDivId;
		clientCached.resultsCountUrl = parameter.resultsCountUrl;
		clientCached.delay = parameter.delay;
		
        $('#'+clientCached.resultsDivId).bind('customAction', function(event, data) {
            if(! localStorage[resultsLocalStorageKey]){
                clientCached.initLocalStorage();
            }
			localStorage[resultsCountLocalStorageKey] = clientCached.getCount();
            var uncompressedData = $('#'+clientCached.resultsDivId).html();
            var compressedData = Iuppiter.compress(uncompressedData);
            localStorage[resultsLocalStorageKey] = JSON.stringify(compressedData);
        });
    },
	
    canUseCachedData : function(){
		if(clientCached.resultsCountUrl==undefined){
		    if(clientCached.delay==undefined){
                return false;
            }else{
			    //every time the delay expires refresh the cached results
			}	
		}else{
			if(clientCached.delay==undefined){
				return false;
            }else{
	            localStorage[storedResultsCountLocalStorageKey] = clientCached.getCount();
				if(localStorage[storedResultsCountLocalStorageKey]!=localStorage[resultsCountLocalStorageKey]){
	                return false;
	            }else{
	                return true;
	            }
			}
		}
		
        return !clientCached.isLocalStorageEmpty(resultsLocalStorageKey);    
    },

    hasLocalStorage : function(){
        return !!('localStorage' in window && window.localStorage !== null);
    },
    
    initLocalStorage : function(){
        localStorage[resultsLocalStorageKey] = JSON.stringify([]);
		localStorage[resultsCountLocalStorageKey] = JSON.stringify([]);
		localStorage[storedResultsCountLocalStorageKey] = JSON.stringify([]);
    },
    
    isLocalStorageEmpty : function(which){
        return localStorage[which]==null || !!(JSON.parse(localStorage[which]).length==0);
    },
    
    populateResults : function(){
        $('#messages').html("taking data from the localStorage");
        var compressedData = JSON.parse(localStorage[resultsLocalStorageKey]);
        $('#'+clientCached.resultsDivId).html(Iuppiter.decompress(compressedData));
    },
	
	getCount : function(){
		var count = 0;
		$.ajax({
            url: clientCached.resultsCountUrl,
            async: false,
            type: 'POST',
            dataType:'json',
            success: function(response) {
                 count = response.count;
            }
        });
	    return count;
	}
};