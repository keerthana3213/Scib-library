export interface IECMVBreadcrumb {
	name: string;
	tooltip: string;
	active: boolean;
	position: number;
}

export interface IECMVBreadcrumbArray {
	breadcrumbArray: IECMVBreadcrumb[];
}
