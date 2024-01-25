import {
  ApolloServer,
  AuthenticationError,
  gql,
  UserInputError,
} from "apollo-server";

import "./db.js";
import Person from "./models/Person.js";
import User from "./models/User.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = "learning-graphql";

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

  type User {
    username: String!
    friends: [Person]!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    personCount: Int!
    allPersons(phone: YesNo): [Person]!
    findPerson(name: String!): Person
    me: User
  }

  type Mutation {
    addPerson(
      name: String!
      phone: String
      street: String!
      city: String!
    ): Person
    editPhone(name: String!, phone: String!): Person
    createUser(username: String!): User
    login(username: String!, password: String!): Token
    addAsFriend(name: String!): User
  }
`;

const resolvers = {
  Query: {
    personCount: async () => {
      const personsLength = await Person.collection.countDocuments();
      return personsLength;
    },
    allPersons: async (root, args) => {
      if (!args.phone) {
        const persons = await Person.find({});
        return persons;
      } else {
        const persons = await Person.find({
          phone: { $exists: args.phone === "YES" },
        });
        return persons;
      }
    },
    findPerson: async (root, args) => {
      const { name } = args;

      const searchedPerson = await Person.findOne({ name });

      return searchedPerson;
    },
    me: (root, args, context) => {
      return context.currentUser;
    },
  },
  Mutation: {
    addPerson: async (root, args, context) => {
      const { currentUser } = context;

      if (!currentUser) throw new AuthenticationError("Not authenticated");

      const person = new Person({ ...args });

      try {
        await person.save();

        currentUser.friends = currentUser.friends.concat(person);

        await currentUser.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }

      return person;
    },
    editPhone: async (root, args) => {
      const person = await Person.findOne({ name: args.name });
      if (!person) return;

      person.phone = args.phone;

      try {
        await person.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }

      return person;
    },
    createUser: (root, args) => {
      const user = new User({ username: args.username });

      return user.save().catch((error) => {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "celopassword") {
        throw new UserInputError("Wrong credentials");
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return {
        value: jwt.sign(userForToken, JWT_SECRET),
      };
    },
    addAsFriend: async (root, args, context) => {
      const { currentUser } = context;
      if (!currentUser) throw new AuthenticationError("Not authenticated");

      const person = await Person.findOne({ name: args.name });

      const nonFriendAlready = (person) =>
        !currentUser.friends.map((p) => p._id).includes(person._id);

      if (nonFriendAlready(person)) {
        currentUser.friends = currentUser.friends.concat(person);
        await currentUser.save();
      } else {
        throw new Error("Already friends");
      }

      return currentUser;
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
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;

    if (auth && auth.toLowerCase().startsWith("bearer ")) {
      const token = auth.substring(7);
      const { id } = jwt.verify(token, JWT_SECRET);

      const currentUser = await User.findById(id).populate("friends");

      return { currentUser };
    }
  },
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
