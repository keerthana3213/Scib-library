import { ICDKNotificationAreaItem, ECDKNotificationAreaItemType } from '../models/cdk-notification-area.model';
import { FunctionalComponent, h } from '@stencil/core';

export const CDKNotificationAreaNotification: FunctionalComponent<{
	notification: ICDKNotificationAreaItem;
	index: number;
	key: any;
	moreText: string;
	onNotificationClick: (event: MouseEvent) => void;
}> = ({ notification, key, moreText, onNotificationClick }) => {
	const icons: { [key: string]: string } = {
		[ECDKNotificationAreaItemType.message]: 'icon-messages_deseable',
		[ECDKNotificationAreaItemType.alert]: 'icon-alerts',
		[ECDKNotificationAreaItemType.app]: 'icon-apps',
		[ECDKNotificationAreaItemType.files]: 'icon-folder',
	};

	return (
		<div role="button" key={key} class="c-areahub-not" onClick={onNotificationClick}>
			<div class="c-areahub-not-content">
				<header class="c-areahub-not-header">
					<span class={{ 'c-areahub-not-icon u-icon': true, [icons[notification.type]]: true }}></span>
					<p class="c-areahub-not-type">{notification.typeTxt}</p>
					<p class="c-areahub-not-date">{notification.date}</p>
				</header>
				<p class="c-areahub-not-subject">{notification.subject}</p>
				<p class="c-areahub-not-preview">{notification.preview}</p>
				{notification.notificationNumber > 1 ? <p class="c-areahub-not-count">{notification.notificationNumber - 1 + ' ' + moreText}</p> : null}
			</div>
		</div>
	);
};
