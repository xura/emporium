import { Observable } from 'graphql-typed-client'

export interface Query {
  entities: Entity[]
  entitiesByType: Entity[]
  __typename: 'Query'
}

export interface Entity {
  _id: ID
  Type: Float
  Fields: JSON
  DateCreated: DateTime
  DateUpdated: DateTime
  __typename: 'Entity'
}

/** The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID. */
export type ID = string

/** The `Float` scalar type represents signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point). */
export type Float = number

/** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
export type JSON = any

/** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
export type DateTime = any

export interface Mutation {
  createEntity: Entity
  __typename: 'Mutation'
}

/** The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text. */
export type String = string

/** The `Boolean` scalar type represents `true` or `false`. */
export type Boolean = boolean

export interface QueryRequest {
  entities?: EntityRequest
  entitiesByType?: [{ Type: Float }, EntityRequest]
  __typename?: boolean | number
  __scalar?: boolean | number
}

export interface EntityRequest {
  _id?: boolean | number
  Type?: boolean | number
  Fields?: boolean | number
  DateCreated?: boolean | number
  DateUpdated?: boolean | number
  __typename?: boolean | number
  __scalar?: boolean | number
}

export interface MutationRequest {
  createEntity?: [{ input: EntityInput }, EntityRequest]
  __typename?: boolean | number
  __scalar?: boolean | number
}

export interface EntityInput {
  Type: Float
  Fields: JSON
  DateCreated: DateTime
  DateUpdated: DateTime
}

const Query_possibleTypes = ['Query']
export const isQuery = (obj: { __typename: String }): obj is Query => {
  if (!obj.__typename) throw new Error('__typename is missing')
  return Query_possibleTypes.includes(obj.__typename)
}

const Entity_possibleTypes = ['Entity']
export const isEntity = (obj: { __typename: String }): obj is Entity => {
  if (!obj.__typename) throw new Error('__typename is missing')
  return Entity_possibleTypes.includes(obj.__typename)
}

const Mutation_possibleTypes = ['Mutation']
export const isMutation = (obj: { __typename: String }): obj is Mutation => {
  if (!obj.__typename) throw new Error('__typename is missing')
  return Mutation_possibleTypes.includes(obj.__typename)
}

export interface QueryPromiseChain {
  entities: { execute: (request: EntityRequest, defaultValue?: Entity[]) => Promise<Entity[]> }
  entitiesByType: (args: {
    Type: Float
  }) => { execute: (request: EntityRequest, defaultValue?: Entity[]) => Promise<Entity[]> }
}

export interface QueryObservableChain {
  entities: { execute: (request: EntityRequest, defaultValue?: Entity[]) => Observable<Entity[]> }
  entitiesByType: (args: {
    Type: Float
  }) => { execute: (request: EntityRequest, defaultValue?: Entity[]) => Observable<Entity[]> }
}

export interface EntityPromiseChain {
  _id: { execute: (request?: boolean | number, defaultValue?: ID) => Promise<ID> }
  Type: { execute: (request?: boolean | number, defaultValue?: Float) => Promise<Float> }
  Fields: { execute: (request?: boolean | number, defaultValue?: JSON) => Promise<JSON> }
  DateCreated: { execute: (request?: boolean | number, defaultValue?: DateTime) => Promise<DateTime> }
  DateUpdated: { execute: (request?: boolean | number, defaultValue?: DateTime) => Promise<DateTime> }
}

export interface EntityObservableChain {
  _id: { execute: (request?: boolean | number, defaultValue?: ID) => Observable<ID> }
  Type: { execute: (request?: boolean | number, defaultValue?: Float) => Observable<Float> }
  Fields: { execute: (request?: boolean | number, defaultValue?: JSON) => Observable<JSON> }
  DateCreated: { execute: (request?: boolean | number, defaultValue?: DateTime) => Observable<DateTime> }
  DateUpdated: { execute: (request?: boolean | number, defaultValue?: DateTime) => Observable<DateTime> }
}

export interface MutationPromiseChain {
  createEntity: (args: {
    input: EntityInput
  }) => EntityPromiseChain & { execute: (request: EntityRequest, defaultValue?: Entity) => Promise<Entity> }
}

export interface MutationObservableChain {
  createEntity: (args: {
    input: EntityInput
  }) => EntityObservableChain & { execute: (request: EntityRequest, defaultValue?: Entity) => Observable<Entity> }
}
