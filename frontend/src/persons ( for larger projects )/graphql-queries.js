import { gql } from "@apollo/client";

export const ALL_PERSONS = gql`
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

export const FIND_PERSON = gql`
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
