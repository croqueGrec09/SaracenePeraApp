/*
	Code von Alexander Abboud
	Diese Funktion ist geschrieben um die Auffällichkeiten und Orte Klassenkonform zu machen: Keine Leerzeichen innerhalb eines Auffälligkeitsbegriffs
	(wird sonst als zwei Klassen gewertet) und keine unerlaubten Sonderzeichen (z.B. / und ( und ) etc)
*/
	function parseClass (name) {
		name = name.replace(/[ /();'.?!,]/g, "_")
		.replace(/[ÉéÈèÊê]/g, "e")
		.replace(/[ÓóÒòÔôÖö]/g, "o")
		.replace(/[ÍíÌìÎîÏï]/g, "i")
		.replace(/[ÁáÀàÂâÄä]/g, "a")
		.replace(/[ÚúÙùÛûÜü]/g, "u");
		return name;
	}

// D3 gibt die Orte standardmäßig auf Englisch aus, dies wird hiermit überschrieben	
	var myFormatters = d3.locale({		
	  "decimal": ",",
	  "thousands": ".",
	  "grouping": [3],
	  "currency": ["$", ""],
	  "dateTime": "%a %b %e %X %Y",
	  "date": "%m/%d/%Y",
	  "time": "%H:%M:%S",
	  "periods": ["AM", "PM"],
	  "days": ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
	  "shortDays": ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
	  "months": ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
	  "shortMonths": ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]
	});