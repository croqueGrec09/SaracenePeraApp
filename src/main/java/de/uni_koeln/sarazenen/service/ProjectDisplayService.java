package de.uni_koeln.sarazenen.service;

import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class ProjectDisplayService {

    private String project;

    public Map<String,String> setPageGenerics(String project) {
        this.project = project;
        return setPageGenerics();
    }

    private Map<String,String> setPageGenerics() {
        Map<String,String> result = new LinkedHashMap<>();
        if(project == null) {
            result.put("projectTitle","Sarazenen & Pera");
            result.put("headerImagePath","/images/header_both.jpg");
            result.put("withProject","false");
        }
        else {
            result.put("withProject","true");
            switch(project.toLowerCase()) {
                case "saraceneapp": result.put("projectTitle","Sarazenen");
                    result.put("headerImagePath","/images/header.jpg");
                    result.put("filepath","xml/Sarazenen_TEI_v1.xml");
                    result.put("dendrographPath","xml/Dendrograph.xml");
                    break;
                case "peraapp": result.put("projectTitle","Pera");
                    result.put("headerImagePath","/images/header_pera.jpg");
                    result.put("filepath","xml/Pera_TEI_v1.xml");
                    result.put("dendrographPath","xml/Pera_Dendrograph.xml");
                    break;
            }
        }
        return result;
    }

}
