import { FunctionalComponent, h } from '@stencil/core';

/** Ejemplo de prop declarada */
interface ContactInfoProps {
	contact: any;
}
export const OrganismsVirtualSupportContactCard: FunctionalComponent<ContactInfoProps> = ({ contact }) => {
	return (
		<div class="virtual-support-container__info-container">
			{contact.map((contact) => (
				<div class="virtual-support-contact-card">
					<span class="virtual-support-contact-card__title">{contact?.title}</span>{' '}
					<div class="virtual-support-contact-card__container">
						<scib-atoms-button
							class="virtual-support-contact-card__btns"
							text={contact?.info}
							icon="email"
							size="s"
							variant="basic"
							type="button"
							level="primary"
							onClick={() => window.open('mailto:' + contact?.info)}
						></scib-atoms-button>
					</div>
				</div>
			))}
		</div>
	);
};
