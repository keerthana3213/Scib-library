import { Component, Host, h, Prop, EventEmitter, Event, Element, State, Method } from '@stencil/core';
import { GlobalPortalService } from '../../../../utils/helpers/portal-body.service';
import { VariantTypes } from '../../../../shared/models';
import { ILiterals } from '../models/popover.model';

/**
 * Interface for card configuration that inherits properties from ui-v2-card
 */
export interface PopoverConfig {
	type?: 'elevated' | 'outlined' | 'link' | 'alternative' | 'linkWithoutBorder' | 'default';
	variant?: VariantTypes;
	tooltip?: string;
	cardId?: string;
}

/**
 * Default literals for accessibility
 */
const DEFAULT_LITERALS: ILiterals = {
	triggerAriaLabel: 'Open popover',
	closeAriaLabel: 'Close popover'
};

/**
 * Popover component - Displays content in a card that floats over the interface
 *
 * @slot trigger - The element that will trigger the popover when clicked
 * @slot default - The content to display inside the popover card
 */
@Component({
	tag: 'scib-atoms-popover',
	styleUrl: 'popover.scss',
	shadow: true
})
export class AtomsPopover {
	@Element() _hostRef: HTMLElement;

	/**
	 * Default variant for the popover (private)
	 */
	private variant: VariantTypes = 'white';

	/**
	 * Default width for the popover (private)
	 */
	private width: string = 'auto';

	/**
	 * Configuration for the dropdown UI appearance
	 * Inherits all properties from ui-v2-card
	 */
	@Prop() popoverConfig: PopoverConfig = {
		type: 'elevated',
		variant: 'white'
	};

	/**
	 * Optional height for the popover content
	 * If not provided, the height will adapt to the content
	 */
	@Prop() height: string;

	/**
	 * Optional horizontal offset for the popover (X axis only)
	 */
	@Prop() offsetX: number = 0;

	/**
	 * Optional vertical offset for the popover (Y axis only)
	 */
	@Prop() offsetY: number = 0;

	/**
	 * Optional custom ID for the popover element.
	 * This ID will be assigned to the popover portal container, allowing to target it with CSS selectors.
	 * If not provided, a random ID will be generated.
	 */
	@Prop() popoverId: string;

	/**
	 * Customizable text literals for accessibility
	 */
	@Prop() literals: ILiterals = DEFAULT_LITERALS;

	/**
	 * Control if the component should manage focus
	 * When true, the component will automatically focus the first focusable element when opened
	 * and return focus to the trigger when closed
	 * Default is true for backwards compatibility
	 */
	@Prop() manageFocus: boolean = true;

	/**
	 * ID of the created portal element (used internally)
	 */
	@State() portalId: string;

	/**
	 * Whether the popover is currently open
	 */
	@State() isOpen: boolean = false;

	/**
	 * Generated unique ID for ARIA attributes if custom popoverId is not provided
	 */
	@State() generatedId: string = `popover-${Math.random().toString(36).substring(2, 11)}`;

	/**
	 * Element that triggers the popover
	 */
	private triggerElement: HTMLElement;

	/**
	 * Reference to the card element that will be used as content container
	 */
	private cardElement: HTMLElement;

	/**
	 * Emitted when the popover is opened
	 */
	@Event() popoverOpen: EventEmitter<void>;

	/**
	 * Emitted when the popover is closed
	 */
	@Event() popoverClose: EventEmitter<void>;

	/**
	 * Life cycle method executed when component is removed
	 */
	disconnectedCallback() {
		this.closePopover();
	}

