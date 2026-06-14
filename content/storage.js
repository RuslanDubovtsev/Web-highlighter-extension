// Web Highlighter — Storage
// Handles saving highlighted text to chrome.storage.local

window.WebHighlighter = window.WebHighlighter || {};
(() => {
	const WH = window.WebHighlighter;

	/**
	 * Save the highlighted text to chrome.storage.local.
	 * Called when the floating "Save" button is clicked.
	 */
	WH.onSaveClick = function onSaveClick() {
		const savedRange = WH.getSavedRange();
		const savedText = WH.getSavedText();

		if (!savedRange || !savedText) return;

		// Highlight the selected text with yellow background
		WH.highlightRange(savedRange);

		const highlightData = {
			id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
			text: savedText,
			url: window.location.href,
			title: document.title,
			timestamp: Date.now()
		};

		chrome.storage.local.get({ highlights: [] }, (result) => {
			const highlights = result.highlights;
			highlights.unshift(highlightData);
			chrome.storage.local.set({ highlights }, () => {
				console.log('Web Highlighter: Text saved.');
			});
		});

		WH.hideFloatingButton();
		window.getSelection()?.removeAllRanges();
	};
})();


