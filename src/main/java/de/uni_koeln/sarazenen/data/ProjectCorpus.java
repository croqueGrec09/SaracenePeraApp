package de.uni_koeln.sarazenen.data;

import de.uni_koeln.sarazenen.service.XmlService;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import javax.xml.xpath.XPathExpressionException;
import java.util.*;

public class ProjectCorpus {

    private Map<String,SPDocument> documents = new TreeMap<>();
    private Map<String,Set<String>> personIndex = new TreeMap<>();
    private Map<String,Set<String>> authorIndex = new TreeMap<>();
    private Map<String,Set<String>> remIndex = new TreeMap<>();
    private Map<String,Set<String>> placeIndex = new TreeMap<>();
    private Map<String,EntityPerson> personList = new TreeMap<>();
    private Map<String,EntityPlace> placeList = new TreeMap<>();
    private Map<String,Set<String>> tradeIndex = new TreeMap<>();

    //continue here: rebuild this logic ex DocumentSourceService for one project string
    public ProjectCorpus(String project, XmlService xml) {
        //for(String project: xml.getProjects()) {
            try {
                NodeList workIdNodeList = xml.query("//TEI/@id",project);
                System.out.println(workIdNodeList.getLength());
                SPDocument document;
                //for test aims
                //SPDocument document = new SPDocument(xml);
                //Random random = new Random();
                //int r = random.nextInt(64);
                //document.buildDocument(workIdNodeList.item(r).getTextContent());
                //build indices
                //documents.put(document.getWorkId(),document);
                /* when everything is finalised, switch it on. Otherwise, every
                 * debugging takes three minutes (!).*/
                for(int n = 0;n < workIdNodeList.getLength();n++) {
                    document = new SPDocument(xml);
                    document.buildDocument(workIdNodeList.item(n).getTextContent(),project);
                    documents.put(workIdNodeList.item(n).getTextContent().split("[Ww]ork")[1],document);

                    for(String author: document.getAuthors()) {
                        Set<String> authors = authorIndex.get(author);
                        if(authors == null)
                            authors = new TreeSet<>();
                        authors.add(document.getWorkId());
                        authorIndex.put(author, authors);
                    }
                    for(SPSource s : document.getSources()) {
                        for(EntityPerson person: s.getPersons()) {
                            Set<String> persons = personIndex.get(person.getId());
                            if(persons == null)
                                persons = new TreeSet<>();
                            persons.add(document.getWorkId()+"q"+s.getSourceId());
                            //System.out.println(person.getId());
                            personIndex.put(person.getId(), persons);
                        }
                        for(EntityPlace place: s.getPlaces()) {
                            Set<String> places = placeIndex.get(place.getId());
                            if(places == null)
                                places = new TreeSet<>();
                            places.add(document.getWorkId()+"q"+s.getSourceId());
                            placeIndex.put(place.getId(), places);
                        }
                        for(String rem: s.getRemarkabilities()) {
                            Set<String> remarkabilites = remIndex.get(rem);
                            if(remarkabilites == null)
                                remarkabilites = new TreeSet<>();
                            remarkabilites.add(document.getWorkId()+"q"+s.getSourceId());
                            remIndex.put(rem, remarkabilites);
                        }
                        for(String good: s.getTradeGoods()) {
                            Set<String> tradeGoods = tradeIndex.get(good);
                            if(tradeGoods == null)
                                tradeGoods = new TreeSet<>();
                            tradeGoods.add(document.getWorkId()+"q"+s.getSourceId());
                            tradeIndex.put(good, tradeGoods);
                        }
                    }
                }
                NodeList entityPersonNode = xml.query("/teiCorpus/teiHeader//person/descendant-or-self::*",project);
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
                        ep.setAltNames(altNames);
                        //System.out.println(ep.getName());
                        personList.put(ep.getId(),ep);
                    }

                }
                NodeList placeInfoNode = xml.query("/teiCorpus/teiHeader//place",project);
                if(placeInfoNode.getLength() > 0) {
                    for(int p = 0;p < placeInfoNode.getLength();p++) {
                        Element placeRoot = (Element) placeInfoNode.item(p);
                        List<String> altNames = new ArrayList<>();
                        EntityPlace ep = new EntityPlace();
                        ep.setId(placeRoot.getAttribute("xml:id"));
                        if(placeRoot.hasAttribute("type"))
                            ep.setType(placeRoot.getAttribute("type"));
                        if(placeRoot.getElementsByTagName("TEI:placeName").getLength() == 0)
                            ep.setName("unbekannt");
                        NodeList placeChildren = placeRoot.getChildNodes();
                        for(int c = 0;c < placeChildren.getLength();c++) {
                            if(placeChildren.item(c).getNodeType() == Node.ELEMENT_NODE) {
                                Element placeInfo = (Element) placeChildren.item(c);
                                //System.out.println(placeInfo.getNodeName());
                                switch(placeInfo.getNodeName()) {
                                    case "TEI:placeName":
                                        if(placeInfo.getAttribute("type").equals("main")) {
                                            ep.setName(placeInfo.getTextContent());
                                        }
                                        else if(placeInfo.getAttribute("type").equals("alt"))
                                            altNames.add(placeInfo.getTextContent());
                                        break;
                                    case "TEI:location":
                                        NodeList latLng = placeInfo.getElementsByTagName("TEI:geo");
                                        double lat = Double.parseDouble(latLng.item(0).getTextContent());
                                        double lng = Double.parseDouble(latLng.item(1).getTextContent());
                                        //System.out.println(placeInfo.getAttribute("type"));
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
                                    case "TEI:region": ep.setType("Region");
                                        NodeList placeNames = placeInfo.getElementsByTagName("TEI:placeName");
                                        for(int n = 0;n < placeNames.getLength();n++) {
                                            Element placeName = (Element) placeNames.item(n);
                                            if(placeName.getAttribute("type").equals("main")) {
                                                ep.setName(placeName.getTextContent());
                                            }
                                            else if(placeName.getAttribute("type").equals("alt"))
                                                altNames.add(placeName.getTextContent());
                                        }
                                        break;
                                    case "TEI:settlement": ep.setType("Stadt");
                                        placeNames = placeInfo.getElementsByTagName("TEI:placeName");
                                        for(int n = 0;n < placeNames.getLength();n++) {
                                            Element placeName = (Element) placeNames.item(n);
                                            if(placeName.getAttribute("type").equals("main")) {
                                                ep.setName(placeName.getTextContent());
                                            }
                                            else if(placeName.getAttribute("type").equals("alt"))
                                                altNames.add(placeName.getTextContent());
                                        }
                                        break;
                                }
                            }
                        }
                        ep.setAltNames(altNames);
                        if(ep.getType() == null)
                            ep.setType("unbekannt");
                        //System.out.println(ep.getName());
                        placeList.put(ep.getId(),ep);
                    }
                }
            } catch (XPathExpressionException e) {
                e.printStackTrace();
            }
        //}
    }

    public List<SPDocument> getDocuments() {
        return new ArrayList<>(documents.values());
    }

    public SPDocument getSingleDocument(String workId) {
        //System.out.println(documents.containsKey(workId));
        return documents.get(workId);
    }

    public SPSource getSingleSource(String workId, String sourceId) {
        return documents.get(workId).getSourcesMap().get(sourceId);
    }

    public Map<String, Set<String>> getPersonIndex() {
        return personIndex;
    }

    public Map<String, Set<String>> getAuthorIndex() {
        return authorIndex;
    }

    public Map<String, Set<String>> getRemIndex() {
        return remIndex;
    }

    public Map<String, Set<String>> getTradeIndex() {
        return tradeIndex;
    }

    public Map<String, Set<String>> getPlaceIndex() {
        return placeIndex;
    }

    public Map<String, EntityPerson> getPersonList() {
        return personList;
    }

    public Map<String, EntityPlace> getPlaceList() {
        return placeList;
    }

    public Map<Object, Integer> getFrequencies(String map) {
        Map<Object,Integer> ret = new TreeMap<>();
        switch(map) {
            case "person": Set<String> keys = personIndex.keySet();
                for(String key: keys) {
                    ret.put(personList.get(key), personIndex.get(key).size());
                }
                break;
            case "place": keys = placeIndex.keySet();
                for(String key: keys) {
                    ret.put(placeList.get(key), placeIndex.get(key).size());
                }
                break;
            case "remarkability": keys = remIndex.keySet();
                for(String key: keys) {
                    ret.put(key, remIndex.get(key).size());
                }
                break;
            case "tradeGoods": keys = tradeIndex.keySet();
                for(String key: keys) {
                    ret.put(key, tradeIndex.get(key).size());
                }
                break;
        }
        return ret;
    }
}
