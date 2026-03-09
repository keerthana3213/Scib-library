import { ECDKMessagesUserActions, ICDKMessagesFile } from '../../cdk-messages/models/cdk-messages.model';
export interface ICDKMessagesConversation {
	author: {
		name: string;
		avatar: {
			src: string;
			alt: string;
		};
		isEmployee?: boolean;
	};
	date: string;
	sender: string;
	unread: string;
	message: string;
}

export interface Subheader {
	idElem: string;
	link: {
		href: string;
		label: string;
	};
	items: {
		title: string;
		value: string;
		state?: string;
	}[];
}

export interface errorSubheaderInterface {
	status: boolean;
	text: string;
}

export interface EventActionFile {
	type: ECDKMessagesUserActions;
	payload: ICDKMessagesFile;
}
