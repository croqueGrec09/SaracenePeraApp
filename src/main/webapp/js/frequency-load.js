/*
	Code von Gwenlyn Tiedemann
	angepasst von Andreas Gálffy
*/

/* Der Bar Chart visualisiert die Häufigkeit der Vorkommnisse eines Objektes.
 * Es lassen sich drei Charts anzeigen, je zu der Auflistung von Personen, Orten und Auffälligkeiten.
 * Wenn man einen der Balken oder die dahinter stehende Anzahl der Vorkommnisse anklickt, 
 * wird rechts eine Auflistung der Quellen angezeigt, in denen das gewählte Objekt vorkommt.
 * Klickt man wiederum eine der Quellen in der Liste an, wird der Inhalt dieser Quelle unter dem Bar Chart gezeigt.
 * Die zugehörigen Quellenstellen zu der Quelle werden links neben dem Quelleninhalt angezeigt und können durch Anklicken auch angezeigt werden.
 * Rechts neben der Quellendarstellung befindet sich weiterhin die Auflistung der Vorkommnisse.*/
 
$(document).ready(function(){
	//Bar Chart	Grundlage
	var colors = ['#0000b4','#0082ca','#0094ff','#0d4bcf','#0066AE','#074285','#00187B','#285964','#405F83','#416545','#4D7069','#6E9985'];
	var grid = d3.range(5).map(function(i){ //Anzahl graue Streifen. Siehe Zeile 65!
		return {'x1':0,'y1':0,'x2':0,'y2':4500};
	});
	var xscale = d3.scale.linear();
	var barchart = d3.select('#bar-chart').append('svg').attr({'width':1200,'height':5000});
	var currArray = [];
	var currType = "";
	
//------------------------------------------------------------ Eventbereich ----------------------------------------------------------------------------

	$(".container-fluid").on("click","#frequPers",function(){
		getFrequencies("person");
	});
	
	$(".container-fluid").on("click","#frequOrt",function(){
		getFrequencies("place");
	});
	
	$(".container-fluid").on("click","#frequAuf",function(){
		getFrequencies("remarkability");
	});
	
	$(".container-fluid").on("click","#frequHand",function(){
		getFrequencies("tradeGoods");
	});
	
//------------------------------------------------------------ Funktionsbereich ----------------------------------------------------------------------------
	
	function getFrequencies(map) {
		currType = map;
		$.ajax({
			type: "GET",
			url: "getFrequencies/"+map,
			success: function(response){
				currArray = [];
				if(currType !== "remarkability" && currType !== "tradeGoods") {
					//console.log(response);
					for(let r = 0;r < Object.keys(response).length;r++){
						//console.log(r);
						let currEnt = JSON.parse(Object.keys(response)[r]);
						console.log(JSON.parse(Object.keys(response)[r]));
						currArray.push(currEnt.id);
					}
				}
				else {
					for(let r = 0;r < Object.keys(response).length;r++){
						//console.log(r);
						let currEnt = Object.keys(response)[r];
						console.log(Object.keys(response)[r]);
						currArray.push(currEnt);
					}
				}
				$('#bar-chart').show();
				$('g').empty();
				$('#viewOccurence').empty();
				$('#workView').empty();
				var yscale = d3.scale.linear().domain([0,Object.keys(response).length]).range([0,4500]); //Abstand zwischen den Begriffen. Für Pera verringert; muß proportioniert werden
				var colorScale = d3.scale.quantize().domain([0,Object.values(response).length]).range(colors);
				var grids = barchart.append('g').attr('id','grid').attr('transform','translate(350,57)')//positionierung der Streifen
				.selectAll('line').data(grid).enter().append('line')
				.attr({'x1':function(d,i){ return i*10; },
						'y1':function(d){ return d.y1; },
						'x2':function(d,i){ return i*35; },
						'y2':function(d){ return d.y2; },
				}).style({'stroke':'#adadad','stroke-width':'1px'});
				//Y-Axe mit Beschriftung
				var	yAxis = d3.svg.axis();
				yAxis.orient('left').scale(yscale).tickSize(1)
				.tickFormat(function(d,i){
					if(currType !== "remarkability" && currType !== "tradeGoods") {
						if(typeof(Object.keys(response)[i]) !== "undefined") {
							const currEnt = JSON.parse(Object.keys(response)[i]);
							return currEnt.name;
						}
					}
					else {
						if(typeof(Object.keys(response)[i]) !== "undefined") {
							console.log(Object.keys(response)[i]);
							return Object.keys(response)[i];
						}
					};
				})
				.tickValues(d3.range(800)); //800 Namen an der Y-Achse möglich. Hoch gesetzt, falls Erweiterung

				var y_xis = barchart.append('g')
        							.attr("transform", "translate(350,57)") //Positionierung
        							.attr('id','yaxis')
									.call(yAxis)

				//Balken hinzufügen
				var chart = barchart.append('g').attr("transform", "translate(350,40)") //Positionierung
        								.attr('id','bars')
        								.selectAll('rect')
        								.data(Object.values(response))
        								.enter()
        								.append('rect')
        								.attr('height',10)
        								.attr({'x':	0,'y':function(d,i){ return yscale(i)+10; }})
        								.style('fill',function(d,i){ return colorScale(i); })
        								.attr('width',function(d){ return 0; })
        								.on("click", clickCompare); //Balken anklickbar
        			
				//Transition der Balken bestimmen
				var transit = barchart.selectAll("rect")
        							    .data(Object.values(response))
        							    .transition()
        							    .duration(3000) 
        							    .attr("width", function(d) {return d*10; });
        								
				//Zahlen zum Balken hinzufügen
				var transittext = barchart.append('g')
        							.attr('id','text')
        							.selectAll('text')
        							.data(Object.values(response))
        							.enter()
        							.append('text')
        							.attr({'x': 500, 'y': function(d,i){return yscale(i)+59; }})
        							.text(function(d){ return d;}).style({'fill':'#808080', 'font-size': '14px'})		//Text Farbe noch ändern!!!
        							.on("click", clickCompare); //Zahlen anklickbar
			},
			error: function() {
				alert("Fehler beim Laden der Dateien!");
			}
		});
	}
	
	function clickCompare(count,rowno){
		console.log(currType);
		var term = currArray[rowno];
		var url = "";
		switch(currType) {
			case "person": url = "getSourcesByKey/"+term+"/person";
			break;
			case "place": url = "getSourcesByKey/"+term+"/place";
			break;
			case "remarkability": url = "getSourcesByKey/"+term+"/remarkability";
			break;
			case "tradeGoods": url = "getSourcesByKey/"+term+"/tradeGoods";
			break;
		}
		//Holen der Quellen per AJAX-Abfrage der übergebenen ID
		$.ajax({
			type: "GET",
			url: url,
			success: function(response) {
				$("#viewOccurence").empty().html(response);
			},
			error: function() {
				alert("Fehler beim Laden der Quellenstellen!");
			}
		});
	}
	
	
	
});