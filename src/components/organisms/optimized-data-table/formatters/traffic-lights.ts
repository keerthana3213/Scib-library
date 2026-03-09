import { TableCell } from '../models/optimized-data-table.model';

export const trafficLights = (cell: TableCell, formatterParams) => {
	const { lights } = formatterParams;
	const position = cell.getColumn().getDefinition().hozAlign || 'left';
	const slaPercent = cell.getValue();
	const config = (lights || []).find((lightConfig) => {
		const { min, max = -1 } = lightConfig;
		return slaPercent > min && (min >= 100 || slaPercent <= max);
	});
	const { icon = 'circle-success', color = 'green' } = config || {};
	return `<div class='traffic_lights_cell' style='justify-content: ${position};'>
				<i class='icon' style='--icon-content:var(--theme-scib-icon-${icon}); --icon-color: ${color}'></i>
				<span>${Math.round(slaPercent)}%</span>
			</div>`;
};
