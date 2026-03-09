import { FunctionalComponent, h } from '@stencil/core';

export const UiV2CounterPanelCardS: FunctionalComponent<{
	id: number;
	panel: any;
	activeIds: number[];
	handlerClick: (event: any, id: number) => any;
	getPanelIndicator: (panel: any) => any;
}> = ({ id, panel, activeIds, handlerClick, getPanelIndicator }) => {
	return (
		<div class="counter-panel__globalcontainer counter-panel__globalcontainer--small">
			<div class="counter-panel__container counter-panel__container--small">
				{panel?.label && (
					<div
						class={{
							'counter-panel__label counter-panel__label--small': true,
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
						'counter-panel__card counter-panel__card--small': true,
						'counter-panel__card--active counter-panel__card--active--small': activeIds.indexOf(id) > -1,
						'counter-panel__card--opacity counter-panel__card--opacity--small': activeIds.length > 0 && activeIds.indexOf(id) === -1
					}}
					style={{
						'--_ui-v2-counter-panel-status-color': panel?.color,
						'--_ui-v2-counter-panel-status-background-color': `${panel?.color}1A`
					}}
					onClick={(event) => handlerClick(event, id)}
				>
					<span class="counter-panel__card__text counter-panel__card__text--small">{getPanelIndicator(panel)}</span>
				</div>
			</div>
			{panel?.spacer && <div class="counter-panel__spacer-line"></div>}
		</div>
	);
};
