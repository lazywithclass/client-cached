/*
 * client-cached.js: An object to cache data on the client side.
 *
 * (C) 2010 Alberto Zaccagni
 * MIT LICENSE
 *
 */

var resultsLocalStorageKey = 'query-results';
var resultsCountLocalStorageKey = 'count';
var storedResultsCountLocalStorageKey = 'stored-count';

$('#clearLocalStorage').click(function(){
    clientCached.initLocalStorage();
});

Function.prototype.isset = function (variable){
	return typeof variable != 'undefined';
};

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
			
			$.post(clientCached.resultsCountUrl, function(data){
                localStorage[storedResultsCountLocalStorageKey] = data;
            });
            var uncompressedData = $('#'+clientCached.resultsDivId).html();
            var compressedData = Iuppiter.compress(uncompressedData);
            localStorage[resultsLocalStorageKey] = JSON.stringify(compressedData);
        });
		
    },
	
    canUseCachedData : function(){
		//if clientCached.resultsCountUrl was not set 
		if(!isset(clientCached.resultsCountUrl)){
		    if(!isset(clientCached.delay)){
                return false;
            }else{
			    //every time the delay expires refresh the cached results
			}	
		}else{
			if(isset(clientCached.delay)){
                //every time the delay expires check the counts
            }else{
				return false;
			}
		}
		
		if(clientCached.isLocalStorageEmpty(resultsCountLocalStorageKey)){
			$.post(clientCached.resultsCountUrl, function(data){
			    clientCached.resultsCountUrl = data;
			});
			return false;
		}else{
			if(localStore[storedResultsCountLocalStorageKey]!=localStorage[resultsCountLocalStorageKey]){
			    return false;
			}else{
			    return true;
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
    },
    
    isLocalStorageEmpty : function(which){
        return localStorage[which]==null || !!(JSON.parse(localStorage[which]).length==0);
    },
    
    populateResults : function(){
        $('#messages').html("taking data from the localStorage");
        var compressedData = JSON.parse(localStorage[resultsLocalStorageKey]);
        $('#'+clientCached.resultsDivId).html(Iuppiter.decompress(compressedData));
    }
};