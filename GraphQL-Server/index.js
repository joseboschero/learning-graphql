import { ApolloServer, gql, UserInputError } from "apollo-server";

import { v1 as uuid } from "uuid";

import axios from "axios";

const persons = [
  {
    name: "Joselito",
    phone: "54-3541370188",
    street: "cast 103",
    city: "VCP",
    id: "1",
  },
  {
    name: "Messi",
    phone: "54-3541345222",
    street: "Miami 223",
    city: "Miami",
    id: "2",
  },
  {
    name: "Tryndamere",
    street: "Toplane",
    city: "La grieta del invocador",
    id: "3",
  },
];

const typeDefs = gql`
  enum YesNo {
    YES
    NO
  }

  type Address {
    street: String!
    city: String!
  }

  type Person {
    name: String!
    phone: String
    address: Address!
    id: ID!
  }

  type Query {
    personCount: Int!
    allPersons(phone: YesNo): [Person]!
    findPerson(name: String!): Person
  }

  type Mutation {
    addPerson(
      name: String!
      phone: String
      street: String!
      city: String!
    ): Person
    editPhone(name: String!, phone: String!): Person
  }
`;

const resolvers = {
  Query: {
    personCount: async () => {
      const { data: personsFromApi } = await axios.get(
        "http://localhost:3000/persons"
      );
      return personsFromApi.length;
    },
    allPersons: async (root, args) => {
      const { data: personsFromApi } = await axios.get(
        "http://localhost:3000/persons"
      );

      if (!args.phone) return personsFromApi;

      const byPhone = (person) =>
        args.phone === "YES" ? person.phone : !person.phone;

      return personsFromApi.filter(byPhone);
    },
    findPerson: async (root, args) => {
      const { name } = args;

      const { data: personsFromApi } = await axios.get(
        "http://localhost:3000/persons"
      );

      return personsFromApi.find((person) => person.name === name);
    },
  },
  Mutation: {
    addPerson: async (root, args) => {
      const { name, phone, street, city } = args;

      const { data: personsFromApi } = await axios.get(
        "http://localhost:3000/persons"
      );

      if (personsFromApi.find((p) => p.name === name)) {
        throw new UserInputError("Name must be unique", {
          invalidArgs: args.name,
        });
      }

      const newPerson = { name, phone, street, city, id: uuid() };
      await axios.post("http://localhost:3000/persons", newPerson);

      return newPerson;
    },
    editPhone: async (root, args) => {
      const { name, phone } = args;

      const { data: personsFromApi } = await axios.get(
        "http://localhost:3000/persons"
      );

      const person = personsFromApi.find((p) => p.name === name);

      if (!person) return null;

      const updatedPerson = { ...person, phone };

      await axios.put(
        `http://localhost:3000/persons/${person.id}`,
        updatedPerson
      );

      return updatedPerson;
    },
  },
  Person: {
    address: (root) => {
      return {
        street: root.street,
        city: root.city,
      };
    },
  },
};

const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
