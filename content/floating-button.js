// Web Highlighter — Floating Button Management
// Creates, positions, shows / hides the floating "Save" button

window.WebHighlighter = window.WebHighlighter || {};
(() => {
	const WH = window.WebHighlighter;

	/**
	 * Create the floating "Save" button and append it to the page.
	 * Registers hover and click event listeners.
	 */
	WH.createFloatingButton = function createFloatingButton() {
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
			WH.onSaveClick();
		});

		WH.setFloatingButton(btn);
		return btn;
	};

	/**
	 * Position the floating button near the current text selection.
	 */
	WH.positionFloatingButton = function positionFloatingButton() {
		const selection = window.getSelection();
		if (!selection || selection.isCollapsed || !selection.rangeCount) {
			WH.hideFloatingButton();
			return;
		}

		const range = selection.getRangeAt(0);
		const text = selection.toString().trim();
		if (!text) {
			WH.hideFloatingButton();
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
			WH.hideFloatingButton();
			return;
		}

		WH.setSavedRange(range);
		WH.setSavedText(text);

		const btn = WH.getFloatingButton();
		btn.style.display = 'block';
		const scrollX = window.scrollX || window.pageXOffset;
		const scrollY = window.scrollY || window.pageYOffset;

		let top = rect.bottom + scrollY + 6;
		let left = rect.left + scrollX;

		// Make sure button doesn't go off-screen horizontally
		if (left + btn.offsetWidth > window.innerWidth + scrollX - 10) {
			left = window.innerWidth + scrollX - btn.offsetWidth - 10;
		}
		if (left < scrollX) {
			left = scrollX + 4;
		}

		btn.style.top = top + 'px';
		btn.style.left = left + 'px';
	};

	WH.showFloatingButton = function showFloatingButton() {
		WH.positionFloatingButton();
	};

	WH.hideFloatingButton = function hideFloatingButton() {
		const btn = WH.getFloatingButton();
		if (btn) {
			btn.style.display = 'none';
		}
		WH.clearSavedState();
	};
})();


