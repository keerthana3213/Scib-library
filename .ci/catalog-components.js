// Script catalog component generator excel

const fg = require('fast-glob');
const XLSX = require('xlsx');
const path = require('upath');
const fs = require('fs');

//get filesNames and types
const files = fg
	.sync([path.resolve(__dirname, '../src/components/**/component/*.tsx')])
	.map((element) => element.split('/components/')[1]?.split('/'));

const workbook = XLSX.utils.book_new();

const sheetData = files.slice(0, 2);

//create excel file and headers
const sheetHeader = ['Component name', 'Type', 'Migrated story', 'Deprecated', 'Version', 'Revision required', 'More documentation required'];
const sheet = XLSX.utils.aoa_to_sheet([sheetHeader, ...sheetData]);

const defaultValue = 'true';

//Run throught data
for (let i = 1; i < sheetData.length + 1; i++) {
	const typeValue = sheet[`B${i + 1}`]?.v;

	//check deprecated
	const isDeprecated = ['ui', 'ecmv', 'cdk'].includes(typeValue.toLowerCase());
	const deprecatedValue = isDeprecated ? defaultValue : 'false';

	//check Migration
	const isMigrated = ['organisms', 'molecules'].includes(typeValue.toLowerCase());
	const migratedValue = isMigrated ? defaultValue : 'false';

	//check Version
	const versionValue = isDeprecated ? 'V1' : 'V2';

	//set default values at >Revision required and more documents required
	const revisionRequiredValue = defaultValue;
	const moreDocsRequiredValue = defaultValue;

	//add values to columns
	XLSX.utils.sheet_add_aoa(sheet, [[migratedValue]], { origin: `C${i + 1}` });
	XLSX.utils.sheet_add_aoa(sheet, [[deprecatedValue]], { origin: `D${i + 1}` });
	XLSX.utils.sheet_add_aoa(sheet, [[versionValue]], { origin: `E${i + 1}` });
	XLSX.utils.sheet_add_aoa(sheet, [[revisionRequiredValue]], { origin: `F${i + 1}` });
	XLSX.utils.sheet_add_aoa(sheet, [[moreDocsRequiredValue]], { origin: `G${i + 1}` });
}

//add excel file to workbook
XLSX.utils.book_append_sheet(workbook, sheet, 'Components');

const fileName = 'component-list.xlsx';

//Overwrite excel file
fs.writeFileSync(fileName, XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }));

console.log(`Excel file ${fileName} created`);
