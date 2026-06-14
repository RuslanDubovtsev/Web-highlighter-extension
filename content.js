// Web Highlighter — Content Script

let floatingButton = null;
let savedRange = null;
let savedText = '';

// Create floating "Save" button
function createFloatingButton() {
	const btn = document.createElement('div');
	btn.id = 'web-highlighter-save-btn';
	btn.textContent = 'Сохранить';
	btn.style.cssText = `
		position: absolute;
		z-index: 2147483647;
		display: none;
		background: #fbbc04;
		color: #202124;
		font: 13px/1 Arial, sans-serif;
		padding: 6px 14px;
		border-radius: 4px;
		cursor: pointer;
		box-shadow: 0 2px 6px rgba(0,0,0,0.3);
		user-select: none;
		white-space: nowrap;
	`;
	document.body.appendChild(btn);

	btn.addEventListener('mouseenter', () => {
		btn.style.background = '#f9ab00';
	});
	btn.addEventListener('mouseleave', () => {
		btn.style.background = '#fbbc04';
	});

	btn.addEventListener('click', (e) => {
		e.stopPropagation();
		onSaveClick();
	});

	return btn;
}

// Position the floating button near the selection
function positionFloatingButton() {
	const selection = window.getSelection();
	if (!selection || selection.isCollapsed || !selection.rangeCount) {
		hideFloatingButton();
		return;
	}

	const range = selection.getRangeAt(0);
	const text = selection.toString().trim();
	if (!text) {
		hideFloatingButton();
		return;
	}

	const rect = range.getBoundingClientRect();

	// Determine if selection is inside an editable area like input/textarea
	let node = range.startContainer;
	if (node.nodeType === Node.TEXT_NODE) {
		node = node.parentElement;
	}
	// Don't show button for selections inside input/textarea
	const tagName = node?.tagName?.toLowerCase();
	if (tagName === 'input' || tagName === 'textarea') {
		hideFloatingButton();
		return;
	}

	savedRange = range;
	savedText = text;

	floatingButton.style.display = 'block';
	const scrollX = window.scrollX || window.pageXOffset;
	const scrollY = window.scrollY || window.pageYOffset;

	let top = rect.bottom + scrollY + 6;
	let left = rect.left + scrollX;

	// Make sure button doesn't go off-screen horizontally
	if (left + floatingButton.offsetWidth > window.innerWidth + scrollX - 10) {
		left = window.innerWidth + scrollX - floatingButton.offsetWidth - 10;
	}
	if (left < scrollX) {
		left = scrollX + 4;
	}

	floatingButton.style.top = top + 'px';
	floatingButton.style.left = left + 'px';
}

function showFloatingButton() {
	positionFloatingButton();
}

function hideFloatingButton() {
	if (floatingButton) {
		floatingButton.style.display = 'none';
	}
	savedRange = null;
	savedText = '';
}

// Save the highlighted text to chrome.storage.local
function onSaveClick() {
	if (!savedRange || !savedText) return;

	// Highlight the selected text with yellow background
	highlightRange(savedRange);

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

	hideFloatingButton();
	window.getSelection()?.removeAllRanges();
}

// Apply yellow highlight to a Range
function highlightRange(range) {
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
}

// ---- Mouseup / Selection tracking ----
document.addEventListener('mouseup', (e) => {
	// Small delay to let the browser finalize the selection
	setTimeout(() => {
		const selection = window.getSelection();
		if (selection && !selection.isCollapsed && selection.toString().trim()) {
			showFloatingButton();
		} else {
			hideFloatingButton();
		}
	}, 10);
});

// Hide button when scrolling
document.addEventListener('scroll', () => {
	if (floatingButton && floatingButton.style.display !== 'none') {
		hideFloatingButton();
	}
});

// Hide button on keydown Escape
document.addEventListener('keydown', (e) => {
	if (e.key === 'Escape') {
		hideFloatingButton();
	}
});

// Hide button when clicking outside the selection/floating button
document.addEventListener('mousedown', (e) => {
	if (floatingButton && floatingButton.style.display !== 'none') {
		if (!floatingButton.contains(e.target)) {
			hideFloatingButton();
		}
	}
});

// Initialize floating button when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => {
		floatingButton = createFloatingButton();
	});
} else {
	floatingButton = createFloatingButton();
}

console.log('Web Highlighter: Content script loaded.');
