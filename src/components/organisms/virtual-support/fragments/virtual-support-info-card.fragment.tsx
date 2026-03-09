import { FunctionalComponent, h } from '@stencil/core';
import { CardInfoI } from '../models/virtual-support.model';

interface CardInfoProps {
	info: CardInfoI[];
	section: string;
}
export const OrganismsVirtualSupportInfoCard: FunctionalComponent<CardInfoProps> = ({ info, section: section }) => {
	return (
		<div class="virtual-support-container__info-container">
			{info.map((info) => (
				<div class="virtual-support-info-card">
					<span class="virtual-support-info-card__title">{info?.title}</span>
					<span class="virtual-support-info-card__info">{info?.info}</span>
					{section !== 'ERROR' ? (
						<span class="virtual-support-info-card__contact">
							<i class="icon" style={{ '--icon-content': `var(--theme-scib-icon-phone)` }}></i>
							<span class="virtual-support-info-card__contact__number" title={info?.contact}>
								{info.contact}
							</span>
						</span>
					) : null}
				</div>
			))}
		</div>
	);
};
