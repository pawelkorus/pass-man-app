import { render, screen } from "@testing-library/react";
import  RealmList from "../../src/ui/RealmList"
import React from 'react';
import { RealmDefinition } from '../../src/api'

it("should render empty RealmList", () => {

    const realms:RealmDefinition[] = []

    const result = render(<RealmList items={realms}></RealmList>)
    
    expect(result).toMatchSnapshot()
})

it("should render RealmList", () => {
    const realms:RealmDefinition[] = [
        { realm: "realm1", username: "username1", password: "password1", tags: [], id: "id1", persisted: true }
        ,{ realm: "realm2", username: "username2", password: "password2", tags: [], id: "id2", persisted: true }
        ,{ realm: "realm3", username: "username3", password: "password3", tags: [], id: "id3", persisted: false }
    ]

    const result = render(<RealmList items={realms}></RealmList>)

    expect(result).toMatchSnapshot()
})

it("should render realm as link if it seems to be an url", () => {
    const realms:RealmDefinition[] = [
        { realm: "https://realm1", username: "username1", password: "password1", tags: [], id: "id1", persisted: true }
        ,{ realm: "http://realm2", username: "username2", password: "password2", tags: [], id: "id2", persisted: true }
        ,{ realm: "realm3", username: "username3", password: "password3", tags: [], id: "id3", persisted: false }
    ]

    const result = render(<RealmList items={realms}></RealmList>)

    expect(result).toMatchSnapshot()
})
