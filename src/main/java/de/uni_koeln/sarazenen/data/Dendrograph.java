package de.uni_koeln.sarazenen.data;

import java.util.Set;
import java.util.TreeSet;

import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

public class Dendrograph {

	private String name;
	private Set<Remarkabilities> children;
	
	public Dendrograph(NodeList root,String projectString) {
		name = projectString;
		NodeList superCategories = root.item(0).getChildNodes();
		children = new TreeSet<>();
		for(int s = 0;s < superCategories.getLength();s++) {
			if(superCategories.item(s).getNodeType() == Node.ELEMENT_NODE) {
				Element superCategory = (Element) superCategories.item(s);
				String type = "remarkability";
				if(superCategory.getAttribute("name").equals("Handelswaren"))
					type = "tradeGoods";
				Remarkabilities rem = new Remarkabilities(superCategory.getAttribute("name"),superCategory.getElementsByTagName("remarkability"),type);
				children.add(rem);
			}
		}
	}

	public String getName() {
		return name;
	}

	public Set<Remarkabilities> getChildren() {
		return children;
	}

}
