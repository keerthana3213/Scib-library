export interface PaginationEvent {
	currentPage: number;
	itemsPerPage: number;
	tableUuid?: string;
}

export type PaginationLanguages = 'en' | 'es';

export type PaginatorVariants = 'standard' | 'advanced';
