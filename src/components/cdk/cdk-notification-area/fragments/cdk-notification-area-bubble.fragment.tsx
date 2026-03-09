import { _ICDKNotificationAreaDroppablePositions, ICDKNotificationAreaProfile } from '../models/cdk-notification-area.model';
import { FunctionalComponent, h } from '@stencil/core';

export const CDKNotificationAreaBubble: FunctionalComponent<{
	labelTxt: string;
	position: _ICDKNotificationAreaDroppablePositions;
	notificationsCount: number;
	isCollapsed: boolean;
	profile: ICDKNotificationAreaProfile;
	onBubbleClick: (event: MouseEvent) => void;
}> = props => {
	return (
		<div
			class={{ 'c-bubble': true, '--collapse': props.isCollapsed }}
			style={{
				[props.position.x]: props.isCollapsed && '0',
				[props.position.y]: props.isCollapsed && '0',
				'transform-origin': `${props.position.x} ${props.position.y}`,
			}}
		>
			<span aria-label="hidden" class="c-bubble-draghandler u-icon icon-drag-hander"></span>
			<button
				onClick={props.onBubbleClick}
				class="c-bubble-avatar"
				style={{
					'background-image': props.profile?.avatarPhotoSrc
						? `url(${props.profile.avatarPhotoSrc}), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' viewBox='0 0 350 350' class='sc-scib-ui-avatar' style=' height: 100%25; width: 100%25; fill: %23b5b5b5;%0A'%3E%3Cg class='sc-scib-ui-avatar'%3E%3Cpath d='M175,171.173c38.914,0,70.463-38.318,70.463-85.586C245.463,38.318,235.105,0,175,0s-70.465,38.318-70.465,85.587 C104.535,132.855,136.084,171.173,175,171.173z' class='sc-scib-ui-avatar'%3E%3C/path%3E%3Cpath d='M41.909,301.853C41.897,298.971,41.885,301.041,41.909,301.853L41.909,301.853z' class='sc-scib-ui-avatar'%3E%3C/path%3E%3Cpath d='M308.085,304.104C308.123,303.315,308.098,298.63,308.085,304.104L308.085,304.104z' class='sc-scib-ui-avatar'%3E%3C/path%3E%3Cpath d='M307.935,298.397c-1.305-82.342-12.059-105.805-94.352-120.657c0,0-11.584,14.761-38.584,14.761 s-38.586-14.761-38.586-14.761c-81.395,14.69-92.803,37.805-94.303,117.982c-0.123,6.547-0.18,6.891-0.202,6.131 c0.005,1.424,0.011,4.058,0.011,8.651c0,0,19.592,39.496,133.08,39.496c113.486,0,133.08-39.496,133.08-39.496 c0-2.951,0.002-5.003,0.005-6.399C308.062,304.575,308.018,303.664,307.935,298.397z' class='sc-scib-ui-avatar'%3E%3C/path%3E%3C/g%3E%3C/svg%3E")`
						: null,
				}}
			>
				{!props.profile?.avatarPhotoSrc && (
					<span>
						{props.profile?.name?.slice(0, 1)}
						{props.profile?.surname?.slice(0, 1)}
					</span>
				)}
			</button>
			<div class="c-bubble-text-wrapper" onClick={props.onBubbleClick}>
				<span class="c-bubble-nots-label">{props.labelTxt}</span>
				<span class="c-bubble-nots">{props.notificationsCount}</span>
			</div>
		</div>
	);
};
