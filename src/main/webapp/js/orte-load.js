/*  Code von Gwenlyn Tiedemann, Code für die Karte dabei nach dem Vorbild von Alex Abboud gebaut.*/

/* Laden der XML-Daten und einfügen in eine Tabelle für die Orte, die in den Quellen erwähnt werden.
 * 		In der Tabelle sind alle Spalten sortierbar und es besteht die Möglichkeit sie zu durchsuchen.
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
	
	// Orte-Tabelle: Alternativnamen einklappbar machen, damit die Tabelle nicht zu lang wird. 
	/*Funktioniert plötzlich hier nicht mehr. Fehler konnte nicht mehr gefunden werden.*/
	/*Funktionierende Variante bei der Personentabelle zu sehen*/
	$(function toggleOrt() {
		 var $research = $('#ortPers');
		    $research.find("p").not('.accordion').hide();
			// $research.find("p").eq(0).show();
		    
		    $research.find(".accordion").click(function(){
		    	$(this).find('span').toggleClass('glyphicon glyphicon-menu-down').toggleClass('glyphicon glyphicon-menu-right');

		        $research.find('.accordion').not(this).siblings().fadeOut(500);
		        $(this).siblings().fadeToggle(500);
		    }).eq(0).trigger('click');
	});
	
	//Search-PlugIn für die dynamisch geladene Tabelle (Orte)
	var qs = $('input#search').quicksearch('table tbody tr ');

