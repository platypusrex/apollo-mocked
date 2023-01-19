export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Dog = {
  __typename?: 'Dog';
  breed: Scalars['String'];
  name: Scalars['String'];
};

export type Human = {
  __typename?: 'Human';
  age: Scalars['Int'];
  name: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  dog?: Maybe<Dog>;
  human?: Maybe<Human>;
};

export type DogFragment = { __typename?: 'Dog'; name?: string; breed: string };

export type DogQueryVariables = Exact<{
  includeName?: InputMaybe<Scalars['Boolean']>;
}>;

export type DogQuery = {
  __typename?: 'Query';
  dog?: { __typename?: 'Dog'; name?: string; breed: string } | null;
};

export type HumanQueryVariables = Exact<{ [key: string]: never }>;

export type HumanQuery = {
  __typename?: 'Query';
  human?: { __typename?: 'Human'; name: string; age: number } | null;
};
