const removeNewLineInCell = document.getElementById('removeNewLineInCell');
removeNewLineInCell.addEventListener('change', function () {
	const state = this.checked;
	chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
		chrome.scripting.executeScript({
			target: { tabId: tabs[0].id },
			func: state => setRemoveNewLineInCell(state),
			args: [state]
		}, () => { });
	});
	chrome.storage.local.set({ removeNewLineInCell: state }, () => { });
});

const removeWhiteSpace = document.getElementById('removeWhiteSpace');
removeWhiteSpace.addEventListener('change', function () {
	const state = this.checked;
	chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
		chrome.scripting.executeScript({
			target: { tabId: tabs[0].id },
			func: state => setRemoveWhiteSpace(state),
			args: [state]
		}, () => { });
	});
	chrome.storage.local.set({ removeWhiteSpace: state }, () => { });
});

chrome.storage.local.get({ removeNewLineInCell: false, removeWhiteSpace: false, insertButtons: 0 }, result => {
	removeNewLineInCell.checked = result.removeNewLineInCell;
	removeWhiteSpace.checked = result.removeWhiteSpace;

	document.getElementById("tableList").textContent = result.insertButtons;
});
