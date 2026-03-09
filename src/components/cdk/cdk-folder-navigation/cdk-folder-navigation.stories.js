import { getStoryConfig, parseBoolean, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Folder Navigation',
	...getStoryConfig('scib-cdk-folder-navigation')
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-cdk-folder-navigation
		literals='${parseObject(args.literals)}'
		columns='${args.columns}'
		loading='${parseBoolean(args.loading)}'
		emptyState='${parseBoolean(args.emptyState)}'
		folder='${parseObject(args.folder)}'
	></scib-cdk-folder-navigation>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	// Add default values here
	literals:{
		mainTitle: "Esta carpeta está vacía.",
		desc: "Consulta con un administrador en caso de ser un error."
	},
	columns: 2,
	loading: true,
	emptyState: false,
	folder: {
		"idFolder": "1",
		"nameFolder": "Apps",
		"subFolders": [
		  {
			"idFolder": "2",
			"nameFolder": "Graphio",
			"subFolders": [
			  {
				"idFolder": "3",
				"nameFolder": "Folder1",
				"subFolders": [
				  {
					"idFolder": "4",
					"nameFolder": "Folder 2",
					"subFolders": [
					  {
						"idFolder": "5",
						"nameFolder": "Folder 3",
						"subFolders": [],
						"templates": []
					  },
					  {
						"idFolder": "6",
						"nameFolder": "Folder 4",
						"subFolders": [],
						"templates": [{
							"createDateTime":"1",
							"is21CFRPart11":"1",
							"ownerName":"1",
							"recipientsUri":"1",
							"senderCompany":"1",
							"senderEmail":"1",
							"senderName":"1",
							"status":"1",
							"subject":"Basic Template 1",
							"templateId":"1",
							"templateUri":"1",
						},
						{
							"createDateTime":"1",
							"is21CFRPart11":"1",
							"ownerName":"1",
							"recipientsUri":"1",
							"senderCompany":"1",
							"senderEmail":"1",
							"senderName":"1",
							"status":"1",
							"subject":"Basic Template 2",
							"templateId":"1",
							"templateUri":"1",
						}]
					  },
					],
					"templates": ["template 3", "template 4"]
				  }
				],
				"templates": null
			  },
			  {
				"idFolder": "6",
				"nameFolder": "Folder7",
				"subFolders": [],
				"templates": ["template 1", "template 2"]
			  },
			  {
				"idFolder": "9",
				"nameFolder": "Folder8",
				"subFolders": [],
				"templates": []
			  },
			  {
				"idFolder": "10",
				"nameFolder": "Folder9",
				"subFolders": null,
				"templates": null
			  },
			],
			"templates": null
		  },
		  {
			"idFolder": "10",
			"nameFolder": "Ibor",
			"subFolders": null,
			"templates": null
		  }
		],
		"templates": null
	  },

};
