/*Code von Gwenlyn Tiedemann*/

/* Der Bar Chart visualisiert die Häufigkeit der Vorkommnisse eines Objektes.
 * Es lassen sich drei Charts anzeigen, je zu der Auflistung von Personen, Orten und Auffälligkeiten.
 * Wenn man einen der Balken oder die dahinter stehende Anzahl der Vorkommnisse anklickt, 
 * wird rechts eine Auflistung der Quellen angezeigt, in denen das gewählte Objekt vorkommt.
 * Klickt man wiederum eine der Quellen in der Liste an, wird der Inhalt dieser Quelle unter dem Bar Chart gezeigt.
 * Die zugehörigen Quellenstellen zu der Quelle werden links neben dem Quelleninhalt angezeigt und können durch Anklicken auch angezeigt werden.
 * Rechts neben der Quellendarstellung befindet sich weiterhin die Auflistung der Vorkommnisse.*/

$(document).ready(function(){
	  	
	//Ajax-Aufruf, um die XML zu parsen
        $.ajax({
            type: "GET",
            url: "data/Sarazenen_Final_Map_v0.1.xml",
            dataType: "xml",
            success: function(xml){
            	//verstecken der Elemente, bis sie aufgerufen werden
            	$('#quellAnsicht').hide();
            	$('#bar-chart').hide();
				$('#anweisung').hide();

            	
//				Häuigkeits Tabellen für: 		Person
//            									Ort
//            									Auffälligkeiten
            
            //Häufigkeit der Personen berechnen
        			var EntitaetenArrayPers = [];
        			
        			//In einem Array alle Personennamen speichern, die unter Entitäten geführt werden
        			var person = $(xml).find('Entitaet[Type="Person"] Name');
        			for (p = 0; p < person.length; p++){
        				EntitaetenArrayPers[p] = $(person[p]).text();
        			}
        			// Array alphabetisch sortieren
        			EntitaetenArrayPers.sort();
        			
        			//zählen wie häufig ein Name jeweils in dem Array vorkommt. Namen sowie Häufigkeit in Arrays speichern.
        			var result = {};
        			   for(c=0;c<EntitaetenArrayPers.length;++c) {
        			       if(!result[EntitaetenArrayPers[c]])
        			         result[EntitaetenArrayPers[c]]=0;
        			       ++result[EntitaetenArrayPers[c]];
        			   }
        			   
        			   //Array in einem CSV-Format für den Bar Chart speichern
           			var  PersArray = [ , ];
           			var FrequArrayPers = [ , ];

        			for (var c in result){
        				PersArray.push(c);
        				FrequArrayPers.push(result[c]);
        			}

        		// Häufigkeit der Orte berechnen
        			var EntitaetenArrayOrt = [];
        			
        			//In einem Array alle Ortsnamen speichern, die unter Entitäten geführt werden
        			var ort = $(xml).find('Entitaet[Type="Ort"] Name');
        			for (o = 0; o < ort.length; o++){
        				EntitaetenArrayOrt[o] = $(ort[o]).text();
        			}
        			// Array alphabetisch sortieren
        			EntitaetenArrayOrt.sort();
        			
        			//zählen wie häufig ein Name jeweils in dem Array vorkommt. Namen sowie Häufigkeit in Arrays speichern.
        			var result = {};
        			   for(c=0;c<EntitaetenArrayOrt.length;++c) {
        			       if(!result[EntitaetenArrayOrt[c]])
        			         result[EntitaetenArrayOrt[c]]=0;
        			       ++result[EntitaetenArrayOrt[c]]
        			   }
        			   
        			   //Array in einem CSV-Format für den Bar Chart speichern
           			var  OrtArray = [ , ];
           			var FrequArrayOrt = [ , ];

        			for (var c in result){
        				OrtArray.push(c);
        				FrequArrayOrt.push(result[c]);
        			}
        			
        			
        		// Häufigkeit der Auffälligkeiten berechnen
        			var AuffaelligkeitenArray = [];
        			
        			//In einem Array alle Auffälligkeiten speichern, die in der XML aufgeführt werden
        			var auf = $(xml).find('Auffaelligkeiten Schlagwort');
        			for (a = 0; a < auf.length; a++){
        				AuffaelligkeitenArray[a] = $(auf[a]).text();
        			}
        			// Array alphabetisch sortieren
        			AuffaelligkeitenArray.sort();
        			
        			//zählen wie häufig eine Auffälligkeit jeweils in dem Array vorkommt. Namen sowie Häufigkeit in Arrays speichern.
        			var result = {};
        			   for(c=0;c<AuffaelligkeitenArray.length;++c) {
        			       if(!result[AuffaelligkeitenArray[c]])
        			         result[AuffaelligkeitenArray[c]]=0;
        			       ++result[AuffaelligkeitenArray[c]];
        			   }
        			   
        			   //Array in einem CSV-Format für den Bar Chart speichern
           			var  AufArray = [ , ];
           			var FrequArrayAuf = [ , ];

        			for (var c in result){
        				AufArray.push(c);
        				FrequArrayAuf.push(result[c]);
        			}

        			
        			
        			
        //Bar Chart	Grundlage
        			var colors = ['#0000b4','#0082ca','#0094ff','#0d4bcf','#0066AE','#074285','#00187B','#285964','#405F83','#416545','#4D7069','#6E9985'];

        			var grid = d3.range(5).map(function(i){ //Anzahl graue Streifen
        				return {'x1':0,'y1':0,'x2':0,'y2':4500};
        			});

        			var xscale = d3.scale.linear()
        			
        			var barchart = d3.select('#bar-chart')
        						.append('svg')
        						.attr({'width':800,'height':4600});

        			
        		// Get Data für Personen onclick Button
        			$('#frequPers').click(function(){
        				
        				$('#bar-chart').show();
        				$('#quellAnsicht').hide();
        				$('g').empty();
        				$('#anweisung').show();
        				$('#showSelected').empty();
                    	$('#showQuel').empty();
			
        			var yscale = d3.scale.linear()
        			        		.domain([0,PersArray.length]) 							
        							.range([0,4500]); //Abstand zwischen den Personnamen

        			var colorScale = d3.scale.quantize()
        							.domain([0,FrequArrayPers.length])
        							.range(colors);

        			var grids = barchart.append('g')
        							  .attr('id','grid')
        							  .attr('transform','translate(350,57)')//positionierung der Streifen
        							  .selectAll('line')
        							  .data(grid)
        							  .enter()
        							  .append('line')
        							  .attr({'x1':function(d,i){ return i*30; },
        									 'y1':function(d){ return d.y1; },
        									 'x2':function(d,i){ return i*30; },
        									 'y2':function(d){ return d.y2; },
        								})
        							  .style({'stroke':'#adadad','stroke-width':'1px'});
        			//Y-Axe mit Beschriftung
        			var	yAxis = d3.svg.axis();
        				yAxis
        					.orient('left')
        					.scale(yscale)
        					.tickSize(1)
        					.tickFormat(function(d,i){ return PersArray[i]; }) 		
        					.tickValues(d3.range(800)); //800 Namen an der Y-Achse möglich. Hoch gesetzt, falls Erweiterung

        			var y_xis = barchart.append('g')
        							.attr("transform", "translate(350,57)") //Positionierung
        							.attr('id','yaxis')
									.call(yAxis)

									//Balken hinzufügen
        			var chart = barchart.append('g')
        								.attr("transform", "translate(350,40)") //Positionierung
        								.attr('id','bars')
        								.selectAll('rect')
        								.data(FrequArrayPers)
        								.enter()
        								.append('rect')
        								.attr('height',13)
        								.attr({'x':	0,'y':function(d,i){ return yscale(i)+10; }})
        								.style('fill',function(d,i){ return colorScale(i); })
        								.attr('width',function(d){ return 0; })
        								.on("click", clickComparePers); //Balken anklickbar
        			
        			//Transition der Balken bestimmen
        			var transit = barchart.selectAll("rect")
        							    .data(FrequArrayPers)
        							    .transition()
        							    .duration(3000) 
        							    .attr("width", function(d) {return d*5; });
        								
        					//Zahlen zum Balken hinzufügen
        			var transittext = barchart.append('g')
        							.attr('id','text')
        							.selectAll('text')
        							.data(FrequArrayPers)
        							.enter()
        							.append('text')
        							.attr({'x': 500, 'y': function(d,i){return yscale(i)+59; }})
        							.text(function(d){ return d;}).style({'fill':'#808080', 'font-size': '14px'})		//Text Farbe noch ändern!!!
        							.on("click", clickComparePers); //Zahlen anklickbar
      			}) // /. onclick Person
      			
      			
      			// Get Data für Orte onclick Button
        			$('#frequOrt').click(function(){
        				
        				$('#bar-chart').show();
        				$('#quellAnsicht').hide();
        				$('g').empty();
        				$('#anweisung').show();
        				$('#showSelected').empty();
                    	$('#showQuel').empty();


        				
        			var yscale = d3.scale.linear()
        			        		.domain([0,OrtArray.length]) 							
        							.range([0,4500]); //Abstand zwischen den Personnamen

        			var colorScale = d3.scale.quantize()
        							.domain([0,FrequArrayOrt.length])
        							.range(colors);

        			var grids = barchart.append('g')
        							  .attr('id','grid')
        							  .attr('transform','translate(350,57)')//positionierung der Streifen
        							  .selectAll('line')
        							  .data(grid)
        							  .enter()
        							  .append('line')
        							  .attr({'x1':function(d,i){ return i*30; },
        									 'y1':function(d){ return d.y1; },
        									 'x2':function(d,i){ return i*30; },
        									 'y2':function(d){ return d.y2; },
        								})
        							  .style({'stroke':'#adadad','stroke-width':'1px'});

        			var	yAxis = d3.svg.axis();
        				yAxis
        					.orient('left')
        					.scale(yscale)
        					.tickSize(1)
        					.tickFormat(function(d,i){ return OrtArray[i]; }) 		
        					.tickValues(d3.range(800)); //800 Namen an der Y-Achse möglich. Hoch gesetzt, falls Erweiterung
        				

        			var y_xis = barchart.append('g')
        							.attr("transform", "translate(350,57)")
        							.attr('id','yaxis')
									.call(yAxis)
									
									//Balken hinzufügen
        			var chart = barchart.append('g')
        								.attr("transform", "translate(350,40)")
        								.attr('id','bars')
        								.selectAll('rect')
        								.data(FrequArrayOrt)
        								.enter()
        								.append('rect')
        								.attr('height',13)
        								.attr({'x':	0,'y':function(d,i){ return yscale(i)+10; }})
        								.style('fill',function(d,i){ return colorScale(i); })
        								.attr('width',function(d){ return 0; })
        								.on("click", clickCompareOrt);      //Balken anklickbar  			        			


        			var transit = barchart.selectAll("rect")
        							    .data(FrequArrayOrt)
        							    .transition()
        							    .duration(3000) 
        							    .attr("width", function(d) {return d*5; });
        								
        			var transittext = barchart.append('g')
        							.attr('id','text')
        							.selectAll('text')
        							.data(FrequArrayOrt)
        							.enter()
        							.append('text')
        							.attr({'x': 500, 'y': function(d,i){return yscale(i)+59; }})
        							.text(function(d){ return d;}).style({'fill':'#808080', 'font-size': '14px'})		//Text Farbe noch ändern!!!
        							.on("click", clickCompareOrt); //Zahlen anklickbar
      			}) // /. onclick Ort
      			
      			
      			// Get Data für Auffälligkeiten onclick Button
        			$('#frequAuf').click(function(){
        				
        				$('#bar-chart').show();
        				$('#quellAnsicht').hide();
        				$('g').empty();
        				$('#anweisung').show();
        				$('#showSelected').empty();
                    	$('#showQuel').empty();


        				
        			var yscale = d3.scale.linear()
        			        		.domain([0,AufArray.length]) 							
        							.range([0,4500]); //Abstand zwischen den Personnamen

        			var colorScale = d3.scale.quantize()
        							.domain([0,FrequArrayAuf.length])
        							.range(colors);

        			var grids = barchart.append('g')
        							  .attr('id','grid')
        							  .attr('transform','translate(350,57)')//positionierung der Streifen
        							  .selectAll('line')
        							  .data(grid)
        							  .enter()
        							  .append('line')
        							  .attr({'x1':function(d,i){ return i*30; },
        									 'y1':function(d){ return d.y1; },
        									 'x2':function(d,i){ return i*30; },
        									 'y2':function(d){ return d.y2; },
        								})
        							  .style({'stroke':'#adadad','stroke-width':'1px'});

        			var	yAxis = d3.svg.axis();
        				yAxis
        					.orient('left')
        					.scale(yscale)
        					.tickSize(1)
        					.tickFormat(function(d,i){ return AufArray[i]; }) 		
        					.tickValues(d3.range(800)); //800 Namen an der Y-Achse möglich. Hoch gesetzt, falls Erweiterung
        				

        			var y_xis = barchart.append('g')
        							.attr("transform", "translate(350,57)")
        							.attr('id','yaxis')
									.call(yAxis);
        			
					//Balken hinzufüge
        			var chart = barchart.append('g')
        								.attr("transform", "translate(350,40)")
        								.attr('id','bars')
        								.selectAll('rect')
        								.data(FrequArrayAuf)
        								.enter()
        								.append('rect')
        								.attr('height',13)
        								.attr({'x':	0,'y':function(d,i){ return yscale(i)+10; }})
        								.style('fill',function(d,i){ return colorScale(i); })
        								.attr('width',function(d){ return 0; })
        								.on("click", clickCompareAuf); //Balken anklickbar
        			


        			var transit = barchart.selectAll("rect")
        							    .data(FrequArrayAuf)
        							    .transition()
        							    .duration(3000) 
        							    .attr("width", function(d) {return d*5; });
        								
        			var transittext = barchart.append('g')
        							.attr('id','text')
        							.selectAll('text')
        							.data(FrequArrayAuf)
        							.enter()
        							.append('text')
        							.attr({'x': 500, 'y': function(d,i){return yscale(i)+59; }})
        							.text(function(d){ return d;}).style({'fill':'#808080', 'font-size': '14px'})		//Text Farbe noch ändern!!!
        							.on("click", clickCompareAuf); //Zahlen anklickbar
      			}) // /. onclick Auffälligkeiten
      			
      			
        			
        			
            	// dynamisches Laden der zugehörigen Quellenstellen aus der XML als Auflistung für den Personen Bar Chart
        			function clickComparePers(result, c){
        				$('#quellAnsicht').hide();
        				$('#showSelected').empty();
                    	$('#showQuel').empty();

	
         				var selected_object = PersArray[c];                   				
          				var dokument = $(xml).find('Dokumente');
          			  for (var i = 0; i < dokument.length; i++){               	    	
               	    	var werkid = $(dokument[i]).find('WerkId');
               	    	var werktitel = $(dokument[i]).find('WerkTitel');               	    	
               	    	var quelle = $(dokument[i]).find('Quelle');
               	    		for (var ii = 0; ii < quelle.length; ii++){               	    			
               	    			var quellenid = $(quelle[ii]).find('QuellenId');               	    			
               	    			 entitaet = $(quelle[ii]).find('Entitaet');
               	    			 
               	    				for (var iii = 0; iii < entitaet.length; iii++){
               	    					 entitaetlist = $(entitaet[iii]).find('Name');
               	    					 
               	                //Wenn die ausgewählte Person unter den Entitäten einer Quelle gefunden wurde, werden die Quellendaten ausgegeben.
               	    			if(selected_object == entitaetlist.text())
               	    				{
               	    				var ortHeader = "<p>In folgenden Quellen wird die Person  '<b>"+ selected_object +"</b>'  erwähnt:  </p>";
              	    				$('#showSelected').html(ortHeader);
              	    				$('#showQuel').append("<p> <span  id='dokument_"+i+"_"+ii+"'><a href='#quellAnsicht'> "+werkid.text()+": "+werktitel.text()+"</a></span>" +
              	    			  	  		" <br> Quellenstelle: "+quellenid.text()+ " </p>");
            	    			  	
             	    			  	//Wenn eine Quelle angeklickt wird, wird ihr Inhalt angezeigt
               	    			  	$('#dokument_' + i+'_'+ii).click(displayWerkInfo.bind($('#dokument_' + i+'_'+ii), dokument[i]))
      		
               	    				}
               	    		}
               	    }
               	    }
        				
        			} // /.clickComparePers
        			
                	// dynamisches Laden der zugehörigen Quellenstellen aus der XML als Auflistung für den Orte Bar Chart
        			function clickCompareOrt(result, c){
        				$('#quellAnsicht').hide();
        				$('#showSelected').empty();
                    	$('#showQuel').empty();

         				var selected_object = OrtArray[c];
          				var dokument = $(xml).find('Dokumente');
          			  for (var i = 0; i < dokument.length; i++){
               	    	var werkid = $(dokument[i]).find('WerkId');
               	    	var werktitel = $(dokument[i]).find('WerkTitel');
               	    	var quelle = $(dokument[i]).find('Quelle');
               	    		for (var ii = 0; ii < quelle.length; ii++){               	    			
               	    			var quellenid = $(quelle[ii]).find('QuellenId');               	    			
               	    			 entitaet = $(quelle[ii]).find('Entitaet');
               	    			 
               	    				for (var iii = 0; iii < entitaet.length; iii++){
               	    					 entitaetlist = $(entitaet[iii]).find('Name');
               	    					 
               	               //Wenn der ausgewählte Ort unter den Entitäten einer Quelle gefunden wurde, werden die Quellendaten ausgegeben.
               	    			if(selected_object == entitaetlist.text())
               	    				{
               	    				var ortHeader = "<p>In folgenden Quellen wird der Ort  '<b>"+ selected_object +"</b>'  erwähnt:  </p>";
              	    				$('#showSelected').html(ortHeader);
              	    				$('#showQuel').append("<p> <span  id='dokument_"+i+"_"+ii+"'><a href='#quellAnsicht'> "+werkid.text()+": "+werktitel.text()+"</a></span>" +
              	    			  	  		" <br> Quellenstelle: "+quellenid.text()+ " </p>");
            	    			  	
             	    			  	//Wenn eine Quelle angeklickt wird, wird ihr Inhalt angezeigt
               	    			  	$('#dokument_' + i+'_'+ii).click(displayWerkInfo.bind($('#dokument_' + i+'_'+ii), dokument[i]))
      		
               	    				}
               	    		}
               	    }
               	    }
        				
        			} // /.clickCompareOrt
        			
        			
        			
                	// dynamisches Laden der zugehörigen Quellenstellen aus der XML als Auflistung für den Auffälligkeiten Bar Chart
        			function clickCompareAuf(result, c){
        				$('#quellAnsicht').hide();
        				$('#showSelected').empty();
                    	$('#showQuel').empty();

         				var selected_object = AufArray[c];
            		  var dokument = $(xml).find('Dokumente');          	  
          	   for ( i = 0; i < dokument.length; i++){
          	   	var werkid = $(dokument[i]).find('WerkId');
          	   	var werktitel =$(dokument[i]).find('WerkTitel');
          	   	var quelle = $(dokument[i]).find('Quelle');
          	   		for (var ii = 0; ii < quelle.length; ii++){
          	   			var quellenid = $(quelle[ii]).find('QuellenId');
            				
          	   			    	 var Schlagwort = $(quelle[ii]).find('Schlagwort')
          	   			    	 for(var iii = 0; iii < Schlagwort.length;iii++){
          	   			    		 var auffaellList = $(Schlagwort[iii]);
          	   			    		 
          	   			//Wenn die ausgewählte Auffälligkeit in einer Quelle gefunden wurde, werden die Quellendaten ausgegeben. 			   			    		   			    	
          	   			if(selected_object == auffaellList.text())
          	   				{
          	   				var aufHeader = "<p>In folgenden Quellen wird die Auffälligkeit  '<b>"+ selected_object +"</b>'  erwähnt:  </p>";
          	    				$('#showSelected').html(aufHeader);
          	    				$('#showQuel').append("<p> <span  id='dokument_"+i+"_"+ii+"'><a href='#quellAnsicht'> "+werkid.text()+": "+werktitel.text()+"</a></span>" +
          	    			  	  		" <br> Quellenstelle: "+quellenid.text()+ " </p>");
          	    				
         	    			  	//Wenn eine Quelle angeklickt wird, wird ihr Inhalt angezeigt
           	    			  	$('#dokument_' + i+'_'+ii).click(displayWerkInfo.bind($('#dokument_' + i+'_'+ii), dokument[i]))

          	   				}
          	   			      } 
          	   		}
          	   }
        				
        			} // /.clickCompareAuf

        			
        			 //Laden der Inhalte für die angeklickte Quelle
            	  	function displayWerkInfo(xml) {

            	  		//Elemente leeren, um neuen Inhalt anzuzeigen	  		
            	  		$('#QuelList').empty();
            	  		$('#showQuelInfo').empty(); 
            	  		$('#showMoreContent').empty();
            	  		
            	  		$('#quellAnsicht').show(); //Quellentext Vollansicht anzeigen
            	  		
            		  	$('#QuelList').append('<h4>Quellenstellen</h4>');
            		  	
            	  		var quelle = $(xml).find('Quelle')
            		  	      for(var j = 0; j < quelle.length;j++){
            		  	    	  //Quellenstelle Liste zu der bestimmten Quelle unter die blaue Box als Liste setzen
            			  	      $('#QuelList').append('<li id="quelle_' + j +'"><a href="#quellAnsicht">' + $(quelle[j]).find('QuellenId').text() +'</a></li>');
            			  	      //Anklicken der Id einer Quellenstellen => laden der Inhalte
            			  	      $('#quelle_' + j ).click(displayQuelInfo.bind($('#quelle_' + j), quelle[j]));
            		  	      }
            	  		
            	  	//finden der XML-Taginhalte
          	  		  WerkTitel= $(xml).find('WerkTitel').text();							//Werktitel
          		  	  WerkId = $(xml).find('WerkId').text();								//WerkId
          		  	  LebensdatenVerfasser = $(xml).find('LebensdatenVerfasser').text();	//Lebensdaten des Verfasser
          		  	  Abfassungszeitraum = $(xml).find('Abfassungszeitraum').text();		//Abfassungszeitraum der Quelle
          		  	  Abfassungsort = $(xml).find('Abfassungsort').text();					//Abfassungsort der Quelle
          		  	  Editionshinweise = $(xml).find('Editionshinweise').text();			//Editionshinweis
          		  	  Werkinformation = $(xml).find('Werkinformation').text();				//Werkinformationen
          		  	 
            		  	  
          		  	 // Einfügen der XML-Inhalte ins Template
        		  	  //Header: WerkTitel und Alternativnamen
        		  	  var werkHeader = "<h1 class='main-title'>"+WerkTitel+"</h1> <p class='sub-title' id='altTitel'> </p>";
        		  	  $('#showTitel').html(werkHeader);

        		  	  //Main Content: Abfassungszeitraum, Abfassungsort, Regionen, Editionshinweise und Werkinformationen
        		  	  var werkInfo = "<p><b>Abfassungszeitraum:</b> "+Abfassungszeitraum+"</p><p><b>Abfassungsort:</b> "+Abfassungsort+"</p><p><b>Region:</b><ul id='showRegion'></ul></p><p><b>Editionshinweise:</b> <p>"+Editionshinweise+"</p><hr><p><b>Allgemeines </b></p>"+Werkinformation+"</p></hr>";
        		  	  $('#showContent').html(werkInfo);
        		  	  
        		  	  //blaue Box: Autor mit Lebensdaten
        		  	  var verfInfo = "<div  class='sidebar-module-inset'><h4>Verfasser</h4><p><span id='showAuthor'></span>("+LebensdatenVerfasser+ ")</br></p></div>";
        		  	  $('#showInfo').html(verfInfo);
        		  	    
        			  	//Finden und Ausgeben der untergeordneten Inhalte
        		  	  var altTitelArray = [];
        		  	  var altTitelList;
        	  	var altTitel = $(xml).find('Alternativtitel')		//Alternativtitel
        	      for(var i = 0; i < altTitel.length;i++){
        	    	  var titel = $(altTitel[i]).find('Titel')
        	    	  for (var ii = 0; ii < titel.length; ii++){
        	    		  altTitelArray[ii] = $(titel[ii]).text();
        	    		  altTitelList = altTitelArray.join(', ');	//Einzelne Titel werden mit Kommas getrennt und in einer Zeile angezeigt.
        	    	  }	  	    	  
        	    	  $('#altTitel').append(altTitelList);
        	      }
        	  	
        	  	
        	  	autoren = $(xml).find('Autoren')					//Autoren
        	      for(var i = 0; i < autoren.length;i++){
        	    	 autor = $(autoren[i]).find('Autor')
        	    	  for (var ii = 0; ii < autor.length; ii++){
        	    		  $('#showAuthor').append($(autor[ii]).text()+'<br>');
        	    	  }	  	    	  
        	      }
        	  	
        	  	var regionen = $(xml).find('Regionen')				//Regionen
        	      for(var i = 0; i < regionen.length;i++){
        	    	 var region = $(regionen[i]).find('Region')
        	    	  for (var ii = 0; ii < region.length; ii++){
        	    		  $('#showRegion').append($(region[ii]).text()+'<br>');
        	    	  }	  	    	  
        	      }


        	  	}// /.displayWerkInfo()

          		  //Laden der Inhalte für die angeklickte Quellenstelle
          	  	function displayQuelInfo(xml) {
          	  		
          	  		//Elemente leeren, um neuen Inhalt anzuzeigen
          	  		$('#showTitel').empty();
          	  		$('#showContent').empty();
          	  		$('#showInfo').empty();
          		  	$('#showMoreContent').empty();

          	  		// finden der XML-Inhalte
          		  	  var QuellenId= $(xml).find('QuellenId').text();					//QuellenId
          		  	  var Zitation = $(xml).find('Zitation').text();					//Zitation
          		  	  var ZeitangabeQuelle = $(xml).find('ZeitangabeQuelle').text();	//(Quellen-)Zeitangabe
          		  	  var Inhaltsangabe = $(xml).find('Inhaltsangabe').text();			//Inhalstangabe
          		  	  var VolltextOrig = $(xml).find('VolltextOriginalsprache').text();	//Volltext Original
          		  	  var VolltextUeb = $(xml).find('VolltextUebersetzung').text();		//Volltext Übersetzung
          		  	  var ZitationsUeb = $(xml).find('ZitationUebersetzung').text();	//Hinweis zur Übersetzung
          		  	  var Interaktion = $(xml).find('Interaktion').text();				//Interaktion
          		  	  var Anmerkungen = $(xml).find('Anmerkungen').text();				//Anmerkungen
          		  	  		  	  
          	  // Einfügen der XML-Inhalte ins Template
          		  	  //Header: QuellenID und Zitation
          		  	  var quelHeader = "<h1 class='main-title'>Quellenstelle: "+QuellenId+"</h1><p class='sub-title'>"+Zitation+"</p>"
          		  	  $('#showTitel').html(quelHeader);
          		  	  
          		  	  //Main-Content: zeitliche Angaben (Quellen + Wissenschaftlich), Inhaltsangabe, Volltext Original und Übersetzung, sowie Hinweise zur Übersetzung
          		  	  var quelInfo = "<p><b>zeitliche (Quellen-)Angabe: </b>" +ZeitangabeQuelle+"</p><p><b>zeitliche (wissenschaftliche) Einordnung: </b><span id='zeitwiss'></span></p><p><b>Inhaltsangabe:</b> " +Inhaltsangabe+"</p><hr> <p> <b>Volltext </b></p><p>"+VolltextOrig+"</p></hr><hr><p><b>Übersetzung:  </b></p><p>"+VolltextUeb+"</p></hr><hr><p><b>Hinweise zur Übersetzung (Zitation):</b></p><p>"+ZitationsUeb+"</p></hr><br></br>";
          		  	  $('#showContent').html(quelInfo);
          		  	  
          		  	  //Blaue-Box: Werktitel, Abfassungszeitraum, Abfassungsort, Verfasser mit Lebensdaten
          		  	  var werk = "<div  class='sidebar-module-inset'><h4> Werk </h4><p>"+WerkTitel+"</p><p>"+Abfassungszeitraum+"</p><p>"+Abfassungsort+"</p><h5><b>Verfasser</b></h5><p><div id='showAuthor'></div> ("+LebensdatenVerfasser+")</p></div>";
          		  	  $('#showInfo').html(werk);
          		  	  
          		  	  //Zusätzliche Informationen zu den Quellen (von dem DFG-Projekt ergänzt): Geographische Stichworte, Angabe der Betiligten und Interaktion, Auffälligkeiten und Anmerkungen
          		  	  var moreInfo = "<div class='panel panel-default'><div class='panel-body'><p><b>geographisches Stichwort: </b><ul id='showGeoStichwort'></ul></p><p><b>Bericht über ein/mehrere Individuum/en oder Kollektive: </b><ul id='showBeteiligte'></ul></p><p><b>Interaktion (j/n): </b>"+Interaktion+"</p><p><b>Auffälligkeiten: </b><ul id='showAufaell'></ul></p><p><b>Suchbegriffe: </b><ul id='showSuchworte'></ul></p><p><b>Anmerkungen: </b></p><p>"+Anmerkungen+"></p></div></div>";
          		  	  $('#showMoreContent').html(moreInfo);
          		  	  
          		  	  //erneutes Aufrufen und ausgeben des Autoren für die blaue Info-Box
          		  	  for(var i = 0; i < autoren.length;i++){
          			    	 autor = $(autoren[i]).find('Autor')
          			    	  for (var ii = 0; ii < autor.length; ii++){
          			    		  $('#showAuthor').append($(autor[ii]).text()+'<br>');
          			    	  }	  	    	  
          			      }
          		  	  
          		  	  //finden und ausgeben der untergeordneten Inhalte
          		  	  
          		    	var  datumArray = [];														
          	    		var DatumList;
          			  	var ZeitWiss = $(xml).find('ZeitangabeWissenschaft')			//wiss. Zeiteinordnung
          			      for(var i = 0; i < ZeitWiss.length;i++){
          			    	  var Datum = $(ZeitWiss[i]).find('Datum')
          			    	  for (var ii = 0; ii < Datum.length; ii++){
          			    		datumArray[ii] = $(Datum[ii]).attr('Text');
          			    		DatumList = datumArray.join(', ');  		    		  //bei mehreren Angaben werden diese mit Kommas getrennt und in einer Zeile angezeigt.
          			    	  }
          			    		  $('#zeitwiss').append(DatumList);
          			    	  }	 	    	  

          		  	var GeoStichwort = $(xml).find('GeographischesStichwort')					//geographisches Stichwort als Liste
          		      for(var i = 0; i < GeoStichwort.length;i++){
          		    	 var ort = $(GeoStichwort[i]).find('Ort')
          		    	  for (var ii = 0; ii < ort.length; ii++){
          		    		  $('#showGeoStichwort').append('<li>'+$(ort[ii]).text()+'</li>');
          		    	  }	  	    	  
          		      }
          		  	var Beteiligte = $(xml).find('Beteiligte')									//Beteiligte als Liste
          		      for(var i = 0; i < Beteiligte.length;i++){
          		    	 var Beteiligter = $(Beteiligte[i]).find('Beteiligter')
          		    	  for (var ii = 0; ii < Beteiligter.length; ii++){
          		    		  $('#showBeteiligte').append('<li>'+$(Beteiligter[ii]).text()+'</li>');
          		    	  }	  	    	  
          		      }
          		  	var Auffaelligkeiten = $(xml).find('Auffaelligkeiten')						//Auffälligkeiten als Liste
          		      for(var i = 0; i < Auffaelligkeiten.length;i++){
          		    	 var Schlagwort = $(Auffaelligkeiten[i]).find('Schlagwort')
          		    	  for (var ii = 0; ii < Schlagwort.length; ii++){
          		    		  $('#showAufaell').append('<li>'+$(Schlagwort[ii]).text()+'</li>');
          		    	  }	  	    	  
          		      }
          		  	
          		  	
          		  	var Suchbegriffe = $(xml).find('Suchbegriffe')								//Suchbegriffe als Liste
          		      for(var i = 0; i < Suchbegriffe.length;i++){
          		    	 var Suchwort = $(Suchbegriffe[i]).find('Suchwort')
          		    	  for (var ii = 0; ii < Suchwort.length; ii++){
          		    		  $('#showSuchworte').append('<li>'+$(Suchwort[ii]).text()+'</li>');
          		    	  }	  	    	  
          		      }
          		  	
          		
          	  	} // /.displayQuelInfo()
        		
                       },
                       error: function() {
                       alert("An error occurred while processing XML file.");
                       }
                       }); // Ende Ajax xml Sarazenen
        
    	//fixed Position für die Vorkommniss-Liste 
    	var vorkommnisPosition = $('#vorkommnisAnsicht').offset();
    	$(window).scroll(function(){
    	        if($(window).scrollTop() > vorkommnisPosition.top){	
    	              $('#vorkommnisAnsicht').css('position','fixed').css('top','0');
    	        } 
    	        
    	        else {
    	            $('#vorkommnisAnsicht').css('position','static');
    	        }    
    	});
    	
           		

});