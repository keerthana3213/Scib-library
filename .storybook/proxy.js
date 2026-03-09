const { createProxyMiddleware } = require('http-proxy-middleware');
const jsonfile = require('jsonfile');
const fetch = require('node-fetch');
const express = require('express');
const dotenv = require('dotenv');
const open = require('open');
const path = require('path');
const _ = require('lodash');

const configEnv = dotenv.config().parsed;

const proxyConfig = jsonfile.readFileSync(path.join(__dirname, './config/proxy.conf.json'));
const { customConfig } = jsonfile.readFileSync(path.join(__dirname, '../package.json'));
const newUniversalCookie = configEnv.NEW_UNIVERSAL_COOKIE;
const proxyTarget = configEnv.PROXY_TARGET;
const browserPort = 4300;

const launchProxy = async () => {
	const app = express();
	const storybookPort = customConfig.storybook.port;
	const stencilPort = customConfig.stencil.port;

	/**
	 * Stencil ws server proxy
	 */
	app.use(
		'/~dev-server',
		createProxyMiddleware({
			target: `http://0.0.0.0:${stencilPort}`,
			changeOrigin: true,
			logLevel: 'silent',
			ws: true
		})
	);

	/**
	 * Stencil server proxy
	 */
	app.use(
		'/stencil-server-assets/*',
		createProxyMiddleware({
			target: `http://0.0.0.0:${stencilPort}`,
			changeOrigin: true,
			logLevel: 'silent',
			pathRewrite: {
				'^/stencil-server-assets': '/assets'
			}
		})
	);

	app.use(
		'/stencil-server/*',
		createProxyMiddleware({
			target: `http://0.0.0.0:${stencilPort}`,
			changeOrigin: true,
			logLevel: 'silent',
			pathRewrite: {
				'^/stencil-server': '/build'
			}
		})
	);

	/**
	 * Stencil tailwind proxy
	 */

	app.use(
		'/assets/lib/*',
		createProxyMiddleware({
			target: `http://0.0.0.0:${storybookPort}`,
			changeOrigin: true,
			logLevel: 'silent',
			pathRewrite: {
				'^/assets/lib': '/assets/lib'
			}
		})
	);

	/**
	 * Reverse custom proxy
	 */
	try {
		await Promise.all(
			_.get(proxyConfig, 'contexts', []).map(({ context }) => {
				return app.use(
					context,
					createProxyMiddleware({
						target: proxyTarget || _.get(proxyConfig, 'target', ''),
						changeOrigin: true,
						logLevel: 'silent',
						secure: false,
						pathRewrite: {
							[`^${context}`]: context
						},
						onProxyReq: (proxyReq) => {
							if (newUniversalCookie) {
								proxyReq.setHeader('Cookie', `NewUniversalCookie=${newUniversalCookie}`);
							}
						}
					})
				);
			})
		);
	} catch (error) {
		console.warn(error);
	}

	/**
	 * Storybook iframe listener
	 */
	app.use(/\/iframe\.html\?*/, async (req, res) => {
		let html = await fetch(`http://0.0.0.0:${storybookPort}/iframe.html${req.url.replace('/', '')}`).then((res) => res.text());
		html = html.replace('</body>', `<iframe src="/~dev-server" style="display: block; width: 0; height: 0; border: 0;"></iframe></body>`);
		res.type('html').send(html);
	});

	/**
	 * Storybook server proxy
	 */
	app.use(
		'/',
		createProxyMiddleware({
			target: `http://0.0.0.0:${storybookPort}`,
			logLevel: 'silent'
		})
	);

	return app;
};

launchProxy()
	.then((_app) => _app.listen({ port: browserPort }, () => open(`http://localhost:${browserPort}`)))
	.catch(console.log);
