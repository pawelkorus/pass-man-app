export type Authentication = { __TYPE__: "Authentication" }

export type Config = { __TYPE__: "Config" }

export interface RealmDefinition {
    realm: string,
    username: string,
    password: string,
    tags: string[],
    id: string,
    persisted: boolean
}
