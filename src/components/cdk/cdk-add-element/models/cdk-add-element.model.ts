export interface ICDKAddElement {
	/**Title literal*/
	title: string;

	/**Sub title literal **/
	subtitle: string;

	/**Description literal*/
	description: string;

	/**Image src literal*/
	image: string;

	/**Image alt */
	imageAlt: string;

	/**Literals */
	[key: string]: string;
}
