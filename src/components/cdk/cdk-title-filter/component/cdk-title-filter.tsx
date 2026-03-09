import { Component, h, Prop, EventEmitter, Watch, State, Event, Listen } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { CDKTitleFilterSkeleton } from '../fragments/cdk-title-filter-skeleton.fragment';
import { ICDKActionMenu, IEventActionMenuSelect, IEventChangeTitleFilter, ILiterals, IOptionDetail } from '../models/cdk-title-filter.model';

@Component({
	tag: 'scib-cdk-title-filter',
	styleUrl: 'cdk-title-filter.scss',
	shadow: false,
	scoped: false,
})
export class CDKTitleFilter {
	$title: HTMLElement;
	$radiosContainer: HTMLElement;

	/** Change components color to secondary theme */
	@Prop({ reflect: true }) secondary: boolean = false;

	/** Change components size to S (default M) */
	@Prop({ reflect: true }) small: boolean = false;

	/** Set up component display on right and show options on left */
	@Prop({ reflect: true }) right: boolean = false;

	/** Set up arrow separate between title and width */
	@Prop({ reflect: true }) separateArrow: boolean = false;

	/** Set up radio buttons on extra small style */
	@Prop({ reflect: true }) smallRadios: boolean = false;

	/** Indicate if total elements show */
	@Prop({ reflect: true }) showTotal: boolean = false;

	/** Indicate if options are loading and show skeleton */
	@Prop({ reflect: true }) loading: boolean = false;

	/** Set up a max height for scroll on radio buttons popover */
	@Prop({ reflect: true }) maxHeightScroll: boolean = false;

	/** Set up a max height depends of number of elements for scroll on radio buttons popover */
	@Prop({ reflect: true }) maxHeightElements: number = 5;

	/** Allows to display the search input */
	@Prop({ reflect: true }) showSearchEngine: boolean = false;

	/** Add action menu for radio options */
	@Prop({ reflect: true }) actionMenu: string | ICDKActionMenu[];

	@State() _actionMenu: ICDKActionMenu[];

	@Watch('actionMenu') parseActionMenu(newValue: string | ICDKActionMenu[]) {
		this._actionMenu = _parseProp<ICDKActionMenu[]>(newValue as string);
	}

	/** Prop for literals */
	@Prop({ reflect: true }) literals: ILiterals | string;

	@State() _literals: ILiterals;

	@Watch('literals') parseLiterals(newLiterals: ILiterals | string) {
		this._literals = _parseProp<ILiterals>(newLiterals as string);
	}

	/** Prop for radio buttons options */
	@Prop({ reflect: true }) optionsFilter: string | any;

	@State() _optionsFilter: IOptionDetail[];

	@Watch('optionsFilter') parseOptionsFilter(newLiterals: string | any) {
		this._optionsFilter = _parseProp(newLiterals);
		this.checkTitleSelected();
		this._totalItems = this._optionsFilter?.length;
	}

	/** Prop for literals */
	@Prop({ reflect: true }) optionIndexSelected: number = 0;

	@State() _optionIndexSelected: number;

	@Watch('optionIndexSelected') parseOptionIndexSelected(newValue: number) {
		this._optionIndexSelected = newValue;

		if (this._optionIndexSelected != undefined && this._optionIndexSelected != null) {
			this._handleOptionsChange(this._optionsFilter[this._optionIndexSelected], true);
		}
	}

	@State() _openOptions: boolean = false;

	@State() _changeFilter: string;

	@State() _totalItems: number | string;

	@Listen('click', { target: 'window' }) checkClickOutside(event) {
		const insideElementCheck = document.querySelector('scib-cdk-title-filter');
		if (!insideElementCheck.contains(event.target) && this._openOptions) {
			this._handleOpenOptions();
		}
	}

	@Listen('scroll', { target: 'window' }) checkScrollOutside() {
		this._openOptions = false;
		this._totalItems = this._optionsFilter?.length;
	}

	@Listen('valueChange')
	_inputFilterValueChange(event: CustomEvent & { detail: string }) {
		this._changeFilter = event.detail;
	}

	@Listen('iconClick')
	_inputfilterCleanValue(event: CustomEvent & { detail: string }) {
		this._changeFilter = event.detail;
	}

	@Listen('changeTotalItems')
	_changeTotalItems(event: CustomEvent & { detail: string | number }) {
		this._totalItems = event.detail;
	}

	/** Descripción del evento */
	@Event() eventChange: EventEmitter<IEventChangeTitleFilter>;

	/** Lifecycle methods*/

