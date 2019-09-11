package de.uni_koeln.sarazenen.service;

import java.io.File;
import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;
import java.util.Scanner;

import javax.xml.transform.OutputKeys;
import javax.xml.transform.Source;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;

import org.springframework.stereotype.Service;

@Service
public class ExportService {

	private String filename = "src/main/webapp/WEB-INF/templates/data/Sarazenen_Final_Map_v0.1.xml";
	
	public String getTEIExport(String workid) throws TransformerException, IOException {
		StringBuilder sb = new StringBuilder();
		Scanner scanner = new Scanner(new File(filename));
		while(scanner.hasNextLine()){
			sb.append(scanner.nextLine());
			sb.append("\n");
		}
		scanner.close();
		StringReader sr = new StringReader(sb.toString());
		StringWriter sw = new StringWriter();
		TransformerFactory factory = TransformerFactory.newInstance();
		//pass params to transforming scenario!
		Source xslt = new StreamSource(new File("src/main/resources/xml/sarazenen_xsl_tei_v1_dok.xsl"));
		Transformer transformer = factory.newTransformer(xslt);
		Source xml = new StreamSource(sr);
		transformer.setOutputProperty(OutputKeys.INDENT, "yes");
		transformer.setParameter("werkid", workid);
		transformer.transform(xml,new StreamResult(sw));
		String xmlOut = sw.toString();
		return xmlOut;
	}
	
}
