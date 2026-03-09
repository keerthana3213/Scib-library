export interface ICDKVdrPreviewLiterals {
	activeVDR: string;
	activeTopic: string;
	recentActivity: string;
	errorTitle: string;
	errorDesc: string;
}

export interface ICDKVdrPreviewData {
	activeVDR: string | number;
	activeTopic: string | number;
	recentVDR: Array<{ title: string; url?: string }>;
	loadingImgSrc: string;
}
