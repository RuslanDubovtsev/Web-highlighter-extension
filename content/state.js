// Web Highlighter — Shared State
// Module holding global variables used across content scripts

let floatingButton = null;
let savedRange = null;
let savedText = '';

export { floatingButton, savedRange, savedText };

/**
 * Update the shared state references.
 * Use these instead of direct assignment from outside.
 */
export function setFloatingButton(btn) {
	floatingButton = btn;
}

export function setSavedRange(range) {
	savedRange = range;
}

export function setSavedText(text) {
	savedText = text;
}

export function clearSavedState() {
	savedRange = null;
	savedText = '';
}
