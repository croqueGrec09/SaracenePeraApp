//package util;
//
//import javax.xml.stream.XMLStreamReader;
//
//import org.junit.Test;
//import org.w3c.dom.NamedNodeMap;
//import org.w3c.dom.Node;
//import org.w3c.dom.NodeList;
//
//public class XmlReaderTest {
//	public XMLStreamReader reader = null;
//
//	public String tagName;
//	public NodeList nodes;
//	public Node node;
//	public String attrName;
//	// @Test
//	// public void readFromDic() throws IOException {
//	// File dir = new File("src/main/resources/");
//	// File[] fileList = dir.listFiles();
//	// for (File f : fileList) {
//	// System.out.println(f.getPath());
//	// }
//	//
//	// }
//
//	@Test
//	public void getNode() {
//
//		for (int x = 0; x < nodes.getLength(); x++) {
//			Node node = nodes.item(x);
//			if (node.getNodeName().equalsIgnoreCase(tagName)) {
//
//			}
//		}
//
//	}
//
//	@Test
//	public void getChildNodeValue() {
//
//		NodeList childNodes = node.getChildNodes();
//		for (int x = 0; x < childNodes.getLength(); x++) {
//			Node data = childNodes.item(x);
//			if (data.getNodeType() == Node.TEXT_NODE)
//				;
//
//		}
//
//	}
//
//	@Test
//	public void getNodeValue() {
//		for (int x = 0; x < nodes.getLength(); x++) {
//			Node node = nodes.item(x);
//			if (node.getNodeName().equalsIgnoreCase(tagName)) {
//				NodeList childNodes = node.getChildNodes();
//				for (int y = 0; y < childNodes.getLength(); y++) {
//					Node data = childNodes.item(y);
//					if (data.getNodeType() == Node.TEXT_NODE)
//						;
//
//				}
//			}
//		}
//	}
//
//	@Test
//	public void getNodeAttr() {
//		NamedNodeMap attrs = node.getAttributes();
//		for (int y = 0; y < attrs.getLength(); y++) {
//			Node attr = attrs.item(y);
//			if (attr.getNodeName().equalsIgnoreCase(attrName)) {
//
//			}
//		}
//
//	}
//
//	@Test
//	public void getChildNodeAttr() {
//		for (int x = 0; x < nodes.getLength(); x++) {
//			Node node = nodes.item(x);
//			if (node.getNodeName().equalsIgnoreCase(tagName)) {
//				NodeList childNodes = node.getChildNodes();
//				for (int y = 0; y < childNodes.getLength(); y++) {
//					Node data = childNodes.item(y);
//					if (data.getNodeType() == Node.ATTRIBUTE_NODE) {
//						if (data.getNodeName().equalsIgnoreCase(attrName))
//							;
//					}
//				}
//			}
//		}
//	}
//}