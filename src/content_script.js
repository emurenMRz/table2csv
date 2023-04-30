let removeNewLineInCell = false;
let removeWhiteSpace = false;

window.setRemoveNewLineInCell = state => removeNewLineInCell = state;
window.setRemoveWhiteSpace = state => removeWhiteSpace = state;

chrome.storage.local.get({ removeNewLineInCell: false, removeWhiteSpace: false, insertButtons: 0 }, result => {
	setRemoveNewLineInCell(result.removeNewLineInCell);
	setRemoveWhiteSpace(result.removeWhiteSpace);
});

///////////////////////////////////////////////////////////////////////////////

const normalizeCell = c => {
	let content = c.textContent;
	if (removeNewLineInCell) content = content.replace(/[\r\n]/g, "");
	if (removeWhiteSpace) content = content.replace(/ +/g, "");
	return content.indexOf(",") === -1 ? content : `"${content}"`;
};
const cellsToRow = row => Array.from(row.cells).map(normalizeCell).join(",");
const tableToCSV = table => Array.from(table.rows).map(cellsToRow).join("\n");

const tables = document.getElementsByTagName("table");
let insertButtons = 0;

for (const table of tables) {
	if (table.rows.length <= 1) continue;

	const elm = document.createElement("button");
	elm.type = "button";
	elm.className = "table2csv-extension-button";
	elm.textContent = "Download CSV";
	elm.addEventListener("click", () => downloadCSV(tableToCSV(table)));
	table.before(elm);
	++insertButtons;
}

chrome.storage.local.set({ insertButtons }, () => { });

function downloadCSV(csv) {
	const blob = new Blob([csv], { type: "text/csv" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.download = "data.csv";
	a.href = url;
	a.click();
	URL.revokeObjectURL(url);
}
