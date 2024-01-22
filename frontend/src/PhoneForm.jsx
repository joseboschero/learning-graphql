import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { EDIT_NUMBER } from "./persons ( for larger projects )/graphql-mutations";

export const PhoneForm = ({ notifyError }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [editNumber, result] = useMutation(EDIT_NUMBER);

  useEffect(() => {
    if (result.data /* || result.data.editNumber === null */) {
      notifyError("Person not found");
    }
  }, [result.data]);

  const handleSubmit = (e) => {
    e.preventDefault();

    editNumber({ variables: { name, phone } });

    setName("");
    setPhone("");
  };

  return (
    <div>
      <h2>Edit person phone number</h2>
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
        <button>Change phone</button>
      </form>
    </div>
  );
};
