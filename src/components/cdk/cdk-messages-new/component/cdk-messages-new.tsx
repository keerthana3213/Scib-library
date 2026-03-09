import { Component, Host, h, Prop, EventEmitter, Watch, State, Event } from '@stencil/core';
import {
	ECDKMessagesUserActions,
	ICDKMessagesAttachFilePayload,
	ICDKMessagesDefault,
	ICDKMessagesFile,
	ICDKMessagesLiterals,
	ICDKMessagesNewMsg,
	ICDKMessagesToUserList
} from '../../cdk-messages/models/cdk-messages.model';
import { CDKMsgNewHeader } from '../fragments/cdk-messages-new-header.fragment';
import { EventActionFile } from '../models/cdk-messages-new.model';

/**
 * Component description
 *
 * @slot content - Slot por defecto
 */
@Component({
	tag: 'scib-cdk-messages-new',
	styleUrl: 'cdk-messages-new.scss',
	shadow: false,
	scoped: true
})
export class CDKMessagesNew {
	$headerCard!: HTMLElement;
	$contentEditableRef!: HTMLElement;
	$formRef!: HTMLFormElement;

	@Prop() userList: ICDKMessagesToUserList[] = [];
	@Prop() literals: ICDKMessagesLiterals;
	@Prop() attachedFiles: ICDKMessagesFile[];

	@Prop() loadingSend: boolean;
	@Watch('loadingSend') updateloadingSend(newVal: boolean) {
		this._loadingSend = newVal;
	}
	@State() _loadingSend: boolean;

	@Prop() resetForm: boolean;
	@Watch('resetForm') doFormReset(newVal: boolean) {
		this._resetForm = newVal;
		if (newVal) {
			this.formResetAction();
		}
	}
	@State() _resetForm: boolean;

	@Prop({ mutable: true, reflect: true }) activeDraftId: string;
	@Prop() defaultData: ICDKMessagesDefault;
	@Prop() emptyHeaderFields: boolean[] = [true, true];
	@Watch('emptyHeaderFields') updateEmptyHeaderFields(newVal: boolean[]) {
		if (newVal) {
			this._emptyHeaderFields = newVal;
		}
	}
	@State() _emptyHeaderFields: boolean[];

	/** Change status of loading on input */
	@Prop() loadingUsers: boolean = false;
	@Watch('loadingUsers') changeLoading(newVal: boolean) {
		this._loadingUsers = newVal;
	}
	@State() _loadingUsers: boolean;

	@Prop() bodyMessage: string = '';
	@Watch('bodyMessage') addDefaultiBodyMessage(newVal: string) {
		this._bodyMessage = newVal;
	}
	@State() _bodyMessage: string;

	@Event() eventSubmit: EventEmitter<ICDKMessagesNewMsg>;

	@Event() eventDiscardNew: EventEmitter;

	@Event() eventResetUserList: EventEmitter;

	@Event() eventSearchByUsers: EventEmitter<string>;

	@Event() eventAttachNew: EventEmitter<ICDKMessagesAttachFilePayload>;

	@Event() eventActionFile: EventEmitter<EventActionFile>;

	componentWillLoad() {
		this.updateEmptyHeaderFields(this.emptyHeaderFields);
		this.changeLoading(this.loadingUsers);
		this.addDefaultiBodyMessage(this.bodyMessage);
		this.updateloadingSend(this.loadingSend);
	}

	formResetAction() {
		if (this.$formRef) {
			this.$formRef.reset();
			const switches = (this.$formRef.querySelectorAll('scib-ui-switch') as unknown as any[]) || [];
			switches.forEach((el) => (el.checked = false));
		}
	}

	handleDiscard() {
		this.eventDiscardNew.emit();
		this.formResetAction();
	}

	handleSubmit(e: Event) {
		e.preventDefault();
		const formData: FormData = new FormData(this.$formRef);
		// this.$formRef.reset();
		const userInfo = (('[' + formData.get('to')) as string) + ']';
		const userData = JSON.parse(userInfo);
		const userDataId = userData.map((item) => item.id).join(',');
		this.eventSubmit.emit({
			to: userDataId,
			userData: userData,
			subject: formData.get('subject') as string,
			body: formData.get('rich-editor-body') as string,
			disableReplies: formData.get('disable-replies') === 'on',
			markAsImportant: formData.get('mark-as-important') === 'on'
		});
	}

