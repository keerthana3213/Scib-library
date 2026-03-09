import { Component, Host, h, Prop, Watch, State } from '@stencil/core';
import { parseProp as _parseProp, addDays as _addDays } from '../../../../utils/helpers/common';

/**
 * Component description
 */
@Component({
	tag: 'scib-cdk-signature-table-cell-status',
	styleUrl: 'cdk-signature-table-cell-status.scss',
	shadow: true,
})
export class CDKSignatureTableCellStatus {
	@Prop() cellId: string;

	@Prop() status: string;
	@State() _status: string;
	@Watch('status') parseStatus(newValue: string) {
		this._status = newValue;
	}

	@Prop() completed: string;
	@State() _completed: string;
	@Watch('completed') parseCompleted(newValue: string) {
		this._completed = newValue;
	}

	@Prop() total: string;
	@State() _total: string;
	@Watch('total') parseTotal(newValue: string) {
		this._total = newValue;
	}

	@Prop() color: string;
	@State() _color: string;
	@Watch('color') parseColor(newValue: string) {
		this._color = newValue;
	}

	@Prop() isError: boolean;
	@State() _isError: boolean;
	@Watch('isError') parseIsError(newValue: boolean) {
		this._isError = newValue;
	}

	@Prop() literal: string;
	@State() _literal: string;
	@Watch('literal') parseLiteral(newValue: string) {
		this._literal = newValue;
	}

	@Prop() error: string;
	@State() _error: string;
	@Watch('error') parseError(newValue: string) {
		this._error = newValue;
	}

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.parseError(this.error);
		this.parseLiteral(this.literal);
		this.parseColor(this.color);
		this.parseCompleted(this.completed);
		this.parseError(this.error);
		this.parseIsError(this.isError);
		this.parseTotal(this.total);
		this.parseStatus(this.status);
	}

	render() {
		return (
			<Host>
				<div class="cdk-signature-table__progress">
					<div class="cdk-signature-table__circle-container">
						<scib-ui-circle-progress-bar
							class={`cdk-signature-table__circle cdk-signature-table__circle--${this._status}`}
							circle-progress-bar-id={`circle-signature-${this.cellId}`}
							part-label=""
							part-value={this._status === 'completed' || this._status === 'canceled' ? '1' : this._completed}
							total-label=""
							total-value={this._status === 'completed' || this._status === 'canceled' ? '1' : this._total}
							show-ratio={true}
							show-check-when-complete={true}
							no-decimals={true}
							styling={{ color: this._color, trailWidth: 1, strokeWidth: 8 }}
						></scib-ui-circle-progress-bar>
					</div>
					<span class="cdk-signature-table__progress-txt">
						{this._literal} {this._isError ? <span class="awarness-color">{this._error}</span> : null}
					</span>
				</div>
			</Host>
		);
	}
}
