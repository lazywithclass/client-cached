/*
 * client-cached.js: An object to cache data on the client side
 *
 * (C) 2010 Alberto Zaccagni - http://www.lazywithclass.com
 * MIT LICENSE
 */


$('#clearLocalStorage').click(function(){
    CLIENTCACHED.initLocalStorage();
});

var CLIENTCACHED = CLIENTCACHED || {};

CLIENTCACHED.storageKeys = {
	resultsElementId : "",
	resultsCount : "",
	startedTime : ""
};

CLIENTCACHED.hasLocalStorage = function(){
    return !!('localStorage' in window && window.localStorage !== null);
};

CLIENTCACHED.init = function(parameter){

	if (!CLIENTCACHED.hasLocalStorage()) {
        return;
    }   
    
    //fixme: isn't there a cleaner way?
    CLIENTCACHED.resultsDivId = parameter.resultsDivId;
    CLIENTCACHED.resultsCountUrl = parameter.resultsCountUrl;
    CLIENTCACHED.delay = parameter.delay;
	
    CLIENTCACHED.storageKeys.resultsElementId = parameter.id;
    CLIENTCACHED.storageKeys.resultsCount = parameter.id+"-count";
	
    $('#'+CLIENTCACHED.resultsDivId).bind('customAction', function(event, data) {
        if(! localStorage[CLIENTCACHED.storageKeys.resultsElementId]){
            CLIENTCACHED.initLocalStorage();
        }
		localStorage[CLIENTCACHED.storageKeys.resultsCount] = CLIENTCACHED.getCount();
        var uncompressedData = $('#'+CLIENTCACHED.resultsDivId).html();
        var compressedData = Iuppiter.compress(uncompressedData);
        localStorage[CLIENTCACHED.storageKeys.resultsElementId] = JSON.stringify(compressedData);
    });
};

CLIENTCACHED.canUseCachedData = function(){
	
	if(CLIENTCACHED.isLocalStorageEmpty(CLIENTCACHED.storageKeys.startedTime)){
		updateStartedTime();
	}
	
	if(onlyDelayWasSet()){
		return !delayExpired();
	}else if(delayAndCountUrlWereSet()){
		return !dataChanged();
	}
    return !CLIENTCACHED.isLocalStorageEmpty(CLIENTCACHED.storageKeys.resultsElementId);    

    function updateStartedTime(){
    	localStorage[CLIENTCACHED.storageKeys.startedTime] = new Date().getTime();
    }
    
    function dataChanged(){
    	return CLIENTCACHED.getCount() != localStorage[CLIENTCACHED.storageKeys.resultsCount];
    }
    
    function delayExpired(){
    	return localStorage[CLIENTCACHED.storageKeys.startedTime] + CLIENTCACHED.delay > new Date().getTime();
    }
    
    function onlyDelayWasSet(){
    	if(CLIENTCACHED.resultsCountUrl==undefined){
    		if(CLIENTCACHED.delay!=undefined){
    			return true;
    		}	
    	}
    	return false;
    }
    
    function delayAndCountUrlWereSet(){
    	return CLIENTCACHED.resultsCountUrl!=undefined && CLIENTCACHED.delay!=undefined;
    }
};

CLIENTCACHED.initLocalStorage = function(){
    localStorage[CLIENTCACHED.storageKeys.resultsElementId] = JSON.stringify([]);
	localStorage[CLIENTCACHED.storageKeys.resultsCount] = JSON.stringify([]);
};

CLIENTCACHED.isLocalStorageEmpty = function(which){
    return localStorage[which]==null || !!(JSON.parse(localStorage[which]).length==0);
};

CLIENTCACHED.populateResults = function(){
    var compressedData = JSON.parse(localStorage[CLIENTCACHED.storageKeys.resultsElementId]);
    $('#'+CLIENTCACHED.resultsDivId).html(Iuppiter.decompress(compressedData));
};

CLIENTCACHED.getCount = function(){
	var count = 0;
	$.ajax({
        url: CLIENTCACHED.resultsCountUrl,
        async: false,
        type: 'POST',
        dataType:'json',
        success: function(response) {
             count = response.count;
        }
    });
    return count;
};