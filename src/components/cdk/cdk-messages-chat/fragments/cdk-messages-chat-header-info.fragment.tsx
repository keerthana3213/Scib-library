import { FunctionalComponent, h } from '@stencil/core';
import { IUIAvatarImage } from '../../../ui/ui-avatar/models/ui-avatar.model';
import { ECDKChatTabIds, ICDKChatTab } from '../../cdk-messages/models/cdk-messages.model';
import { CDKMsgChatHeaderInfoSkeleton } from './cdk-messages-chat-header-info.skeleton';

export const CDKMsgChatHeaderInfo: FunctionalComponent<{
	refCard?: (el: HTMLElement) => void;
	onClick?: (event: MouseEvent) => void;
	onClickOpenModal?: () => void;
	eventOptionsClick?: (event: String) => void;
	loading?: boolean;
	authorName: string;
	subject: string;
	date: string;
	authorAvatarSrc?: string;
	authorAvatarAlt?: string;
	conversationAvatars?: IUIAvatarImage[];
	activeTab: string;
	tabs: ICDKChatTab[];
	isEmployee: boolean;
	closed?: boolean;
	closedLiteral?: string;
	scrollTop?: boolean;
	isMobile?: boolean;
	optionButtons?: any;
}> = props => {
	return (
		<div class="c-header-info">
			<div ref={props.refCard} class="c-header-info-card">
				{props.loading ? (
					<div role="status" aria-busy="true" aria-live="polite">
						<figure class="c-header-info-card-skeleton">
							<CDKMsgChatHeaderInfoSkeleton />
						</figure>
					</div>
				) : (
					<div>
						<div class="c-header-info-card-subject">
							<div class="c-header-info-card-subject__container">
								<scib-ui-avatar class="c-header-info-avatar" images={JSON.stringify(props.conversationAvatars)}></scib-ui-avatar>
								{/* {props.closed && <scib-ui-tag closed large text={props.closedLiteral} class="c-header-info-closed-tag"></scib-ui-tag>} */}
								<span class="c-header-info-title-text">{props.subject}</span>
							</div>
							{props.isMobile ? (
								<div class="c-header-tab-files c-header-tab-files">
									<scib-ui-button tertiary hide-txt medium onClick={props.onClickOpenModal} icon="icon-menu" red-icon></scib-ui-button>
								</div>
							) : (
								<div class="c-header-tab-files c-header-tab-files">
									{props.tabs.map(tab => (
										<button class={{ 'c-header-tab': true, '--active': tab.id === props.activeTab }} aria-label={tab.label} data-id={tab.id} onClick={props.onClick}>
											<i
												data-id={tab.id}
												class={{
													'u-icon': true,
													'icon-message': tab.id === ECDKChatTabIds.MSG,
													'icon-attach': tab.id === ECDKChatTabIds.FIL,
													'icon-users': tab.id === ECDKChatTabIds.USER,
												}}
											></i>
										</button>
									))}
								</div>
							)}
						</div>
						{/* <div class={{ 'c-header-info__author-mobile': true, 'c-header-info__author-mobile--hide': !props.scrollTop }}>
							<scib-ui-avatar
								class="c-header-info-card-avatar"
								images={[
									{
										src: props.authorAvatarSrc,
										alt: props.authorAvatarAlt,
									},
								]}
								is-employee={props.isEmployee}
							></scib-ui-avatar>
							<div class="c-header-info__author-container">
								<span class="c-header-info__author-name">{props.authorName}</span>
								<span class="c-header-info__author-date">{props.date}</span>
							</div>
						</div> */}
					</div>
				)}
			</div>
			{/* <div class="c-header-info-avatar-wrapper">
				<scib-ui-avatar class="c-header-info-avatar" images={JSON.stringify(props.conversationAvatars)}></scib-ui-avatar>
			</div> */}
		</div>
	);
};
