import { FunctionalComponent, h } from '@stencil/core';
import { ICDKMessagesFile } from '../../cdk-messages/models/cdk-messages.model';
import { CDKMsgChatMesageSkeleton } from './cdk-messages-chat-message.skeleton';

export const CDKMsgChatMessage: FunctionalComponent<{
	refCard?: (el: HTMLElement) => void;
	onClick?: (event: MouseEvent) => void;
	body?: string;
	files?: ICDKMessagesFile[];
	loading?: boolean;
	hasSubheader?: boolean;
	attachDocumentsTxt: string;
}> = props => {
	return props.loading ? (
		<div role="status" aria-busy="true" aria-live="polite">
			<figure class="c-header-info-card-skeleton c-header-info-card-skeleton--header">
				<CDKMsgChatMesageSkeleton />
			</figure>
		</div>
	) : (
		<div ref={props.refCard} class={{ 'c-message u-rich-text': true, 'c-message__has-subheader': props.hasSubheader }}>
			<div innerHTML={props.body}></div>
			{props.files && <scib-cdk-messages-attached-bar titleTxt={props.attachDocumentsTxt} class="c-reply__files" files={props.files}></scib-cdk-messages-attached-bar>}
			<div class="c-messages-decoration" onClick={props.onClick}></div>
		</div>
	);
};
