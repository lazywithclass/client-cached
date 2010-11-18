/*
 * client-cached.js: An object to cache form results on the client side.
 *
 * (C) 2010 Alberto Zaccagni
 * MIT LICENSE
 *
 */

//link per compressione clientside del javascript
//http://code.google.com/p/jslzjb/

//TODO i seguenti campi devono essere configurati quando 
//si crea l'oggetto cache-results

var localStorageId = 'localhost-montecristoz';

$('#clearLocalStorage').click(function(){
    clientCached.initLocalStorage();
});

var clientCached = {

    //it has to be implemented from the user
    cancelServerCall : undefined,
    
    isProperlyInitiated : function() {
        return typeof clientCached.cancelServerCall === 'function';
    },

    hasLocalStorage : {
        return 'localStorage' in window && window.localStorage !== null {
    },

    init : function(resultsDivId){
        if(!clientCached.isProperlyInitiated() && !hasLocalStorage){
	    return;
	}
		
        $('#'+resultsDivId).bind('customAction', function(event, data) {
            if(!localStorage[localStorageId]){
                clientCached.initLocalStorage();
            }
            
            if(!clientCached.isLocalStorageEmpty()){
                $('#messages').append("not empty localStorage");
                //come sono i dati nello storage? non ricordo, cazzo
                var compressedData = JSON.parse(localStorage[localStorageId]);
                var decompressedData = Iuppiter.decompress(compressedData);
                $('#'+resultsDivId).html(decompressedData);
            }else{
                $('#messages').append("empty localStorage");
                var uncompressedData = $('#'+resultsDivId).html();
                var compressedData = Iuppiter.compress(uncompressedData);
                localStorage[localStorageId] = JSON.stringify(compressedData);
                
                //TODO disabilita meccanismo di interrogazione server
                outerThis.cancelServerCall();
            }
        });
    },
    
    initLocalStorage : function(){
        localStorage[localStorageId] = JSON.stringify([]);
    },
    
    isLocalStorageEmpty : function(){
        return !!(JSON.parse(localStorage[localStorageId]).length==0);
    }
};