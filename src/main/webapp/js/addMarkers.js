/*
	Code von Alexander Abboud. Die Ajax-Abfrage für den Ort wurde nach dem Vorbild von Gwenlyn Tiedemann gebaut. Die clickCompare
	Funktion sowie die Darstellung der Quelle wurde von Gwenlyn Tiedemann gebaut und von mir durch einen Einbezug der Zeitangaben
	(des Sliders und der Quellen) sowie der Auffälligkeitsangaben (um die Textboxen später ansprechbar zu machen) erweitert.
			Anmerkung Tiedemann: Quellendarstellung entspricht einer gespiegelten Variante 2.
*/

//globale Parameter
var parseDate = d3.time.format("%Y-%m-%d").parse;
var viewedWork = null;

/* 
	Folgende Funktion ist für die Erstellung der Marker zuständig. Es werden mit Hilfe einer Ajaxabfrage alle <Ort>-Elemente von <Orte>
	aus dem Ortsregister eingelesen. Es werden sowohl die Marker erstellt, als auch ein "Lexikon" mit den Orten und zugehörigen Geokoordinaten,
	auf welches bei der JSON Erstellung zurückgegriffen wird.
*/
function addMarkers(alle_orte, map){
	// Die Icons für die Pins auf der Karte werden hier eingelesen
	var smallIcon = L.icon({
		iconUrl: '/images/ma.svg',
		iconSize:     [22, 40], // Größe des Icons
		iconAnchor:   [10, 38], // Der Punkt des Icons, der auf der Geokoordinate liegt (in diesem Fall die untere Spizte)
		popupAnchor:  [1, -37] // Der Punkt von dem aus das Popup geöffnet wird
	});
	/* Ein Array für die Markerelemente */			
	var frage = [];	
	var alternativnamen, altname;
	var entitaet, entitaetlist;
	var ort_name, ort_typ, geo_als_string;
	var ort_location = [];           	
	/* Es werden die Ortsangaben aus der XML eingelesen. Hierfür werden die entsprechenden Tags eines Orts durchgegangen 
	(Ort, Geokoordinaten und Typ) */
	for (var i = 0; i < places.length; i++) {
		var currOrt = places[i];
		//console.log(currOrt.lat+" "+currOrt.lng);
		ort_name = currOrt.name;
		ort_typ = currOrt.type;
		alt_names = "";
		if(currOrt.altNames.length > 0)
			alt_names = " ("+currOrt.altNames.join(", ")+")";
		ort_location[0] = currOrt.lat;
		ort_location[1] = currOrt.lng;
		/*
			Die Geokoordinaten werden als ein String gespeichert und dann in einem Objekt unter dem Namen des Orts in einem Array abgelegt
			Somit kann auf die Geokoordinate zugegriffen werden, wenn sie für die JSON Erstellung notwendig ist
		*/
		geo_als_string = ort_location.join();
		alle_orte[ort_name] = geo_als_string;
		/* 
		Die einzelnen Marker. An dieser Stelle wird direkt festgelegt, dass sie das oben definierte Icon nutzen. Auch bekommt der Marker
		die aktuell in den Variablen gespeicherten Geokoordinaten des Ortes. 
		Der Text des Popups (Ort und Typ des Orts) wird auch an dieser Stelle festgelegt.
		Wird ein Ort angeklickt, so öffnet sich außerdem der Abschnitt mit der Übersicht, wo er auftaucht
		*/
		frage = L.marker([ort_location[0],ort_location[1]], {icon: smallIcon}).addTo(map)
		.bindPopup(ort_name+alt_names+" ("+ort_typ+")")
		.on('click',clickCompare.bind($('#vorkommnis_'+i), currOrt));
		/*
		Um die Marker ansprechbar zu machen, bekommen sie eine Klasse. Sie werden ansprechbar gemacht, damit sie ein- und ausgeblendet werden können:
		Nur aktive Marker (bedeutet es existieren Quellenstellen zu dieser Zeit und diesem Ort) werden eingeblendet. Hierfür wird bei der Quellenauswertung der mapJS
		ein Array mit den aktiven Orten gefüllt. Anschließend werden die aktiven Marker über das Style-Attribut "display:block" eingeblendet.
		*/
		L.DomUtil.addClass(frage._icon, (parseClass(ort_name)+' '+parseClass(ort_typ)));
		d3.select("#map").selectAll("img."+parseClass(ort_name)).style("display", "none");
	}
	// Ende Ajax xml Sarazenen
	return alle_orte;
}

