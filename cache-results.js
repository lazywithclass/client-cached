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


//TODO questi sono da cambiare, il localStorage è per site,
//quindi non c'è problema di incasinamento di nomi di variabili
var canUseId = 'wer324tfgerfew4sf1aas2earf';
var localStorageId = '1aaa<azazaassq<aa2aasxwa1a<aabaa';
var localStorageStartFunction = '2aa<aqaaasxz2s1saaza<aaawbazaa<a';
var localStorageCancelFunction = '3aaasa2zaasaa<xas1<aaazaw<aaa';

$('#clearLocalStorage').click(function(){
    clientCached.initLocalStorage();
});

var clientCached = {
    
    resultsDivId : '',

    canUseCachedData : function(){
        return !clientCached.isLocalStorageEmpty();    
    },

    //these are to be implemented from the user
    setCancelServerCall : function(cancelServerCallFunction){
        localStorage[localStorageCancelFunction] = cancelServerCallFunction;
    },
    setServerCall : function(serverCallFunction){
        localStorage[localStorageStartFunction] = serverCallFunction;
    },
    
    cancelServerCallIsSet : function(){
        return !!(localStorage[localStorageCancelFunction]!==null &&
                localStorage[localStorageCancelFunction].length>0);
    },
    
    startServerCallIsSet : function(){
        return !!(localStorage[localStorageCancelFunction]!==null &&
                localStorage[localStorageCancelFunction].length>0);
    },
    
    isProperlyInitiated : function() {
        return !!(typeof clientCached.cancelServerCall === 'function' ||
              typeof clientCached.setServerCall === 'function');
    },

    hasLocalStorage : function(){
        return !!('localStorage' in window && window.localStorage !== null);
    },

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