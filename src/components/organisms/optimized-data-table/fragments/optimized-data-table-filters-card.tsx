import { FunctionalComponent, h } from '@stencil/core';
import _ from 'lodash';

export const OrganismsOptimizedDataTableFiltersCard: FunctionalComponent<{
	openChipFilters: any;
	tittleFilter: string;
	currentOpenChipFiltersColumn: any;
	chips: any;
	deleteFilters: any;
	elementPositionRef: any;
	hostRef: HTMLElement;
}> = ({ openChipFilters, tittleFilter, currentOpenChipFiltersColumn, chips, deleteFilters, elementPositionRef = null, hostRef }) => {
	const chipsVisible = !currentOpenChipFiltersColumn ? chips : chips.filter((chip) => chip.field === currentOpenChipFiltersColumn);
	const { left, top, height, width } = elementPositionRef?.getBoundingClientRect() || {};
	const _left = left - 182;
	const topContainerModal = hostRef.shadowRoot.querySelector('.modal-chips-container')?.getBoundingClientRect().top;
	const topModal = top - topContainerModal + height / 2;
	let _position = {};
	if (left && height) {
		const leftContainer = hostRef?.shadowRoot?.querySelector('.tabulator-tableholder')?.getBoundingClientRect()?.left;
		_position = { top: `${topModal}px`, left: `${_left - leftContainer + width}px` };
	}
	return (
		<scib-ui-v2-card
			onFocusout={() => (openChipFilters = false)}
			id="chip-container"
			class={'chips-container' + (openChipFilters ? ' chips-container--open' : '')}
			card-id="card-id"
			tooltip="Tooltip for the card"
			type="elevated"
			style={{ ..._position }}
		>
			<div class="chips-container__header">
				<h4>{tittleFilter}</h4>
				<div class="reset-button">
					<scib-atoms-button
						onClick={() => {
							deleteFilters(chipsVisible);
						}}
						text={`Reset (${chipsVisible.length})`}
						size="s"
						color="none"
						variant="basic"
						type="button"
					></scib-atoms-button>
				</div>
			</div>
			<div class="chips-container__area">
				<scib-ui-v2-chips
					value={chipsVisible}
					variant="blue"
					onValueChange={(event) => {
						deleteFilters(event.detail.oldChips);
					}}
				></scib-ui-v2-chips>
			</div>
		</scib-ui-v2-card>
	);
};
