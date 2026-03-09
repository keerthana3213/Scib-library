import { createNodeLogger, createNodeSys } from '@stencil/core/sys/node';
import { createCompiler, loadConfig } from '@stencil/core/compiler';
import { config } from '../stencil.config';

(async () => {
	try {
		const logger = createNodeLogger(process as any);
		const sys = createNodeSys(process as any);
		const validated = await loadConfig({
			logger,
			sys,
			config
		});
		const compiler = await createCompiler(validated.config);
		await compiler.build();
		process.exit(0);
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
})();