/*
	Diese Funktion wird ausgeführt, sobald ein Ort angeklickt wurde. Es werden daraufhin die Quellenstellen aufgelistet, die zu diesem Ort
	existieren. Die Ajaxabfrage zur Darstellung	wurde von Gwenlyn Tiedemann gebaut, von Andreas Gálffy angepasst und durch eine Berücksichtigung 
	der Zeit- und Sliderangaben, sowie der Klassenhinzufügung von mir erweitert.
*/
function clickCompare(ort){
	$('#ausgabe').show(); 
	/* Zeiten des Slider einlesen um damit später den Abgleich machen zu können */	
	var sliderStart = $('#slider3textmin').text();
	var sliderEnde = $('#slider3textmax').text();	
	if (sliderStart == "") { sliderStart = "1255";}
	if (sliderEnde == "") { sliderEnde = "1399";}
	/*
		Umrechnung der Textangabe mit parseDate in eine Datumsform von D3, mit anschließender Transformation in Milisekunden.
		Somit kann mit den Zeitwerden gerechnet und die Werte mit den Slidern verglichen werden. Es werden nur die aktiven Einträge aufgeglistet
	*/		
	sliderStartAsDate = new Date(sliderStart);
	sliderEndeAsDate = new Date(sliderEnde);
	sliderStartAsMS = +sliderStartAsDate;
	sliderEndeAsMS = +sliderEndeAsDate;
	var slider = [sliderStartAsMS, sliderEndeAsMS];
	$.ajax({
		type: "POST",
		url: "getWorksListByKey/"+ort.id+"/place",
		success: function(response) {
			console.log(response);
			$('#showOrt').empty();
			$('#showSources').empty();
			$.each(response,function(k,v){
				let work = v.work;
					let quelle = v.source;
					werktitel = work.mainTitle;
					var ZeitangabeWissenschaft = quelle.timeScientific;
					var foo = [];
					/* 
						Ein Array für die Auffälligkeiten wird hier erstellt, um es später als Klassenbezeichnung der entsprechenden Textbox 
						auszugeben.
						Somit ist ein einfärben / Kasten setzen der Quellenstellen möglich, in denen die Auffälligkeiten vorkommen
					*/
					var AuffaelligkeitenArrayJSON = '"' + quelle.remarkabilities.join(' ') + '"';
					/* 	Für die Darstellung in der Seitenleiste werden die gesamten Werte von Time_from bis Time_to genutzt,
						da die Quellenstellen sowieso nur einmal ausgegeben werden. Während auf der Karte jedes Datum als eigener Kreis angezeigt 
						wird, wird die Textausgabe nur einmal erfolgen
					*/
					
					if (typeof(ZeitangabeWissenschaft) !== "undefined") {
						var ZeitangabeWissenschaft_fromInDate = new Date(parseDate(ZeitangabeWissenschaft.from));
						var ZeitangabeWissenschaft_toInDate = new Date(parseDate(ZeitangabeWissenschaft.to));
						var ZeitangabeWissenschaft_fromInMS =+ZeitangabeWissenschaft_fromInDate;
						var ZeitangabeWissenschaft_toInMS =+ZeitangabeWissenschaft_toInDate;
						foo.push([ZeitangabeWissenschaft_fromInMS, ZeitangabeWissenschaft_toInMS]);
						//console.log(foo);
						for (kl = 0 ; kl < foo.length ; kl++) {
							/* 	
								Nur, wenn die ausgewählten Sliderzeiten zutreffend sind, wird eine Textausgabe hergestellt. 
								In der Auflistung erscheint die Quellenstelle nicht doppelt, selbst, 
								wenn es zwei passende Daten gibt, da die if-Schleife durch break - im Falle eines Fundes in der Quelle - 
								abgebrochen wird
							*/
							
							if ((foo[kl][0] >= slider[0]) && (foo[kl][1] <= slider[1])) {
								var quellenid = quelle.sourceId;
								var ortHeader = "<p>In folgenden Quellen wird der Ort '<b>"+ ort.name +"</b>' zur Zeit <b>"+sliderStart+"</b> bis <b>"+sliderEnde+"</b> erwähnt:  </p>";
								$('#showOrt').html(ortHeader);
								$('#showSources').append("<p class="+AuffaelligkeitenArrayJSON+"> <span><a class='loadWorkPopup' data-work='"+work.workId+"' href='#'> "+work.workId+": "+werktitel+"</a></span>" +
										" <br> Quellenstelle: "+quellenid+ " </p>");
								break;
							}	 //if-Ausgabe
						} // for kl
					} else {
					 // console.log("Keine Zeit");	
					}
			});
		},
		error: function() {
			alert("Fehler beim Laden der Quellen!");
		}
	});
	/* Falls bereits Auffälligkeiten ausgewählt wurden, wird durch Aufruf der folgenden Funktion gewährleistet, dass die farblichen Markierungen korrekt bleiben */
	quellen_ausgeben("vonOrt","");
} // /.Function clickCompare
//Ende WerkLoad