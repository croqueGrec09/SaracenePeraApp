package de.uni_koeln.sarazenen.util;

/**
 * Mit Hilfe von Lucene wird ein Index erstellt.
 *
 */
public class Indexer {
	
	/*
	private IndexWriter writer;

	public Indexer(String indexDir) throws IOException {
		Directory luceneDir = new SimpleFSDirectory(new File(indexDir).toPath());
		Analyzer analyzer = new StandardAnalyzer();
		IndexWriterConfig conf = new IndexWriterConfig(analyzer);
		writer = new IndexWriter(luceneDir, conf);
		writer.commit();
		
	}

	public void buildIndex(String filename) throws JAXBException, IOException {
		//1. Lucene Dokument wird erstellt
		Document doc = new Document();
		//2.XML Elemente werden Deserialisiert mit Hilfe des Unmarschallers JAXB
		JAXBContext jaxbContext = JAXBContext.newInstance(Sarazenen.class);
		Unmarshaller jaxbUnmarshaller = jaxbContext.createUnmarshaller();
		Sarazenen sarazenen = (Sarazenen) jaxbUnmarshaller.unmarshal(new File(filename));
		//3.Iteration durch alle Quellen
		for (Dokumente document : sarazenen.getDokumente()) {
			//4. Dem Lucene Dokument werden Felder hinzugefügt. Dabei wird jeden Feld ein Titel zugewiesen.
			//Elemente können später durch Titel abgerufen werden.
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
				doc.add(new TextField("volltextUeber", quelle.getVolltextUebersetzung(), Store.YES));
				doc.add(new TextField("volltext", quelle.getVolltextOriginalsprache(), Store.YES));
				doc.add(new TextField("anmerkungen", quelle.getAnmerkungen(), Store.YES));
				doc.add(new TextField("zeitQuelle", quelle.getZeitangabeQuelle(), Store.YES));
				doc.add(new TextField("zeitWissen", quelle.getZeitangabeWissenschaft(), Store.YES));
				doc.add(new TextField("zitation", quelle.getZitation(), Store.YES));
				doc.add(new TextField("interaktion", quelle.getInteraktion(), Store.YES));
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
		
		}
		writer.addDocument(doc);
	
		writer.close();
		
		

	}

	
	public void close() throws IOException {

		writer.close();
	}

	public int getNumDocs() {
		return writer.numDocs();
	}
	*/
}
