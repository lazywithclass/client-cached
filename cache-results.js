/*
 * client-cached.js: An object to cache form results on the client side.
 *
 * (C) 2010 Alberto Zaccagni
 * MIT LICENSE
 *
 */

var resultsLocalStorageKey = 'query-results';
var resultsCountLocalStorageKey = 'count';

$('#clearLocalStorage').click(function(){
    clientCached.initLocalStorage();
});

var clientCached = {
    
    init : function(resultsDivId){
        if (!clientCached.hasLocalStorage()) {
            return;
        }
        $('#'+resultsDivId).bind('customAction', function(event, data) {
            if(!localStorage[resultsLocalStorageKey]){
                clientCached.initLocalStorage();
            }
            var uncompressedData = $('#'+resultsDivId).html();
            var compressedData = Iuppiter.compress(uncompressedData);
            localStorage[resultsLocalStorageKey] = JSON.stringify(compressedData);
        });
        clientCached.resultsDivId = resultsDivId;
    },
	
    canUseCachedData : function(){
		//se dentro resultsCountLocalStorageKey non c'è niente
		    //faccio la chiamata al server prendendo l'url per la count passato dal client
		
		//altrimenti
		    //confronto le due count, se sono diverse 
			    //chiamo il server, metto i risultati compressi nello storage, aggiorno la count
		    //altrimenti
			    //mostro il contenuto del localstorage
        return !clientCached.isLocalStorageEmpty();    
    },

    hasLocalStorage : function(){
        return !!('localStorage' in window && window.localStorage !== null);
    },
    
    initLocalStorage : function(){
        localStorage[resultsLocalStorageKey] = JSON.stringify([]);
		localStorage[resultsCountLocalStorageKey] = JSON.stringify([]);
    },
    
    isLocalStorageEmpty : function(){
        return localStorage[resultsLocalStorageKey]==null || !!(JSON.parse(localStorage[resultsLocalStorageKey]).length==0);
    },
    
    populateResults : function(){
        $('#messages').html("taking data from the localStorage");
        var compressedData = JSON.parse(localStorage[resultsLocalStorageKey]);
        $('#'+clientCached.resultsDivId).html(Iuppiter.decompress(compressedData));
    }
};