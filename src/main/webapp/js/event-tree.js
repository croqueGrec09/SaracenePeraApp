/* Code von Gwenlyn Tiedemann, mit der Visualisierungsvorlage bis Zeile 158 von Mike Bostock ( https://bl.ocks.org/mbostock/4339083) */

/* JSON-Datei mit Hierarchie der Auffälligkeiten erstellt von Alex Abboud in Zusammenarbeit mit Dominik Leyendecker und Britta Hermans, 
   mithilfe der von Gwenlyn Tiedemann herausgesuchten Daten*/

/* Der dynamic Tree zeigt in einer Hierachie die Auffälligkeiten an.
 *  Durch anklicken des letzten Nodes werden in einer Liste rechts alle Quellen aufgelistet, 
 *  in denen diese Auffälligkeit aufgeführt wird.
 *  Klickt man wiederum eine der Quellen in der Liste an, wird der Inhalt dieser Quelle unter den dynamic Tree gezeigt. 
 *  (dritte Variante der Quellendarstellung, wie in der Tabelle für erwähnte Personen)
 *  Die zugehörigen Quellenstellen zu der Quelle werden links neben dem Quelleninhalt angezeigt und können durch Anklicken auch angezeigt werden.
 *  Rechts neben der Quellendarstellung befindet sich weiterhin die Auflistung der Vorkommnisse.*/

$(document).ready(function(){
	
	//dynamic Tree mithilfe der Daten aus der JSON-Datei erstellen
	var out;

	var margin = {top: 20, right: 120, bottom: 20, left: 300},
	    width = 1000 - margin.right - margin.left,
	    height = 700 - margin.top - margin.bottom;


	var i = 0,
	    duration = 750,
	    root;

	var classChanger;

	var tree = d3.layout.tree()
	    .size([height, width]);

	var diagonal = d3.svg.diagonal()
	    .projection(function(d) { return [d.y, d.x]; });

	var svg02 = d3.select("#dynamicTree").append("svg")
	    .attr("width", width + margin.right + margin.left)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	d3.json("flare", function(error, flare) {
	  if (error) console.log(error);

	  root = flare;
	  root.x0 = height / 2;
	  root.y0 = 0;

	  function collapse(d) {
	    if (d.children) {
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
	      .data(nodes, function(d) { return d.id || (d.id = ++i); });

	  // Enter any new nodes at the parent's previous position.
	  var nodeEnter = node.enter().append("g")
	      .attr("class", function(d) { if(d.name === "Handelswaren" || d.type === "tradeGoods") return "node2"; else return "node";})
	      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
	      .on("click", click);

	  nodeEnter.append("circle")
	      .attr("r", 4.5)
	      .style("fill", function(d) { let color = "#b0c4de"; if(d.name === "Handelswaren") color = "#deb0b0"; return d._children ? color : "#fff"; })
		  
		  
	  nodeEnter.append("text")
	      .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
	      .attr("dy", ".35em")
	      .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
	      .attr("data-type", function(d) { return d.type; })
		  .text(function(d) { return d.name; })
		  .on("click", loadRemarkability) 
	      .style("fill-opacity", .6);

	  // Transition nodes to their new position.
	  var nodeUpdate = node.transition()
	      .duration(duration)
	      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

	  nodeUpdate.select("#dynamicTree").select("circle")
	      .attr("r", 4.5)
	      .style("fill", function(d) { let color = "#b0c4de"; if(d.name === "Handelswaren") color = "#deb0b0"; return d._children ? color : "#fff"; });
		  
		  
	  nodeUpdate.select("#dynamicTree").select("text")
	      .style("fill-opacity", 1);

	  // Transition exiting nodes to the parent's new position.
	  var nodeExit = node.exit().transition()
	      .duration(duration)
	      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
	      .remove();

	  nodeExit.select("#dynamicTree").select("circle")
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
	  } else {						//ausklappen
	    d.children = d._children;
	    d._children = null;	
	  }
	  update_auff(d);
	};

	function loadRemarkability(){ //Anklicken der Auffälligkeit, um Vorkommnisliste zu laden
		var keyword = $(this).text();
		//Holen der Quellen per AJAX-Abfrage der übergebenen ID
		$.ajax({
			type: "GET",
			url: "getSourcesByKey/"+keyword+"/"+$(this).attr("data-type"),
			success: function(response) {
				$('#viewOccurence').empty().html(response);
			},
			error: function() {
				alert("Fehler beim Laden der Quellenstellen!");
			}
		});
	}
	
});
