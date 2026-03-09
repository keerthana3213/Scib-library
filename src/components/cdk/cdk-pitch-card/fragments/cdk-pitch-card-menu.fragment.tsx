import { ICDKPitchCardActions, ICDKPitchCardData } from '../models/cdk-pitch-card.model';
import { FunctionalComponent, h } from '@stencil/core';

export const CDKPitchCardMenu: FunctionalComponent<{
	data: ICDKPitchCardActions[];
	cardData: ICDKPitchCardData;
	eventClickOptions: (event: any, id: string) => void;
}> = props => {
	return (
		<div class="c-menu-box c-menu-box__container">
			{/* Recorremos el array con el metodo map() */}
			{props.data.map(item => (
				<div class="c-menu-box__item">
					{/* Esto pinta los botones y el texto que acompaña */}
					<scib-ui-button class="c-menu-box__button" icon={item.icon} iconLeft small link onEventClick={() => props.eventClickOptions(item.eventId, props.cardData.id)}>
						{item.text}
					</scib-ui-button>
				</div>
			))}
		</div>
	);
};
