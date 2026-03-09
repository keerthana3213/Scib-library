import { ICDKLegend } from '../models/cdk-list-request.model';
import { FunctionalComponent, h } from '@stencil/core';

export const CDKListRequestLegend: FunctionalComponent<{
	legend: ICDKLegend;
}> = props => {
	return (
		<div class="c-legend">
			<div class="c-legend-panel">
				<span class="c-legend-label">{props.legend.pendingLabel}</span>
				<scib-ui-color-panel id="scib-ui-color-panel" status="pending" role="status" isFilter>
					<span class="c-legend-text" slot="dataContent">
						{props.legend?.pending || '-'}
					</span>
				</scib-ui-color-panel>
			</div>
			<div class="c-legend-panel">
				<span class="c-legend-label">{props.legend.requestedLabel}</span>
				<scib-ui-color-panel id="scib-ui-color-panel" status="requested" role="status" isFilter>
					<span class="c-legend-text" slot="dataContent">
						{props.legend?.requested || '-'}
					</span>
				</scib-ui-color-panel>
			</div>
			<div class="c-legend-panel">
				<span class="c-legend-label">{props.legend.inProgressLabel}</span>
				<scib-ui-color-panel id="scib-ui-color-panel" status="progress" role="status" isFilter>
					<span class="c-legend-text" slot="dataContent">
						{props.legend?.inProgress || '-'}
					</span>
				</scib-ui-color-panel>
			</div>
			<div class="c-legend-panel">
				<span class="c-legend-label">{props.legend.doneLabel}</span>
				<scib-ui-color-panel id="scib-ui-color-panel" status="done" role="status" isFilter>
					<span class="c-legend-text" slot="dataContent">
						{props.legend?.done || '-'}
					</span>
				</scib-ui-color-panel>
			</div>
			<div class="c-legend-panel">
				<span class="c-legend-label">{props.legend.cancelLabel}</span>
				<scib-ui-color-panel id="scib-ui-color-panel" status="canceled" role="status" isFilter>
					<span class="c-legend-text" slot="dataContent">
						{props.legend?.canceled || '-'}
					</span>
				</scib-ui-color-panel>
			</div>
		</div>
	);
};
