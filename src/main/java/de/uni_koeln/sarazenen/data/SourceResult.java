package de.uni_koeln.sarazenen.data;

/**
 * @author A. Gálffy
 *
 */
public class SourceResult {

	private SPDocument work;
	private SPSource source;

	public SourceResult(SPDocument work, SPSource source) {
		this.work = work;
		this.source = source;
	}

	public SPDocument getWork() {
		return work;
	}

	public SPSource getSource() {
		return source;
	}

}
