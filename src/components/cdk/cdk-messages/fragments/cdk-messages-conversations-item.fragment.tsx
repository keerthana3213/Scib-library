import { FunctionalComponent, h } from '@stencil/core';
import { ICDKMessagesConversation } from '../models/cdk-messages.model';

export const CDKMessagesConversationsItem: FunctionalComponent<{
	conversation: ICDKMessagesConversation;
	active: boolean;
	unread?: boolean;
	notifications?: number;
	index?: number;
	closedLiteral?: string;
	onSetActive?: (event: MouseEvent) => void;
	important?: boolean;
	onToggleUnread?: (event: MouseEvent) => void;
}> = props => {
	const stripHTMLTags = (HTMLasString: string) => {
		const element = document.createElement('div');
		element.innerHTML = HTMLasString;
		return element.innerText || '';
	};

	return (
		<div class="c-conversations-item-container">
			<button onClick={props.onToggleUnread} class={`c-conversations-item-unread-button u-icon ${props.unread ? 'icon-open-eye' : 'icon-hide-eye'}`}>
				{/* Toggle unread */}
			</button>
			<button
				onClick={props.onSetActive}
				class={{
					'c-conversations-item': true,
					'--active': props.active,
					'--has-unread-elements': props.unread,
				}}
				style={{
					'animation-delay': (props.index + 1) * 35 + 'ms',
				}}
			>
				<scib-ui-avatar showBubble={props.unread} notifications={props.notifications} images={props.conversation?.avatar} class="c-conversations-item-img"></scib-ui-avatar>
				<div class="c-conversations-item-wrapper">
					<div class="c-conversations-item-header">
						{/* {props.conversation.closed && <scib-ui-tag closed small text={props.closedLiteral} class="c-conversations-item-closed-tag"></scib-ui-tag>} */}
						{props.important && (
							<span class="c-conversations-item-important" aria-label="important">
								!
							</span>
						)}
						<span class="c-conversations-item-subject">{props.conversation.subject}</span>
						<span class="c-conversations-item-date">{props.conversation.date}</span>
					</div>
					<p class="c-conversations-item-subtitle">
						<span>{props.conversation.subtitle}</span>
					</p>
					<div class="c-conversations-item-preview">{stripHTMLTags(props.conversation.preview)}</div>
				</div>
			</button>
		</div>
	);
};
