package de.uni_koeln.sarazenen.data;

import java.util.Map;
import java.util.TreeMap;

public class AuthorResult implements Comparable<AuthorResult> {

	private String name;
	private String lifeDates;
	private Map<String,String> works = new TreeMap<String,String>();
	
	public AuthorResult(String name) {
		this.name = name;
	}

	public Map<String, String> getWorks() {
		return works;
	}

	public void setWorks(Map<String, String> works) {
		this.works = works;
	}

	public String getName() {
		return name;
	}

	public String getLifeDates() {
		return lifeDates;
	}

	public void setLifeDates(String lifeDates) {
		this.lifeDates = lifeDates;
	}

	@Override
	public int compareTo(AuthorResult o) {
		return name.compareToIgnoreCase(o.getName());
	}
	
}
