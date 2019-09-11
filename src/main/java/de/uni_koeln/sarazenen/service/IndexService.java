package de.uni_koeln.sarazenen.service;

//@Service
public class IndexService {

	/*
	private String indexDir = "index";
	private IndexWriter writer;

	@PostConstruct
	public void init() throws IOException, JAXBException {

		Directory luceneDir = new SimpleFSDirectory(new File(indexDir).toPath());
		Analyzer analyzer = new StandardAnalyzer();
		IndexWriterConfig conf = new IndexWriterConfig(analyzer);
		writer = new IndexWriter(luceneDir, conf);
		writer.deleteAll();
		String filename = "xml/Sarazenen_Final_Map_v0.1.xml";
		JAXBContext jaxbContext = JAXBContext.newInstance(Sarazenen.class);
		Unmarshaller jaxbUnmarshaller = jaxbContext.createUnmarshaller();
		Sarazenen sarazenen = (Sarazenen) jaxbUnmarshaller.unmarshal(new File(filename));		
		for (Dokumente document : sarazenen.getDokumente()) {
			Document doc = indexDocuments(document);
			writer.addDocument(doc);
		}
		indexPersons(sarazenen.getPersonen());
		indexPlaces(sarazenen.getOrte());
		writer.close();
	}

	public Document indexDocuments(Dokumente document) throws JAXBException, IOException {
		
		Document doc = new Document();
			//System.out.println(document.getWerkTitel());
			doc.add(new TextField("titel", document.getWerkTitel(), Store.YES));

			for (String autor : document.getAutoren().getAutor()) {
				doc.add(new TextField("autor", autor, Store.YES));
			}
			doc.add(new TextField("edhinweis", document.getEditionshinweise(), Store.YES));
			doc.add(new TextField("werkinfo", document.getWerkinformation(), Store.YES));
			doc.add(new TextField("abfassungsort", document.getAbfassungsort(), Store.YES));
			doc.add(new TextField("abfassungszeitraum", document.getAbfassungszeitraum(), Store.YES));
			doc.add(new TextField("lebensdaten", document.getLebensdatenVerfasser(), Store.YES));
			for (String region : document.getRegionen().getRegion()) {
				doc.add(new TextField("region", region, Store.YES));
			}
			Quellen werkQuellen = document.getQuellen();
			for (Quelle quelle : werkQuellen.getQuelle()) {
				doc.add(new TextField("inhaltsangabe", quelle.getInhaltsangabe(), Store.YES));
				// Fehler
				// doc.add(new StringField("volltextUeber",
				// quelle.getVolltextUebersetzung(), Store.YES));

				doc.add(new TextField("volltext", quelle.getVolltextOriginalsprache(), Store.YES));
				// Fehler
				if(quelle.getAnmerkungen() != null)
				 doc.add(new TextField("anmerkungen",quelle.getAnmerkungen(),Store.YES));

				// Fehler
				// doc.add(new TextField("zeitQuelle",
				// quelle.getZeitangabeQuelle(),
				// Store.YES));

				doc.add(new TextField("zeitWissen", quelle.getZeitangabeWissenschaft(), Store.YES));
				doc.add(new TextField("zitation", quelle.getZitation(), Store.YES));

				// Fehler
				// doc.add(new TextField("interaktion",
				// quelle.getInteraktion().toString(),
				// Store.YES));
				//
				for (String schlagwort : quelle.getAuffaelligkeiten().getSchlagwort()) {
					doc.add(new TextField("schlagwort", schlagwort, Store.YES));
				}
				for (String beteiligter : quelle.getBeteiligte().getBeteiligter()) {
					doc.add(new TextField("beteiligter", beteiligter, Store.YES));
				}
				for (Entitaet entitaet : quelle.getEntitaeten().getEntitaet()) {
					doc.add(new TextField("entitaetN", entitaet.getName(), Store.YES));
					doc.add(new TextField("entitaetT", entitaet.getType(), Store.YES));
				}
				for (String suchwort : quelle.getSuchbegriffe().getSuchwort()) {
					doc.add(new TextField("suchwort", suchwort, Store.YES));

				}

		}
		return doc;
	}

	public void indexPersons(Personen personen) throws IOException {
		for(Person person: personen.getPerson()) {
			Document doc = new Document();
			doc.add(new TextField("personName",person.getName(),Store.YES));
			doc.add(new TextField("personRolle",person.getRolle(),Store.YES));
			for (String personAlt : person.getAlternativnamen().getName()) {
				doc.add(new TextField("personAlt",personAlt,Store.YES));	
			}
			writer.addDocument(doc);
		}
	}
	
	public void indexPlaces(Orte orte) throws IOException {
		for(Ort ort : orte.getOrt()) {
			Document doc = new Document();
			doc.add(new TextField("ortName",ort.getName(),Store.YES));
			doc.add(new TextField("ortTyp",ort.getTyp(),Store.YES));
			for (String ortAlt : ort.getAlternativnamen().getName()) {
				doc.add(new TextField("ortAlt",ortAlt,Store.YES));	
			}
			
			writer.addDocument(doc);
		}
		
	}
	
	public void close() throws IOException {
		writer.close();
	}

	public int getNumDocs() {
		return writer.numDocs();
	}
	*/
}
