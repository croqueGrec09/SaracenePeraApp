/*
	Angepasster Code von Gwenlyn Tiedemann
	angepasst von Andreas Gálffy
*/

/* 
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
	//seitenweit geltende Parameter
	//Search-PlugIn für die dynamisch geladene Tabellen (Quellenverzeichnis und Verfasserregister)
	if($('input#search').length > 0)
		var qs = $('input#search').quicksearch('table tbody tr ');
	//linke Quellenliste der Quellendarstellung verstecken, bis eine Quelle angezeigt werden soll.
	$("#quellAnsicht").hide();
	var work = null;
	
//------------------------------------------------------------ Eventbereich ----------------------------------------------------------------------------

	$(".container-fluid").on("click",".viewWorkInfo, .loadWork",function(){
		$.ajax({
			type: "GET",
			url: "singleWork/"+$(this).attr("data-work"),
			success: function(response){
				$("#mainList, #workTable").hide();
				$("#workView div").remove();
				$("#workView").css("display","flex").append(response);
			},
			error: function() {
				alert("An error occurred while loading work.");
            }
		});
	});

	$(".container-fluid").on("click",'#workBack',function(){ 
		$('#workView').hide();
		$('#mainList, #workTable').show();
		$('#workView div').remove();
	});
	
	$("#viewWork").on("click",'#workBackModal',function(){ 
		$("#showMoreContent").empty();
		$(this).hide();
	});

	$(".container-fluid").on("click",".viewSource",function(){
		$.ajax({
			type: "GET",
			url: "singleSource/"+$(this).attr("data-work")+"/"+$(this).attr("data-source"),
			success: function(response){
				$("#showMoreContent").html(response);
			},
			error: function() {
				alert("An error occurred while loading work.");
            }
		});
	});
	
	$("#workView").on("click",".viewSource",function(){
		$.ajax({
			type: "GET",
			url: "singleSource/"+$(this).attr("data-work")+"/"+$(this).attr("data-source"),
			success: function(response){
				$("#showMoreContent").empty().html(response);
				$("#workBackModal").show();
			},
			error: function() {
				alert("An error occurred while loading work.");
            }
		});
	});
	
	//Anzeigen der Quellen, in denen die ausgewählte Person unter Entitäten aufgeführt wird.
	$(".container-fluid").on("click",".loadOccurence",function(){
		$('#sourceView').remove();
		//Holen der Quellen per AJAX-Abfrage der übergebenen ID
		$.ajax({
			type: "GET",
			url: "getSourcesByKey/"+$(this).attr("data-id")+"/"+$(this).attr("data-queryType"),
			success: function(response) {
				$('#viewOccurence').empty().html(response);
			},
			error: function() {
				alert("Fehler beim Laden der Quellenstellen!");
			}
		});
	});
	
	//Anzeigen der Quellen, in denen der ausgewählte Ort unter Entitäten aufgeführt wird. Ausgabe in Modal
	$(".container-fluid").on("click",".loadWorkPopup",function(){
		//Holen der Quellen per AJAX-Abfrage der übergebenen ID
		$.ajax({
			type: "GET",
			url: "singleWorkModal/"+$(this).attr("data-work"),
			success: function(response) {
				$('#workView').show().empty().html(response);
				$('#workView .modal').modal();
			},
			error: function() {
				alert("Fehler beim Laden der Quellenstellen!");
			}
		});
	});
	
});