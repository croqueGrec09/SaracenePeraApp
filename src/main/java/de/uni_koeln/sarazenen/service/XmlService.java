package de.uni_koeln.sarazenen.service;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

import javax.annotation.PostConstruct;
import javax.xml.XMLConstants;
import javax.xml.namespace.NamespaceContext;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import de.uni_koeln.sarazenen.data.Dendrograph;

@Service
public class XmlService {

    private final ProjectDisplayService pds;
	private Map<String,Document> doc = new HashMap<>();
	private Map<String,Document> dendroXML = new HashMap<>();

	@Autowired
    public XmlService(ProjectDisplayService pds) {
	    this.pds = pds;
    }

	@PostConstruct
	public void init() throws IOException, SAXException, ParserConfigurationException {
		DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
		//this is a main configuration point, should be deployed later
		String[] projects = {"SaraceneApp","PeraApp"};
		for(String project: projects) {
		    Map result = pds.setPageGenerics(project);
		    if(result.get("filepath") instanceof String && result.get("dendrographPath") instanceof String) {
                DocumentBuilder builder = factory.newDocumentBuilder();
                File f = new File((String) result.get("filepath"));
                //System.out.println(f.exists());
                doc.put(project, builder.parse(f));
                //Element TEI = (Element) doc.getElementsByTagName("TEI").item(0);
                //System.out.println(TEI.getAttribute("xml:id"));
                factory = DocumentBuilderFactory.newInstance();
                builder = factory.newDocumentBuilder();
                File d = new File((String) result.get("dendrographPath"));
                dendroXML.put(project, builder.parse(d));
            }
			else {
			    System.err.println("Invalid paths for XML provided!");
            }
		}
	}

	public Map<String, Document> getDoc() {
	    return doc;
    }

    public Map<String, Document> getDendroXML() {
	    return dendroXML;
    }
	
	public NodeList query(String queryPath,String currProj) throws XPathExpressionException {
		XPathFactory xPathFactory = XPathFactory.newInstance();
		XPath xpath = xPathFactory.newXPath();
		xpath.setNamespaceContext(new NamespaceContext(){

			@Override
			public String getNamespaceURI(String prefix) {
				if ("TEI".equals(prefix)) return "http://www.tei-c.org/ns/1.0";
				else if("xml".equals(prefix)) return XMLConstants.XML_NS_URI;
		        return XMLConstants.NULL_NS_URI;
			}

			@Override
			public String getPrefix(String namespaceURI) {
				return null;
			}

			@Override
			public Iterator<String> getPrefixes(String namespaceURI) {
				return null;
			}
			
		});
		XPathExpression expr = xpath.compile(queryPath);
		//System.out.println(expr.evaluate(doc,XPathConstants.BOOLEAN));
		return (NodeList) expr.evaluate(doc.get(currProj), XPathConstants.NODESET);
	}
	
	public Dendrograph getDendrograph(String project) throws XPathExpressionException {
		XPathFactory xPathFactory = XPathFactory.newInstance();
		XPath xpath = xPathFactory.newXPath();
		XPathExpression expr = xpath.compile("//remarkabilities[@name='"+project+"']");
		NodeList root = (NodeList) expr.evaluate(dendroXML.get(project), XPathConstants.NODESET);
		String projectString = "default root";
		switch(project){
			case "SaraceneApp": projectString = "Sarazenen";
			break;
			case "PeraApp": projectString = "Handelsposten Pera";
			break;
		}
		return new Dendrograph(root,projectString);
	}
	
}