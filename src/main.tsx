import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { BodyWidget } from './BodyWidget';
import { Application } from './Application';

document.addEventListener('DOMContentLoaded', () => {
	const root = createRoot(document.querySelector('#application'));
	const app = new Application();
	root.render(<BodyWidget app={app} />);
});