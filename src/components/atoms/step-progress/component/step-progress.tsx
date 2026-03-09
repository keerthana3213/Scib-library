import { Component, Host, h, Prop, EventEmitter, Watch, State, Event, Element } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { StepProgress } from '../models/step-progress.model';
import { VariantTypes } from '../../../../shared/models';

@Component({
	tag: 'scib-atoms-step-progress',
	styleUrl: 'step-progress.scss',
	shadow: true
})
export class AtomsStepProgress {
	@Element() _hostRef: HTMLElement;

	private _listRef: HTMLElement;

	resizeObserver: any;

	/**
	 * The variant modifies the value of the custom properties to change the appearance of the component based on the theme.
	 * Variant, deprecated
	 */
	@Prop({ reflect: true }) variant: VariantTypes = 'none';

	/**
	 * Defines the initial step that will be marked as active (optional). The number should correspond to the ID passed in the STEPS object.
	 */
	@Prop({ mutable: true }) activeId: number;
	@State() $activeId: number;
	@Watch('activeId') parseActiveId(newId: number) {
		this.$activeId = newId;
		this.mapStepsStatus();
	}

	/**
	 * Enables the flow through clicks by modifying the component and emitting events (optional).
	 */
	@Prop() allowFlow: boolean;

	/**
	 * Enables the flow through clicks by emitting events without modifying the component (optional) (priority).
	 */
	@Prop() allowOnlyEvents: boolean;

	/**
	 * Enables text adjustment based on the first step to prevent overflow (optional).
	 */
	@Prop() adjustText: boolean;

	/**
	 * Specific configuration for each step of the process.
	 */
	@Prop() steps: StepProgress[] | string;
	@State() $steps: StepProgress[];
	@Watch('steps') parseSteps(newSteps: StepProgress[] | string) {
		this.$steps = _parseProp<StepProgress[]>(newSteps || []);
		this.mapStepsStatus();
	}

	@State() _containerWidth: string;

	/**
	 * This event is emitted when a user clicks on one of the steps. It returns the complete information of the selected step.
	 */
	@Event() eventClickStep: EventEmitter;

	/**** LifeCycle methods ****/

	componentWillLoad() {
		this.parseSteps(this.steps);
		this.parseActiveId(this.activeId);
		this.initializeResizeObserver();
	}

	componentDidRender() {
		this.adjustTextFirstStep();
	}

	componentDidUpdate() {
		this._setStyle();
	}

	/**** Custom methods ****/

	mapStepsStatus() {
		let activeIndex = this.$steps.findIndex((step) => step.active);
		this.resetActiveSteps();

		activeIndex < 0 && isNaN(this.$activeId) ? (activeIndex = 0) : (activeIndex = this.$steps.findIndex((step) => step.id == this.$activeId));

		this.$steps[activeIndex].active = true;

		this.$steps.forEach((step, index) => {
			step.complete = index < activeIndex;
		});
	}

	resetActiveSteps() {
		this.$steps.forEach((step) => {
			step.active = false;
		});
	}

	adjustTextFirstStep() {
		if (this.adjustText) {
			const stepText = this._listRef?.querySelector('.step-progress__step-txt');
			const stepItem = this._listRef?.querySelector('.step-progress__item');

			if (stepText && stepItem) {
				const lengthText = (stepText.getBoundingClientRect().width / 2 - stepItem.getBoundingClientRect().width / 2) * 2;
				this._containerWidth = `calc(100% - ${Math.abs(lengthText)}px)`;
			}
		}
	}

	goToClickedStep(step) {
		if (!step.notAllow && this.allowFlow) {
			this.eventClickStep.emit(step);

			if (this.allowFlow && !this.allowOnlyEvents) {
				this.$activeId = step.id;
				this.mapStepsStatus();
			}
		}
	}

	initializeResizeObserver() {
		this.resizeObserver = new ResizeObserver((_) => {
			this._setStyle();
		});

		this.resizeObserver.observe(this._hostRef);
	}

	private _setStyle() {
		const widthHost = this._hostRef.getBoundingClientRect().width;
		const stepsLength = this.$steps.length;

		const defaultMediaValues = this.adjustText
			? {
					0: 300,
					1: 300,
					2: 400,
					3: 480,
					4: 640,
					5: 740,
					default: 760
			  }
			: {
					0: 300,
					1: 300,
					2: 360,
					3: 440,
					4: 520,
					5: 640,
					default: 720
			  };

		const defaultMedia = defaultMediaValues[stepsLength] || defaultMediaValues.default;
		if (widthHost < defaultMedia) this.hideStepText();
		else this.showStepText();
	}

	setStepTextDisplay(style: string) {
		const stepTextNotActive = this._hostRef.shadowRoot.querySelectorAll('.step-progress__step-txt--not-active');
		const stepTextActive = this._hostRef.shadowRoot.querySelectorAll('.step-progress__step-txt--active');

		stepTextNotActive.forEach((element: any) => {
			element.style.display = style;
		});

		stepTextActive.forEach((element: any) => {
			element.style.display = 'block';
		});
	}

	hideStepText() {
		this.setStepTextDisplay('none');
	}

	showStepText() {
		this.setStepTextDisplay('block');
	}

	handleStepClick(step) {
		this.goToClickedStep(step);
	}

	/**** Render Methods ****/

	renderStep(step, index, allowEvents) {
		return (
			<li class="step-progress__list-item" key={index}>
				{index > 0 && (
					<div
						class={{
							'step-progress__line': true,
							'step-progress__line--complete': step.complete || step.active
						}}
					/>
				)}
				<div
					onClick={this.handleStepClick.bind(this, step)}
					class={{
						'step-progress__item': true,
						'step-progress__item--active': step.active,
						'step-progress__item--complete': step.complete,
						'step-progress__item--not-allowed': allowEvents && step.notAllow
					}}
				>
					{step.complete && <i class="icon step-progress__icon" />}
					<span class="step-progress__step" />
					<span
						class={{
							'step-progress__step-txt': true,
							'step-progress__step-txt--not-active': !step.active,
							'step-progress__step-txt--active': step.active
						}}
					>
						{step.label}
					</span>
				</div>
			</li>
		);
	}

	render() {
		const allowEvents = this.allowFlow || this.allowOnlyEvents;
		return (
			<Host>
				<div ref={(el) => (this._listRef = el as HTMLElement)} class="step-progress" style={{ width: this._containerWidth }}>
					<ol class={{ 'step-progress__list': true, 'step-progress__list--flow': allowEvents }}>
						{this.$steps.map((step, index) => this.renderStep(step, index, allowEvents))}
					</ol>
				</div>
			</Host>
		);
	}
}
