import { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";

import { Persons } from "./Persons.jsx";
import "./App.css";

const ALL_PERSONS = gql`
  query {
    allPersons {
      id
      name
      phone
      address {
        city
        street
      }
    }
  }
`;

function App() {
  const { data, error, loading } = useQuery(ALL_PERSONS);

  if (error) return <span style="color: red">{error}</span>;
  return (
    <>
      <div>
        <h1>Persons</h1>
      </div>

      <ul>
        {loading ? <p>Loading ... </p> : <Persons persons={data?.allPersons} />}
      </ul>
    </>
  );
}

export default App;
