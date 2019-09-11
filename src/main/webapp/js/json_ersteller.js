/* Code von Alexander Abboud. Die Ajax-Abfrage wurde nach dem Vorbild von Gwenlyn Tiedemann gebaut */

/* Diese Funktion wird nur benötigt, wenn die JSON für die Karte erstellt werden soll. Per Ajax-Abfrage wird die XML eingelesen und nur bei
zutreffenden Eigenschaften (Ort als Entität & wissenschaftliche Einordnung als Zeit) wird eine Zeile in die Konsole geschrieben, die so
als JSON-Objekt genutzt werden kann. */


/* Zu aller erst wird die XML eingelesen */	
function collectPlacesWithTimes(alle_orte){
	
        $.ajax({
            type: "GET",
            url: "data/Sarazenen_Final_Map_v0.1.xml",
            dataType: "xml",
            success: function(xml){
/*
	Eine Zeile der JSON soll beinhalten:
	ort_name, ort_location[], WerkId, WerkTitel, QuellenId, ZeitangabeWissenschaft_from, ZeitangabeWissenschaft_to, Auffaelligkeiten[]
	es soll eine Zeile pro Ort entstehen. Falls eine Quellenstelle mehrere Angaben beim Ort hat, so
	soll pro EntitaetTypeOrt eine Zeile mit der angegebenen Zeit entstehen. Falls es auch noch mehrere ZeitangabeWissenschaft existieren,
	so soll für jede unterschiedliche Zeitangabe auch eine Zeile entstehen


	>Quellenstelle01 - EntitaetTypeOrt [Bremen, Hannover] - ZeitangabeWissenschaft [2010-2011, 2013-2014]

	-> Quellenstelle01 - Bremen - 2010-2011
	-> Quellenstelle01 - Bremen - 2013-2014
	-> Quellenstelle01 - Hannover - 2010-2011
	-> Quellenstelle01 - Hannover - 2013-2014

	Die Zeit darf nicht leer sein. Wenn die Zeit leer ist, dann wird keine Zeile erstellt, da sich die Information dann nicht auf der 
	Karte darstellen lässt
*/
             	

		//	var quellen_ohne_ort = 0;
		    var ort_name, ort_typ;
			var ort_einzeln;
			var ort_location = [1];	
            var WerkId, WerkTitel;  
			var QuellenId;
			var ZeitangabeWissenschaft;
			var ZeitangabeWissenschaft_from; // hier liegen zwar mehrere Werte, allerdings soll jede Zeitangabe zu einem eigenen Objekt im Array werden
			var ZeitangabeWissenschaft_to;
			var Auffaelligkeiten;
			var AuffaelligkeitenArray = [];
			var tempGeokoordinaten;
			var parseDate = d3.time.format("%Y-%m-%d").parse;
			
			
			var dokumente = $(xml).find('Dokumente');
			
			for (var q = 0; q < dokumente.length; q++) {
				WerkId = $(dokumente[q]).find('WerkId').text();
				WerkTitel = $(dokumente[q]).find('WerkTitel').text();
				var quelle = $(dokumente[q]).find('Quelle');
				
				
				for (var r = 0; r < quelle.length; r++) {
					QuellenId = $(quelle[r]).children('QuellenId').text();
					ZeitangabeWissenschaft = $(quelle[r]).find('ZeitangabeWissenschaft Datum');
					Auffaelligkeiten = $(quelle[r]).find('Auffaelligkeiten Schlagwort');
					
				// Ein Array für die Auffälligkeiten	
					for (var a = 0; a < Auffaelligkeiten.length; a++) {
						AuffaelligkeitenArray[a] = $(Auffaelligkeiten[a]).text();
						auffaelligkeit_einzeln = $(Auffaelligkeiten[a]).text();
					//	console.log('{"auffaelligkeit": '+'"'+auffaelligkeit_einzeln+'"'+', "werk_id": "'+WerkId+'", "werk_titel": "'+WerkTitel+'", "quellen_id": "'+QuellenId+'"},\n');
					}
					var AuffaelligkeitenArrayJSON = '"' + AuffaelligkeitenArray.join('","') + '"';
					
					ort_name = $(quelle[r]).find('Entitaeten Entitaet[Type="Ort"]');
					
					if (ZeitangabeWissenschaft.length != 0) {
						
						for (var s = 0; s < ZeitangabeWissenschaft.length; s++) {
							ZeitangabeWissenschaft_from = $(ZeitangabeWissenschaft[s]).attr('From');
							ZeitangabeWissenschaft_to = $(ZeitangabeWissenschaft[s]).attr('To');
							ZeitangabeWissenschaft_fromAsDate = parseDate(ZeitangabeWissenschaft_from);
							ZeitangabeWissenschaft_ToAsDate = parseDate(ZeitangabeWissenschaft_to);
							ZeitangabeWissenschaft_fromAsMs = +ZeitangabeWissenschaft_fromAsDate;
							ZeitangabeWissenschaft_ToAsMs = +ZeitangabeWissenschaft_ToAsDate;
							
						// Damit die "Ausreißerdaten" nicht die Zeitleiste in die Länge ziehen	
						if(ZeitangabeWissenschaft_fromAsMs >= -43106864400000 && ZeitangabeWissenschaft_ToAsMs <= -27233801999999) {
							
							if (ort_name.length != 0) {
								for (var t = 0; t < ort_name.length; t++) {
									ort_einzeln = $(ort_name[t]).find('Name').text();

										if (alle_orte[ort_einzeln] != undefined){
										//	quellen_ohne_ort++;
										//	console.log(quellen_ohne_ort);
										
										/*
											Da es bei Javascript standardmäßig keine Ausgabe in Textform gibt, werden die Zeilen in die Konsole geschrieben.
											Sie können dann in eine JSON rauskopiert und anschließend eingebunden werden.
										*/
										// console.log('{"circle":\n{"coordinates": ['+alle_orte[ort_einzeln]+'], "werk_id": "'+WerkId+'", "werk_titel": "'+WerkTitel+'", "quellen_id": "'+QuellenId+'", "period_from": "'+ZeitangabeWissenschaft_from+'", "period_to": "'+ZeitangabeWissenschaft_to+'", "place": "'+ort_einzeln+'", "auffaelligkeiten": ['+AuffaelligkeitenArrayJSON+']}},\n');
										}
								}
							} else {
							/* Hier darf keine Ausgabe erfolgen, da die Punkte nicht auf der Karte angezeigt werden können */
							ort_einzeln = undefined;  
							// console.log('{"circle":\n{"coordinates": ['+alle_orte[ort_einzeln]+'], "werk_id": "'+WerkId+'", "werk_titel": "'+WerkTitel+'", "quellen_id": "'+QuellenId+'", "period_from": "'+ZeitangabeWissenschaft_from+'", "period_to": "'+ZeitangabeWissenschaft_to+'", "place": "'+ort_einzeln+'", "auffaelligkeiten": ['+AuffaelligkeitenArrayJSON+']}},\n');  				
							}
						}						
						}
					} else {
					// console.log("Keine Zeit "+q+" r "+r);	
					}
					
				AuffaelligkeitenArray = [];
				}
	  	    }
			
            },
            error: function() {
            alert("An error occurred while processing XML file.");
            }
            }); // Ende Ajax xml Sarazenen
};