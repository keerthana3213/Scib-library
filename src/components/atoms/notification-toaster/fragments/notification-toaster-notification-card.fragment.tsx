import { FunctionalComponent, h } from '@stencil/core';

export const AtomsNotificationToasterNotificationCard: FunctionalComponent<{
	/** Ejemplo de prop declarada */
	name: string;
	description: string;
	app: string;
	close(): void;
	redirect(): void;
}> = (props) => {
	return (
		<div onClick={() => props.redirect()} class="card__container">
			<div class="card__header">
				{!!props.app ? <scib-atoms-badge variant="none" type="md" text={props.app}></scib-atoms-badge> : <div></div>}
				<div class="close-icon-container">
					<span
						onClick={(e) => {
							props.close();
							e.stopPropagation();
						}}
						style={{ '--icon-content': `var(--theme-scib-icon-close-thin)` }}
					>
						<i class="icon" />
					</span>
				</div>
			</div>
			<div class="card__title">{props.name}</div>
			<div class="card__description-wrapper">
				<p class="card__description">{props.description}</p>
			</div>
		</div>
	);
};
