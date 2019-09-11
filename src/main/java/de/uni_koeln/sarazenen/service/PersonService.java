package de.uni_koeln.sarazenen.service;

/**
 * @author A.Pietsch
 * @author A.Gálffy
 */
//@Service
public class PersonService {
	
	/*
	@Autowired
	private XmlService xmlService;
	private String filepath = "xml/Sarazenen_Final_Map_v0.1.xml";
	private Document doc;
	private XPath xpath;
	
	@PostConstruct
	public void init() throws ParserConfigurationException, SAXException, IOException {
		DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
		DocumentBuilder builder = factory.newDocumentBuilder();
		doc = builder.parse(new File(filepath));
		XPathFactory xPathFactory = XPathFactory.newInstance();
		xpath = xPathFactory.newXPath();
	}
	
	public Map<String,List<QuelleForm>> getSourcesByKey(String id,String keyType) throws XPathExpressionException {
		String query = "";
		System.out.println(id);
		if(keyType.equals("person")) query = "//Quelle[Entitaeten/Entitaet/@Id='"+id+"']"+
				"|//Quelle[Entitaeten/Entitaet/@Id='"+id+"']/ancestor::Dokumente/WerkId"+
				"|//Quelle[Entitaeten/Entitaet/@Id='"+id+"']/ancestor::Dokumente/WerkTitel";
		else if(keyType.equals("place")) query = "//Quelle[Entitaeten/Entitaet/Name='"+id+"']"+
				"|//Quelle[Entitaeten/Entitaet/Name='"+id+"']/ancestor::Dokumente/WerkId"+
				"|//Quelle[Entitaeten/Entitaet/Name='"+id+"']/ancestor::Dokumente/WerkTitel";
		else if(keyType.equals("keyword")) query = "//Quelle[Auffaelligkeiten/Schlagwort='"+id+"']|"+
				"//Quelle[Auffaelligkeiten/Schlagwort='"+id+"']/ancestor::Dokumente/WerkId|"+
				"//Quelle[Auffaelligkeiten/Schlagwort='"+id+"']/ancestor::Dokumente/WerkTitel";
		XPathExpression expr = xpath.compile(query);
		NodeList res = (NodeList) expr.evaluate(doc, XPathConstants.NODESET);
		List<QuelleForm> ret = new ArrayList<QuelleForm>();
		Map<String,List<QuelleForm>> retMap = new TreeMap<String,List<QuelleForm>>();
		String werkId = "";
		String werkTitel = "";
		for(int r = 0;r < res.getLength(); r++) {
			Node node = res.item(r);
			QuelleForm qNeu = new QuelleForm();
			//System.out.println(node.getNodeName());
			if(node.getNodeName().equals("WerkId")) {
				ret = new ArrayList<QuelleForm>();
				werkId = node.getTextContent();
			}
			else if(node.getNodeName().equals("WerkTitel"))
				werkTitel = node.getTextContent();
			else if(node.getNodeName().equals("Quelle")) {
				qNeu = xmlService.buildSource(werkId, node.getChildNodes());
			}
			if(qNeu.getQuellenId() != null) {
				ret.add(qNeu);				
			}
			if(!werkTitel.isEmpty())
				retMap.put(werkTitel, ret);
		}
		return retMap;
	}
	
	public List<AuthorRes> getAuthorsAndWorks() throws XPathExpressionException {
		List<AuthorRes> ret = new ArrayList<AuthorRes>();
		Set<String> authors = new TreeSet<String>();
		String query = "//Autor";
		XPathExpression expr = xpath.compile(query);
		NodeList res = (NodeList) expr.evaluate(doc, XPathConstants.NODESET);
		for(int r = 0;r < res.getLength(); r++) {
			String author = res.item(r).getTextContent();
			authors.add(author);
		}
		for(String author: authors) {
			System.out.println(author);
			String queryLifeDates = "//Autor[text()='"+author+"']/ancestor::Autoren/following-sibling::LebensdatenVerfasser";
			expr = xpath.compile(queryLifeDates);
			String lifeDates = (String) expr.evaluate(doc, XPathConstants.STRING);
			AuthorRes authorRes = new AuthorRes();
			authorRes.setName(author);
			authorRes.setLebensdatenVerfasser(lifeDates);
			String queryWorks = "//Autor[text()='"+author+"']/ancestor::Dokumente/WerkTitel|"+
								"//Autor[text()='"+author+"']/ancestor::Dokumente/WerkId";
			expr = xpath.compile(queryWorks);
			NodeList worksList = (NodeList) expr.evaluate(doc, XPathConstants.NODESET);
			Map<String,String> works = new TreeMap<String,String>();
			for(int w = 0;w < worksList.getLength();w+=2) {
				works.put(worksList.item(w).getTextContent(), worksList.item(w+1).getTextContent());
			}
			authorRes.setWerke(works);
			ret.add(authorRes);
		}
		return ret;
	}
	*/
	
}
