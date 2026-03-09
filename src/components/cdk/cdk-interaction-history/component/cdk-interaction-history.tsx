import { Component, Host, h, Prop, EventEmitter, Watch, State, Event } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import {
	ICDKInteractionHistoryData,
	ICDKInteractionHistoryLiterals,
	CDKInteractionHistoryTypeEnum,
	CDKInteractionHistoryChannelEnum,
} from '../models/cdk-interaction-history.model';

@Component({
	tag: 'scib-cdk-interaction-history',
	styleUrl: 'cdk-interaction-history.scss',
	shadow: false,
	scoped: true,
})
export class CDKInteractionHistory {
	/** Data */
	@Prop({ reflect: true }) data: ICDKInteractionHistoryData | string;
	@State() _data: ICDKInteractionHistoryData;
	@Watch('data') parseData(newData: ICDKInteractionHistoryData | string) {
		const newDataValue = _parseProp<ICDKInteractionHistoryData>(newData as string);
		this._data = newDataValue;
		this._showForm = newDataValue.showForm;
	}

	/** Literals */
	@Prop({ reflect: true }) literals: ICDKInteractionHistoryLiterals | string;
	@State() _literals: ICDKInteractionHistoryLiterals;
	@Watch('literals') parseLiterals(newLiterals: ICDKInteractionHistoryLiterals | string) {
		this._literals = _parseProp<ICDKInteractionHistoryLiterals>(newLiterals as string);
	}

	@State() _showForm: boolean = false;

	@State() _dateTime: {
		joinedDateTime: string;
		day: string;
		time: string;
	} = {
		joinedDateTime: null,
		day: null,
		time: null,
	};

	componentWillLoad() {
		this.parseData(this.data);
		this.parseLiterals(this.literals);
	}

	joinDateTime(day, time) {
		if (day == null || time == null || day == '' || time == '') {
			this._dateTime.day = day;
			this._dateTime.time = time;
			this._dateTime.joinedDateTime = null;
		} else {
			this._dateTime.day = day;
			this._dateTime.time = time;
			this._dateTime.joinedDateTime = day + 'T' + time;
		}
	}

	/** Descripción del evento */
	@Event() userAction: EventEmitter;

	/** Event for datetime change */
	@Event() eventFormChange: EventEmitter;

	fixedDate = number => String(number).padStart(2, '0');

