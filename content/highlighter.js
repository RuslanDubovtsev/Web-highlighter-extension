// Web Highlighter — Highlight Range
// Handles applying yellow background highlight to selected DOM ranges

window.WebHighlighter = window.WebHighlighter || {};
(() => {
	const WH = window.WebHighlighter;

	/**
	 * Apply a yellow highlight span around the given Range.
	 * Falls back to a more robust approach if surroundContents fails.
	 *
	 * @param {Range} range - The DOM Range to highlight
	 */
	WH.highlightRange = function highlightRange(range) {
		try {
			const span = document.createElement('span');
			span.style.backgroundColor = 'yellow';
			span.style.color = 'inherit';
			// Add a data attribute to mark it as our highlight
			span.dataset.webHighlighter = 'true';

			range.surroundContents(span);
		} catch (e) {
			// If surroundContents fails (e.g. across element boundaries),
			// use a more robust approach
			try {
				const text = range.extractContents();
				const span = document.createElement('span');
				span.style.backgroundColor = 'yellow';
				span.style.color = 'inherit';
				span.dataset.webHighlighter = 'true';
				span.appendChild(text);
				range.insertNode(span);
			} catch (e2) {
				console.warn('Web Highlighter: Could not highlight range', e2);
			}
		}
	};
})();