	componentWillLoad() {
		this.parseLiterals(this.literals);
		this.parseOptionsFilter(this.optionsFilter);
		this.parseOptionIndexSelected(this.optionIndexSelected);
		this.parseActionMenu(this.actionMenu);
	}

	componentDidLoad() {
		this.$title.onclick = () => {
			this._handleOpenOptions();
		};
	}

	/** Common methods */

	checkTitleSelected() {
		if (this.optionIndexSelected && this._optionsFilter) {
			this._literals.title = this._optionsFilter[this.optionIndexSelected].label;
		} else if (this._optionsFilter[0]) {
			this._literals.title = this._optionsFilter[0].label;
		}
	}

	_handleOpenOptions() {
		this._openOptions = !this._openOptions;
		if (!this._openOptions) this._totalItems = this._optionsFilter?.length;
	}

	_handleActionMenuClicked(e: IEventActionMenuSelect) {
		if (!e.eventId) return;

		this.eventChange.emit({
			eventId: e?.eventId,
			index: e.index,
			type: this._optionsFilter[e.index]?.value,
		});
	}

	_handleOptionsChange(op: IOptionDetail, omitEvent?: boolean) {
		if (!op) return;

		this._literals = { ...this._literals, title: op.label };

		if (this._optionsFilter?.length > 0) {
			const indexOption = this._optionsFilter.findIndex(x => x.value === op.value);
			this._optionIndexSelected = indexOption;
		}

		this._openOptions = false;
		this._totalItems = this._optionsFilter?.length;

		if (!omitEvent) {
			this.eventChange.emit({
				eventId: 'event_click',
				index: this._optionIndexSelected,
				type: op.value,
			});
		}
	}

	render() {
		return (
			<div
				class={{
					'cdk-title-filter': true,
					'cdk-title-filter--secondary': this.secondary,
					'cdk-title-filter--small': this.small,
					'cdk-title-filter--right': this.right,
				}}
			>
				<span class="cdk-title-filter__subtitle">{this._literals?.subtitle}</span>
				<div
					class={{
						'cdk-title-filter__title-container': true,
						'cdk-title-filter__title-container--separate': this.separateArrow,
					}}
					ref={el => (this.$title = el as HTMLElement)}
				>
					<h2 class="cdk-title-filter__title">{this._literals?.title}</h2>
					<span
						role="img"
						class={{
							'u-icon icon-arrow cdk-title-filter__arrow': true,
							'cdk-title-filter__arrow--reverse': this._openOptions,
						}}
					/>
				</div>
				{this._openOptions && (
					<div
						class={{
							'cdk-title-filter__options': true,
							'cdk-title-filter__options--total': this.showTotal && this._optionsFilter?.length > this.maxHeightElements,
						}}
					>
						<div
							class={{
								'cdk-title-filter__options-container': true,
								'cdk-title-filter__options-container--max-height':
									!this.loading && this.maxHeightElements > 0 && this.maxHeightScroll && this._optionsFilter.length > this.maxHeightElements,
							}}
							ref={el => (this.$radiosContainer = el as HTMLElement)}
						>
							{this.loading && (
								<div role="status" aria-busy="true" aria-live="polite">
									<figure class="cdk-title-filter__loading">
										<CDKTitleFilterSkeleton literalSkeleton={this._literals.accessibleLoading} />
									</figure>
								</div>
							)}

							{!this.loading && (
								<div>
									{this.showSearchEngine && (
										<scib-ui-v2-text-field class="cdk-title-filter__searchEngine" variant="white" label={this._literals.textLabelSearchEngineInput} icon="search" value="" />
									)}
									<scib-ui-radio-button
										group-name="title-filter-options"
										extra-small={this.smallRadios}
										options={JSON.stringify(this._optionsFilter)}
										active-button-index={this._optionIndexSelected}
										action-menu={JSON.stringify(this._actionMenu)}
										showInColumn
										changeFilter={this._changeFilter}
										onEventRadioButtonChange={(e: CustomEvent & { detail: IOptionDetail }) => {
											e.preventDefault();
											e.stopPropagation();
											this._handleOptionsChange(e.detail);
										}}
										onEventActionMenuSelect={(e: CustomEvent & { detail: IEventActionMenuSelect }) => {
											e.preventDefault();
											e.stopPropagation();
											this._handleActionMenuClicked(e.detail);
										}}
									/>
								</div>
							)}
						</div>
						{this.showTotal && this._optionsFilter?.length && (
							<div class="cdk-title-filter__total">
								<span class="cdk-title-filter__total-txt">
									{this._literals?.totalItems} {this.loading ? 0 : this._totalItems}
								</span>
							</div>
						)}
					</div>
				)}
			</div>
		);
	}
}
