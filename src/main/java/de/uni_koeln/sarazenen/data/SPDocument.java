package de.uni_koeln.sarazenen.data;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import javax.xml.xpath.XPathExpressionException;

import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import de.uni_koeln.sarazenen.service.XmlService;

public class SPDocument {

	protected XmlService xml;
	private String workId;
	private String mainTitle;
	private List<String> altTitles = new ArrayList<>();
	private List<String> authors = new ArrayList<>();
	private String lifeDates;
	private String edRemarks;
	private String origPlace;
	private String origDate;
	private List<String> workRegions = new ArrayList<>();
	private String workInformation;
	private Map<String,SPSource> sources = new TreeMap<>();
	
	/*  *S*aracene*P*era (SP)Document loading workflow:
	 *  1. XmlService: provides XPath for queries upon both Saracene and Pera-TEI
	 *  2. SPDocument (this class): result document accoring to given query, containing
	 *  3. SPSource representing the source nodes
	 *  4. return classes SPDocument/SPSource as JSON for Thymeleaf templates
	 */
	
	SPDocument(XmlService xml) {
		this.xml = xml;
	}
	
	void buildDocument(String workId,String project) {
		String basePath;
		if(workId.contains("Work") || workId.contains("work")) {
			basePath = "//TEI[@id='"+workId+"']";
			this.workId = workId.split("[Ww]ork")[1];
		}
		else {
			basePath = "//TEI[@id='work"+workId+"']";
			this.workId = workId;
		}
		System.out.println(this.workId);
			try {
				System.out.println(basePath);
				mainTitle = xml.query(basePath+"//title[@type='main']",project).item(0).getTextContent();
				//System.out.println(mainTitle);
				NodeList altTitleNodeList = xml.query(basePath+"//title[@type='alt']",project);
				for(int n = 0;n < altTitleNodeList.getLength();n++) {
					Node altTitleNode = altTitleNodeList.item(n);
					altTitles.add(altTitleNode.getTextContent());
				}
				NodeList authorNames = xml.query(basePath+"//author/persName",project);
				for(int n = 0;n < authorNames.getLength();n++) {
					Node authorName = authorNames.item(n);
					authors.add(authorName.getTextContent());
				}
				NodeList lifeDatesNode = xml.query(basePath+"//date[@type='lifeDates']",project);
				if(lifeDatesNode.getLength() > 0)
					lifeDates = lifeDatesNode.item(0).getTextContent();
				edRemarks = xml.query(basePath+"//sourceDesc[@n='work']/bibl",project).item(0).getTextContent();
				origPlace = xml.query(basePath+"//creation/placeName",project).item(0).getTextContent();
				origDate = xml.query(basePath+"//creation/date",project).item(0).getTextContent();
				NodeList workRegionsListPlace = xml.query(basePath+"//listPlace[@type='workRegions']",project);
				for(int n = 0;n < workRegionsListPlace.getLength();n++) {
					Node workRegion = workRegionsListPlace.item(n);
					workRegions.add(workRegion.getTextContent());
				}
				workInformation = xml.query(basePath+"//abstract[@n='work']",project).item(0).getTextContent();
				NodeList sourceIds = xml.query(basePath+"//text/@n",project);
				for(int n = 0;n < sourceIds.getLength();n++) {
					String sourceId = sourceIds.item(n).getTextContent();
					if(sourceId.contains("source")) {
						SPSource sps = new SPSource(xml);
						sps.buildSource(this.workId, sourceId, project);
						sources.put(sourceId.split("source")[1],sps);
					}
				}
			} catch (XPathExpressionException e) {
				e.printStackTrace();
			}
	}
	
	public String getMainTitle() {
		return mainTitle;
	}

	public List<String> getAltTitles() {
		return altTitles;
	}

	public List<String> getAuthors() {
		return authors;
	}
	
	public String getLifeDates() {
		return lifeDates;
	}
	
	public String getEdRemarks() {
		return edRemarks;
	}

	public String getOrigPlace() {
		return origPlace;
	}

	public String getOrigDate() {
		return origDate;
	}

	public List<String> getWorkRegions() {
		return workRegions;
	}

	public String getWorkInformation() {
		return workInformation;
	}
	
	public List<SPSource> getSources() {
		List<SPSource> ret = new ArrayList<>();
		ret.addAll(sources.values());
		return ret;
	}
	
	public Map<String,SPSource> getSourcesMap() {
		return sources;
	}

	public String getWorkId() {
		return workId;
	}

}
