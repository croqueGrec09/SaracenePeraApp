package de.uni_koeln.sarazenen.service;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

/*import org.apache.lucene.analysis.TokenStream;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.index.DirectoryReader;
import org.apache.lucene.queryparser.classic.ParseException;
import org.apache.lucene.queryparser.classic.QueryParser;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.ScoreDoc;
import org.apache.lucene.search.TopDocs;
import org.apache.lucene.search.TopScoreDocCollector;
import org.apache.lucene.search.highlight.Highlighter;
import org.apache.lucene.search.highlight.InvalidTokenOffsetsException;
import org.apache.lucene.search.highlight.QueryScorer;
import org.apache.lucene.search.highlight.SimpleHTMLFormatter;
import org.apache.lucene.search.highlight.SimpleSpanFragmenter;
import org.apache.lucene.search.highlight.TextFragment;
import org.apache.lucene.store.Directory;
import org.apache.lucene.store.SimpleFSDirectory;*/
import org.springframework.stereotype.Service;

import de.uni_koeln.sarazenen.data.SourceResult;

/**
 * @author A.Pietsch
 *
 */
@Service
public class SearchService {
//
//	private int totalHits;
//	private Properties properties;
//	private static String PAGEHITS = "lucene.search.pageHits";
//	private String filename="src/main/resources/xml/sarazenen_vollstaendig.xml";
//
//	public List<SourceResult> search(String q) throws IOException, ParseException {
//
//		DirectoryReader dirReader = openDirectory();
//		IndexSearcher is = new IndexSearcher(dirReader);
//		QueryParser parser = new QueryParser("titel", new StandardAnalyzer());
//		Query query = parser.parse(q);
//		System.out.println("Gesucht wird: "+q);
//		TopDocs hits = is.search(query, dirReader.numDocs());
//		System.out.println(hits.totalHits+" Dokumente gefunden!");
//		this.setTotalHits(hits.totalHits);
//		List<SourceResult> resultList = toResult(is, hits);
//
//		dirReader.close();
//		return resultList;
//	}
//
//	private DirectoryReader openDirectory() throws IOException {
//		return DirectoryReader.open(getLuceneDir());
//	}
//	/**
//	 * @param totalHits
//	 */
//	private void setTotalHits(int totalHits) {
//		this.totalHits = totalHits;
//	}
//	/**
//	 * @return totalHits in current search
//	 */
//	public int getTotalHits() {
//		return totalHits;
//	}
//
//	private Directory getLuceneDir() throws IOException {
//		File indexDir = new File("index");
//		return new SimpleFSDirectory(indexDir.toPath());
//	}
//
//	private List<SourceResult> toResult(IndexSearcher is, TopDocs hits) throws IOException {
//		List<SourceResult> resultList = new ArrayList<SourceResult>();
//		for (int i = 0; i < hits.scoreDocs.length; i++) {
//			ScoreDoc scoreDoc = hits.scoreDocs[i];
//			Document doc = is.doc(scoreDoc.doc);
//			SourceResult result = wrapFieldResults(doc);
//			resultList.add(result);
//		}
//		return resultList;
//	}
//
//	/**
//	 * Wrap up all field contents of a hit.
//	 *
//	 * @param doc
//	 * @return a SearchResult object reflecting the given Document.
//	 */
//	private SourceResult wrapFieldResults(Document doc) {
//		System.out.println(doc.get("titel"));
//		String title = doc.get("titel");
//		String autor = doc.get("autor");
//		String edhinweis = doc.get("edhinweis");
//		String werkinfo = doc.get("werkinfo");
//		String abfassungsort = doc.get("abfassungsort");
//		String abfassungszeit = doc.get("abfassungszeit");
//		String lebensdaten = doc.get("lebensdaten");
//		String region = doc.get("region");
//		String inhaltsangabe = doc.get("inhaltsangabe");
//
//		/*SourceResult result = new SourceResult(title, autor, edhinweis, werkinfo, abfassungsort, abfassungszeit,
//				lebensdaten, region,inhaltsangabe);*/
//
//		return null;
//	}
//
//	private Query getQuery(String searchPhrase, boolean regex, StandardAnalyzer analyzer) throws ParseException {
//		String contents = "";
//		if (regex) {
//			contents = "contents:/" + searchPhrase + "/ ";
//		} else {
//			contents = "contents:" + "\"" + searchPhrase + "\"" + "~10 ";
//		}
//
//		QueryParser parser = new QueryParser("contents", analyzer);
//		String q = contents;
//
//		Query query = parser.parse(q);
//		return query;
//	}
//
//	public List<SourceResult> withQuotations(String searchPhrase, boolean regex, int numFragments, int page)
//			throws IOException, ParseException, InvalidTokenOffsetsException {
//
//		DirectoryReader dirReader = openDirectory();
//		IndexSearcher is = new IndexSearcher(dirReader);
//		StandardAnalyzer analyzer = new StandardAnalyzer();
//
//		int hitsPerPage = getHitsPerPage();
//		TopScoreDocCollector collector = TopScoreDocCollector.create(dirReader.maxDoc());
//		int startIndex = (page - 1) * hitsPerPage;
//
//		Query query = getQuery(searchPhrase, regex, analyzer);
//
//		is.search(query, collector);
//		TopDocs hits = collector.topDocs(startIndex, hitsPerPage);
//
//		this.setTotalHits(hits.totalHits);
//		SimpleHTMLFormatter htmlFormatter = new SimpleHTMLFormatter("<span class=\"quotation\">", "</span>");
//		QueryScorer queryScorer = new QueryScorer(query, "contents");
//		Highlighter highlighter = new Highlighter(htmlFormatter, queryScorer);
//		highlighter.setTextFragmenter(new SimpleSpanFragmenter(queryScorer, 100));
//		List<SourceResult> resultList = new ArrayList<>();
//		for (ScoreDoc scoreDoc : hits.scoreDocs) {
//			int id = scoreDoc.doc;
//			Document doc = is.doc(id);
//			String text = doc.get("contents");
//			TokenStream tokenStream = analyzer.tokenStream("contents", text);
//			TextFragment[] frag = highlighter.getBestTextFragments(tokenStream, text, false, numFragments);
//			List<String> quots = new ArrayList<>();
//			for (TextFragment textFragment : frag) {
//				if ((textFragment != null) && (textFragment.getScore() > 0)) {
//					String quotation = "[...] " + textFragment.toString() + " [...]";
//					quots.add(quotation);
//				}
//			}
//			//SourceResult result = wrapFieldResults(doc, quots);
//			//resultList.add(result);
//		}
//
//		return resultList;
//	}
//
//	/*
//	private SourceResult wrapFieldResults(Document doc, List<String> quotations) {
//		SourceResult result = new SourceResult(doc);
//		result.setQuotations(quotations);
//		result.setTitle("title");
//		result.setAutor("autor");
//		result.setAbfassungsort(doc.get("abfassungsort"));
//		return result;
//	}
//	*/
//
//	public int getHitsPerPage() {
//		return Integer.parseInt(properties.getProperty(PAGEHITS));
//	}

}
