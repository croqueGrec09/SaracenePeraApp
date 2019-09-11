package de.uni_koeln.sarazenen.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
import java.util.TreeSet;

import javax.xml.xpath.XPathExpressionException;

import de.uni_koeln.sarazenen.service.ProjectDisplayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import de.uni_koeln.sarazenen.data.AuthorResult;
import de.uni_koeln.sarazenen.data.Circle;
import de.uni_koeln.sarazenen.data.Dendrograph;
import de.uni_koeln.sarazenen.data.EntityPlace;
import de.uni_koeln.sarazenen.data.SPDocument;
import de.uni_koeln.sarazenen.data.SPSource;
import de.uni_koeln.sarazenen.data.SourceResult;
import de.uni_koeln.sarazenen.service.DocumentSourceService;
import de.uni_koeln.sarazenen.service.XmlService;

@Controller
@RequestMapping(value = {"/{project}","/{project}/"})
public class HomeController {

	private final DocumentSourceService dss;
	private final XmlService xml;
	private final ProjectDisplayService pds;

	@Autowired
	public HomeController(DocumentSourceService dss, XmlService xml, ProjectDisplayService pds) {
		this.dss = dss;
		this.xml = xml;
		this.pds = pds;
	}

	/**
	 * Mapping für die Startseite
	 * 
	 * @return die Startseite
	 */
	@RequestMapping(value = {"/","/index"})
	public String init(Model model, @PathVariable String project) {
		model.addAllAttributes(pds.setPageGenerics(project));
		return "index";
	}
	
	/**
	 * Mapping für die Werksliste
	 * 
	 * @return die Liste aller Quellen
	 */
	@RequestMapping(value = {"/workList"})
	public String getSources(Model model, @PathVariable String project) {
		model.addAllAttributes(pds.setPageGenerics(project));
		model.addAttribute("documents",dss.getDocuments(project));
		return "workList";
	}

	@RequestMapping(value = {"/persons"})
	public String getPersons(Model model, @PathVariable String project) {
		model.addAllAttributes(pds.setPageGenerics(project));
		model.addAttribute("persons", dss.getPersonList(project).values());
		return "persons";
	}
	
	/**
	 * Mapping für ein einzelnes Werk
	 */
	@RequestMapping(value = {"/singleWork/{workId}"})
	public String getSingleWork(Model model, @PathVariable("workId") String workId, @PathVariable String project) {
		model.addAllAttributes(pds.setPageGenerics(project));
		model.addAttribute("work",dss.getSingleDocument(project, workId));
		model.addAttribute("documents", dss.getDocuments(project));
		return "work :: workView";
	}
	
	/**
	 * Mapping für ein einzelnes Werk - Ausgabe in Modal
	 */
	@RequestMapping(value = {"/singleWorkModal/{workId}"})
	public String getSingleWorkModal(Model model, @PathVariable("workId") String workId, @PathVariable String project) {
		model.addAllAttributes(pds.setPageGenerics(project));
		model.addAttribute("work",dss.getSingleDocument(project, workId));
		model.addAttribute("documents", dss.getDocuments(project));
		return "workModal :: workModal";
	}
	
	/**
	 * Mapping für eine einzelne Quellenstelle
	 */
	@RequestMapping(value = {"/singleSource/{workId}/{sourceId}"})
	public String getSingleSource(Model model, @PathVariable("workId") String workId, @PathVariable("sourceId") String sourceId, @PathVariable String project) {
		model.addAllAttributes(pds.setPageGenerics(project));
		model.addAttribute("documents", dss.getDocuments(project));
		model.addAttribute("source", dss.getSingleSource(project, workId, sourceId));
		return "source :: sourceView";
	}
	
	/**
	 * Mapping für eine Suche nach Quellenstellen nach Suchbegriff
	 * 
	 * @param model - geparstes Template
	 * @param queryTerm - Suchbegriff
	 * @param queryType - Suchtyp (Person, Auffälligkeit, Ort)
	 * @return das Fragment der Vorkommnisse
	 */
	@RequestMapping(value = {"/getSourcesByKey/{queryTerm}/{queryType}"})
	public String getSourcesByKey(Model model, @PathVariable("queryTerm") String queryTerm, @PathVariable("queryType") String queryType, @PathVariable String project) {
		model.addAllAttributes(pds.setPageGenerics(project));
		Map<String,Set<String>> resMap = null;
		String qType = null;
		String qTerm = null;
		String ret = null;
		switch(queryType) {
		case "person": resMap = dss.getPersonIndex(project);
		qType = "die Person";
		qTerm = dss.getPersonList(project).get(queryTerm).getName();
		ret = "occurences :: viewOccurence";
		break;
		case "place": resMap = dss.getPlaceIndex(project);
		qType = "der Ort";
		qTerm = dss.getPlaceList(project).get(queryTerm).getName();
		ret = "occurences :: viewOccurenceModal";
		break;
		case "remarkability": resMap = dss.getRemIndex(project);
		qType = "die Auffälligkeit";
		qTerm = queryTerm;
		ret = "occurences :: viewOccurenceModal";
		break;
		case "tradeGoods": resMap = dss.getTradeIndex(project);
		qType = "die Handelsware";
		qTerm = queryTerm;
		ret = "occurences :: viewOccurenceModal";
		break;
		default: System.err.println("key type unknown!");
		break;
		}
		Set<String> res = resMap.get(queryTerm);
		for(String s: res) {
			System.out.println(s);
		}
		List<SourceResult> sr = new ArrayList<SourceResult>();
		if(res != null) {
			for(String result: res) {
				String[] workSource = result.split("q");
				sr.add(new SourceResult(dss.getSingleDocument(project, workSource[0]), dss.getSingleSource(project, workSource[0], workSource[1])));
			}
		}
		model.addAttribute("queryType",qType);
		model.addAttribute("queryTerm",qTerm);
		model.addAttribute("sources",sr);
		return ret;
	}
	
