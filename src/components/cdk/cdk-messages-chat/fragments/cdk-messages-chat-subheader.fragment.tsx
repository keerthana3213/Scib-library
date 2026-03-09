import { FunctionalComponent, h } from '@stencil/core';

export const CDKMessagesChatSubheader: FunctionalComponent<{
	/** Ejemplo de prop declarada */
	link: { label: string; href: string };
	items: { title: string; value: string; state?: string }[];
	isMobile?: boolean;
	loading?: boolean;
	errorSubheader?: { status: boolean; text: string };
	eventClickOpenDetail?: () => void;
}> = props => {
	return props.loading ? (
		<div class="c-subheader">
			<div class="skeleton" style={{ display: props.loading ? 'block' : 'none' }}>
				<scib-atoms-skeleton skeletonType="subheaderComms" />
			</div>
		</div>
	) : props.errorSubheader.status === true ? (
		<div class="c-subheader">
			<div class="c-subheader__error">{props.errorSubheader.text}</div>
		</div>
	) : (
		props.errorSubheader.status === false &&
		(props.link || props.items) && (
			<div class="c-subheader">
				<div class="c-subheader__items">
					{props.items?.map(item => {
						return (
							<p class="c-subheader__info">
								{(item.title || item.state) && (
									<span
										class={{ 'c-subheader__info-title': item.state ? true : false, 'c-subheader__info-no-title': item.title ? false : true }}
										style={{ 'background-color': item.state ? item.state : 'transparent' }}
									>
										{item?.title}
									</span>
								)}
								{item.value && <span class="c-subheader__info-value">{item?.value}</span>}
							</p>
						);
					})}
				</div>
				{props.link ? (
					props.isMobile ? (
						<scib-ui-button title="Show detail" class="u-icon icon-eye-show" link disable-min-width red-icon hide-text onClick={props.eventClickOpenDetail}></scib-ui-button>
					) : (
						<a href={props.link?.href} title={props.link.label} id="link" target="_blank" rel="noopener noreferrer">
							{props.link?.label}
						</a>
					)
				) : null}
			</div>
		)
	);
};
