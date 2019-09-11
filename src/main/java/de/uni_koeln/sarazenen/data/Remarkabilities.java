package de.uni_koeln.sarazenen.data;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

public class Remarkabilities implements Comparable<Remarkabilities> {

	private String name;
	private Set<Map<String,String>> children;
	
	public Remarkabilities(String name,NodeList leaves, String type) {
		this.name = name;
		children = new HashSet<Map<String,String>>();
		for(int l = 0;l < leaves.getLength();l++) {
			Map<String,String> rem = new HashMap<String,String>();
			Element remarkability = (Element) leaves.item(l);
			rem.put("name", remarkability.getTextContent());
			rem.put("type", type);
			children.add(rem);
		}
	}
	
	public String getName() {
		return name;
	}
	
	public Set<Map<String, String>> getChildren() {
		return children;
	}

	@Override
	public int compareTo(Remarkabilities o) {
		return name.compareTo(o.getName());
	}
	
}
