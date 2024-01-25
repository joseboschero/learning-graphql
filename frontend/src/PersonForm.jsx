import { useMutation } from "@apollo/client";
import { useState } from "react";
import { ALL_PERSONS } from "./persons ( for larger projects )/graphql-queries";
import { CREATE_PERSON } from "./persons ( for larger projects )/graphql-mutations";

export const PersonForm = ({ notifyError }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");

  const [createPerson] = useMutation(CREATE_PERSON, {
    /* refetchQueries: [{ query: ALL_PERSONS }], */
    onError: (error) => {
      notifyError(error.graphQLErrors[0].message);
    },
    update: (store, response) => {
      const dataInStore = store.readQuery({ query: ALL_PERSONS });
      store.writeQuery({
        query: ALL_PERSONS,
        data: {
          ...dataInStore,
          allPersons: [...dataInStore.allPersons, response.data.addPerson],
        },
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    createPerson({ variables: { name, phone, street, city } });

    setName("");
    setPhone("");
    setStreet("");
    setCity("");
  };

  return (
    <div>
      <h2>Create new Person</h2>
      <form action="" onSubmit={handleSubmit}>
        <h3>Name</h3>
        <input
          type="text"
          value={name}
          onChange={(evt) => {
            setName(evt.target.value);
          }}
        />
        <h3>Phone</h3>
        <input
          type="text"
          value={phone}
          onChange={(evt) => {
            setPhone(evt.target.value);
          }}
        />
        <h3>Street</h3>
        <input
          type="text"
          value={street}
          onChange={(evt) => {
            setStreet(evt.target.value);
          }}
        />
        <h3>City</h3>
        <input
          type="text"
          value={city}
          onChange={(evt) => {
            setCity(evt.target.value);
          }}
        />
        <button>Add person</button>
      </form>
    </div>
  );
};
