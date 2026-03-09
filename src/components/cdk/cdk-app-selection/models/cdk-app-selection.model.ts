/* Interfaz de la lista de apps */
export interface AppOption {
	id: string;
	name: string;
	select?: boolean;
	[key: string]: any;
}
/* Conversion de la lista apps a la interfaz para ui-input */
export class AppInputObject {
	name: string = '';
	value: string = '';
	isSelected: boolean = false;

	constructor(entryData: AppOption) {
		this.name = entryData.name;
		this.value = entryData.id;
		this.isSelected = entryData.select;
	}
}
/* Devuelve lista apps con la interfaz para ui-input */
export class CDKAppSelectionArray {
	constructor(entryData: Array<AppOption>) {
		let apps = [];
		entryData.forEach(item => {
			apps.push(new AppInputObject(item));
		});
		return apps;
	}
}
