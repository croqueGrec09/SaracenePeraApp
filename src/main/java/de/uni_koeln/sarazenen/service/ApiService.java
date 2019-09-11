package de.uni_koeln.sarazenen.service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

import org.springframework.stereotype.Service;

/**
 * @author A.Pietsch
 *
 */
@Service
public class ApiService {

	public static String getHTML(String anfrage) throws Exception {
		StringBuilder result = new StringBuilder();
		URL url = new URL("http://www.mgh.de/dmgh/imgh/geo/api/search?q=" + anfrage);
		HttpURLConnection conn = (HttpURLConnection) url.openConnection();
		conn.setRequestMethod("GET");
		BufferedReader rd = new BufferedReader(new InputStreamReader(conn.getInputStream()));
		String line;
		while ((line = rd.readLine()) != null) {
			result.append(line);
			result.append("\n");
		}
		rd.close();
		return result.toString();
	}

}
