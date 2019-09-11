/* Code von Alexander Abboud mit der Visualisierungsvorlage bis Zeile 158 von Mike Bostock ( https://bl.ocks.org/mbostock/4339083 ) */

/*
	Die Auffälligkeiten (geparst und ungeparst) werden in Array gesammelt um ausgewählte Schlagworte nicht zu verlieren und 
	eine Weiterarbeit zu gewährleisten
*/

var aSammler = [];
var aSammlerAlt = [];
var aSammlerUn = [];
var superCategories = [];

$(document).ready(function(){

var out;

var margin02 = {top: 20, right: 120, bottom: 20, left: 120},
    width02 = 580 - margin02.right - margin02.left,
    height02 = 580 - margin02.top - margin02.bottom;


var i02 = 0,
    duration = 750,
    root;

var classChanger;

var tree = d3.layout.tree()
    .size([height02, width02]);

var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

var svg02 = d3.select("#remarkabilities").append("svg")
    .attr("width", width02 + margin02.right + margin02.left)
    .attr("height", height02 + margin02.top + margin02.bottom)
  .append("g")
    .attr("transform", "translate(" + margin02.left + "," + margin02.top + ")");

d3.json("flare", function(error, flare) {
  if (error) throw error;

  root = flare;
  root.x0 = height02 / 2;
  root.y0 = 0;

  function collapse(d) {
    if (d.children) {
	  superCategories.push(d.name);
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }
  }
  root.children.forEach(collapse);
  update_auff(root);
});


d3.select(self.frameElement).style("height", "800px");

function update_auff(source) {

  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
      links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 120; });

  // Update the nodes…
  var node = svg02.selectAll("g.node, g.node2")
      .data(nodes, function(d) { return d.id || (d.id = ++i02); });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
      .attr("class", function(d) { if(d.name === "Handelswaren" || d.type === "tradeGoods") return "node2"; else return "node"; })
      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
      .on("click", click);

  nodeEnter.append("circle")
      .attr("r", 4.5)
      .style("fill", function(d) { let color = "#b0c4de"; if(d.name === "Handelswaren") color = "#deb0b0"; return d._children ? color : "#fff"; })
	  .attr("class", (function(d) { return parseClass(d.name); })  );
	  
	  
  nodeEnter.append("text")
      .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
      .attr("dy", ".35em")
      .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
	  .attr("data-type", function(d) { return d.type; })
      .attr("class", (function(d) { return parseClass(d.name)+" "+d.type; })  )
	  .text(function(d) { return d.name; })
      .style("fill-opacity", .6);

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

  nodeUpdate.select("#auffallendes").select("circle")
      .attr("r", 4.5)
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });
	  
	  
  nodeUpdate.select("#auffallendes").select("text")
      .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
      .remove();

  nodeExit.select("#auffallendes").select("circle")
      .attr("r", 1e-6);

  nodeExit.select("text")
      .style("fill-opacity", 1e-6);

  // Update the links…
  var link = svg02.selectAll("path.link")
      .data(links, function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
        var o = {x: source.x0, y: source.y0};
        return diagonal({source: o, target: o});
      });

  // Transition links to their new position.
  link.transition()
      .duration(duration)
      .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = {x: source.x, y: source.y};
        return diagonal({source: o, target: o});
      })
      .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

// Toggle children on click.
function click(d) {
  if (d.children) {				//einklappen
	d._children = d.children;
    d.children = null;
  } else {						//ausklappen: Hier startet die von mir geschriebene Funktion quellen_ausgeben(), welche die Auffälligkeitsoptionen verwaltet
    d.children = d._children;
    d._children = null;
	if (superCategories.indexOf(d.name) < 0) {
	quellen_ausgeben(d.name,d.type);
	}	
  }
  update_auff(d);
  
  /* Aktiviere Anhand des Auffälligkeitsarrays die Worte in der Grafik */
  	if (aSammler!=0) {
		for (c = 0; c < aSammler.length ; c++){
		d3.select("#remarkabilities").selectAll('.'+aSammler[c]).style("fill", "#0000FF");
		}
	}
}

});


