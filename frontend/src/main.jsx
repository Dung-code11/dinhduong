import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'aos/dist/aos.css'
import Aos from 'aos'
import './css/LoginPage.module.css'
import App from './App.jsx'
import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";

Aos.init();
// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
// ReactDOM.createRoot(document.getElementById("root")).render(
//   <GoogleOAuthProvider clientId="818083105662-t6l4764b8ikkn78a5o4kho6unrvqop11.apps.googleusercontent.com">
//     <App />
//   </GoogleOAuthProvider>
// );
const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <StrictMode>
    <GoogleOAuthProvider clientId="818083105662-t6l4764b8ikkn78a5o4kho6unrvqop11.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);