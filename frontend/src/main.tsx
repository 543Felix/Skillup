// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import './index.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App from './router.tsx';
import { store } from './store/store.ts';
// import GroupVideo from './components/metting/videoChat.tsx';
// import VideoCall from './components/metting/sampleVideoCallUi.tsx';
// import MakePayment from './components/payment/stripe.tsx';
// import SampleBlurPage from './SampleComponent.tsx';
// import TextEditor from './components/metting/textEditor.tsx';
// import CodeEditor from './components/metting/CodeEditor.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <>
    <Provider store={store}>
    <ToastContainer
        autoClose={3000}
        draggable
        closeOnClick
        theme='dark'
        pauseOnHover
      />

      <App />
    </Provider>
       
    </>
  </React.StrictMode>,
);