	/**
	 * Life cycle method executed after the component has loaded
	 */
	componentDidLoad() {
		this.triggerElement = this._hostRef.shadowRoot.querySelector('.popover-trigger');
		this.cardElement = this._hostRef.shadowRoot.querySelector('scib-ui-v2-card');

		// Apply default configuration to the card
		if (this.cardElement) {
			this.applyCardConfig(this.cardElement);
		}

		// Setup accessibility attributes
		this.setupAccessibility();

		// Add click handler to trigger element
		this.triggerElement.addEventListener('click', (e) => {
			e.preventDefault();
			e.stopPropagation();
			this.togglePopover();
		});

		// Add keyboard support
		this.triggerElement.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				e.stopPropagation();
				this.togglePopover();
			} else if (e.key === 'Escape' && this.isOpen) {
				e.preventDefault();
				e.stopPropagation();
				this.closePopover();
			}
		});
	}

	/**
	 * Apply card configuration to an element
	 */
	private applyCardConfig(element: HTMLElement) {
		if (this.popoverConfig.type) {
			element.setAttribute('type', this.popoverConfig.type);
		}
		if (this.popoverConfig.variant) {
			element.setAttribute('variant', this.popoverConfig.variant);
		}
		if (this.popoverConfig.cardId) {
			element.setAttribute('card-id', this.popoverConfig.cardId);
		}
		if (this.popoverConfig.tooltip) {
			element.setAttribute('tooltip', this.popoverConfig.tooltip);
		}
	}

	/**
	 * Setup accessibility attributes on trigger and content
	 */
	private setupAccessibility() {
		const finalLiterals = { ...DEFAULT_LITERALS, ...this.literals };

		// Set ARIA attributes to trigger element
		if (this.triggerElement) {
			this.triggerElement.setAttribute('role', 'button');
			this.triggerElement.setAttribute('aria-haspopup', 'dialog');
			this.triggerElement.setAttribute('aria-controls', this.popoverId);
			this.triggerElement.setAttribute('aria-expanded', this.isOpen ? 'true' : 'false');
			this.triggerElement.setAttribute('aria-label', finalLiterals.triggerAriaLabel);
			this.triggerElement.setAttribute('tabindex', '0');
		}
	}

	/**
	 * Toggle popover visibility
	 * @param force Optional parameter to force a specific state (true to open, false to close)
	 * @returns Boolean indicating the new open state of the popover
	 */
	private togglePopover(force?: boolean): boolean {
		const newState = force !== undefined ? force : !this.isOpen;

		if (newState) {
			this.openPopover();
		} else {
			this.closePopover();
		}

		return this.isOpen;
	}

	/**
	 * Open the popover
	 */
	@Method()
	async openPopover() {
		if (this.isOpen) return;

		// Create a container for the popover content
		const popoverContent = document.createElement('div');
		popoverContent.className = 'popover-content';
		popoverContent.id = this.popoverId;
		popoverContent.setAttribute('role', 'dialog');
		popoverContent.setAttribute('aria-modal', 'true');

		// Get all content nodes from the default slot
		const contentSlot = this._hostRef.shadowRoot.querySelector('slot:not([name])') as HTMLSlotElement;
		// Asegurarnos de que contentSlot es un HTMLSlotElement antes de llamar a assignedElements
		const contentElements = contentSlot instanceof HTMLSlotElement ? contentSlot.assignedElements() : [];

		if (contentElements.length === 0) return;

		// Clone the card element with its content
		const clonedCard = this.cardElement.cloneNode(true) as HTMLElement;

		// Configure the card with the specified attributes
		this.applyCardConfig(clonedCard);

		// Apply height style if provided
		if (this.height) {
			clonedCard.style.height = this.height;
		}

		// Apply width style if provided
		if (this.width && this.width !== 'auto') {
			clonedCard.style.width = this.width;
		}

		// Clone and append content nodes to the cloned card
		contentElements.forEach((element) => {
			const clonedNode = element.cloneNode(true);
			clonedCard.appendChild(clonedNode);
		});

		// Append close button for keyboard accessibility
		this.addCloseButton(clonedCard);

		// Append the cloned card to the popover content container
		popoverContent.appendChild(clonedCard);

		// Position below the trigger element with configurable X and Y offsets
		const position = 'below';
		const offset = { x: this.offsetX, y: this.offsetY };

		// Create the portal element at body level
		this.portalId = GlobalPortalService.createElement({
			triggerElement: this.triggerElement,
			content: popoverContent,
			position: position,
			width: this.width,
			offset: offset,
			closeOnOutsideClick: true, // Always close on outside click
			preventOverflow: true, // Always prevent overflow
			id: this.popoverId, // Usar el ID personalizado si está definido
			onClose: () => {
				this.isOpen = false;
				this.updateAriaAttributes(false);
				this.popoverClose.emit();
			}
		});

		this.isOpen = true;
		this.updateAriaAttributes(true);
		this.popoverOpen.emit();

		// Add global event listener for Escape key
		document.addEventListener('keydown', this.handleEscapeKey);

		// Focus the first focusable element inside the popover only if manageFocus is true
		if (this.manageFocus) {
			setTimeout(() => {
				this.focusFirstElement(popoverContent);
			}, 100);
		}
	}

	/**
	 * Close the popover
	 */
	@Method()
	async closePopover() {
		if (this.portalId) {
			// Remove the global event listener for Escape key
			document.removeEventListener('keydown', this.handleEscapeKey);

			GlobalPortalService.removeElement(this.portalId);
			this.portalId = null;
			this.isOpen = false;
			this.updateAriaAttributes(false);
			this.popoverClose.emit();

			// Return focus to the trigger element only if manageFocus is true
			if (this.manageFocus && this.triggerElement) {
				this.triggerElement.focus();
			}
		}
	}

	/**
	 * Updates ARIA attributes based on popover state
	 */
	private updateAriaAttributes(isOpen: boolean) {
		if (this.triggerElement) {
			this.triggerElement.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
		}
	}

	/**
	 * Adds a visually hidden close button for keyboard accessibility
	 */
	private addCloseButton(container: HTMLElement) {
		const closeButton = document.createElement('button');
		closeButton.className = 'flame-sr-only flame-focus-visible:flame-not-sr-only';
		closeButton.textContent = this.literals?.closeAriaLabel || DEFAULT_LITERALS.closeAriaLabel;
		closeButton.setAttribute('aria-label', this.literals?.closeAriaLabel || DEFAULT_LITERALS.closeAriaLabel);
		closeButton.setAttribute('tabindex', '0');
		closeButton.addEventListener('click', () => this.closePopover());
		closeButton.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				this.closePopover();
			}
		});
		container.appendChild(closeButton);
	}

	/**
	 * Focus the first focusable element in the popover
	 * This is called only when manageFocus is true
	 */
	private focusFirstElement(container: HTMLElement) {
		const focusableElements = container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');

		if (focusableElements.length > 0) {
			(focusableElements[0] as HTMLElement).focus();
		}
	}

	/**
	 * Handler for Escape key press
	 */
	private handleEscapeKey = (e: KeyboardEvent) => {
		if (e.key === 'Escape' && this.isOpen) {
			e.preventDefault();
			this.closePopover();
		}
	};

	render() {
		return (
			<Host>
				<div class="popover-trigger">
					<slot name="trigger"></slot>
				</div>
				<div class="popover-content-container" style={{ display: 'none' }}>
					<scib-ui-v2-card
						type={this.popoverConfig?.type || 'elevated'}
						card-id={this.popoverConfig?.cardId}
						tooltip={this.popoverConfig?.tooltip}
					>
						<slot></slot>
					</scib-ui-v2-card>
				</div>
			</Host>
		);
	}
}
