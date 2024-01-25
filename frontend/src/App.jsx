import { Persons } from "./Persons.jsx";
import { PersonForm } from "./PersonForm.jsx";
import { PhoneForm } from "./PhoneForm.jsx";
import { usePersons } from "./persons ( for larger projects )/custom-hooks.js";
import { Notify } from "./Notify.jsx";
import LoginForm from "./LoginForm.jsx";
import "./App.css";
import { useState } from "react";
import { useApolloClient } from "@apollo/client";

function App() {
  const { data, loading, error } = usePersons();

  const [errorMessage, setErrorMessage] = useState(null);

  const [token, setToken] = useState(() => localStorage.getItem("user-token"));

  const client = useApolloClient();

  if (error) return <span style="color: red">{error}</span>;

  const notifyError = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), 5000);
  };

  const logOut = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  return (
    <>
      <div>
        <h1>Persons</h1>
      </div>

      <ul>
        {loading ? <p>Loading ... </p> : <Persons persons={data?.allPersons} />}
      </ul>

      {token ? (
        <>
          <button onClick={logOut}>Log Out</button>
          <PersonForm notifyError={notifyError} />
          <Notify errorMessage={errorMessage} />

          <PhoneForm notifyError={notifyError} />
          <Notify errorMessage={errorMessage} />
        </>
      ) : (
        <>
          <LoginForm notifyError={notifyError} setToken={setToken} />
          <Notify errorMessage={errorMessage} />
        </>
      )}
    </>
  );
}

export default App;
