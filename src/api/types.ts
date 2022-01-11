export type Authentication = {
    principal: string
}

export type Config = { __TYPE__: "Config" }

export interface RealmDefinition {
    realm: string,
    username: string,
    password: string,
    tags: string[],
    id: string,
    persisted: boolean
}
