import { ICDKHeaderSummaryData, ICDKHeaderSummaryLiterals } from '../models/cdk-header-summary.model';
import { Component, h, Prop, EventEmitter, Watch, State, Event } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { Colors } from '../../../../utils/helpers/styling-settings';

/**
 * Component description
 */
@Component({
	tag: 'scib-cdk-header-summary',
	styleUrl: 'cdk-header-summary.scss',
	shadow: false,
	scoped: false
})
export class CDKHeaderSummary {
	/** Literals */
	@Prop({ mutable: true, reflect: false }) literals: ICDKHeaderSummaryLiterals | string;
	@Watch('literals') parseLiterals(newLiterals: ICDKHeaderSummaryLiterals | string) {
		this._literals = _parseProp(newLiterals);
	}
	@State() _literals: ICDKHeaderSummaryLiterals;

	/** Datas */
	@Prop({ mutable: true, reflect: false }) data: ICDKHeaderSummaryData | string;
	@Watch('data') parseData(newData: ICDKHeaderSummaryData | string) {
		this._data = _parseProp(newData);
	}
	@State() _data: ICDKHeaderSummaryData;

	/** Indicates if the type of distribution is simple */
	@Prop({ mutable: true, reflect: false }) isSimple: boolean;

	/** Indicates if the return button should be shown or not */
	@Prop({ mutable: true, reflect: true }) noHaveBackBtn: boolean;

	/** Indicates if the stats should be shown or not */
	@Prop({ mutable: true, reflect: false }) noHaveStats: boolean;

	/** Event description */
	@Event() userAction: EventEmitter;

	/** Life cycle executed before the first render */
	componentWillLoad() {
		this.parseLiterals(this.literals);
		this.parseData(this.data);
	}

	render() {
		return (
			<section class={{ 'cdk-summary': true, 'cdk-summary--simple': this.isSimple }}>
				{this.noHaveBackBtn ? (
					''
				) : (
					<scib-ui-button
						data-cy="returnCard-button"
						icon="icon-chevron-left"
						small
						hide-txt
						nobackground
						onEventClick={() => {
							this.userAction.emit({
								type: 'goBack'
								// payload: group.id
							});
							event.stopPropagation();
						}}
					></scib-ui-button>
				)}
				<div class="cdk-summary__box">
					<div class="cdk-summary__cell cdk-summary__cell--title">
						<div class="cdk-summary__company">{this._data.titleName}</div>
						{this._data.subtitleName ? (
							<span class="cdk-summary__contracts">{this._data.subtitleName}</span>
						) : Number.isInteger(this._data.countedItems) ? (
							<span class="cdk-summary__contracts">
								{this._data.countedItems} {this._literals.countedItemsName}
							</span>
						) : null}
					</div>
					{this.noHaveStats ? (
						''
					) : (
						<div class="cdk-summary__group">
							<div class="cdk-summary__cell">
								<scib-ui-circle-progress-bar
									circle-progress-bar-id={`circle-progress-bar-summary`}
									part-value={this._data.progressPart}
									total-value={this._data.progressTotal}
									show-ratio="false"
									no-decimal
									show-check-when-complete
									styling={{
										color: this._data.progressPart == this._data.progressTotal && Colors.quaternary.base,
										strokeWidth: 8,
										trailWidth: 4,
										trailColor: Colors.secondary.medium
									}}
								></scib-ui-circle-progress-bar>
								<div class="cdk-summary__progress">
									<label class="cdk-summary__label">{this._literals.progressItemsLabel}</label>
									<span class="cdk-summary__data">
										{`${this._data.progressPart}/${this._data.progressTotal} `} {this._literals.progressItemsName}
									</span>
								</div>
							</div>
							{!this._data.buttonsAlign
								? this._data.subtitleName && (
										<div class="cdk-summary__cell">
											<button
												class="cdk-summary__button"
												type="button"
												onClick={() =>
													this.userAction.emit({
														type: 'showUngrouped'
													})
												}
											>
												<span class="cdk-summary__span">{this._literals.tableListLabel}</span>
											</button>
											<span class="cdk-summary__data">
												{this._data.tableListCount} {this._literals.tableListName}
											</span>
										</div>
								  )
								: ''}
						</div>
					)}
					<slot name="signature-config" />
					<div class={{ 'cdk-summary__group': !this._data.buttonsAlign, 'cdk-summary__group--align': this._data.buttonsAlign }}>
						{(this._data?.buttons || []).map((button, index) => (
							<div class="cdk-summary__cell">
								<scib-atoms-button
									data-cy="ibor-NewGroup-button"
									level={button.type === 'primary' || button.type === 'secondary' ? button.type : 'tertiary'}
									type="button"
									icon={button.iconName}
									iconPosition="leading"
									disabled={button.disabled}
									text={this._literals.buttonLabelList[index]}
									onClick={() => {
										this.userAction.emit({
											type: button.eventName
										});
										event.stopPropagation();
									}}
								></scib-atoms-button>
							</div>
						))}
					</div>
				</div>
			</section>
		);
	}
}
