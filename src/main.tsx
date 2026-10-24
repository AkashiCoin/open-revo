import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import OsdOverlay from './components/OsdOverlay';
import { WidgetHost } from './components/WidgetHost';
import './index.css';

const params = new URLSearchParams(window.location.search);
const injectedWidgetId = (window as any).__OPENREVO_WIDGET_ID__ as string | undefined;
const isOsd = !!(window as any).__OPENREVO_OSD_WINDOW__ || params.get('window') === 'osd' || window.location.hash === '#/osd';
const isWidget = !!injectedWidgetId || params.get('window') === 'widget' || window.location.hash.startsWith('#/widget');
const widgetId = injectedWidgetId || params.get('id') || (window.location.hash.split('/')[2] ?? 'core');

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {isOsd ? (
      <OsdOverlay />
    ) : isWidget ? (
      <WidgetHost pluginId={widgetId} />
    ) : (
      <App />
    )}
  </React.StrictMode>,
);

