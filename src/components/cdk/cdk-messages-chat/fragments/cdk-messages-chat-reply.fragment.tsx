import { FunctionalComponent, h } from '@stencil/core';
import { ICDKListMembersTooltip, ICDKLiteralsTooltip } from '../../cdk-members-tooltip/models/cdk-members-tooltip.model';
import { ICDKMessagesFile } from '../../cdk-messages/models/cdk-messages.model';

export const CDKMsgChatReply: FunctionalComponent<{
	onEyeHover?: (e) => void;
	onEyeClick?: () => void;
	showTooltip?: string;
	parentHeight?: string;
	tooltipPositionX?: string;
	tooltipPositionY?: string;
	parentEl?: (el: HTMLElement) => void;
	readByMembers?: ICDKListMembersTooltip[];
	isLastMessage?: boolean;
	user: string;
	date: string;
	body: string;
	isSender: boolean;
	avatarSrc?: string;
	avatarAlt?: string;
	enableUnreadFlag: boolean;
	unreadFlagTxt?: string;
	unreadCount?: number;
	attachDocumentsTxt: string;
	files?: ICDKMessagesFile[];
	literals?: ICDKLiteralsTooltip;
	isEmployee?: boolean;
	isFromEmail?: boolean;
	emailTooltipText?: string;
	emailTooltipPos?: string;
}> = props => {
	return (
		<li>
			{props.enableUnreadFlag && (
				<span class="c-reply__unread-flag">
					{props.unreadCount || null} {props.unreadFlagTxt || '[[unreadFlagTxt]]'}
				</span>
			)}
			<div class="eye-and-article">
				{props.isLastMessage && (
					<div
						ref={props.parentEl}
						class="read-by-tooltip-wrapper"
						onMouseEnter={e => props.onEyeHover(e)}
						onMouseLeave={e => props.onEyeHover(e)}
						onClick={() => props.onEyeClick()}
					>
						<i class="u-icon c-icon icon-eye-show"></i>
						<scib-cdk-members-tooltip
							positionX={props.tooltipPositionX}
							positionY={props.tooltipPositionY}
							members={props.readByMembers}
							parentHeight={props.parentHeight}
							show={props.showTooltip}
							literals={props.literals}
							linkData=""
							readByTooltip
						></scib-cdk-members-tooltip>
					</div>
				)}
				<article class={{ 'c-reply': true, 'c-reply--is-sender': props.isSender, 'last-own-message': props.isLastMessage }}>
					<header class="c-reply__header">
						<scib-ui-avatar
							class="c-reply__avatar"
							images={[
								{
									src: props.avatarSrc,
									alt: props.avatarAlt,
								},
							]}
							is-employee={props.isEmployee}
						></scib-ui-avatar>
						<div class="c-reply__header-text">
							<p class="c-reply__user">{props.user}</p>
							<p class="c-reply__txt --uppercase">
								{props.isFromEmail && (
									<scib-ui-info-tooltip tooltipPos={props.emailTooltipPos} text={props.emailTooltipText} hover>
										<button class="ui-tooltip__btn icon-messages_deseable u-icon"></button>
									</scib-ui-info-tooltip>
								)}
								{props.date}
							</p>
						</div>
					</header>
					<div class="c-reply__body u-rich-text" innerHTML={props.body}></div>
					{props.files && <scib-cdk-messages-attached-bar titleTxt={props.attachDocumentsTxt} class="c-reply__files" files={props.files}></scib-cdk-messages-attached-bar>}
				</article>
			</div>
		</li>
	);
};
