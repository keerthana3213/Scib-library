import { FunctionalComponent, h } from '@stencil/core';

export const UiV2CounterPanelCardM: FunctionalComponent<{
	id: number;
	panel: any;
	activeIds: number[];
	handlerClick: (event: any, id: number) => any;
	getPanelIndicator: (panel: any) => any;
}> = ({ id, panel, activeIds, handlerClick, getPanelIndicator }) => {
	return (
		<div class="counter-panel__globalcontainer" key={id}>
			<div class="counter-panel__container">
				{panel?.label && (
					<div
						class={{
							'counter-panel__label': true,
							'counter-panel__label--centerLabel': panel.center,
							'counter-panel__card--opacity': activeIds.length > 0 && activeIds.indexOf(id) === -1
						}}
						title={panel.label}
					>
						{panel.label}
					</div>
				)}
				<div
					class={{
						'counter-panel__card counter-panel__card--medium': true,
						'counter-panel__card--active': activeIds.indexOf(id) > -1,
						'counter-panel__card--opacity': activeIds.length > 0 && activeIds.indexOf(id) === -1
					}}
					style={{ '--_ui-v2-counter-panel-status-color': panel?.color }}
					onClick={(event) => handlerClick(event, id)}
				>
					<span class="counter-panel__card__text">{getPanelIndicator(panel)}</span>
				</div>
			</div>
			{panel?.spacer && <div class="counter-panel__spacer-line"></div>}
		</div>
	);
};
