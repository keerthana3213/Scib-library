import { FunctionalComponent, h } from '@stencil/core';

export const AtomsNotificationToasterMessageCard: FunctionalComponent<{
	title: string;
	description: string;
	user: string;
	messageType: string;
	avatar: { text: string; src: string; alt: string };
	close(): void;
	redirect(): void;
}> = (props) => {
	return (
		<div onClick={() => props.redirect()} class="flex">
			<div class="card__avatar">
				<scib-atoms-avatar
					type="md"
					text={props.avatar.src ? '' : props.avatar.text}
					variant="red"
					img={props.avatar.src}
				></scib-atoms-avatar>
			</div>
			<div class="card__container">
				<div class="card__header">
					{!!props.messageType ? <scib-atoms-badge variant="none" type="md" text={props.messageType}></scib-atoms-badge> : <div></div>}
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
				<div class="card__title">{props.title}</div>
				<div class="card__description-wrapper">
					<p class="card__description">{props.user}:</p>
					<p class="card__description">{props.description}</p>
				</div>
			</div>
		</div>
	);
};
