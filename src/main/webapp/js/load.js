/*Code von Gwenlyn Tiedemann*/

/* Laden der XML-Daten und einfügen in eine Tabelle für das Quellenverzeichnnis und eine Tabelle für die Quellenverfasser.
 * 		In beiden Tabellen sind alle Spalten sortierbar und es besteht die Möglichkeit die Tabellen zu durchsuchen.
 * Wenn man die Werkstitel in den Tabellen anklickt, wird der Inhalt der Quelle angezeigt.
 * Hier zwei Varianten der Quellendarstellung: [andere Varianten: 3. Personenregister, 4. Ortsregister]
 * 1. Beim Anklicken des Werktitels im Quellenverzeichnis, wird die Tabelle mit der Quellendarstellung ausgetauscht.
 * 		Alle Werke der Sammlung sind noch einmal auf der linken Seite aufgelistet und anklickbar.
 * 		Auf der rechten Seite werden unter der blauen Info-Box die zugehörigen Quellenstellen aufgelistet, die auch anklickbar sind.
 * 		In der Mitte wird der Inhalt der Quelle/Quellenstelle angezeigt.
 * 2. Beim Anklicken des Werktitel im Verfasserregister, wird die Quelle in einem Popup geöffnet.
 * 		Darstellung wie beim Quellenverzeichnis, nur ohne die Werksauflistung links. */

