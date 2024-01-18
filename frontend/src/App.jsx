import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [persons, SetPersons] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
        query {
          allPersons {
            name
            id
            phone
            address {
              city
              street
            }
          }
        }
      `,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        SetPersons(res.data.allPersons);
      });
  }, []);

  return (
    <>
      <div>
        <h1>Persons</h1>
      </div>

      <ul>
        {persons.map((person) => (
          <li key={person.id}>
            {person.name} - {person.phone ? person.phone : "No Phone"} -
            {person.address.city} - {person.address.street}
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