	handleAttachFile(file: File) {
		this.eventAttachNew.emit({
			conversationId: 'newConversation',
			file: file
		});
	}

	handleResetUserList() {
		this.eventResetUserList.emit();
	}

	handleFieldEditEvent(ce: CustomEvent, index: number) {
		const newEmptyHeaderFields = [...this._emptyHeaderFields];
		if (index < 0 || index >= newEmptyHeaderFields.length) {
			throw new RangeError('Invalid index for FieldEditEvent');
		}

		if (ce.detail == undefined || ce.detail.length == 0) {
			newEmptyHeaderFields[index] = true;
		} else {
			if (ce.detail.hasOwnProperty('value') && (ce.detail.value == undefined || ce.detail.value.length == 0)) {
				newEmptyHeaderFields[index] = true;
			} else {
				newEmptyHeaderFields[index] = false;
			}
		}
		this._emptyHeaderFields = newEmptyHeaderFields;
	}

	render() {
		return (
			<Host>
				<slot name="menu-header" />
				<form
					autocomplete="off"
					class="c-messages-new-form"
					ref={(el) => (this.$formRef = el as HTMLFormElement)}
					onSubmit={(e) => this.handleSubmit(e)}
				>
					<header class="c-messages-new-header">
						<CDKMsgNewHeader
							contactsLabelTxt={this.literals?.contactsLabelTxt}
							disableRepliesLabelTxt={this.literals?.disableRepliesLabelTxt}
							markImportantRepliesLabelTxt={this.literals?.markImportantRepliesLabelTxt}
							subjectLabelTxt={this.literals?.subjectLabelTxt}
							toLabelTxT={this.literals?.toLabelTxT}
							newMessageTxt={this.literals?.newMessageTxt}
							onSearchByDestination={(ce: CustomEvent) => {
								this.eventSearchByUsers.emit(ce.detail);
							}}
							onToFieldEdit={(ce: CustomEvent) => {
								this.handleFieldEditEvent(ce, 0);
								this.handleResetUserList();
							}}
							onSubjectFieldEdit={(ce: CustomEvent) => {
								this.handleFieldEditEvent(ce, 1);
							}}
							refCard={(el: HTMLElement) => (this.$headerCard = el as HTMLElement)}
							usersList={this.userList}
							defaultData={this.defaultData}
							isDefaultData={Object.keys(this.defaultData).length !== 0}
							loading={this._loadingUsers}
						/>
					</header>
					<div class="c-messages-new-body">
						<scib-cdk-messages-sendbar
							// maxHeight={460}
							is-absolute
							total-height
							literals={this.literals}
							loading={this._loadingSend}
							richEditorPlaceholderTxt={this.literals?.newMessagePlaceholderTxt}
							discardButtonTxt={this.literals?.discardButtonTxt}
							sendButtonTxt={this.literals?.sendButtonTxt}
							activeConversationId={this.activeDraftId}
							attachedFiles={this.attachedFiles}
							asSubmitButton="true"
							reset={this._resetForm}
							emptyHeaderFields={this._emptyHeaderFields}
							bodyMessage={this._bodyMessage}
							onEventDiscard={() => this.handleDiscard()}
							onEventAttach={(ev: CustomEvent) => this.handleAttachFile(ev.detail)}
							onEventCancelFile={(ev: CustomEvent) =>
								this.eventActionFile.emit({
									type: ECDKMessagesUserActions.cancelFile,
									payload: ev.detail
								})
							}
							onEventRetryFile={(ev: CustomEvent) =>
								this.eventActionFile.emit({
									type: ECDKMessagesUserActions.retryFile,
									payload: ev.detail
								})
							}
						></scib-cdk-messages-sendbar>
					</div>
				</form>
			</Host>
		);
	}
}
