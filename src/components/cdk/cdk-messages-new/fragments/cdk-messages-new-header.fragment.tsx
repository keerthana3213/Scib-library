import { FunctionalComponent, h } from '@stencil/core';
import { IUIInputOption } from '../../../ui/ui-input/models/ui-input.model';
import { ICDKMessagesDefault, ICDKMessagesToUserList } from '../../cdk-messages/models/cdk-messages.model';

export const CDKMsgNewHeader: FunctionalComponent<{
	refCard?: (el: HTMLElement) => void;
	onSearchByDestination: (event: CustomEvent<any>) => void;
	onToFieldEdit: (event: CustomEvent<any>) => void;
	onSubjectFieldEdit: (event: CustomEvent<any>) => void;
	usersList: ICDKMessagesToUserList[];
	defaultData: ICDKMessagesDefault;
	isDefaultData: boolean;
	// Literals
	contactsLabelTxt: string;
	newMessageTxt: string;
	toLabelTxT: string;
	subjectLabelTxt: string;
	disableRepliesLabelTxt: string;
	markImportantRepliesLabelTxt: string;
	loading: boolean;
}> = props => {
	if (Object.keys(props.defaultData).length !== 0) {
		props.usersList = [props.defaultData.toUser];
	}

	const mapOptionsToInput: IUIInputOption[] = (props.usersList || []).map(user => ({
		value: JSON.stringify(user),
		name: user.name,
		secondary: user.email ? user.email : null,
		avatar: user.avatar,
		isSelected: false,
		isEmployee: user.isEmployee,
	}));

	return (
		<div class="c-header">
			<div ref={props.refCard} class="c-header-card">
				<scib-ui-input
					as-inline
					capitalize-label
					input-text-large
					class="c-header-form-field"
					label={props.subjectLabelTxt || '[[subjectLabelTxt]]'}
					name="subject"
					value={props.defaultData.subject}
					disable-edit={props.isDefaultData && props.defaultData.disableEdit}
					required
					debounceTime={450}
					no-min-height
					onEventFormChange={props.onSubjectFieldEdit}
				></scib-ui-input>
				<scib-ui-input
					autocomplete
					automaticOpen={false}
					loading={props.loading}
					as-inline
					capitalize-label
					optionsTitleTxt={props.contactsLabelTxt || '[[contactsLabelTxt]]'}
					class="c-header-form-field"
					label={props.toLabelTxT || '[[toLabelTxT]]'}
					name="to"
					required
					no-min-height
					debounceTime={300}
					options={mapOptionsToInput}
					default-data={props.isDefaultData}
					disable-edit={props.isDefaultData && props.defaultData.disableEdit}
					onEventChange={props.onSearchByDestination}
					onListEventChange={props.onToFieldEdit}
				></scib-ui-input>
				{!props.isDefaultData && (
					<div class="c-header-form-switches">
						<scib-ui-switch label-black name="disable-replies" label={props.disableRepliesLabelTxt}></scib-ui-switch>
						<scib-ui-switch label-black name="mark-as-important" label={props.markImportantRepliesLabelTxt}></scib-ui-switch>
					</div>
				)}
			</div>
		</div>
	);
};
