import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [message,setMessage] = useState('');

  useEffect(() => {
    axios
      .get(' http://127.0.0.1:8000/api/test-local/')
      .then((response) => {
        setMessage(response.data.payload);
        console.log(message);
      })
      .catch((err) => {
        console.error('error', err);
      });
  }, []);

  return (
    <>
      <div>{message}</div>
    </>
  );
}

export default App;
