// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import './index.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import App from './router.tsx';
import { store } from './store/store.ts';
// import AddSlot from './components/job/addSlotForInterview.tsx';
import DashBoard from './admin/components/dashboard.tsx';


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

      <DashBoard />
    </Provider>
       
    </>
  </React.StrictMode>,
);