/*Code für die Karte von Alex Abboud*/
	// Karte hinzufügen
	var map = L.map('map-orte').setView([45.82727, 15.99390], 4);
	mapLink = 
		'<a href="http://openstreetmap.org">OpenStreetMap</a>';
	L.tileLayer(
		'https://api.mapbox.com/styles/v1/phnny/cj0190ei000pf2spfvojl4jbz/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicGhubnkiLCJhIjoiY2owMTdmdWVnMDY0ajMyb3hscG9pcW5lMCJ9.yE1KMiypYpo0IH1nDejtYQ', {
		attribution: '&copy; ' + mapLink + ' Contributors',
		maxZoom: 18,
		}).addTo(map);

	//Map SVG Layer initalisieren
	map._initPathRoot()    

	/* We simply pick up the SVG from the map object */
	var svg = d3.select("#map-orte").select("svg").attr("class", "mapsvg");
	var g = svg.append("g").attr("class", "date");
	
	var color = d3.scale.category10();
	var init = 0;
	var counterUpdate = 0;
	// Set the dimensions of the canvas
		width = 600,
		height = 380;
	
	// Die Skalen
	var rScale = d3.scale.linear().range([0, 50]); //bestimmt die Skalierung der Kreise

	var alle_orte = {};
	  	
	//Ajax-Aufruf, um die XML zu parsen
        $.ajax({
            type: "GET",
            url: "data/Sarazenen_Final_Map_v0.1.xml",
            dataType: "xml",
            success: function(xml){
            	$('#map-orte').hide(); //verstecken der Map, bis diese aufgerufen wird

            	var alternativnamen, altname;
            	var entitaet, entitaetlist;
        	  	
        		  var dokument = $(xml).find('Dokumente');
        		  var orte = $(xml).find('Orte');
        		  var ort = $(orte).find('Ort')
        		   //Inhalte pro Ort finden und in Template einbinden
    	  	    	for (var i = 0; i < ort.length; i++) {
    	  	    //Ortsregister Tabelle mit Daten füllen
        		  	$('#bindOrte').append('<tr><td>' + $(ort[i]).find('Name').eq(0).text() + '</td><td id="altnamen_'+i+'"><p class="accordion"><span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span> &#160;&#160;&#160;&#160;&#160;&#160;'+$(ort[i]).find('Name').eq(1).text()+'</p></td><td>'+$(ort[i]).find('Typ').text()+'</td><td> <a href="#vorkommnisAnsicht" id="vorkommnis_'+i+'"> Auflistung anzeigen </a></td><td><a href="#map-orte" id="ort_'+i+'">auf Karte anzeigen</a></td></tr>');
        		  	qs.cache(); //Pufferspeicher damit der Quicksearcher PlugIn auf die dynamisch geladenen Daten zugreifen kann.

    	  	    	alternativnamen = $(ort[i]).find('Alternativnamen')  //Alternativnamen
	  	    	for (var ii = 0; ii < alternativnamen.length; ii++){
	  	    		 altname = $(alternativnamen[ii]).find('Name')
	  	    		for (var iii = 1; iii< altname.length; iii++)
	  	    			{
	  	    		  	$('#altnamen_'+i).append('<ol>'+$(altname[iii]).text()+'</ol>');
	  	    			}
	  	    		 }

    	  	    	//Onclick öffnen der Karte
    		  	 $('#ort_'+i).click(displayMap.bind($('#ort_'+i), ort[i]));

    		  	 	//onclick Anzeigen der Quellen, in denen der ausgewählte Ort unter Entitäten aufgeführt wird.
    		  	 $('#vorkommnis_'+i).click(clickCompare.bind($('#vorkommnis_'+i), ort[i]));
    		  	 // zu manchen Orten können keine Vorkommnisse angezeigt werden, da diese nur in der Ortsliste, allerdings nicht in den Quellen unter Entitäten aufgeführt werden.

    	  	  } // /.Ort[i]
    	  	    

            	// dynamisches Laden der zugehörigen Quellenstellen aus der XML als Auflistung
            	function clickCompare(xml){
            		
            		//Liste leeren, um neuen Inhalt anzuzeigen
    			$('#showSelected').empty();
            	$('#showQuel').empty();

          		//Namen des ausgewählten Ortes finden
          		var selected_object = $(xml).find('Name').eq(0);
          		//Für jedes Dokument die Daten beziehen
         	    for (var i = 0; i < dokument.length; i++){
         	    	var werkid = $(dokument[i]).find('WerkId');
         	    	var werktitel = $(dokument[i]).find('WerkTitel');
         	    	//Für jede Quellenstelle im Dokument die Daten beziehen
         	    	var quelle = $(dokument[i]).find('Quelle');
         	    		for (var ii = 0; ii < quelle.length; ii++){        	    		
         	    			var quellenid = $(quelle[ii]).find('QuellenId');        	    			
         	    			 entitaet = $(quelle[ii]).find('Entitaet'); 
         	    				for (var iii = 0; iii < entitaet.length; iii++){
         	    					 entitaetlist = $(entitaet[iii]).find('Name');
         	    					 
         	    			//Wenn der ausgewählte Ort unter den Entitäten einer Quelle gefunden wurde, werden die Quellendaten ausgegeben.
         	    			if(selected_object.text() == entitaetlist.text())
         	    				{
         	    				var ortHeader = "<p>In folgenden Quellen wird der Ort  '<b>"+ selected_object.text() +"</b>'  erwähnt:  </p>";
        	    				$('#showSelected').html(ortHeader);
        	    				$('#showQuel').append("<p> <span  id='dokument_"+i+"_"+ii+"'><a href='#quellAnsicht'> "+werkid.text()+": "+werktitel.text()+"</a></span>" +
        	    			  	  		" <br> Quellenstelle: "+quellenid.text()+ " </p>");
      	    			  	
        	    				//Quellentext wird jeweils in einem neuen PopUp geöffnet. Möglichkeit mehrere Quellen nebeneinander zu vergleichen
    	    					// funktioniert leider noch nicht 100% Richtig.
        	    				$('#dokument_' + i+'_'+ii).msgbox({
         	    					content:  '<div class="row" id="quellAnsicht"><div class="title-header"><div id="showTitel"></div></div><div class="col-sm-8 werk-main"><div id="showContent"></div><div id="showMoreContent"></div></div><div class="col-sm-2 col-sm-offset-1"><div id="showInfo" class="sidebar-module-r"></div><div ><ol class="list-unstyled list-group" id="QuelList"></ol></div></div></div>',
         	    					title: werktitel.text(),
         	    					padding: 20,         	    					
         	    			  		width: 600,
         	    			  		height: 600,
         	    			  		overlay: false,
         	    			  		trigger: 'click'
         	    				});
        	    				
         	    			  	//Wenn eine Quelle angeklickt wird, wird ihr Inhalt angezeigt
         	    			  	$('#dokument_' + i+'_'+ii).click(displayWerkInfo.bind($('#dokument_' + i+'_'+ii), dokument[i],i))
		
         	    				}
         	    		}
         	    }
         	    }
            	} // /.clickCompare
            	
                //Laden der Quellenansicht für die Vorkommnisse
        	  	function displayWerkInfo(xml,i) {
        	  		
        	  		$('#QuelList').empty();
        	  		$('#showQuelInfo').empty(); 
        	  		$('#showMoreContent').empty();
//        	  		        	  		
        		  	$('#QuelList').append('<h4>Quellenstellen</h4>');
       		  	
        		  	//Anklicken der Quellenstellen => laden der jeweiligen Quellenstellen-Informationen
        	  		var quelle = $(xml).find('Quelle')
        	  		for(var j = 0; j < quelle.length;j++){
  		  	    	  //Quellenstelle Liste zu der bestimmten Quelle unter die blaue Box als Liste setzen
  			  	      $('#QuelList').append('<li id="quelle_'+i+'_' + j +'"><a href="#quellAnsicht">' + $(quelle[j]).find('QuellenId').text() +'</a></li>');
			  	      //Anklicken der Id einer Quellenstellen => laden der Inhalte
  			  	      $('#quelle_'+i+'_' + j ).click(displayQuelInfo.bind($('#quelle_'+i+'_' + j), quelle[j]));
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
        	  	
        	  //Laden der Quellenstellenansicht
        	  	function displayQuelInfo(xml) {
        	  		
        	  		// finden der XML-Inhalte für die Quellenstellen
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
        		  	  
        		  	  //erneutes Aufrufen und ausgeben der Autoren für die blaue Info-Box
        		  	  for(var i = 0; i < autoren.length;i++){
        			    	 autor = $(autoren[i]).find('Autor')
        			    	  for (var ii = 0; ii < autor.length; ii++){
        			    		  $('#showAuthor').append($(autor[ii]).text()+'<br>');
        			    	  }	  	    	  
        			      }
        		  	  
        		  	  //Finden und Ausgeben der untergeordneten Inhalte
        		  	  
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
        //Ende WerkLoad
    		
    			
            	// Karte anzeigen und Markierung darin ergänzen
           	 function displayMap(xml){
           		 
           		 //Karte in einem Popup öffnen. Durch anklicken eines neues Ortes wird dieser auf der Karte hinzugefügt.
           		$.msgbox({
					content:  $('#map-orte'),
					title: 'Karte',
			  		width: 700,
			  		height: 530,
			  		overlay: false,
				}); 
           		
          		$('#map-orte').show(); 
          		$('#quellAnsicht').hide();
          		$('#vorkommnisAnsicht').hide();
         		 
       /* Grundlagen Code für die Karte von Alex Abboud, angepasst und eingebaut von Gwenlyn Tiedemann*/
         		// Die Icons mit Schatten für die Pins auf der Karte
         		var smallIcon = L.icon({
         	    iconUrl: '../images/map_pin-512.png',
         	    shadowUrl: '../images/marker-shadow.png',

         	    iconSize:     [25, 25], // size of the icon
         	    shadowSize:   [20, 20], // size of the shadow
         	    iconAnchor:   [12, 23], // point of the icon which will correspond to marker's location
         	    shadowAnchor: [6, 20],  // the same for the shadow
         	    popupAnchor:  [1, -21] // point from which the popup should open relative to the iconAnchor
         				});

         		var selected_ort = $(xml).find('Name').eq(0).text();
         		  
         		  var selected_typ = $(xml).children('Typ').text();
         		  var selected_location = [1];
         		   selected_location[0] = $(xml).find('geometry location lat').text();
         		   selected_location[1] = $(xml).find('geometry location lng').text();
         		  
         		  geo_als_string = selected_location.join();
   				alle_orte[selected_ort] = geo_als_string;
   					
   				  
   				  L.marker([selected_location[0],selected_location[1]], {icon: smallIcon}).addTo(map)
   					.bindPopup(selected_ort+" ("+selected_typ+")");

         		
         	} //End displayMap
            	
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

            