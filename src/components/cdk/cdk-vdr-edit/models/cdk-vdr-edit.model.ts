export interface ICDKVdrEditLiterals {
	/*Modal title*/
	mainTitle: string;

	/*Input label*/
	labelInput: string;

	/*Input placeholder*/
	placeholderInput: string;

	/*Multiselect label*/
	labelMultiSelect: string;

	/*Multiselect placeholder*/
	placeholderMultiSelect: string;

	/* Textarea label */
	textAreaLabel: string;

	/* Textarea Id */
	textAreaId: string;

	/* Name textarea */
	textAreaName: string;

	/* Placeholder textarea*/
	placeholderTextarea: string;

	/*Owners label*/
	ownersList: string;

	/**Notice message footer*/
	notice: string;

	/*Multiselect label members*/
	labelMultiSelectMembers: string;

	/* Members Id */
	membersId: string;

	/*Multiselect placeholder members*/
	placeholderMultiSelectMembers: string;

	/*Cancel btn*/
	btnCancel: string;

	/*Save btn*/
	btnSave: string;

	/** Label list */
	ownersLabel: string;
	membersLabel: string;
	newMembersLabel: string;
	labelCheckboxNewItems: string;

	/** Add new user literal */
	addUserLabel: string;
}

export interface IMemberListProp {
	id: string;
	name: string;
	email: string;
	avatar: {
		src: string;
		alt: string;
	};
	isEmployee?: string;
	ldapUid?: string;
}

export interface IMemberList {
	value: string;
	name: string;
	secondary: string | null;
	avatar: {
		src: string;
		alt: string;
	};
	isSelected: boolean;
	isEmployee: boolean | null;
	ldapUid: boolean | null;
}

export interface IMemberRemove {
	avatar: {
		src: string;
		alt: string;
	};
	isEmployee: boolean;
	isSelected: boolean;
	name: string;
	value: string;
}

export interface INewMemberRemove {
	apply: boolean;
	avatar: {
		src: string;
		alt: string;
	};
	isEmployee: boolean;
	isSelected: boolean;
	name: string;
	value: string;
	ldapUid: string;
	secondary: string;
}

export interface ISelectListChange {
	apply: boolean;
	avatar: {
		src: string;
		alt: string;
	};
	isEmployee: boolean;
	isSelected: boolean;
	ldapUid: string;
	name: string;
	secondary: string;
	value: string;
}

export enum ETypeOfValueCheckBox {
	indeterminate = 'indeterminate',
	checked = 'checked',
	unchecked = 'unchecked',
}

export interface IEventDetailCheckboxClicked {
	id: string;
	value: ETypeOfValueCheckBox;
}

export type TOptionDefaultCheckbox = 'unchecked' | 'checked' | 'disabled';
