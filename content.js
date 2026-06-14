// Web Highlighter — Entry Point
// Initializes the content script: loads sub-modules and registers event listeners

// ---- Mouseup / Selection tracking ----
document.addEventListener('mouseup', (e) => {
	// Small delay to let the browser finalize the selection
	setTimeout(() => {
		const selection = window.getSelection();
		if (selection && !selection.isCollapsed && selection.toString().trim()) {
			WebHighlighter.showFloatingButton();
		} else {
			WebHighlighter.hideFloatingButton();
		}
	}, 10);
});

// Hide button when scrolling
document.addEventListener('scroll', () => {
	const btn = WebHighlighter.getFloatingButton();
	if (btn && btn.style.display !== 'none') {
		WebHighlighter.hideFloatingButton();
	}
});

// Hide button on keydown Escape
document.addEventListener('keydown', (e) => {
	if (e.key === 'Escape') {
		WebHighlighter.hideFloatingButton();
	}
});

// Hide button when clicking outside the selection/floating button
document.addEventListener('mousedown', (e) => {
	const btn = WebHighlighter.getFloatingButton();
	if (btn && btn.style.display !== 'none') {
		if (!btn.contains(e.target)) {
			WebHighlighter.hideFloatingButton();
		}
	}
});

// Initialize floating button when DOM is ready
function init() {
	WebHighlighter.createFloatingButton();
	console.log('Web Highlighter: Content script loaded.');
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', init);
} else {
	init();
}
