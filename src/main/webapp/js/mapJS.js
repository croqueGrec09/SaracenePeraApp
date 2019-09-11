/* Code von Alexander Abboud */

$(document).ready(function(){
	$('#quellAnsicht').hide(); 
	$('#ausgabe').hide(); 


/* Die mit Mapbox erstellte und von Grenzen, Straßennamen, etc aufgeräumte Karte hinzufügen und mit Leaflet einbinden */
	var map = L.map('map').setView([45.82727, 15.99390], 4);
	mapLink = 
		'<a href="http://openstreetmap.org">OpenStreetMap</a>';
	L.tileLayer(
		'https://api.mapbox.com/styles/v1/phnny/cj0190ei000pf2spfvojl4jbz/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicGhubnkiLCJhIjoiY2owMTdmdWVnMDY0ajMyb3hscG9pcW5lMCJ9.yE1KMiypYpo0IH1nDejtYQ', {
		attribution: '&copy; ' + mapLink + ' Contributors',
		maxZoom: 18,
		}).addTo(map);

/* SVG Layer für die Karte wird initialisiert */
	map._initPathRoot()    

/* SVG des Map Objekts für die Zeichnung der Kreise wird genutzt */
	var svg = d3.select("#map").select("svg").attr("class", "mapsvg");
	var g = svg.append("g").attr("class", "date");

/* Prüfvariable die später die initiale Ausführung der Kartenfunktion gewährleistet */	
	var init = 0;
	
/* 
	Zu allererst werden die Marker für die vorkommenden Orte erstellte. Hier wird auf die mit Geodaten ausgestatteten
	<Ort> Angaben zu Beginn der XML zugegriffen. Die Ergebnisse liefert die Funktion addMarkers() und werden in dem Objekt alle_Orte gespeichert
*/
	var alle_orte = {};
	alle_orte = addMarkers(alle_orte, map);
	
/* Zum Erstellen der JSON muss die folgende Funktion aktiviert werde:	*/
	//collectPlacesWithTimes(alle_orte);


$(document).ready(function(){
// lese die JSON mit den Angaben ein, die für die Erstellung von Kreisen und Aktivierung von Makern auf der Karte zuständig sind.

	d3.json("circles", function(collection) {
		
		// falls die deutschen Übersetzungen der Zeiten wichtig sind, so kann die folgende Zeile aktiviert werden um die Begriffe aus der herlpers.js zu nehmen
		// d3.time.format = myFormatters.timeFormat;
		
		var parseDate = d3.time.format("%Y-%m-%d").parse;
		var showDate = d3.time.format("%Y");
		
		
		collection.objects.forEach(function(d) {
			d.parsedPeriodFrom = parseDate(d.periodFrom);
			d.parsedPeriodTo = parseDate(d.periodTo);
			d.remarkabilities = d.remarkabilities;
			d.tradeGoods = d.tradeGoods;
			d.workId = d.workId;
			d.workTitle = d.workTitle;
			d.sourceId = d.sourceId;
			d.place = d.place;
			d.color = d.color;
		});
		

/*
	Für x-Achsenerstellung werden sowohl die period_from als auch die period_to Werte berücksichtigt, 
	da die Ergebnisse in Intervallen und nicht nur punktuell angezeigt werden. Dementsprechend muss
	die x-Achse lang genug sein, um die frühste Startzeit und die späteste Endzeit darzustellen.		

	Hier wird dafür gesorgt, dass ein Array aufgebaut wird, welches die period_from
	und period_to Werte sammelt um daraus den insgesamt minimalsten und maximalsten Wert zu ziehen und
	darauf bauend die x-Achse erstellt (mit Hilfe von concat).
*/
	//Sarazenen
	let start;
	let init;
	if(window.location.href.indexOf("SaraceneApp") > 0) {
		start = [-38909725200000, -36953197200000];
		init = [-38909725200000, -36953197200000];
	}
	//Pera
	else if(window.location.href.indexOf("PeraApp") > 0) {
		start = [ -22405420800000,-22342348800000 ];
		init = [ -22405420800000,-22342348800000];
	}
			d3.select('#slider3')
			.call(d3.slider()
			.scale(d3.time.scale()
			.domain(d3.extent(
			[].concat(collection.objects.map(function(d) { return d.parsedPeriodFrom; 
			}), collection.objects.map(function(d) { return d.parsedPeriodTo; 
			})
			)// End of Concat
			)// End of Extent
			)// End of Domain
			)// End of Scale
			.axis((d3.svg.axis().orient("bottom").ticks(36).tickFormat(d3.time.format("%Y"))))
			.value( start ) // Startwert der Slidereinstellung
			.on("slide", function(evt, value) {
			dateStart = new Date(value[ 0 ]); // Zeit im value Array liegt als Millisekunden vor und muss in Time geparst werden
			dateEnd = new Date(value[ 1 ]);
			d3.select("#slider3textmin").text(showDate(dateStart));
			d3.select("#slider3textmax").text(showDate(dateEnd));
			d3.select("#bis").text(" bis ");
			d3.select("#zeitraum").text("Zeitraum: ");
			
			timeUpdate(value);
			})) // End of Call
			
			
			/* Die Textausgabe am Slider */
				.selectAll("text")
				.style("text-anchor", "end")
				.attr("dx", "-.8em")
				.attr("dy", ".15em")
				.style("fill", "#c8c8c8")
				.attr("transform", function(d) {
				return "rotate(-65)"
				});
		
		var feature;
		
		/*
			Ein double-nested Array wird hier erstelle. Die einzelnen Objecte der JSON werden neu sortiert: Erstes Sortierkriterium ist die
			period_from Zeit. Es werden alle Elemente, die die selbe period_from Zeit haben unter der selben "Überschrift" (dem Key) sortiert.
			Als zweiten Key, also zweites Sortierkriterium innerhalb eines Astes, werden die period_to Werte genutzt. Somit lässt sich durch die Gruppierung
			der Datensatz effizienter durchsuchen (nur wenn der Key innerhalb der Zeit liegt, gebe die Daten aus
		*/
		
		var dNest = d3.nest()
			.key(function(d) {return parseDate(d.periodFrom); })
			.key(function(d) {return parseDate(d.periodTo); })
			.entries(collection.objects);

		/*
			Jedes Objekt wird als Datenset gespeichert. Hier werden die Lat/Lng Angaben als Leaflet Koordinatsangaben gespeichert. Somit lassen sich die einzelnen
			Kreise die gezeichnet werden, auch der Karte immer zu der korrekten Koordinate zuordnen
		*/
		
		dNest.forEach(function(s) {
		 s.values.forEach(function(q) {
			 q.values.forEach(function(d) {
				 
		d.LatLng = new L.LatLng(d.coordinates[0],
								d.coordinates[1])})
															
		})	// Ende zweites Nest values	q	
		});	


/* Da die Slider nicht auf 0 stehen, der initiale Durchlauf mit den oben eingetragenen values, ehemals  */
	if (init==0) {
	value = ( init );
	timeUpdate(value);
	init++;
	}
	
		 
	 
	/* Mit dieser Funktion werden die Kreise neu ausgerichtet. Dafür wird der Punkt des circles auf der Karte anhand der LatLng Angabe neu berechnet */
		function update() {
			d3.select("#map").selectAll("g").selectAll("circle").attr("transform", 
			function(d) {

				return "translate("+ 
					((map.latLngToLayerPoint(d.LatLng).x)+1) +","+ 
					((map.latLngToLayerPoint(d.LatLng).y)-27) +")";
				}
			)
		}
	
	
/* Sobald einer der Slider bewegt wird, sollen Kreise auf der Karte erstellt werden und sich aktualisieren */

	function timeUpdate(value) {
		
		var plo;

/* Räume zunächst bestehende Elemente auf, indem die <g> Container entfernt werden */		
		d3.select(".mapsvg")
		.selectAll("g")
		.remove();

/* Verstecke alle Marker */		
		d3.select("#map")
		.selectAll("img.leaflet-marker-icon")
		.style("display", "none");

/* Füge pro period_to key des Datennests ein neues <g> Containerelement ein. In dieses kann gezeichnet werden */		
		g =	svg.selectAll("g")	
		  .data(dNest)
		.enter().append("g")
		  .attr("class", function (d) { return d.key });
		
		
/*		  
Es sollen die Punkte auf der Karte nicht nur angezeigt werden, wenn der Slider exakt die
ausgewählten Punkte (=Zeiten) trifft, sondern alles in der Range zwischen slider1 und slider2.
Deswegen wird die Millisekundenangabe der period_from und period_to, sowie der sliderpoint Werte errechnet
und mit einer einfachen if-Bedingung werden nur die passenden angezeigt	 

- Sliderpoint1 prüft, ob das Event nach dem Startdatum (period_from) begonnen hat
- Sliderpoint2 prüft, ob das Event vor dem Enddatum (period_to) beendet wurde
 -> Zusammen: Welche Quellen wurden in dem ausgewählten Zeitraum fertiggestellt?

*/	
		var orteMarker = [];  
		var oFund;
		
		var sliderpoint1AsMS = +value[0];
		var sliderpoint2AsMS = +value[1];
		var sliderpoint1AsDate = new Date(value[0]);
		var sliderpoint2AsDate = new Date(value[1]);
		  
/*
	Kreise werden durch die Klassenzugehörigkeit auf der Karte dargestellt. Trifft eine Klasse zu, so ändert sich der Radius des Kreises von 0 auf 10
	Damit die Kreise die Korrekten Klassen beinhaltet, müssen die Angaben klassentauglich gemacht werden (Die Leerzeichen innerhalb der Auffälligkeiten
	müssen entfernt werden, da sonst eine Auffälligkeit mit Leerzeichen als zwei gewertet werden. Außerdem müssen nicht zulässige Zeichen entfernt werden,
	da es sonst zu fehlerhaften Klassenbezeichnungen des circles kommt
	
	D3 ordnet einem circle Element über DOM ein Datenelement zu. Hierdurch wird die Manipulation sowie die Verknüpfung zwischen Daten und Darstellung möglich
*/
	
	g.each(function(period_from_key, i) {
		pKeyAsDate = new Date(period_from_key.key);
		
		var pKeyAsMS = +pKeyAsDate;
		var auff_arr = [];
		var tochange;
		feature = d3.select(this).selectAll("circle"); // feature ist eine selection
		

			if (pKeyAsMS >= sliderpoint1AsMS) {

				for (tert = 0; tert < period_from_key.values.length; tert++ ) {
				pKey02AsDate = new Date(period_from_key.values[tert].key);
				pKey02AsMS = +pKey02AsDate;
				
						if (pKey02AsMS <= sliderpoint2AsMS) {
						//console.log(pKey02AsMS);
						feature.data(function(d, i) { return d.values[tert].values; } )
					  .enter().append("circle")
						.attr("class", (function(d) {
						// Alle aktiven Orte für die Markeraktivierung sammeln, wenn der Ort nicht im Array steht, füge ihn hinzu
						//console.log(d.workId+"/"+d.sourceId+" "+d.place);
						if (!(oFund = orteMarker.includes(parseClass(d.place)))) {
								orteMarker.push(parseClass(d.place));
							}
							
							for (v=0 ; v < d.remarkabilities.length; v++) {							
								tochange = d.remarkabilities[v];
								tochanger = parseClass(tochange);
								auff_arr.push(tochanger);
							}
							
							for (v=0 ; v < d.tradeGoods.length; v++) {							
								tochange = d.tradeGoods[v];
								tochanger = parseClass(tochange);
								auff_arr.push(tochanger);
							}
							
							auff_arrKopie = Array.from(auff_arr);
							auff_arr = [];
							return auff_arrKopie.join(' ');}  ))
							
					//	.style("stroke", "black")  
						.style("opacity", .25)
						.attr("r", 0)
						.style("fill", function(d) { return d.color; })
						.attr("title", (function(d) { return d.workId+". "+d.workTitle+" - Quellenstelle: "+d.sourceId+ " bei Ort: "+d.place ;}  ))
					
			} // Ende: if-Schleife Nummer 2		
			} // Ende: for-Schleife
			
		}; // Ende: if-Schleife Nummer 1	
	}); // Ende: g.each
	
	map.on("viewreset", update);
	update();

	
	// Die zugehörigen Marker aktivieren
		for (uh = 0 ; uh < orteMarker.length ; uh ++) {		
			d3.select("#map").selectAll("img."+orteMarker[uh]).style("display", "block");	
		}	
	
/* Die eventuell vorhandenen Auffälligkeitskreise einfärben	*/
	quellen_ausgeben("vonSlide","");	
	};
});

});


});
