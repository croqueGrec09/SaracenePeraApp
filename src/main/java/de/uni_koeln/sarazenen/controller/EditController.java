package de.uni_koeln.sarazenen.controller;

import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Konformität. Controllerklasse zum Verwalten der Editieranfragen.
 *
 */
//@Controller
@RequestMapping("/edit")
public class EditController {
	/*
	@Autowired
	private EditService editor;
	
	@RequestMapping("/{workid}")
	public String openWork(@PathVariable("workid") String workid, Model workData) {
		Sarazenen sarazenen = editor.loadDatabase();
		List<Dokumente> dok = sarazenen.getDokumente();
		if(Integer.parseInt(workid) <= Integer.parseInt(dok.get(dok.size()-1).getWerkId())) {
			for (Dokumente d: dok) {
				//System.out.println(d.getWerkId());
				//System.out.println(workid);
				if(d.getWerkId().equals(workid)) {
					workData.addAttribute("dokumenteForm", editor.loadWork(d));
					if(d.getQuellen() != null) {
						workData.addAttribute("quellen", d.getQuellen().getQuelle());
						workData.addAttribute("nextSourceId", d.getQuellen().getQuelle().size());
					}
					else workData.addAttribute("nextSourceId", 1);
					//System.out.println("Werk # "+d.getWerkId()+" gefunden!");
				}
			}
		}
		else {
			DokumenteForm newWork = new DokumenteForm();
			newWork.setWerkId(workid);
			workData.addAttribute("dokumenteForm", newWork);
			workData.addAttribute("nextSourceId", 1);
		}
		return "editor";	
	}
	
	@RequestMapping("/source/{workid}/{sourceid}")
	public String openSource(@PathVariable("workid") String workid, @PathVariable("sourceid") String sourceid, Model workData) {
		Sarazenen sarazenen = editor.loadDatabase();
		List<Dokumente> dok = sarazenen.getDokumente();
		if(Integer.parseInt(workid) <= Integer.parseInt(dok.get(dok.size()-1).getWerkId())) {
			for (Dokumente d: dok) {
				if(d.getWerkId().equals(workid)) {
					if(d.getQuellen() != null) {
						List<Quelle> sourcesList = d.getQuellen().getQuelle();
						if(Integer.parseInt(sourceid) <= Integer.parseInt(sourcesList.get(sourcesList.size()-1).getQuellenId())) {
							QuelleForm output = editor.loadSource(workid,sourceid);
							workData.addAttribute("quelleForm", output);
						}
					}
					else {
						QuelleForm newSource = new QuelleForm();
						newSource.setWerkId(workid);
						newSource.setQuellenId(sourceid);
						workData.addAttribute("quelleForm", newSource);
					}
				}
			}
		}
		else return openWork(workid,workData);
		return "editor_quelle";	
	}
	
	@RequestMapping("/submit")
	public String submitData(@Valid DokumenteForm work, BindingResult result, Model workPage) {
		if(result.hasErrors()) {
			//workPage.addAttribute("work", work);
			return "editor";
		}
		try {
			editor.updateWork(work);
		} catch (JAXBException | IOException e) {
			e.printStackTrace();
		}
		return "werk";
	}
	
	@RequestMapping("/submitSource")
	public String submitSource(@Valid QuelleForm source, BindingResult result, Model sourcePage) {
		if(result.hasErrors()){
			return "editor_quelle";
		}
		try {
			editor.updateSource(source);
			return "quellenstelle";
		}
		catch (JAXBException | IOException e) {
			e.printStackTrace();
		}
		return null;
	}
	*/
}
