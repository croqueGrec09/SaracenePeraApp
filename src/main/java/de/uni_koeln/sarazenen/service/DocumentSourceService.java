package de.uni_koeln.sarazenen.service;

import de.uni_koeln.sarazenen.data.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;

import javax.annotation.PostConstruct;
import java.util.*;
import java.util.Map.Entry;

@Service
public class DocumentSourceService {

    private final XmlService xml;
    private Map<String,ProjectCorpus> projectCorpora = new HashMap<>();

    @Autowired
    public DocumentSourceService(XmlService xml) {
        this.xml = xml;
    }

    @PostConstruct
    public void init() {
        for(Entry<String,Document> projectDocs: xml.getDoc().entrySet()) {
            projectCorpora.put(projectDocs.getKey(),new ProjectCorpus(projectDocs.getKey(),xml));
        }
    }

    public List<SPDocument> getDocuments(String project) {
        return projectCorpora.get(project).getDocuments();
    }

    public SPDocument getSingleDocument(String project, String workId) {
        return projectCorpora.get(project).getSingleDocument(workId);
    }

    public SPSource getSingleSource(String project, String workId, String sourceId) {
        return projectCorpora.get(project).getSingleSource(workId, sourceId);
    }

    public Map<String, EntityPerson> getPersonList(String project) {
        return projectCorpora.get(project).getPersonList();
    }

    public Map<String, Set<String>> getPersonIndex(String project) {
        return projectCorpora.get(project).getPersonIndex();
    }

    public Map<String, EntityPlace> getPlaceList(String project) {
        return projectCorpora.get(project).getPlaceList();
    }

    public Map<String, Set<String>> getPlaceIndex(String project) {
        return projectCorpora.get(project).getPlaceIndex();
    }

    public Map<String, Set<String>> getAuthorIndex(String project) {
        return projectCorpora.get(project).getAuthorIndex();
    }

    public Map<String, Set<String>> getRemIndex(String project) {
        return projectCorpora.get(project).getRemIndex();
    }

    public Map<String, Set<String>> getTradeIndex(String project) {
        return projectCorpora.get(project).getTradeIndex();
    }

    public Map<Object, Integer> getFrequencies(String project, String map) {
        return projectCorpora.get(project).getFrequencies(map);
    }

}
