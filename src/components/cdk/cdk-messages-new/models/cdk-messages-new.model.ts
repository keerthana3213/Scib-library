import { ECDKMessagesUserActions, ICDKMessagesFile } from '../../cdk-messages/models/cdk-messages.model';
export interface EventActionFile {
	type: ECDKMessagesUserActions;
	payload: ICDKMessagesFile;
}
