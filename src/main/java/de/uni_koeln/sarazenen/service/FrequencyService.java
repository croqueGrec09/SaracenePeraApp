package de.uni_koeln.sarazenen.service;

import java.io.File;
import java.io.IOException;
import java.util.Map;
import java.util.TreeMap;

import javax.annotation.PostConstruct;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;

import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

@Service
public class FrequencyService {
	
	private String filepath = "xml/Sarazenen_Final_Map_v0.1.xml";
	private Document doc;
	private XPath xpath;
	private Map<String,Integer> persFreq = new TreeMap<String,Integer>();
	private Map<String,Integer> placeFreq = new TreeMap<String,Integer>();
	private Map<String,Integer> kwFreq = new TreeMap<String,Integer>();
	
	@PostConstruct
	public void init() throws ParserConfigurationException, SAXException, IOException, XPathExpressionException {
		DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
		DocumentBuilder builder = factory.newDocumentBuilder();
		doc = builder.parse(new File(filepath));
		XPathFactory xPathFactory = XPathFactory.newInstance();
		xpath = xPathFactory.newXPath();
		XPathExpression expr = xpath.compile("//Entitaet[@Type='Person']/Name");
		NodeList names = (NodeList) expr.evaluate(doc, XPathConstants.NODESET);
		for(int n = 0; n < names.getLength(); n++) {
			String name = names.item(n).getTextContent();
			Integer currCount = persFreq.get(name);
			if(currCount == null){
				persFreq.put(name, 1);
			}
			else persFreq.put(name, currCount+1);
		}
		expr = xpath.compile("//Entitaet[@Type='Ort']/Name");
		names = (NodeList) expr.evaluate(doc, XPathConstants.NODESET);
		for(int n = 0; n < names.getLength(); n++) {
			String name = names.item(n).getTextContent();
			Integer currCount = placeFreq.get(name);
			if(currCount == null){
				placeFreq.put(name, 1);
			}
			else placeFreq.put(name, currCount+1);
		}
		expr = xpath.compile("//Auffaelligkeiten/Schlagwort");
		names = (NodeList) expr.evaluate(doc, XPathConstants.NODESET);
		for(int n = 0; n < names.getLength(); n++) {
			String name = names.item(n).getTextContent();
			Integer currCount = kwFreq.get(name);
			if(currCount == null){
				kwFreq.put(name, 1);
			}
			else kwFreq.put(name, currCount+1);
		}
	}
	
	public Map<String,Integer> getFrequency(String map) {
		switch(map){
		case "person": return persFreq;
		case "place": return placeFreq;
		case "keyword": return kwFreq;
		default: return null;
		}
	}

}
