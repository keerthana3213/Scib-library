import { FunctionalComponent, h } from '@stencil/core';
import { assetUrl } from '../../../../utils/public_api';

interface MessageProps {
	message: any;
}

export const OrganismsVirtualSupportMessageText: FunctionalComponent<MessageProps> = ({ message }) => {
	return (
		<div>
			<div class="virtual-support-message">
				<img class="virtual-support-message__img" src={assetUrl('assets/images/digital_asssistance.svg')} alt="Digital Assistance icon" />
				<span class="virtual-support-message__text">{message}</span>
			</div>
		</div>
	);
};
