/* Code von Gwenlyn Tiedemann*/

/* Laden der XML-Daten und einfügen in eine Tabelle für die Personen, die in den Quellen erwähnt werden.
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

	// Alternativnamen in der Tabelle einklappbar machen, damit die Tabelle nicht zu lang wird.
	$(function togglePers() {
	    var $research = $('#tablePers');
	    $research.find("p").not('.accordion').hide();
	    
	    $research.find(".accordion").click(function(){
	    	$(this).find('span').toggleClass('glyphicon glyphicon-menu-down').toggleClass('glyphicon glyphicon-menu-right');

	        $research.find('.accordion').not(this).siblings().fadeOut(500);
	        $(this).siblings().fadeToggle(500);
	    }).eq(0).trigger('click');
	});
	
	//Search-PlugIn für die dynamisch geladene Tabelle (Personen)
	var qs = $('input#search').quicksearch('table tbody tr ');
	
	//Ajax-Aufruf, um die XML zu parsen
        $.ajax({
            type: "GET",
            url: "data/Sarazenen_Final_Map_v0.1.xml",
            dataType: "xml",
            success: function(xml){
              var alternativnamen, altname;
  		  	  var WerkTitel, WerkID, LebensdatenVerfasser, Abfassungszeitraum, Abfassungsort, Editionshinweise, Werkinformation, autoren, autor;

        	  	var dokument = $(xml).find('Dokumente');
            	var person = $(xml).find('Person')
            	//Inhalte pro Person finden und in Template einbinden
    	  	    for (var i = 0; i < person.length; i++) {
    	  	    //Personenverzeichnis Tabelle mit Daten füllen
        		  	$('#bindPerson').append('<tr><td>' + $(person[i]).find('Name').eq(0).text() + '</td><td>'+ $(person[i]).find('Rolle').text() +  '</td><td id="altnamen_'+i+'"><p class="accordion"><span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span> &#160;&#160;&#160;&#160;&#160;&#160;'+$(person[i]).find('Name').eq(1).text()+'</p></td><td> <a href="#vorkommnisAnsicht" id="vorkommnis_'+i+'"> Auflistung anzeigen </a></td></tr>');
        		  	qs.cache(); //Pufferspeicher damit der Quicksearcher PlugIn auf die dynamisch geladenen Daten zugreifen kann.
        		  	
    		  	 alternativnamen = $(person[i]).find('Alternativnamen') //Alternativnamen
	  	    	for (var ii = 0; ii < alternativnamen.length; ii++){
	  	    		 altname = $(alternativnamen[ii]).find('Name')
	  	    		for (var iii = 1; iii < altname.length; iii++)
	  	    			{
	  	    		  	$('#altnamen_'+i).append('<ol>'+$(altname[iii]).text()+'</ol>');
	  	    			}
	  	    		 }
    		  	 
 		  	 	//onclick Anzeigen der Quellen, in denen die ausgewählt person unter Entitäten aufgeführt wird.
             	$('#vorkommnis_'+i).click(clickCompare.bind($('#vorkommnis_'+i), person[i]));
    		  	 
    	  	    }
            	

            	// dynamisches Laden der zugehörigen Quellenstellen aus der XML als Auflistung
            	function clickCompare(xml){
        	
            	$('#quellAnsicht').hide();
				$('#showSelected').empty();
            	$('#showQuel').empty();

            	//Namen der ausgewählten Person finden
    		  var selected_object = $(xml).find('Name').eq(0);
      		 
    		  //Für jedes Dokument die Daten beziehen
         	    for (var i = 0; i < dokument.length; i++){
         	    	var werkid = $(dokument[i]).find('WerkId');
         	    	var werktitel = $(dokument[i]).find('WerkTitel');
         	    	//Für jede Quellenstelle im Dokument die Daten beziehen
         	    	var quelle = $(dokument[i]).find('Quelle');
         	    		for (var ii = 0; ii < quelle.length; ii++){
         	    			var quellenid = $(quelle[ii]).find('QuellenId');
         	    			var entitaet = $(quelle[ii]).find('Entitaet');         	    			 
         	    				for (var iii = 0; iii < entitaet.length; iii++){
         	    					var entitaetlist = $(entitaet[iii]).find('Name');
         	    					
                 	    //Wenn die ausgewählte Person unter den Entitäten einer Quelle gefunden wurde, werden die Quellendaten ausgegeben.
         	    			if(selected_object.text() == entitaetlist.text())
         	    				{
         	    				var ortHeader = "<p>In folgenden Quellen wird der Ort  '<b>"+ selected_object.text() +"</b>'  erwähnt:  </p>";
        	    				$('#showSelected').html(ortHeader);
        	    				$('#showQuel').append("<p> <span  id='dokument_"+i+"_"+ii+"_"+iii+"'><a href='#quellAnsicht'> "+werkid.text()+": "+werktitel.text()+"</a></span>" +
        	    			  	  		" <br> Quellenstelle: "+quellenid.text()+ " </p>");
        	    				
         	    			  	//Wenn eine Quelle angeklickt wird, wird ihr Inhalt angezeigt
         	    			  	$('#dokument_' + i+'_'+ii+'_'+iii).click(displayWerkInfo.bind($('#dokument_' + i+'_'+ii+'_'+iii), dokument[i]));
         	    			 
         	    				}	
         	    		}       	    			
         	    }
         	    }
            	} // /.Function clickCompare
            	
            	 //Laden der Quellenansicht für die Vorkommnisse
        	  	function displayWerkInfo(xml) {

        	  		//Elemente leeren, um neuen Inhalt anzuzeigen	  		
        	  		$('#werkTable').empty();
        	  		$('#QuelList').empty();
        	  		$('#showQuelInfo').empty(); 
        	  		$('#showMoreContent').empty();
        	  		
        	  		$('#quellAnsicht').show(); //Quellentext Vollansicht anzeigen
        	  		
        		  	$('#QuelList').append('<h4>Quellenstellen</h4>');
        		  	
        		  	//Anklicken der Quellenstellen => laden der jeweiligen Quellenstellen-Informationen
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
        		  	  
        		  	  //erneutes Aufrufen und ausgeben des Autoren für die blaue Info-Box
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