	/**
	 * Mapping für eine Suche nach Quellenstellen nach Suchbegriff
	 * 
	 * @param queryTerm - Suchbegriff
	 * @param queryType - Suchtyp (Person, Auffälligkeit, Ort)
	 * @return eine Liste der Vorkommnisse
	 */
	@ResponseBody
	@RequestMapping(value = {"/getWorksListByKey/{queryTerm}/{queryType}"},produces = "application/json")
	public List<SourceResult> getWorksListByKey(@PathVariable("queryTerm") String queryTerm, @PathVariable("queryType") String queryType, @PathVariable String project) {
		Map<String,Set<String>> resMap = null;
		switch(queryType) {
		case "person": resMap = dss.getPersonIndex(project);
		break;
		case "place": resMap = dss.getPlaceIndex(project);
		break;
		case "remarkability": resMap = dss.getRemIndex(project);
		break;
		case "tradeGoods": resMap = dss.getTradeIndex(project);
		break;
		default: System.err.println("key type unknown!");
		break;
		}
		Set<String> res = resMap.get(queryTerm);
		List<SourceResult> sr = new ArrayList<>();
		if(res != null) {
			for(String result: res) {
				String[] workSource = result.split("q");
				sr.add(new SourceResult(dss.getSingleDocument(project, workSource[0]), dss.getSingleSource(project, workSource[0], workSource[1])));
			}
		}
		return sr;
	}
	
	/**
	 * Mapping für die Autorenliste
	 * 
	 * @param model - geparstes Template
	 * @return die Seite der Autoren
	 */
	@RequestMapping(value = "/authors")
	public String getWorksByAuthor(Model model, @PathVariable String project) {
		model.addAllAttributes(pds.setPageGenerics(project));
		Set<String> authors = dss.getAuthorIndex(project).keySet();
		Set<AuthorResult> ret = new TreeSet<AuthorResult>();
		for(String author: authors) {
			AuthorResult ar = new AuthorResult(author);
			Map<String,String> works = new TreeMap<String,String>();
			Set<String> workList = dss.getAuthorIndex(project).get(author);
			for(String workId: workList) {
				SPDocument work = dss.getSingleDocument(project, workId);
				ar.setLifeDates(work.getLifeDates());
				works.put(work.getWorkId(), work.getMainTitle());
			}
			ar.setWorks(works);
			ret.add(ar);
		}
		model.addAttribute("authors", ret);
		return "authors";
	}
	
	/**
	 * Mapping für die Ortsliste
	 * 
	 * @param model - geparstes Template
	 * @return die Seite der Orte
	 */
	@RequestMapping(value = "/places")
	public String getPlaces(Model model, @PathVariable String project) {
		model.addAllAttributes(pds.setPageGenerics(project));
		model.addAttribute("places", dss.getPlaceList(project).values());
		return "places";
	}
	
	/**
	 * Mapping für den Auffälligkeitenbaum
	 * 
	 * @return die Seite der Auffälligkeiten
	 */
	@RequestMapping(value = "/event")
	public String getEvent(Model model, @PathVariable String project) {
		model.addAllAttributes(pds.setPageGenerics(project));
		return "event";
	}
	
	/**
	 * Mapping für die Häufigkeitentabelle
	 * 
	 * @return die Seite der Häufigkeiten
	 */
	@RequestMapping(value = "/frequency")
	public String getFrequency(Model model, @PathVariable String project) {
		model.addAllAttributes(pds.setPageGenerics(project));
		return "frequency";
	}
	
	/**
	 * Mapping für die Häufigkeiten
	 * 
	 * @return ein Objekt, das pro Begriff die Häufigkeit enthält
	 */
	@ResponseBody
	@RequestMapping(value = "/getFrequencies/{map}")
	public Map<Object,Integer> getFrequencies(Model model, @PathVariable("map") String map, @PathVariable String project) {
		model.addAllAttributes(pds.setPageGenerics(project));
		return dss.getFrequencies(project,map);
	}
	
	/**
	 * Mapping für die Karte
	 * 
	 * @param model - geparstes Template
	 * @return die Seite der Karte
	 */
	@RequestMapping(value = "/map")
	public String getMap(Model model, @PathVariable String project) {
		model.addAllAttributes(pds.setPageGenerics(project));
		model.addAttribute("places", dss.getPlaceList(project).values());
		return "map";
	}
	
	/**
	 * Gibt das JSON des Auffälligkeitenbaumes aus
	 * 
	 * @return den Auffälligkeitenbaum als JSON
	 */
	@ResponseBody
	@RequestMapping(value = "/flare", produces = "application/json")
	public Dendrograph getFlare(@PathVariable String project) {
		try {
			return xml.getDendrograph(project);
		} catch (XPathExpressionException e) {
			e.printStackTrace();
		}
		return null;
	}
	
	/**
	 * Gibt das JSON der Marker aus.
	 * 
	 * @return die Punkte als JSON
	 */
	@ResponseBody
	@RequestMapping(value = "/circles", produces = "application/json")
	public Map<String,List<Circle>> getCircle(@PathVariable String project) {
		Map<String,List<Circle>> circles = new HashMap<>();
		List<Circle> circleList = new ArrayList<>();
		for(SPDocument d: dss.getDocuments(project)) {
			for(SPSource s: d.getSources()) {
				for(EntityPlace ep: s.getPlaces()) {
					circleList.add(new Circle(d,s,ep));
				}
			}
		}
		circles.put("objects", circleList);
		return circles;
	}
	
}
