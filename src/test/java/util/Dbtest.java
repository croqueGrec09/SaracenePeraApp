//package util;
//
//import java.io.File;
//
//import org.exist.xmldb.XmldbURI;
//import org.junit.Test;
//import org.xmldb.api.DatabaseManager;
//import org.xmldb.api.base.Collection;
//import org.xmldb.api.base.Database;
//import org.xmldb.api.base.XMLDBException;
//import org.xmldb.api.modules.CollectionManagementService;
//import org.xmldb.api.modules.XMLResource;
//
//public class Dbtest {
//
//	/**
//	 * Fügt Dokumente zur Datenbank.
//	 */
//
//
//	@Test
//	public void usage() {
//		System.out.println("usage: org.exist.examples.xmldb. Put collection docName");
//		System.exit(0);
//	}
//
//@Test
//	public void addXML() throws ClassNotFoundException, XMLDBException, InstantiationException, IllegalAccessException {
//	String URI = "xmldb:exist://localhost:8080/exist/xmlrpc";
//		String collection = "/db/sarazenen", file = "src/main/resources/SaraceniMaximalschema.xml"; // File
//	
//		// init() driver
//		String driver = "org.exist.xmldb.DatabaseImpl";
//		Class<?> cl = Class.forName(driver);
//		Database database = (Database) cl.newInstance();
//		database.setProperty("create-database", "true");
//		DatabaseManager.registerDatabase(database);
//		// get collection
//		Collection col = DatabaseManager.getCollection(URI + collection);
//		if (col == null) {
//			// wenn collection nicht existiert. Get root collection and
//			// create
//			Collection root = DatabaseManager.getCollection(URI + XmldbURI.ROOT_COLLECTION);
//			CollectionManagementService mgtService = (CollectionManagementService) root
//					.getService("CollectionManagementService", "1.0");
//			col = mgtService.createCollection(collection.substring((XmldbURI.ROOT_COLLECTION + "/").length()));
//		}
//		File f = new File(file);
//		// create neue XMLResource
//		XMLResource document = (XMLResource) col.createResource(f.getName(), "XMLResource");
//		document.setContent(f);
//		System.out.println("storing document" + document.getId() + "...");
//		col.storeResource(document);
//		System.out.println("ok");
//
//	}
//
//}
