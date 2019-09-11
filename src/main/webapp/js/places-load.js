/*  
	Angepasster Code von Gwenlyn Tiedemann, Code für die Karte dabei nach dem Vorbild von Alex Abboud gebaut.
	Code angepasst von Andreas Gálffy
*/

/* 		In der Tabelle sind alle Spalten sortierbar und es besteht die Möglichkeit sie zu durchsuchen.
 * 		Alternativnamen sollten einklappbar sein, leider funktioniert die Funktion nicht mehr und Fehler konnte nicht mehr rechtzeitig behoben werden.
 * Es besteht die Möglichkeit sich den Ort auf einer Karte anzeigen zu lassen. Diese Karte wird in einem Popup geöffnet.
 * Bei anklicken weiterer Orte, werden diese auf der Karte ergänzt.
 * Auch bei den Orten kann man sich in einer Liste die Quellen anzeigen zu lassen, in denen der gewählte Ort vorkommt.
 * 		Allerdings können zu manchen Orten keine Quellen aufgelistet werden, da diese in der XML nur in der Ortsliste genannt werden,
 * 		aber nicht in den Entitäten der Quellen und somit keine Zuweisung zu einer Quelle besitzen.
 * Die Vorkommnisliste wird rechts neben der Tabelle angezeigt und bewegt sich mit, wenn man die Tabelle runterscrollt.
 * Wenn man die Werkstitel in den Tabellen anklickt, wird der Inhalt der Quelle angezeigt.
 * Hier eine vierte Variante der Quellendarstellung: [andere Varianten: 1. Quellenverzeichnis, 2. Verfasserregister, 3. Personenregister]
 * 		Die Quellendarstellung öffnet sich auch in einem Popup. 
 * 		Mehrere Popups können gleichzeitig geöffnet werden, sodass sich die Quellen miteinander vergleichen lassen.
 * 		Leider noch nicht vollkommen funktionstüchtig. */
 
 $(document).ready(function(){
	//seitenweit geltende Parameter
	//Search-PlugIn für die dynamisch geladene Tabelle (Orte)
	var qs = $('input#search').quicksearch('table tbody tr ');
	//verstecken der Map, bis diese aufgerufen wird
	var work = null;
	
	/*Code für die Karte von Alex Abboud*/
	// Karte hinzufügen
	var map = L.map('map-canvas').setView([45.82727, 15.99390], 18);
	mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
	L.tileLayer(
		'https://api.mapbox.com/styles/v1/phnny/cj0190ei000pf2spfvojl4jbz/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicGhubnkiLCJhIjoiY2owMTdmdWVnMDY0ajMyb3hscG9pcW5lMCJ9.yE1KMiypYpo0IH1nDejtYQ', {
		attribution: '&copy; ' + mapLink + ' Contributors',
		maxZoom: 18,
	}).addTo(map);

	//Map SVG Layer initalisieren
	L.svg().addTo(map);

	/* We simply pick up the SVG from the map object */
	var svg = d3.select("#map-canvas").select("svg").attr("class", "mapsvg");
	var g = svg.append("g").attr("class", "date");
	
	var color = d3.scale.category10();
	var init = 0;
	var counterUpdate = 0;
	// Set the dimensions of the canvas
		width = 640,
		height = 480;
	
	// Die Skalen
	var rScale = d3.scale.linear().range([0, 50]); //bestimmt die Skalierung der Kreise

	var alle_orte = {};
	
//------------------------------------------------------------ Eventbereich ----------------------------------------------------------------------------

	//Onclick öffnen der Karte
	$(".container-fluid").on("click",".viewOnMap",function(){
		var place = places[$(this).attr("data-index")];
		//Durch anklicken eines neues Ortes wird dieser auf der Karte hinzugefügt
		/* Grundlagen Code für die Karte von Alex Abboud, angepasst und eingebaut von Gwenlyn Tiedemann*/
		//$("#map-places .modal-body").html(map);
		// Die Icons mit Schatten für die Pins auf der Karte
		var smallIcon = L.icon({
			iconUrl: '/images/map_pin-512.png',
			shadowUrl: '/images/marker-shadow.png',
			iconSize:     [25, 25], // size of the icon
			shadowSize:   [20, 20], // size of the shadow
			iconAnchor:   [12, 23], // point of the icon which will correspond to marker's location
			shadowAnchor: [6, 20],  // the same for the shadow
			popupAnchor:  [1, -21] // point from which the popup should open relative to the iconAnchor
		});
		var selected_ort = place.name;
		var selected_typ = place.type;
		var selected_location = [1];
		selected_location[0] = place.lat;
		selected_location[1] = place.lng;
		geo_als_string = selected_location.join();
		alle_orte[selected_ort] = geo_als_string;
		L.marker([selected_location[0],selected_location[1]], {icon: smallIcon}).addTo(map).bindPopup(selected_ort+" ("+selected_typ+")");
		map.setView([place.lat+15,place.lng-35], 4);
		$("#map-places").modal();
		$("#map-places .modal-content").animate({width:"800px",height:"600px"});
	});
	
});