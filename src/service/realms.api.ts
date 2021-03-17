import RealmDefinition from "../RealmDefinition";
import Papa from 'papaparse'

function transform(value:string, headerName:string) {
    if(headerName == "tags") {
        return value.split(",");
    }
    return value;
}

export const fetchRealms = function(url:string):Promise<RealmDefinition[]> {
    return fetch(url)
        .then(response => response.text())
        .then(textValue => Papa.parse<RealmDefinition>(textValue, { header: true, transform: transform }).data)
}

export const pushRealms = function(realms:RealmDefinition[]):Promise<RealmDefinition[]> {
    console.log(realms);
    return Promise.resolve(realms);
}