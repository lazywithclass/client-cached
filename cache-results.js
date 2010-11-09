//link per compressione clientside del javascript
//http://cheeso.members.winisp.net/srcview.aspx?dir=js-unzip
//http://jszip.stuartk.co.uk/
//http://stackoverflow.com/questions/294297/javascript-implementation-of-gzip
//http://code.google.com/p/jslzjb/


//inserire questo nei dati ritornati 
//$('#targetdiv').trigger('dataarrived', postedUrl);

//TODO i seguenti campi devono essere configurati quando 
//si crea l'oggetto cache-results
var formId;
var resultsDivId;

$('#'+formId).submit(function(){   
	//diciamo che in qualche modo ho recuperato e buildato l'url con tutti i parametri postati
	var postedUrl = buildPostedUrl();
	if(localStorage[postedUrl]){
		//come sono i dati nello storage? non ricordo, cazzo
		var compressedData = localStorage[postedUrl];
		var decompressedData = Iuppiter.decompress(compressedData);
		$('#'+resultsDivId).html(decompressedData);
		//assicurati che basti questo per interrompere il POST della form
		return false;
	}else{
		//mi arriva nei dati il trigger 
		//questa parte è gestita appunto, nel bind
	}
});

//TODO assicurati che postedUrl sia passato correttamente dal trigger correttamente
$('#targetdiv').bind('dataarrived', function(postedUrl){
	var uncompressedData = $('#'+resultsDivId).html();
	var compressedData = Iuppiter.compress(uncompressedData);
	localStorage[postedUrl] = compressedData;
});