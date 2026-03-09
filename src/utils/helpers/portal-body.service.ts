/**
 * Interfaces for positioning configurations
 */
export interface GlobalPortalElementPosition {
	top: string;
	left: string;
}

export interface GlobalPortalElementOffset {
	x: number;
	y: number;
}

export interface GlobalPortalElementConfig {
	triggerElement: HTMLElement;
	content: HTMLElement | string;
	styles?: string;
	position?: 'below' | 'above' | 'left' | 'right';
	offset?: GlobalPortalElementOffset;
	onClose?: () => void;
	width?: string;
	zIndex?: number;
	/**
	 * ID personalizado para el elemento portal.
	 *
	 * @example
	 * // Uso desde componente padre
	 * const config: GlobalPortalElementConfig = {
	 *   triggerElement: miElementoTrigger,
	 *   content: miContenido,
	 *   id: 'mi-portal-personalizado'
	 * };
	 *
	 * // Para inyectar un ID personalizado al crear un portal desde un componente:
	 * @Component({
	 *   tag: 'mi-componente-personalizado'
	 * })
	 * export class MiComponentePersonalizado {
	 *   @Prop() portalId: string; // ID personalizado recibido como propiedad
	 *
	 *   crearPortal() {
	 *     const portalId = GlobalPortalService.createElement({
	 *       // Otras configuraciones...
	 *       id: this.portalId || 'id-predeterminado',
	 *     });
	 *   }
	 * }
	 *
	 * // Atacar mediante CSS
	 * // En tu archivo CSS o estilos inline:
	 * // #mi-portal-personalizado { ... }
	 * // #mi-portal-personalizado .elemento-interno { ... }
	 *
	 * // También se puede usar para seleccionar elementos específicos mediante JavaScript
	 * // document.querySelector('#mi-portal-personalizado')
	 */
	id?: string;
	className?: string;
	closeOnOutsideClick?: boolean;
	preventOverflow?: boolean;
	literals?: Record<string, string>;
	ariaLabel?: string;
	ariaLabelledBy?: string;
	ariaDescribedBy?: string;
	offsetY?: number; // Specific Y offset as requested
}

/**
 * GlobalPortalService - Class responsible for creating and managing floating elements at body level
 * Implemented following principles of single responsibility and loose coupling
 */
export class GlobalPortalService {
	// Registry of active elements
	private static activeElements: Map<string, HTMLElement> = new Map();

	/**
	 * Creates a global element rendered at body level
	 * @param config Element configuration
	 * @returns Unique ID of the created element
	 */
	public static createElement(config: GlobalPortalElementConfig): string {
		const {
			triggerElement,
			content,
			styles = '',
			position = 'below',
			offset = { x: 0, y: 0 },
			onClose,
			width = 'auto',
			zIndex = 9999,
			id = this.generateId(),
			className = 'scib-global-element',
			closeOnOutsideClick = true,
			preventOverflow = true,
			ariaLabel,
			ariaLabelledBy,
			ariaDescribedBy,
			offsetY = 0 // Default to 0 if not provided
		} = config;

		// Remove an existing element with the same ID if it exists
		if (this.activeElements.has(id)) {
			this.removeElement(id);
		}

		// Create container for the element
		const container = document.createElement('div');
		container.id = id;
		container.className = className;

		// Add accessibility attributes
		if (ariaLabel) container.setAttribute('aria-label', ariaLabel);
		if (ariaLabelledBy) container.setAttribute('aria-labelledby', ariaLabelledBy);
		if (ariaDescribedBy) container.setAttribute('aria-describedby', ariaDescribedBy);
		container.setAttribute('role', 'dialog');

		// Set initial styles
		Object.assign(container.style, {
			position: 'absolute',
			width: width,
			zIndex: zIndex.toString(),
			boxSizing: 'border-box'
		});

		// Add custom styles if provided
		if (styles) {
			const styleElement = document.createElement('style');
			styleElement.textContent = styles;
			container.appendChild(styleElement);
		}

		// Get position of the trigger element
		const triggerRect = triggerElement.getBoundingClientRect();

		// Add the element to the body
		document.body.appendChild(container);

		// Render content inside the container
		if (typeof content === 'string') {
			container.innerHTML = content;
		} else if (content instanceof HTMLElement) {
			container.appendChild(content);
		}

		// Position the element with potential offsetY
		const calculatedPosition = this.calculatePosition(triggerRect, container, position, offset, preventOverflow, offsetY);
		Object.assign(container.style, calculatedPosition);

		// Use a MutationObserver to observe content changes and adjust position if necessary
		const observer = new MutationObserver(() => {
			const newPosition = this.calculatePosition(triggerRect, container, position, offset, preventOverflow, offsetY);
			Object.assign(container.style, newPosition);
		});

		observer.observe(container, { childList: true, subtree: true });

		// Handle outside click to close the element if configured
		if (closeOnOutsideClick) {
			const handleOutsideClick = (event: MouseEvent) => {
				if (!container.contains(event.target as Node) && !triggerElement.contains(event.target as Node)) {
					this.removeElement(id);
					if (onClose) onClose();
					document.removeEventListener('click', handleOutsideClick);
				}
			};

			// Add click listener with a small delay to avoid immediate firing
			setTimeout(() => {
				document.addEventListener('click', handleOutsideClick);
			}, 10);
		}

		// Register the element in our active elements map
		this.activeElements.set(id, container);

		// Return the ID of the element for future reference
		return id;
	}

