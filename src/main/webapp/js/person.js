/*
	Angepasster Code von Gwenlyn Tiedemann
	angepasst von Andreas Gálffy
*/

/* 
 * 		In der Tabelle sind alle Spalten sortierbar und es besteht die Möglichkeit sie zu durchsuchen.
 * 		Alternativnamen sind ausklappbar, damit die Tabelle nicht zu lang wird.
 * Es besteht die Möglichkeit sich in einer Liste die Quellen anzeigen zu lassen, in denen die gewählte Person vorkommt.
 * Vorkommnisliste wird rechts neben der Tabelle angezeigt und bewegt sich mit, wenn man die Tabelle runterscrollt.
 * Wenn man die Werkstitel in den Tabellen anklickt, wird der Inhalt der Quelle angezeigt.
 * Hier eine dritte Variante der Quellendarstellung: [andere Varianten: 1. Quellenverzeichnis, 2. Verfasserregister, 4. Ortsregister]
 * 		Die Quelleninhalte werden unterhalb der Tabelle angezeigt.
 * 		Die zugehörigen Quellenstellen werden links aufgelistet, 
 * 		denn auf der rechten Seite wird weiterhin die Vorkommnisliste gezeigt.
 * 		So kann der Benutzer sich schneller durch die Quellen durchklicken. */

