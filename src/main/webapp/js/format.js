/* Code von Gwenlyn Tiedemann*/

/* In dieser JSON werden allgemeine Formatierungsfunktionen gesammelt*/


//Einbinden von Header und Footer
$(function(){
	    $("[data-load]").each(function(){
	        $(this).load($(this).data("load"), function(){
	        });
	    });
	});


// Orte-Tabelle: Alternativnamen einklappbar machen, damit die Tabelle nicht zu lang wird. 
/*Funktioniert plötzlich hier nicht mehr. Fehler konnte nicht mehr gefunden werdens*/
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



$(document).ready(function(){
	 
//	//fixed Position für die Vorkommniss-Liste 
//	var vorkommnisPosition = $('#vorkommnisAnsicht').offset();
//	$(window).scroll(function(){
//	        if($(window).scrollTop() > vorkommnisPosition.top){	
//	              $('#vorkommnisAnsicht').css('position','fixed').css('top','0');
//	        } 
//	        
//	        else {
//	            $('#vorkommnisAnsicht').css('position','static');
//	        }    
//	});
//	
		
		//Sortierung der Tabellen => funktioniet bis auf die Teile mit Verlinkung (<a/> steht im weg)!
			
			$('th').click(function(){
			    var table = $(this).parents('table').eq(0)
			    var rows = table.find('tr:gt(0)').toArray().sort(comparer($(this).index()))
			    this.asc = !this.asc
			    if (!this.asc){rows = rows.reverse()}
			    for (var i = 0; i < rows.length; i++){table.append(rows[i])}
			})
			function comparer(index) {
			    return function(a, b) {
			        var valA = getCellValue(a, index), valB = getCellValue(b, index)
			        return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.localeCompare(valB)
			    }
			}
			function getCellValue(row, index){ return $(row).children('td').eq(index).html() }
			
			
			// Sortierung läuft nicht über den Tablesorter-PlugIn, aber das Layout wird verwendet.
			$("#tablePers").tablesorter(); 
			$("#tableAuth").tablesorter();
			$("#ortTable").tablesorter(); 
			$("#werkTable").tablesorter();



			
});