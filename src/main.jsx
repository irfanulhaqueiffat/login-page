import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import useFetch from './assets/useFetch.js';

const Home = () => {
  const [data] = useFetch('https://api.freeapi.app/api/v1/users/register');

  return (
    <>
      {data &&
        data.map((item) => {
          return <p key={item.id}>{item.title}</p>;
        })}
    </>
  );
};
createRoot(document.getElementById('root')).render(

  <StrictMode>
    <App />
  </StrictMode>,
)
