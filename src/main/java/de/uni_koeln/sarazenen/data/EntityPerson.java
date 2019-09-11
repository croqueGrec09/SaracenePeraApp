package de.uni_koeln.sarazenen.data;

import java.util.ArrayList;
import java.util.List;

public class EntityPerson implements Comparable<EntityPerson> {

	private String id;
	private String name;
	private List<String> altNames = new ArrayList<String>();
	private String role;
	
	public String getId() {
		return id;
	}
	
	public void setId(String id) {
		this.id = id;
	}
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public List<String> getAltNames() {
		return altNames;
	}
	
	public void setAltNames(List<String> altNames) {
		this.altNames = altNames;
	}
	
	public String getRole() {
		return role;
	}
	
	public void setRole(String role) {
		this.role = role;
	}

	@Override
	public int compareTo(EntityPerson o) {
		return name.compareTo(o.getName());
	}
	
	@Override
	public String toString() {
		String altNamesString = "";
		StringBuilder sb = new StringBuilder();
		for(String altName: altNames) {
			sb.append('"');
			sb.append(altName);
			sb.append('"');
			sb.append(',');
		}
		altNamesString = sb.toString();
		if(altNamesString.contains(","))
			altNamesString = altNamesString.substring(0,sb.length()-1);
		return "{\"id\":\""+id+"\",\"name\":\""+name+"\",\"altNames\":["+altNamesString+"],\"role\":\""+role+"\"}";
	}
}