	render() {
		return (
			<Host>
				<scib-ui-wrapper>
					{this._data?.interactions.map(interaction => (
						<scib-ui-row separator>
							<scib-ui-column col-Lg="1" col-Xs="6">
								<scib-ui-label-data label={`${this._literals.date}`} text={`${new Intl.DateTimeFormat('es-ES').format(Date.parse(interaction.date))}`}></scib-ui-label-data>
							</scib-ui-column>
							<scib-ui-column col-Lg="1" col-Xs="6">
								<scib-ui-label-data
									label={`${this._literals.time}`}
									text={`${this.fixedDate(new Date(Date.parse(interaction.date)).getHours())}:${this.fixedDate(new Date(Date.parse(interaction.date)).getMinutes())}`}
								></scib-ui-label-data>
							</scib-ui-column>
							<scib-ui-column col-Lg="2" col-Xs="6">
								<scib-ui-label-data label={`${this._literals.interactionType}`} text={`${interaction.interactionType}`}></scib-ui-label-data>
							</scib-ui-column>
							<scib-ui-column col-Lg="2" col-Xs="6">
								<scib-ui-label-data label={`${this._literals.channel}`} text={`${interaction.channel}`}></scib-ui-label-data>
							</scib-ui-column>
							{interaction.description && (
								<scib-ui-column col-Lg="6" col-Xs="6">
									<scib-ui-label-data label={`${this._literals.description}`} text={`${interaction.description}`}></scib-ui-label-data>
								</scib-ui-column>
							)}
						</scib-ui-row>
					))}
					{this._showForm || !this._data.interactions.length ? (
						<scib-ui-row>
							<scib-ui-column col-Lg="6" col-Xs="6">
								<h3 class="cdk-interaction-history__title">{this._literals.newInteraction}</h3>
							</scib-ui-column>
							<scib-ui-column col-Lg="1.7" col-Xs="6">
								<scib-ui-date-picker
									label={`${this._literals.date}*`}
									header={this._literals.datePlaceholder}
									name="day"
									full
									onEventFormChange={e => {
										e.stopPropagation();
										this.joinDateTime(e.detail.value, this._dateTime.time);
										this.eventFormChange.emit({
											name: 'date',
											value: this._dateTime.joinedDateTime,
											required: true,
										});
									}}
									required
								></scib-ui-date-picker>
							</scib-ui-column>
							<scib-ui-column col-Lg="1.2" col-Xs="6">
								<scib-ui-date-picker
									label={`${this._literals.time}*`}
									header={this._literals.timePlaceholder}
									name="time"
									datetime
									full
									onEventFormChange={e => {
										e.stopPropagation();
										this.joinDateTime(this._dateTime.day, e.detail.value);
										this.eventFormChange.emit({
											name: 'date',
											value: this._dateTime.joinedDateTime,
											required: true,
										});
									}}
									required
								></scib-ui-date-picker>
							</scib-ui-column>
							<scib-ui-column col-Lg="1.8" col-Xs="6">
								<scib-ui-dropdown
									label={`${this._literals.interactionType}*`}
									header={this._literals.interactionTypePlaceholder}
									options={JSON.stringify(
										Object.keys(CDKInteractionHistoryTypeEnum)
											.map(key => ({ active: false, id: key, name: CDKInteractionHistoryTypeEnum[key] }))
											.sort(function (a, b) {
												if (a.name > b.name) {
													return 1;
												} else {
													return -1;
												}
											}),
									)}
									metadatavalues={false}
									multipleselector="single"
									idselect="interactionType"
									name="interactionType"
									onEventFormChange={e => e.detail.value}
									required
								></scib-ui-dropdown>
							</scib-ui-column>
							<scib-ui-column col-Lg="1.3" col-Xs="6">
								<scib-ui-dropdown
									label={`${this._literals.channel}*`}
									header={this._literals.channelPlaceholder}
									options={JSON.stringify(
										Object.keys(CDKInteractionHistoryChannelEnum)
											.map(key => ({ active: false, id: key, name: CDKInteractionHistoryChannelEnum[key] }))
											.sort(function (a, b) {
												if (a.name > b.name) {
													return 1;
												} else {
													return -1;
												}
											}),
									)}
									metadatavalues={false}
									multipleselector="single"
									idselect="channel"
									name="channel"
									onEventFormChange={e => e.detail.value}
									required
								></scib-ui-dropdown>
							</scib-ui-column>
							<scib-ui-column col-Lg="6" col-Xs="6">
								<scib-ui-textarea
									label-txtarea={`${this._literals.description}*`}
									name-txtarea="description"
									placeholder-txtarea={this._literals.descriptionPlaceholder}
									onEventFormChange={e => e.detail.value}
									charLimit={800}
									required
								></scib-ui-textarea>
							</scib-ui-column>
						</scib-ui-row>
					) : (
						<scib-ui-row>
							<scib-ui-column col-Lg="6" col-Xs="6">
								<scib-ui-button
									link
									class="ui-table-button"
									type="button"
									icon-left
									small
									disableMinWidth
									nobackground
									noLateralPadding
									onEventClick={event => {
										this.userAction.emit({
											type: 'showForm',
										});
										event.stopPropagation();
									}}
								>
									{this._literals.addClientInteraction}
								</scib-ui-button>
							</scib-ui-column>
						</scib-ui-row>
					)}
				</scib-ui-wrapper>
			</Host>
		);
	}
}
