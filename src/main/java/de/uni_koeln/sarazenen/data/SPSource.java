package de.uni_koeln.sarazenen.data;

import java.util.ArrayList;
import java.util.List;

import javax.xml.xpath.XPathExpressionException;

import org.w3c.dom.DOMException;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import de.uni_koeln.sarazenen.service.XmlService;

public class SPSource {
	
	private XmlService xml;
	private String sourceId;
	private String citation;
	private String timeSource;
	private TimeScientific timeScientific;
	private String summary;
	private String origText;
	private String translation;
	private String transCit;
	private List<String> geoKeywords;
	private List<String> concerned = new ArrayList<>();
	private Character interaction;
	private List<String> remarkabilities = new ArrayList<>();
	private List<String> searchTerms = new ArrayList<>();
	private List<String> tradeGoods = new ArrayList<>();
	private String annotations;
	private List<EntityPlace> places = new ArrayList<>();
	private List<EntityPerson> persons = new ArrayList<>();
	
	SPSource(XmlService xml) {
		this.xml = xml;
	}

	void buildSource(String workId, String sourceId, String project){
		String n;
			String basePath = "";
			if(project.equals("PeraApp"))
				basePath = "//TEI[@id='PeraWork"+workId+"']";
			else if(project.equals("SaraceneApp"))
				basePath = "//TEI[@id='work"+workId+"']";
			if(sourceId.contains("source")) {
				this.sourceId = sourceId.split("source")[1];
				n = sourceId;
			}
			else {
				this.sourceId = sourceId;
				n = "source"+sourceId;
			}
			String sourceMatch = "[@n='"+n+"']";
			try {
				//System.out.println(basePath+"//sourceDesc"+sourceMatch+"/bibl[@type='source']");
				NodeList citationNode = xml.query(basePath+"//sourceDesc"+sourceMatch+"/bibl[@type='source']",project);
				if(citationNode.getLength() == 0)
					citationNode = xml.query(basePath+"//sourceDesc[@n='work']/bibl",project);
				citation = citationNode.item(0).getTextContent();
				NodeList timeSourceNode = xml.query(basePath+"//setting"+sourceMatch+"/date[@type='source']",project);
				if(timeSourceNode.getLength() > 0)
					timeSource = timeSourceNode.item(0).getTextContent();
				timeScientific = new TimeScientific();
				NodeList tsNodeList = xml.query(basePath+"//setting"+sourceMatch+"/date[@type='scientific']",project);
				//System.out.println(tsNodeList.getLength());
				if(tsNodeList.getLength() > 0) {
					Element tsNode = (Element) tsNodeList.item(0);
					timeScientific.setFrom(tsNode.getAttribute("from-iso"));
					timeScientific.setTo(tsNode.getAttribute("to-iso"));
					timeScientific.setDate(tsNode.getTextContent());
				}
				else {
					timeScientific.setFrom("700-01-01");
					timeScientific.setTo("1399-12-31");
					timeScientific.setDate("nicht angegeben");
				}
				summary = xml.query(basePath+"//abstract"+sourceMatch+"/p[@n='summary']",project).item(0).getTextContent();
				NodeList textNode = xml.query(basePath+"//text"+sourceMatch+"//div",project);
				//System.out.println(textNode.item(0).getTextContent());
				origText = textNode.item(0).getTextContent();
				translation = textNode.item(1).getTextContent();
				NodeList transCitNode = xml.query(basePath+"//sourceDesc"+sourceMatch+"/bibl[@type='translation']",project);
				if(transCitNode.getLength() > 0)
					transCit = transCitNode.item(0).getTextContent();
				NodeList keywordNodeList = xml.query(basePath+"//textClass"+sourceMatch+"/keywords",project);
				for(int i = 0;i < keywordNodeList.getLength();i++) {
					Element kwList = (Element) keywordNodeList.item(i);
					//System.out.println(kwList.getAttribute("n"));
					switch(kwList.getAttribute("n")) {
					case "geo": geoKeywords = processTermList(kwList);
					break;
					case "remarkabilities": remarkabilities = processTermList(kwList);
					break;
					case "searchTerms": searchTerms = processTermList(kwList);
					break;
					case "tradeGoods": tradeGoods = processTermList(kwList);
					break;
					}
				}
				NodeList placeEntitiesList = xml.query(basePath+"//settingDesc/listPlace"+sourceMatch+"/place/@corresp",project);
				if(placeEntitiesList.getLength() > 0) {
					for(int i = 0;i < placeEntitiesList.getLength(); i++) {
						NodeList placeInfoNode = xml.query("/teiCorpus/teiHeader//place[@id='"+placeEntitiesList.item(i).getTextContent().substring(1)+"']/descendant-or-self::*",project);
						if(placeInfoNode.getLength() > 0) {
							EntityPlace ep = null;
							List<String> altNames = null;
							for(int p = 0;p < placeInfoNode.getLength();p++) {
								if(placeInfoNode.item(p).getNodeType() == Node.ELEMENT_NODE) {
									Element placeInfo = (Element) placeInfoNode.item(p);
									switch(placeInfo.getNodeName()) {
									case "TEI:place": ep = new EntityPlace();
										altNames = new ArrayList<>();
										ep.setId(placeInfo.getAttribute("xml:id"));
										if(placeInfo.hasAttribute("type"))
											ep.setType(placeInfo.getAttribute("type"));
									break;
									case "TEI:placeName":
										if(placeInfo.getAttribute("type").equals("main"))
											ep.setName(placeInfo.getTextContent());
										else if(placeInfo.getAttribute("type").equals("alt")) 
											altNames.add(placeInfo.getTextContent());
									break;
									case "TEI:location":
										NodeList latLng = placeInfo.getElementsByTagName("TEI:geo");
										double lat = Double.parseDouble(latLng.item(0).getTextContent());
										double lng = Double.parseDouble(latLng.item(1).getTextContent());
										switch(placeInfo.getAttribute("type")) {
										case "point": 
											ep.setLat(lat);
											ep.setLng(lng);
										break;
										case "viewportSW": Double[] viewportSW = new Double[2];
											viewportSW[0] = lat;
											viewportSW[1] = lng;
											ep.setViewportSW(viewportSW);
										break;
										case "viewportNE": Double[] viewportNE = new Double[2];
											viewportNE[0] = lat;
											viewportNE[1] = lng;
											ep.setViewportNE(viewportNE);
										break;
										}
									break;
									case "TEI:region": ep.setType("region");
									break;
									case "TEI:settlement": ep.setType("settlement");
									break;
									}
								}
							}
							if(ep.getName() == null)
								ep.setName("unbekannt");
							if(ep.getType() == null)
								ep.setType("unbekannt");
							ep.setAltNames(altNames);
							places.add(ep);
						}
					}
				}
				NodeList concernedNodeList = xml.query(basePath+"//particDesc"+sourceMatch+"/listPerson",project);
				if(concernedNodeList.getLength() > 0) {
					NodeList concernedNodes = concernedNodeList.item(0).getChildNodes();
					for(int i = 0;i < concernedNodes.getLength();i++) {
						if(concernedNodes.item(i).getNodeType() == Node.ELEMENT_NODE) {
							String nextConcerned = "";
							Element concerned = (Element) concernedNodes.item(i);
							switch (concerned.getAttribute("role")) {
								case "other":
									nextConcerned += "a";
									break;
								case "saracene":
									nextConcerned += "s";
									break;
								case "genuese":
									nextConcerned += "g";
									break;
								case "venetian":
									nextConcerned += "v";
									break;
							}
							if(concerned.getNodeName().equals("TEI:person"))
								nextConcerned += "I";
							else if(concerned.getNodeName().equals("TEI:personGrp"))
								nextConcerned += "K";
							this.concerned.add(nextConcerned);
						}
					}

					if(concernedNodeList.getLength() > 1) {
						NodeList entityNode = concernedNodeList.item(1).getChildNodes();
						for(int i = 0;i < entityNode.getLength();i++) {
							if(entityNode.item(i).hasAttributes()) {
								Element entity = (Element) entityNode.item(i);
								NodeList entityPersonNode = xml.query("/teiCorpus/teiHeader//person[@id='"+entity.getAttribute("corresp").substring(1)+"']/descendant-or-self::*",project);
								if(entityPersonNode.getLength() > 0) {
									EntityPerson ep = null;
									List<String> altNames = null;
									for(int p = 0;p < entityPersonNode.getLength();p++) {
										if(entityPersonNode.item(p).getNodeType() == Node.ELEMENT_NODE) {
											Element entityPerson = (Element) entityPersonNode.item(p);
											switch(entityPerson.getNodeName()) {
											case "TEI:person": ep = new EntityPerson();
												altNames = new ArrayList<>();
												ep.setId(entityPerson.getAttribute("xml:id"));
											break;
											case "TEI:persName":
												if(entityPerson.getAttribute("type").equals("main"))
													ep.setName(entityPerson.getTextContent());
												else if(entityPerson.getAttribute("type").equals("alt"))
													altNames.add(entityPerson.getTextContent());
											break;
											case "TEI:note": ep.setRole(entityPerson.getTextContent());
											break;
											}
										}
									}
									ep.setAltNames(altNames);
									//System.out.println(ep.getName());
									persons.add(ep);
								}
							}
						}
					}
				}
				String interactionText = xml.query(basePath+"//textDesc"+sourceMatch+"/interaction",project).item(0).getTextContent();
				if(!interactionText.isEmpty())
					interaction = interactionText.charAt(0);
				NodeList annotationsNode = xml.query(basePath+"//text"+sourceMatch+"/back/p",project);
				if(annotationsNode.getLength() > 0)
					annotations = annotationsNode.item(0).getTextContent();
			} catch (DOMException | XPathExpressionException e) {
				e.printStackTrace();
			}
	}
	
