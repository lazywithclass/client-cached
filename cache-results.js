/*
 * client-cached.js: An object to cache form results on the client side.
 *
 * (C) 2010 Alberto Zaccagni
 * MIT LICENSE
 *
 */

var localStorageId = 'query-results';

$('#clearLocalStorage').click(function(){
    clientCached.initLocalStorage();
});

var clientCached = {
    
    init : function(resultsDivId){
        if (!clientCached.hasLocalStorage()) {
            return;
        }
        $('#'+resultsDivId).bind('customAction', function(event, data) {
            if(!localStorage[localStorageId]){
                clientCached.initLocalStorage();
            }
            var uncompressedData = $('#'+resultsDivId).html();
            var compressedData = Iuppiter.compress(uncompressedData);
            localStorage[localStorageId] = JSON.stringify(compressedData);
        });
        clientCached.resultsDivId = resultsDivId;
    },
	
    canUseCachedData : function(){
        return !clientCached.isLocalStorageEmpty();    
    },

    hasLocalStorage : function(){
        return !!('localStorage' in window && window.localStorage !== null);
    },
    
    initLocalStorage : function(){
        localStorage[localStorageId] = JSON.stringify([]);
    },
    
    isLocalStorageEmpty : function(){
        return localStorage[localStorageId]==null || !!(JSON.parse(localStorage[localStorageId]).length==0);
    },
    
    populateResults : function(){
        $('#messages').html("taking data from the localStorage");
        var compressedData = JSON.parse(localStorage[localStorageId]);
        $('#'+clientCached.resultsDivId).html(Iuppiter.decompress(compressedData));
    }
};