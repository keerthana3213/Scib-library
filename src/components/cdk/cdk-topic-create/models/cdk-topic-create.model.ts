export interface ICDKTopicCreateLiterals {
	mainTitle: string;
	labelInput: string;
	placeholderInput: string;
	textAreaLabel: string;
	textAreaId: string;
	textAreaName: string;
	placeholderTextarea: string;
	notice: string;
	btnCancel: string;
	btnSave: string;
	membersLabel: string;
	editTitle: string;
	noMembers: string;
	vdrConfig: string;
}

export interface ICDKTopicCreateMembers {
	id: string;
	email?: string;
	name: string;
	avatar: {
		src: string;
		alt: string;
	};
	isEmployee?: boolean;
}

export interface ICDKTopicEdit {
	name: string;
	description: string;
}
