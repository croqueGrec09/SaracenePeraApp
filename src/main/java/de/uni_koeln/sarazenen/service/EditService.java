package de.uni_koeln.sarazenen.service;

//@Service
public class EditService {
	/*
	private Sarazenen sarazenen;
	private JAXBContext jaxbContext;
	private Unmarshaller jaxbUnmarshaller;
	private Marshaller jaxbMarshaller;
	private String filename ="xml/Sarazenen_Final_Map_v0.1.xml";

	@PostConstruct
	public void init() throws JAXBException, IOException {
		jaxbContext = JAXBContext.newInstance(Sarazenen.class);
		jaxbUnmarshaller = jaxbContext.createUnmarshaller();
		jaxbMarshaller = jaxbContext.createMarshaller();
		File f = new File(filename);
		FileInputStream fis = new FileInputStream(f);
		InputStreamReader reader = new InputStreamReader(fis,"UTF-8");
		sarazenen = (Sarazenen) jaxbUnmarshaller.unmarshal(reader);
	}
	
	public Sarazenen loadDatabase() {
		return sarazenen;
	}

	public QuelleForm loadSource(String workid,String sourceid) {
		for (Dokumente d: sarazenen.getDokumente()) {
			//System.out.println(d.getWerkId());
			//System.out.println(workid);
			if(d.getWerkId().equals(workid)) {
				int source = Integer.parseInt(sourceid)-1;
				QuelleForm output = new QuelleForm(workid,sourceid,d.getQuellen().getQuelle().get(source));
				return output;
			}
		}
		return null;
	}
	
	public Sarazenen updateWork(DokumenteForm work) throws JAXBException, IOException {
		List<Dokumente> dok = sarazenen.getDokumente();
		if(Integer.parseInt(work.getWerkId()) <= Integer.parseInt(dok.get(dok.size()-1).getWerkId())) {
			for(int i = 0;i < dok.size(); i++) {
				Dokumente d = dok.get(i);
				if(d.getWerkId().equals(work.getWerkId())){
					d = setWorkValues(d,work);
				}
			}
		}
		else {
			Dokumente d = new Dokumente();
			dok.add(setWorkValues(d, work));
		}
		File f = new File(filename);
		FileOutputStream fos = new FileOutputStream(f);
		OutputStreamWriter writer = new OutputStreamWriter(fos,"UTF-8");
		jaxbMarshaller.marshal(sarazenen,writer);
		return sarazenen;
	}
	
	public Dokumente setWorkValues(Dokumente d, DokumenteForm work) {
		if(d.getWerkId() == null)
			d.setWerkId(work.getWerkId());
		d.setWerkTitel(work.getWerkTitel());
		String[] alternativtitel = work.getAlternativtitel().split(",[ ]?");
		Alternativtitel alt = new Alternativtitel();
		for(String titel: alternativtitel) {
			//System.out.println(beteiligter);
			alt.getTitel().add(titel);
		}
		d.setAlternativtitel(alt);
		String[] autoren = work.getAutoren().split(",[ ]?");
		Autoren aut = new Autoren();
		for(String autor: autoren) {
			//System.out.println(beteiligter);
			aut.getAutor().add(autor);
		}
		d.setAutoren(aut);
		d.setLebensdatenVerfasser(work.getLebensdatenVerfasser());
		d.setAbfassungszeitraum(work.getAbfassungszeitraum());
		d.setAbfassungsort(work.getAbfassungsort());
		String[] regionen = work.getRegionen().split(",[ ]?");
		Regionen r = new Regionen();
		for(String region: regionen) {
			//System.out.println(beteiligter);
			r.getRegion().add(region);
		}
		d.setRegionen(r);
		d.setEditionshinweise(work.getEditionshinweise());
		d.setWerkinformation(work.getWerkinformation());
		return d;
	}

	public Sarazenen updateSource(QuelleForm source) throws JAXBException, IOException {
		List<Dokumente> dok = sarazenen.getDokumente();
		for(int i = 0;i < dok.size();i++){
			Dokumente d = dok.get(i);
			//System.out.println(d.getWerkId());
			Quellen qNeu = new Quellen();
			if(d.getWerkId().equals(source.getWerkId())){
				if(d.getQuellen() != null) {
					List<Quelle> sourcesList = d.getQuellen().getQuelle();
					if(Integer.parseInt(source.getWerkId()) <= Integer.parseInt(sourcesList.get(sourcesList.size()-1).getQuellenId())) {
						for(Quelle q: sourcesList) {
							//System.out.println(q.getQuellenId());
							if(q.getQuellenId().equals(source.getQuellenId())) {
								q = setSourceValues(q,source);
							}
							qNeu.getQuelle().add(q);
						}
					}	
				}
				else {
					Quelle q = new Quelle();
					qNeu.getQuelle().add(setSourceValues(q,source));
				}
			}
			d.setQuellen(qNeu);
			dok.set(i, d);
		}
		File f = new File(filename);
		FileOutputStream fos = new FileOutputStream(f);
		OutputStreamWriter writer = new OutputStreamWriter(fos,"UTF-8");
		jaxbMarshaller.marshal(sarazenen,writer);
		return sarazenen;
	}

	public Quelle setSourceValues(Quelle q,QuelleForm source) {
		if(q.getQuellenId() == null)
			q.setQuellenId(source.getQuellenId());
		q.setZitation(source.getZitation());
		q.setZeitangabeQuelle(source.getZeitangabeQuelle());
		q.setInhaltsangabe(source.getInhaltsangabe());
		q.setVolltextOriginalsprache(source.getVolltextOriginalsprache());
		q.setVolltextUebersetzung(source.getVolltextUebersetzung());
		q.setZitationUebersetzung(source.getZitationUebersetzung());
		//q.setDatum(source.getZeitangabeWissenschaft());
		 
		String[] gs = source.getGeografischeStichworte().split(",[ ]?");
		
		String[] beteiligte = source.getBeteiligte().split(",[ ]?");
		Beteiligte b = new Beteiligte();
		for(String beteiligter: beteiligte) {
			//System.out.println(beteiligter);
			b.getBeteiligter().add(beteiligter);
		}
		q.setBeteiligte(b);
		q.setInteraktion(source.getInteraktion());
		String[] auffaelligkeiten = source.getAuffaelligkeiten().split(",[ ]?");
		Auffaelligkeiten a = new Auffaelligkeiten();
		for(String auffaelligkeit: auffaelligkeiten) {
			a.getSchlagwort().add(auffaelligkeit);
		}
		q.setAuffaelligkeiten(a);
		String[] suchbegriffe = source.getSuchbegriffe().split(",[ ]?");
		Suchbegriffe s = new Suchbegriffe();
		for(String suchbegriff: suchbegriffe) {
			s.getSuchwort().add(suchbegriff);
		}
		q.setSuchbegriffe(s);
		q.setAnmerkungen(source.getAnmerkungen());
		return q;
	}
	
	public DokumenteForm loadWork(Dokumente d) {
		return new DokumenteForm(d);
	}
	*/
}
