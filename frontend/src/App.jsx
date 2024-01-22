import { Persons } from "./Persons.jsx";
import { PersonForm } from "./PersonForm.jsx";
import { PhoneForm } from "./PhoneForm.jsx";
import { usePersons } from "./persons ( for larger projects )/custom-hooks.js";
import { Notify } from "./Notify.jsx";
import "./App.css";
import { useState } from "react";

function App() {
  const { data, loading, error } = usePersons();

  const [errorMessage, setErrorMessage] = useState(null);

  if (error) return <span style="color: red">{error}</span>;

  const notifyError = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), 5000);
  };

  return (
    <>
      <div>
        <h1>Persons</h1>
      </div>

      <ul>
        {loading ? <p>Loading ... </p> : <Persons persons={data?.allPersons} />}
      </ul>

      <PersonForm notifyError={notifyError} />
      <Notify errorMessage={errorMessage} />
      <PhoneForm notifyError={notifyError} />
      <Notify errorMessage={errorMessage} />
    </>
  );
}

export default App;
