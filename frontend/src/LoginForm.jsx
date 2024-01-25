import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { LOGIN } from "./login/graphql-mutations";

const LoginForm = ({ notifyError, setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      notifyError(error.graphQLErrors[0].mesage);
    },
  });

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value;

      setToken(token);

      localStorage.setItem("user-token", token);
    }
  }, [result.data]);

  const handleSubmit = (event) => {
    event.preventDefault();

    login({ variables: { username, password } });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          username{" "}
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>

        <div>
          password{" "}
          <input
            value={password}
            type="password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