	public List<String> processTermList(Element termList) {
		List<String> ret = new ArrayList<String>();
		NodeList terms = termList.getElementsByTagName("TEI:term");
		for(int i = 0;i < terms.getLength();i++){
			ret.add(terms.item(i).getTextContent());
			//System.out.println(ret.get(i));
		}
		return ret;
	}
	
	public String getSourceId() {
		return sourceId;
	}

	public String getCitation() {
		return citation;
	}

	public String getTimeSource() {
		return timeSource;
	}

	public TimeScientific getTimeScientific() {
		return timeScientific;
	}

	public String getSummary() {
		return summary;
	}

	public String getOrigText() {
		return origText;
	}

	public String getTranslation() {
		return translation;
	}

	public String getTransCit() {
		return transCit;
	}

	public List<String> getGeoKeywords() {
		return geoKeywords;
	}

	public List<String> getConcerned() {
		return concerned;
	}

	public Character getInteraction() {
		return interaction;
	}

	public List<String> getRemarkabilities() {
		return remarkabilities;
	}

	public List<String> getSearchTerms() {
		return searchTerms;
	}
	
	public List<String> getTradeGoods() {
		return tradeGoods;
	}

	public String getAnnotations() {
		return annotations;
	}

	public List<EntityPlace> getPlaces() {
		return places;
	}

	public List<EntityPerson> getPersons() {
		return persons;
	}
	
}
