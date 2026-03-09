export type SkeletonTypes =
	| 'default'
	| 'table'
	| 'advancedTable'
	| 'advancedTableWhitelabel'
	| 'optimizedTable'
	| 'subheaderComms'
	| 'card'
	| 'list'
	| 'onboardingPercentage'
	| 'notification';

export interface SkeletonImageBreakpoints {
	default: string;
	md?: string;
	sm?: string;
}

export interface Skeleton {
	[key: string]: SkeletonImageBreakpoints;
}

export const skeletonImages: Skeleton = {
	default: {
		default: 'skeleton-default.svg'
	},
	table: {
		default: 'table-desktop.svg',
		md: 'table-desktop.svg',
		sm: 'table-desktop.svg'
	},
	advancedTable: {
		default: 'skeleton_table-m.svg',
		md: 'skeleton_table-m.svg',
		sm: 'skeleton_table-m.svg'
	},
	advancedTableWhitelabel: {
		default: 'skeleton_table_whitelabel-m.svg',
		md: 'skeleton_table_whitelabel-m.svg',
		sm: 'skeleton_table_whitelabel-m.svg'
	},
	optimizedTable: {
		default: 'skeleton_table-m.svg',
		md: 'skeleton_table-m.svg',
		sm: 'skeleton_table-m.svg'
	},
	subheaderComms: {
		default: 'single-skeleton.svg',
		md: 'single-skeleton.svg',
		sm: 'single-skeleton.svg'
	},
	card: {
		default: 'card-skeleton.svg',
		md: 'card-skeleton.svg',
		sm: 'card-skeleton.svg'
	},
	notification: {
		default: 'skeleton-notifications.svg',
		md: 'skeleton-notifications.svg',
		sm: 'skeleton-notifications.svg'
	},
	list: {
		default: 'list-skeleton.svg',
		md: 'list-skeleton.svg',
		sm: 'list-skeleton.svg'
	},
	onboardingPercentage: {
		default: 'onboarding-percentage-skeleton.svg',
		md: 'onboarding-percentage-skeleton.svg',
		sm: 'onboarding-percentage-skeleton.svg'
	}
};
