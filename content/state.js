// Web Highlighter — Shared State
// Module holding global variables used across content scripts

window.WebHighlighter = window.WebHighlighter || {};
(() => {
	const WH = window.WebHighlighter;
	let floatingButton = null;
	let savedRange = null;
	let savedText = '';

	WH.setFloatingButton = function setFloatingButton(btn) {
		floatingButton = btn;
	};

	WH.getFloatingButton = function getFloatingButton() {
		return floatingButton;
	};

	WH.setSavedRange = function setSavedRange(range) {
		savedRange = range;
	};

	WH.getSavedRange = function getSavedRange() {
		return savedRange;
	};

	WH.setSavedText = function setSavedText(text) {
		savedText = text;
	};

	WH.getSavedText = function getSavedText() {
		return savedText;
	};

	WH.clearSavedState = function clearSavedState() {
		savedRange = null;
		savedText = '';
	};
})();
