package de.uni_koeln.sarazenen.data;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class EntityPlace implements Comparable<EntityPlace> {

	private String id;
	private String name;
	private List<String> altNames = new ArrayList<String>();
	private String type;
	private double lat;
	private double lng;
	private Double[] viewportSW = new Double[2];
	private Double[] viewportNE = new Double[2];
	

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

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public double getLat() {
		return lat;
	}

	public void setLat(double lat) {
		this.lat = lat;
	}

	public double getLng() {
		return lng;
	}

	public void setLng(double lng) {
		this.lng = lng;
	}

	public Double[] getViewportSW() {
		return viewportSW;
	}

	public void setViewportSW(Double[] viewportSW) {
		this.viewportSW = viewportSW;
	}

	public Double[] getViewportNE() {
		return viewportNE;
	}

	public void setViewportNE(Double[] viewportNE) {
		this.viewportNE = viewportNE;
	}

	@Override
	public int compareTo(EntityPlace o) {
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
		return "{\"id\":\"" + id + "\",\"name\":\"" + name + "\",\"altNames\":[" + altNamesString + "],\"type\":\"" + type + "\",\"lat\":" + lat
				+ ",\"lng\":" + lng + ",\"viewportSW\":[" + Arrays.toString(viewportSW) + "],\"viewportNE\":["
				+ Arrays.toString(viewportNE) + "]}";
	}
	
	
}