/* Array mit den Begriffen füllen. Falls ein Begriff noch nicht im Array drin ist, Färben ausführen. Falls doch, Färben zurücknehmen */
function quellen_ausgeben(name,type){

	var astring = "";
	var astringAlt = "";
	var aausgabe = "";
	var aFund;

	// Einen geparsten Namen für die Verarbeitung und ein ungeparsten für die textuelle Ausgabe
	ungepName = name;
	name = parseClass(name);


	/*
		Falls die Funktion vom Slider ausgelöst wird, ändern sich die Auffälligkeiten nicht. Es sollen aber die neuentstandenen Kreise
		bei positiver Klassenzugehörigkeit zum (eventuell) bereits vorhandenen Auffälligkeitsarray vergrößert und eingefärbt werden
	*/

	if (name == "vonSlide") {
			if (aSammler.length != 0) {
			// Erstelle einen String, welcher D3 zur Prüfung, ob ein Kreis all diese Klassen aufweist, nutzen kann
			for (as = 0; as < aSammler.length ; as++) {
				astring = astring.concat('.'+aSammler[as]);
			}
			d3.select("#map").selectAll(astring).attr("r", 10);	
			}
		}



	/*
		Falls die Funktion durch einen Klick auf den Ort aufgerufen wurde, ändert sich nicht das Set an Auffälligkeiten
		Das einzige, was geprüft werden muss, ist ob mit den ausgewählten Auffälligkeiten Text eingefärbt werden muss
	*/
	if (name == "vonOrt") {
		
		if (aSammler.length != 0) {
			
			// Erstelle einen String, welcher D3 zur Prüfung, ob ein Text all diese Klassen aufweist, nutzen kann
			for (as = 0; as < aSammler.length ; as++) {
				astring = astring.concat('.'+aSammler[as]);
			}
			
			if ((d3.select("#ausgabe").selectAll(astring)) != 0) {
				d3.select("#ausgabe").selectAll(astring).style("border-color", "#0000FF").style("border-style", "solid");
			}
			
		}
	} 

	
	/*
		Wenn die Funktion weder vom Slider, noch von der Karte aufgerufen wurde, wurde eine Auffälligkeit ausgewählt.
		Einige Änderungen müssen vorgenommen werden
	*/

	if (name != "vonSlide" && name != "vonOrt") {
		
	//Wenn es diese Auffällligkeit unter des Kreisen gibt
	if (d3.select("#map").selectAll('.'+name) != 0) {
		
		// Wenn der Begriff nicht im Array steht, füge ihn hinzu
		if (!(aFund = aSammler.includes(name))) {
			aSammlerAlt = Array.from(aSammler);
			aSammler.push(name);
			aSammlerUn.push(ungepName);
			//console.log("aSammler in False "+aSammler);
			//console.log("aSammlerAlt in False "+aSammlerAlt);
			
			// Erstelle einen String, welcher D3 zur Prüfung, ob ein circle all diese Klassen aufweist, nutzen kann
			for (as = 0; as < aSammler.length ; as++) {
				astring = astring.concat('.'+aSammler[as]);
			}
			
			// Erstelle einen String mit dem alten Auffälligkeitsarray, damit eventuelle Veränderungen wieder zurückgenommen werden können
			for (at = 0; at < aSammlerAlt.length ; at++) {
				astringAlt = astringAlt.concat('.'+aSammlerAlt[at]);
			}	
			
			// Falls astringAlt nicht leer ist, dann wurden bereits Kreise auf dem Feld vergrößert. Diese sollen dann wieder auf Null gesetzt werden...
			if (astringAlt != "") {
			d3.select("#map").selectAll(astringAlt).attr("r", 0);
			d3.select("#ausgabe").selectAll(astringAlt).style("border-style", "none");
			}
			// ... um anschließend mit dem neuen Auffälligkeitsstring die Kreise einzufärben
			d3.select("#map").selectAll(astring).attr("r", 10);
			d3.select("#ausgabe").selectAll(astring).style("border-color", "#0000FF").style("border-style", "solid");		
			} else
			{
		// Schon im Array vorhandenes Element ausfindig machen, um es dann zu entfernen
			var i = aSammler.indexOf(name);
				if(i != -1) {
					aSammler.splice(i, 1);
				}
			var di = aSammlerUn.indexOf(ungepName);
				if(di != -1) {
					aSammlerUn.splice(i, 1);
				}	
				
				// Erstelle einen String, welcher D3 zur Prüfung, ob ein circle all diese Klassen aufweist, nutzen kann
				for (as = 0; as < aSammler.length ; as++) {
				astring = astring.concat('.'+aSammler[as]);
				}
				
				// An dieser Stelle werden die Kreise von der entfernten Klasse entfernt. Da die Kreise aber trotzdem bleiben könnten
				// (weil die anderen Auffälligkeiten noch zutreffen)...
				d3.select("#map").selectAll('.'+name).attr("r", 0);
				d3.select("#ausgabe").selectAll('.'+name).style("border-style", "none");
				
				// ... vergrößere (falls der sting nicht leer ist) die alte Auswahl wieder
				// Färbe - falls vorhanden - die Quellenstellen mit den Auffälligkeiten wieder ein
				if (astring != "") {
				d3.select("#map").selectAll(astring).attr("r", 10);
				d3.select("#ausgabe").selectAll(astring).style("border-color", "#0000FF").style("border-style", "solid");
				}
				
				// Die Deaktivierung der Auffälligkeitsbegriffs in dem Begriffsbaum
				d3.select("#remarkabilities").selectAll("text."+name).style("fill", "#000000");
				d3.select("#remarkabilities").selectAll("circle."+name).style("fill", "#FFFFFF");
				
			//console.log("aSammler in True "+aSammler);
			//console.log("aSammlerAlt in True "+aSammlerAlt);
			}
		
	}	
	}

	// Die Textausgabe in das "aktivierte Auffälligkeitfeld"
		if (aSammlerUn.length != 0) {
			// Erstelle einen String aus den Auffälligkeiten zur Ausgabe
			for (as = 0; as < aSammlerUn.length ; as++) {
				aausgabe = aausgabe.concat('- '+aSammlerUn[as]+' - ');
			}
			d3.select('#ausgewaehlteA').text(aausgabe);
		} else {
			d3.select('#ausgewaehlteA').text("Keine Auffälligkeiten oder Handelsware ausgewählt");	
		}
}