package de.uni_koeln.sarazenen.data;

public class Bag {
	/*
	private List<Map<String,String>> objects;
	
	public Bag() {
		objects = new ArrayList<Map<String,String>>();
	}

	public List<Map<String,String>> getObjects() {
		return objects;
	}
	
	public void fillList(Sarazenen sarazenen) {
		for(Dokumente doc : sarazenen.getDokumente()) {
			Quellen q = doc.getQuellen();
			//für jede Auffälligkeit eine eigene Map
			for(Quelle quel : q.getQuelle()) {
				for(String schlagwort : quel.getAuffaelligkeiten().getSchlagwort()) {
					Map<String,String> a = new HashMap<String,String>();
					a.put("auffaelligkeit", schlagwort);
					a.put("werk_id", doc.getWerkId());
					a.put("werk_titel", doc.getWerkTitel());
					a.put("quellen_id", quel.getQuellenId());
					objects.add(a);
				}
			}
		}
	}
	
	public String fillTrailingZeros(BigInteger init) {
		String retVal = "0";
		if(init.intValue() < 10){
			retVal += "00"+init.toString();
		}
		else if(init.intValue() >= 10 && init.intValue() < 100) {
			retVal += "0"+init.toString();
		}
		//für den Fall der Fälle ...
		else if(init.intValue() >= 100 && init.intValue() < 999) {
			retVal += init.toString();
		}
		//und wenn das auch nicht ausreichen sollte ...
		else retVal = init.toString();
		return retVal;
	}
	*/
}