$(document).ready(function(){
//seitenweit gültige Parameter
var work = null;
//Search-PlugIn für die dynamisch geladene Tabelle (Personen)
var qs = $('input#search').quicksearch('table tbody tr ');

//------------------------------------------------------------ Eventbereich ----------------------------------------------------------------------------

	//Anzeigen der Quellen, in denen die ausgewählte Person unter Entitäten aufgeführt wird.
	$(".container").on("click",".loadOccurence",function(){
		$('#sourceView').remove();
		var person = $(this).attr("data-person");
		//Holen der Quellen per AJAX-Abfrage der übergebenen ID
		$.ajax({
			type: "GET",
			url: "/getSourcesByKey/"+$(this).attr("data-vorkommnis")+"/person",
			success: function(response) {
				$('#viewOccurence').html(response);
				/*
				$.each(response,function(workTitle,work){
					$('#showSelected').html("<p>In folgenden Quellen wird die Person '<b>"+ person +"</b>' erwähnt:</p>");
					$.each(work,function(id,source){
						$('#showQuel').append("<p><span class='loadWork' data-work='"+source.werkId+"'><a href='#sourceView'>"+source.werkId+": "+workTitle+"</a></span>" +
        	    			  	  		" <br> Quellenstelle: "+source.quellenId+ " </p>");
					});
				});
				*/
			},
			error: function() {
				alert("Fehler beim Laden der Quellenstellen!");
			}
		});
	});

	$(".container").on("click",".loadWork",function(){
		$.ajax({
			type: "GET",
			url: "/singleWork/"+$(this).attr("data-work"),
			success: function(response){
				work = response;
				displayWerkInfo();
			},
			error: function() {
				alert("Fehler beim Laden der Werksdaten!");
			}
		});
	});
	
	$(".container").on("click",".viewSource",function(){
		displayQuelInfo(work.quellen[$(this).attr("data-quel")]);
	});
	
//------------------------------------------------------------ Funktionsbereich ----------------------------------------------------------------------------

/*
	//Laden der Werksansicht für die Vorkommnisse
	function displayWerkInfo() {
		//Elemente leeren, um neuen Inhalt anzuzeigen	  		
		$('#werkTable').empty();
		$('#QuelList').empty();
		$('#showQuelInfo').empty(); 
		$('#showMoreContent').empty();
		//Quellentext Vollansicht anzeigen
		$('#sourceView').show();
		$('#QuelList').append('<h4>Quellenstellen</h4>');
		//Anklicken der Quellenstellen => laden der jeweiligen Quellenstellen-Informationen
		//var quelle = work.quellen;
		$.each(work.quellen,function(id,quelle){;
			//Quellenstelle Liste zu der bestimmten Quelle unter die blaue Box als Liste setzen
			$('#QuelList').append('<li class="viewSource" data-quel="'+id+'"><a href="#sourceView">' + id +'</a></li>');
		});
		// Einfügen der XML-Inhalte ins Template
		//Header: WerkTitel und Alternativnamen
		var werkHeader = "<h1 class='main-title'>"+work.werkTitel+"</h1> <p class='sub-title' id='altTitel'> </p>";
		$('#showTitel').html(werkHeader);
		//Main Content: Abfassungszeitraum, Abfassungsort, Regionen, Editionshinweise und Werkinformationen
		var werkInfo = "<p><b>Abfassungszeitraum:</b> "+work.abfassungszeitraum+"</p><p><b>Abfassungsort:</b> "+work.abfassungsort+"</p><p><b>Region:</b><ul id='showRegion'></ul></p><p><b>Editionshinweise:</b> <p>"+work.editionshinweise+"</p><hr><p><b>Allgemeines </b></p>"+work.werkinformation+"</p></hr>";
		$('#showContent').html(werkInfo);
		//blaue Box: Autor mit Lebensdaten
		var verfInfo = "<div class='sidebar-module-inset'><h4>Verfasser</h4><p><span id='showAuthor'></span>("+work.lebensdatenVerfasser+ ")</br></p></div>";
		$('#showInfo').html(verfInfo);
		//Finden und Ausgeben der untergeordneten Inhalte
		$('#altTitel').append(work.alternativtitel);
		$('#showAuthor').append(work.autoren.replace(/, /g,'<br>'));
		$('#showRegion').append(work.regionen.replace(/, /g,'<br>'));
	}
	
	//Laden der Quellenansicht für die Vorkommnisse
	function displayQuelInfo(quel) {
		//Elemente leeren, um neuen Inhalt anzuzeigen
		$('#showTitel').empty();
		$('#showContent').empty();
		$('#showInfo').empty();
		$('#showMoreContent').empty();
		// Einfügen der XML-Inhalte ins Template
		//Header: QuellenID und Zitation
		var quelHeader = "<h1 class='main-title'>Quellenstelle: "+quel.quellenId+"</h1><p class='sub-title'>"+quel.zitation+"</p>"
		$('#showTitel').html(quelHeader);
		//Main-Content: zeitliche Angaben (Quellen + Wissenschaftlich), Inhaltsangabe, Volltext Original und Übersetzung, sowie Hinweise zur Übersetzung
		var quelInfo = "<p><b>zeitliche (Quellen-)Angabe: </b>" +quel.zeitangabeQuelle+"</p><p><b>zeitliche (wissenschaftliche) Einordnung: </b><span id='zeitwiss'></span></p><p><b>Inhaltsangabe:</b> " +quel.inhaltsangabe+"</p><hr> <p> <b>Volltext </b></p><p>"+quel.volltextOriginalsprache+"</p></hr><hr><p><b>Übersetzung:  </b></p><p>"+quel.volltextUebersetzung+"</p></hr><hr><p><b>Hinweise zur Übersetzung (Zitation):</b></p><p>"+quel.zitationUebersetzung+"</p></hr><br></br>";
		$('#showContent').html(quelInfo);
		//Blaue-Box: Werktitel, Abfassungszeitraum, Abfassungsort, Verfasser mit Lebensdaten
		var werk = "<div class='sidebar-module-inset'><h4> Werk </h4><p>"+work.werkTitel+"</p><p>"+work.abfassungszeitraum+"</p><p>"+work.abfassungsort+"</p><h5><b>Verfasser</b></h5><p><div id='showAuthor'></div> ("+work.lebensdatenVerfasser+")</p></div>";
		$('#showInfo').html(werk);
        //Zusätzliche Informationen zu den Quellen (von dem DFG-Projekt ergänzt): Geographische Stichworte, Angabe der Betiligten und Interaktion, Auffälligkeiten und Anmerkungen
		var moreInfo = "<div class='panel panel-default'><div class='panel-body'><p><b>geographisches Stichwort: </b><ul id='showGeoStichwort'></ul></p><p><b>Bericht über ein/mehrere Individuum/en oder Kollektive: </b><ul id='showBeteiligte'></ul></p><p><b>Interaktion (j/n): </b>"+quel.interaktion+"</p><p><b>Auffälligkeiten: </b><ul id='showAufaell'></ul></p><p><b>Suchbegriffe: </b><ul id='showSuchworte'></ul></p><p><b>Anmerkungen: </b></p><p>"+quel.anmerkungen+"</p></div></div>";
		$('#showMoreContent').html(moreInfo);
		//erneutes Aufrufen und ausgeben des Autoren für die blaue Info-Box
		$('#showAuthor').append(work.autoren.replace(/, /g,'<br>'));
		//Finden und Ausgeben der untergeordneten Inhalte
		var zeitangabeWissenschaft = [];
		for(var z = 0;z < quel.zeitangabeWissenschaft.length; z++) {
			zeitangabeWissenschaft[z] = quel.zeitangabeWissenschaft[z].datum;
		}
		$('#zeitwiss').append(zeitangabeWissenschaft.join(", "));
		var GeoStichwort = quel.geografischeStichworte;					//geographisches Stichwort als Liste
		var ort = GeoStichwort.split(", ");
		for (var i = 0; i < ort.length; i++){
			$('#showGeoStichwort').append('<li>'+ort[i]+'</li>');
		}
		var Beteiligte = quel.beteiligte;									//Beteiligte als Liste
		var Beteiligter = Beteiligte.split(", ");
		for (var b = 0; b < Beteiligter.length; b++){
			$('#showBeteiligte').append('<li>'+Beteiligter[b]+'</li>');
		}
		var Auffaelligkeiten = quel.auffaelligkeiten;						//Auffälligkeiten als Liste
		var Schlagwort = Auffaelligkeiten.split(", ");
		for(var s = 0; s < Schlagwort.length;s++){
			$('#showAufaell').append('<li>'+Schlagwort[s]+'</li>');	  	    	  
		}
		var Suchbegriffe = quel.suchbegriffe;								//Suchbegriffe als Liste
		var Suchwort = Suchbegriffe.split(", ");
		for(var u = 0; u < Suchwort.length;u++){
			$('#showSuchworte').append('<li>'+Suchwort[u]+'</li>');
		}
	}
*/
});

