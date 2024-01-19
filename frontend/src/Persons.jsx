import { gql, useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";

const FIND_PERSON = gql`
  query findPersonByName($nameToSearch: String!) {
    findPerson(name: $nameToSearch) {
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

export const Persons = ({ persons }) => {
  const [getPerson, result] = useLazyQuery(FIND_PERSON);
  const [person, SetPerson] = useState(null);

  const showPerson = (name) => {
    getPerson({ variables: { nameToSearch: name } });
  };

  useEffect(() => {
    if (result.data) {
      SetPerson(result.data.findPerson);
    }
  }, [result]);

  if (person) {
    return (
      <div>
        <h2>
          You selected: <span>{person.name}</span>
        </h2>
        <button
          onClick={() => {
            SetPerson(null);
          }}
        >
          Close
        </button>
      </div>
    );
  }

  if (persons === null) return null;

  return (
    <>
      {persons.map((p) => (
        <li
          key={p.id}
          onClick={() => {
            showPerson(p.name);
          }}
        >
          Name: {p.name} - Phone: {p.phone} - Id: {p.id} - City:{" "}
          {p.address.city} - Street: {p.address.street}
        </li>
      ))}
    </>
  );
};
