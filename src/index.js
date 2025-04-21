import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '~/App';
import reportWebVitals from './reportWebVitals';
import GlobalStyles from './components/GlobalStyles/GlobalStyles';
import { ConfigProvider } from 'antd';
import viVN from 'antd/es/locale/vi_VN';
import ReactGA from 'react-ga4';

ReactGA.initialize('G-GRXHD0H7CY');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <GlobalStyles>
            <ConfigProvider locale={viVN}>
                <App />
            </ConfigProvider>
        </GlobalStyles>
    </React.StrictMode>,
);

ReactGA.send('pageview');

reportWebVitals();
