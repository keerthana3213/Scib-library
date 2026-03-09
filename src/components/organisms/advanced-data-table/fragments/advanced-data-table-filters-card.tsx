import { FunctionalComponent, h } from '@stencil/core';
import { ActiveFilters } from '../models/advanced-data-table.model';
import _ from 'lodash';

export const OrganismsAdvancedDataTableFiltersCard: FunctionalComponent<{
	openChipFilters: any;
	openChipFiltersColumn: any;
	literals: any;
	currentOpenChipFiltersColumn: any;
	chips: any;
	totalActiveFilters: any;
	deleteAllFilter: any;
	deleteAllFilterOneColumn: any;
	chipsFiltersNumber: any;
	deleteOneFilter: any;
	elementPositionRef: any;
	hostRef: HTMLElement;
}> = ({
	openChipFilters,
	openChipFiltersColumn,
	literals,
	currentOpenChipFiltersColumn,
	chips,
	totalActiveFilters,
	deleteAllFilter,
	deleteAllFilterOneColumn,
	chipsFiltersNumber,
	deleteOneFilter,
	elementPositionRef = null,
	hostRef
}) => {
	const { left, height, width } = elementPositionRef?.getElement().querySelector('.header-filters-icon-container')?.getBoundingClientRect() || {};
	const _left = left - 287;
	let _position = {};
	if (left && height) {
		const leftContainer = hostRef?.shadowRoot?.querySelector('.tabulator-tableholder')?.getBoundingClientRect()?.left;
		_position = { top: `${height}px`, left: `${_left - leftContainer + width}px` };
	}
	return (
		<scib-ui-v2-card
			onFocusout={() => (openChipFilters = false)}
			id="chip-container"
			class={'chips-container' + (openChipFilters || openChipFiltersColumn ? ' chips-container--open' : '')}
			card-id="card-id"
			tooltip="Tooltip for the card"
			type="elevated"
			style={{ ..._position }}
		>
			<div class="chips-container__header">
				<h4>{openChipFilters ? literals.tittleChipContainer : literals.tittleColumnChipContainer}</h4>
				<div class="reset-button">
					<scib-atoms-button
						onClick={() => {
							openChipFilters ? deleteAllFilter() : deleteAllFilterOneColumn(currentOpenChipFiltersColumn);
						}}
						text={chipsFiltersNumber()}
						size="s"
						color="none"
						variant="basic"
						type="button"
					></scib-atoms-button>
				</div>
			</div>
			<div class="chips-container__area">
				<scib-ui-v2-chips
					value={openChipFilters ? chips : chips.filter((chip) => chip.field === currentOpenChipFiltersColumn)}
					variant="blue"
					onValueChange={(event) => {
						let filter = totalActiveFilters.filter((filter: ActiveFilters, index: number) => {
							if (index == event.detail.oldChips[0].id) {
								return filter;
							}
						});
						openChipFilters ? deleteOneFilter(filter[0], false) : deleteOneFilter(filter[0], true);
					}}
				></scib-ui-v2-chips>
			</div>
		</scib-ui-v2-card>
	);
};
