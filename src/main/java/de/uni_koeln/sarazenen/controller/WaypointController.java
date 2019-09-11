package de.uni_koeln.sarazenen.controller;

import de.uni_koeln.sarazenen.service.ProjectDisplayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 
 * Dies ist ein Wegweiser, der als Einstiegspunkt dient für den Fall, dass der Projektaufruf noch nicht gemacht wurde.
 * 
 * @author Andreas Gálffy
 */
@Controller
public class WaypointController {

	private final ProjectDisplayService pds;

	@Autowired
	public WaypointController(ProjectDisplayService pds) {
		this.pds = pds;
	}

	@RequestMapping(value = { "/", "/index" })
	public String welcome(Model model) {
		model.addAllAttributes(pds.setPageGenerics(null));
		return "home";
	}

}
