package de.uni_koeln.sarazenen.data;

import java.util.ArrayList;
import java.util.List;

public class Circle {
	
	private Double[] coordinates = new Double[2];
	private String workId;
	private String workTitle;
	private String sourceId;
	private String periodFrom;
	private String periodTo;
	private String place;
	private String color;
	private List<String> remarkabilities = new ArrayList<String>();
	private List<String> tradeGoods = new ArrayList<String>();
	
	public Circle(SPDocument doc, SPSource source, EntityPlace ep) {
		workId = doc.getWorkId();
		workTitle = doc.getMainTitle();
		sourceId = source.getSourceId();
		coordinates[0] = ep.getLat();
		coordinates[1] = ep.getLng();
		//System.out.println(ep.getLat());
		periodFrom = source.getTimeScientific().getFrom();
		//System.out.println(source.getTimeScientific().getFrom());
		periodTo = source.getTimeScientific().getTo();
		tradeGoods = source.getTradeGoods(); 
		place = ep.getName();
		remarkabilities = source.getRemarkabilities();
		if(tradeGoods.size() > 0 && remarkabilities.size() > 0)
			color = "#FF00FF";
		else if(tradeGoods.size() > 0)
			color = "#FF0000";
		else if(remarkabilities.size() > 0)
			color = "#0000FF";
	}

	public Double[] getCoordinates() {
		return coordinates;
	}

	public String getWorkId() {
		return workId;
	}

	public String getWorkTitle() {
		return workTitle;
	}

	public String getSourceId() {
		return sourceId;
	}

	public String getPeriodFrom() {
		return periodFrom;
	}

	public String getPeriodTo() {
		return periodTo;
	}

	public String getPlace() {
		return place;
	}

	public List<String> getRemarkabilities() {
		return remarkabilities;
	}
	
	public List<String> getTradeGoods() {
		return tradeGoods;
	}
	
	public String getColor() {
		return color;
	}
}