	/**
	 * Removes a specific global element by ID
	 * @param id ID of the element to remove
	 * @returns true if the element was successfully removed, false otherwise
	 */
	public static removeElement(id: string): boolean {
		const element = this.activeElements.get(id);
		if (element) {
			// If there is an element with this ID, remove it from the DOM and our registry
			document.body.removeChild(element);
			this.activeElements.delete(id);
			return true;
		}
		return false;
	}

	/**
	 * Removes all active global elements
	 */
	public static removeAllElements(): void {
		this.activeElements.forEach((element, id) => {
			this.removeElement(id);
		});
	}

	/**
	 * Updates the position of an existing element
	 * @param id ID of the existing element
	 * @param config Partial configuration with new settings
	 * @returns true if the element was successfully updated, false otherwise
	 */
	public static updateElementPosition(id: string, config: Partial<GlobalPortalElementConfig>): boolean {
		const element = this.activeElements.get(id);
		if (!element) return false;

		const { triggerElement, position, offset, preventOverflow = true, offsetY = 0 } = config;
		if (!triggerElement) return false;

		const triggerRect = triggerElement.getBoundingClientRect();
		const newPosition = this.calculatePosition(triggerRect, element, position || 'below', offset || { x: 0, y: 0 }, preventOverflow, offsetY);

		Object.assign(element.style, newPosition);

		return true;
	}

	/**
	 * Calculates the position for the element based on the trigger element
	 * @private
	 */
	private static calculatePosition(
		triggerRect: DOMRect | null,
		element: HTMLElement,
		position: 'below' | 'above' | 'left' | 'right' = 'below',
		offset: GlobalPortalElementOffset = { x: 0, y: 0 },
		preventOverflow: boolean = true,
		offsetY: number = 0
	): GlobalPortalElementPosition {
		// Default safe position in case triggerRect is null or not a valid DOMRect
		if (!triggerRect || typeof triggerRect !== 'object') {
			return {
				top: `${offset.y + offsetY}px`,
				left: `${offset.x}px`
			};
		}

		const elementRect = element.getBoundingClientRect();
		const scrollY = window.scrollY || window.pageYOffset || 0;
		const scrollX = window.scrollX || window.pageXOffset || 0;

		let top = 0;
		let left = 0;

		// More robust checking for triggerRect properties
		// Verificamos que cada propiedad sea un número válido
		const triggerTop = typeof triggerRect.top === 'number' && !isNaN(triggerRect.top) ? triggerRect.top : 0;
		const triggerBottom = typeof triggerRect.bottom === 'number' && !isNaN(triggerRect.bottom) ? triggerRect.bottom : triggerTop;
		const triggerLeft = typeof triggerRect.left === 'number' && !isNaN(triggerRect.left) ? triggerRect.left : 0;
		const triggerRight = typeof triggerRect.right === 'number' && !isNaN(triggerRect.right) ? triggerRect.right : triggerLeft;

		// Medidas de seguridad adicionales para elementRect
		const elementHeight = elementRect && typeof elementRect.height === 'number' && !isNaN(elementRect.height) ? elementRect.height : 0;
		const elementWidth = elementRect && typeof elementRect.width === 'number' && !isNaN(elementRect.width) ? elementRect.width : 0;

		switch (position) {
			case 'below':
				top = triggerBottom + offset.y + scrollY + offsetY;
				left = triggerLeft + offset.x + scrollX;
				break;
			case 'above':
				top = triggerTop - elementHeight - offset.y + scrollY - offsetY;
				left = triggerLeft + offset.x + scrollX;
				break;
			case 'left':
				top = triggerTop + offset.y + scrollY + offsetY;
				left = triggerLeft - elementWidth - offset.x + scrollX;
				break;
			case 'right':
				top = triggerTop + offset.y + scrollY + offsetY;
				left = triggerRight + offset.x + scrollX;
				break;
		}

		if (preventOverflow) {
			// Ensure the element does not overflow the viewport
			const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;
			const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;

			// Adjust if the element overflows the right edge
			if (left + elementWidth > viewportWidth) {
				left = viewportWidth - elementWidth - 5;
			}

			// Adjust if the element overflows the bottom edge
			if (top + elementHeight > viewportHeight + scrollY) {
				top = triggerTop - elementHeight + scrollY;
			}

			// Ensure the element does not overflow the left or top edges
			left = Math.max(5, left);
			top = Math.max(5, top);
		}

		return {
			top: `${top}px`,
			left: `${left}px`
		};
	}

	/**
	 * Generates a unique ID for elements
	 * @private
	 */
	private static generateId(): string {
		return `global-element-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
	}
}