$(document).ready(function(){
	
	//Search-PlugIn für die dynamisch geladene Tabellen (Quellenverzeichnis und Verfasserregister)
	var qs = $('input#search').quicksearch('table tbody tr ');

	  //Ajax-Aufruf, um die XML zu parsen
        $.ajax({
            type: "GET",
            url: "data/Sarazenen_Final_Map_v0.1.xml",
            dataType: "xml",
            success: function(xml){
            
            var Werktitel, WerkId, Autor, LebensdatenVerfasser, Abfassungszeitraum, Abfassungsort, Region, Editionshinweise, Werkinformation;  
            var autoren, autor;

            var dokument = $(xml).find('Dokumente')
            //Inhalte pro Dokument finden und in Templates einbinden
	  	    for (var i = 0; i < dokument.length; i++) {
	  	    	
	  	    	//linke Quellenliste der Quellendarstellung mit Daten füllen, Clickevent hinzufügen und verstecken, bis eine Quelle angezeigt werden soll.
	  	    		//Auflistung mit WerktId und Werktitel
	  	      $('#werkList').append('<a href="#quellAnsicht"><button type="button" class="list-group-item" id="dokument_' + i + '">' + $(dokument[i]).find('WerkId').text() + ': ' + $(dokument[i]).find('WerkTitel').text() + '</button></a>');
			  //auszulagern
	  	      $('#dokument_' + i).click(displayWerkInfo.bind($('#dokument_' + i), dokument[i])); //Klickweiterleitung für die Quellenliste
	  	      $('#quellAnsicht').hide(); //Quellentext Vollansicht verstecken

	  	      
	  		//Quellenverzeichnis Tabelle mit Daten füllen und Clickevent hinzufügen.
	  	      	//WerkId, Werktitel, Alternativtitel, Verfasser, Abfassungszeitraum und Abfassungsort
		  	  $('#bindWerk').append('<tr><td>'+ $(dokument[i]).find('WerkId').text() +'</td><td id="dokument_' + i + '" class="link">'+ $(dokument[i]).find('WerkTitel').text() + '</td><td id="alttitel_'+i+'"></td><td id="autor_'+i+'"></td><td>'+ $(dokument[i]).find('Abfassungszeitraum').text() + '</td><td>'+ $(dokument[i]).find('Abfassungsort').text() + '</td></tr>');	  	  
		  	  $('#dokument_' + i).click(displayWerkInfo.bind($('#dokument_' + i), dokument[i]));
  		  		qs.cache(); //Pufferspeicher damit der Quicksearcher PlugIn auf die dynamisch geladenen Daten zugreifen kann.

		  	  var altTitel = $(dokument[i]).find('Alternativtitel')		//Alternativtitel
			      for(var a = 0; a < altTitel.length;a++){
			    	  var titel = $(altTitel[a]).find('Titel')
			    	  for (var aa = 0; aa < titel.length; aa++){
			    		  $('#alttitel_'+i).append($(titel[aa]).text()+'<br>');
			    	  }	  	    	  
			      }
			  	autoren = $(dokument[i]).find('Autoren')				// Autoren				
			      for(var au = 0; au < autoren.length;au++){
			    	 autor = $(autoren[au]).find('Autor')
			    	  for (var aut = 0; aut < autor.length; aut++){
			    		  $('#autor_'+i).append($(autor[aut]).text()+'<br>');
			    	  }	  	    	  
			      }
		  	  
		  	 //Autorenverzeichnis Tabelle mit Daten füllen und Clickevent hinzufügen
			  		//Autor, Lebensdaten, Werktitel
		      for(var ii = 0; ii < autoren.length;ii++){ //für jeden Autor ein Eintrag.
		    	 autor = $(autoren[ii]).find('Autor')
		    	  for (var iii = 0; iii < autor.length; iii++){
		  	$('#bindAuthor').append('<tr><td>'+ $(autor[iii]).text() +'</td><td>'+$(dokument[i]).find('LebensdatenVerfasser').text()+'</td><td class="link" id="dokument_' + i +'_'+iii+ '">'+ $(dokument[i]).find('WerkTitel').text() + '</td></tr>');
		  	qs.cache(); //Pufferspeicher damit der Quicksearcher PlugIn auf die dynamisch geladenen Daten zugreifen kann.
		  	
		  	//Quellenansicht in PopUp öffnen. Immer nur ein Fenster.
		  	$('#dokument_' + i+'_'+iii).msgbox({
					content: $('#quellAnsicht'),
					title: $(dokument[i]).find('WerkTitel').text(),
					padding: 20,         	    					
			  		width: 800,
			  		height: 600,
			  		drag: window,
			  		icons:[close]
				});
			//Wenn eine Quelle angeklickt wird, wird ihr Inhalt in einem PopUp angezeigt
		  	$('#dokument_' + i+'_'+iii).click(displayWerkInfo.bind($('#dokument_' + i+'_'+iii), dokument[i]));
		  	}}
		
	  	    }
			
       	 //Laden der Inhalte für die angeklickte Quelle
	  	function displayWerkInfo(xml) {

	  		//Listen leeren, um neuen Inhalt anzuzeigen	  		
	  		$('#QuelList').empty();
	  		$('#sidebar-l').empty();
	  		$('#werkBack').empty();
	  		$('#werkEdit').empty();
	  		$('#werkExport').empty();
	  		$('#showQuelInfo').empty(); 
	  		$('#showMoreContent').empty();
	  		
	  		
	  	//Titel und Buttons hinzufügen
		  	$('#QuelList').append('<h4>Quellenstellen</h4>');
		  	$('#sidebar-l').append('Quellen');
		  	$('#werkBack').append(" <a href='#'><button type='button' class='list-group-item'>Zurück zum Quellenverzeichnis</button></a>");
		  	$('#werkEdit').append(" <a href='/edit/"+$(xml).find("WerkId").text().replace(/^[0]+/g,"")+"'><button type='button' class='list-group-item'>Werk bearbeiten</button></a>");
		  	$('#werkExport').append(" <a href='/export/"+$(xml).find("WerkId").text()+"'><button type='button' class='list-group-item'>Werk als TEI-XML exportieren</button></a>");


		  	
		  //Elemente verstecken/anzeigen, je nachdem, was gerade ausgewählt wurde
	  		$('#werkTable').hide();
	  		$('#searchbutton').hide();
	  		$('#quellAnsicht').show(); //Quellentext Vollansicht anzeigen
		  	
		  	$('#werkBack').click(function(){ 
		  		$('#werkTable').show();
		  		$('#searchbutton').show();
		  		$('#quellAnsicht').hide();
		  	})
		  	

	  		var quelle = $(xml).find('Quelle')
		  	      for(var j = 0; j < quelle.length;j++){
		  	    	  //Quellenstelle Liste zu der bestimmten Quelle unter die blaue Box als Liste setzen
			  	      $('#QuelList').append('<li id="quelle_' + j +'"><a href="#quellAnsicht">' + $(quelle[j]).find('QuellenId').text() +'</a> <a href="/edit/source/'+$(xml).find("WerkId").text().replace(/^[0]+/g,"")+'/'+(j+1)+'">bearbeiten</a></li>');
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
		  	  
		  	  
				 // ausgeben der XML-Inhalte
		  	  //Header: WerkTitel und Alternativnamen
		  	  var werkHeader = "<h1 class='main-title'>"+WerkTitel+"</h1> <p class='sub-title' id='altTitel'> </p>";
		  	  $('#showTitel').html(werkHeader);

		  	  //Main Content: Abfassungszeitraum, Abfassungsort, Regionen, Editionshinweise und Werkinformationen
		  	  var werkInfo = "<p><b>Abfassungszeitraum:</b> "+Abfassungszeitraum+"</p><p><b>Abfassungsort:</b> "+Abfassungsort+"</p><p><b>Region:</b><ul id='showRegion'></ul></p><p><b>Editionshinweise:</b> <p>"+Editionshinweise+"</p><hr><p><b>Allgemeines </b></p>"+Werkinformation+"</p></hr>";
		  	  $('#showContent').html(werkInfo);
		  	  
		  	  //blaue Box: Autor mit Lebensdaten
		  	  var verfInfo = "<div  class='sidebar-module-r sidebar-module-inset'><h4>Verfasser</h4><p><span id='showAuthor'></span>("+LebensdatenVerfasser+ ")</br></p></div>";
		  	  $('#showInfo').html(verfInfo);
		  	  
			 //Finden und Ausgeben der untergeordneten Inhalte
		  	  var altTitelArray = [];
		  	  var altTitelList;
	  	var altTitel = $(xml).find('Alternativtitel')		//Alternativtitel
	      for(var i = 0; i < altTitel.length;i++){
	    	  var titel = $(altTitel[i]).find('Titel')
	    	  for (var ii = 0; ii < titel.length; ii++){
	    		  altTitelArray[ii] = $(titel[ii]).text();
	    		  altTitelList = altTitelArray.join(', '); 	//Einzelne Titel werden mit Kommas getrennt und in einer Zeile angezeigt.
	    	  }	  	    	  
	    	  $('#altTitel').append(altTitelList);
	      }
	  	
	  	autoren = $(xml).find('Autoren')						//Autoren
	      for(var i = 0; i < autoren.length;i++){
	    	 autor = $(autoren[i]).find('Autor')
	    	  for (var ii = 0; ii < autor.length; ii++){
	    		  $('#showAuthor').append($(autor[ii]).text()+'<br>');
	    	  }	  	    	  
	      }
	  	
	  	var regionen = $(xml).find('Regionen')					//Regionen
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
		  	  var werk = "<div  class='sidebar-module-r sidebar-module-inset'><h4> Werk </h4><p>"+WerkTitel+"</p><p>"+Abfassungszeitraum+"</p><p>"+Abfassungsort+"</p><h5><b>Verfasser</b></h5><p><div id='showAuthor'></div> ("+LebensdatenVerfasser+")</p></div>";
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
  	
	  	}// /.displayQuelInfo()
	  	
//Ende WerkLoad
	  	
       },
            error: function() {
            alert("An error occurred while processing XML file.");
            }
            }); // Ende Ajax xml Sarazenen
		


		
		
            });
