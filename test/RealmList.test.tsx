import { unmountComponentAtNode } from 'react-dom'
import { render, screen } from "@testing-library/react";
import RealmList from "../src/RealmList"
import React from 'react';
import { RealmDefinition } from '../src/api'

it("should render empty RealmList", () => {

    let realms:RealmDefinition[] = []

    let result = render(<RealmList items={realms}></RealmList>)
    
    expect(result).toMatchSnapshot()
})

it("should render RealmList", () => {
    let realms:RealmDefinition[] = [
        { realm: "realm1", username: "username1", password: "password1", tags: [], id: "id1", persisted: true }
        ,{ realm: "realm2", username: "username2", password: "password2", tags: [], id: "id2", persisted: true }
        ,{ realm: "realm3", username: "username3", password: "password3", tags: [], id: "id3", persisted: false }
    ]

    let result = render(<RealmList items={realms}></RealmList>)

    expect(result).toMatchSnapshot()
})
