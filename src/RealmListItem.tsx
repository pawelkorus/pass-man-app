import React from 'react'
import { Badge, Button, FormControl, ButtonGroup, Col, Row } from 'react-bootstrap'
import { RealmDefinition, useEncryption } from './api'
import { RealmTagsInput } from './RealmTagsInput'

type Props = {
    item: RealmDefinition

    onItemChanged?:(item:RealmDefinition) => void,
    onItemRemoved?:(item:RealmDefinition) => void
}

type FormData = {
    id: string,
    realm: string,
    username: string,
    password: string,
    tags: string[]
}

export default (props:Props):JSX.Element => {
    const textEncoder = new TextEncoder()
    const textDecoder = new TextDecoder()
    const encryptionContext = useEncryption()
    var [editEnabled, setEditEnabled] = React.useState(false)
    var [editData, setEditData] = React.useState<RealmDefinition | undefined>(undefined)
    var [realm, setRealm] = React.useState<String | undefined>(undefined)
    var [formData, setFormData] = React.useState<FormData | undefined>(undefined)

    // function handleItemChanged(field: keyof RealmDefinition, item:RealmDefinition, newValue:string|string[]) {
    //     if(field == 'tags') {
    //         item[field] = newValue as string[]
    //     } else if(field == 'persisted') {
    //         // skip
    //     } else {
    //         item[field] = newValue as string
    //     }
    // }
    function handleItemChanged(field: keyof FormData, item:FormData, newValue:string|string[]) {

    }

    function handleEnableEdit() {
        // setEditData(decrypt(props.item))
        setRealm(props.item.realm)
        
        setEditEnabled(true)
    }

    function handleSaveItem(item:RealmDefinition) {
        setEditEnabled(false)
        // Promise.resolve(item)
        //     .then((v : RealmDefinition) => {
        //         return Promise.all(
                    
        //         )
        //     })
        props?.onItemChanged(encrypt(editData))
    }

    function strToUint8(data:string) {
        return textEncoder.encode(data)
    }

    function uint8ToStr(data:Uint8Array) {
        return textDecoder.decode(data)
    }

    function decrypt(source:RealmDefinition) {
        return {
            id: source.id,
            persisted: source.persisted,
            realm: source.realm,
            // username: uint8ToStr(encryptionContext.actions.decrypt(strToUint8(source.username))),
            // password: uint8ToStr(encryptionContext.actions.decrypt(strToUint8(source.password))),
            username: source.username,
            password: source.password,
            tags: [].concat(source.tags)
        }
    }

    function encrypt(source:RealmDefinition) {
        return {
            id: source.id,
            persisted: source.persisted,
            realm: source.realm,
            // username: uint8ToStr(encryptionContext.actions.encrypt(strToUint8(source.username))),
            // password: uint8ToStr(encryptionContext.actions.encrypt(strToUint8(source.password))),
            username: source.username,
            password: source.password,
            tags: [].concat(source.tags)
        }
    }
 
    return (
<Row className="align-items-center border-bottom pt-2 pb-2">
    <Col xs="3" className="text-break">
    {editEnabled?
        <FormControl 
            defaultValue={formData.realm}
            onBlur={(e:React.FocusEvent<HTMLInputElement>) => handleItemChanged("realm", formData, e.target.value)}></FormControl>
        : realm
    }
    </Col>
    <Col className="text-break">
    {editEnabled?
        <FormControl 
            defaultValue={formData.username}
            onBlur={(e:React.FocusEvent<HTMLInputElement>) => handleItemChanged("username", formData, e.target.value)}></FormControl>
        : props.item.username
    }
    </Col>
    <Col className="text-break">
    {editEnabled?
        <FormControl 
            defaultValue={formData.password}
            onBlur={(e:React.FocusEvent<HTMLInputElement>) => handleItemChanged("password", formData, e.target.value)}></FormControl>
        : props.item.password
    }
    </Col>
    <Col xs="3" className="text-break">
    {editEnabled?
        <RealmTagsInput
            id={"tags-field-" + formData.id}
            tags={formData.tags}
            onChange={handleItemChanged.bind(this, "tags", formData)}
        />
        : <div>
            {props.item.tags.map(t => <Badge key={t} className="mx-1" bg="info">{t}</Badge>)
            }
        </div>
    }
    </Col>
    <Col sm="auto">
        <ButtonGroup>
            { editEnabled?
                <Button onClick={e => { handleSaveItem(props.item) }}><i className="fas fa-save"></i></Button>
                : <Button onClick={handleEnableEdit}><i className="fas fa-edit"></i></Button>
            }
            <Button variant="danger" onClick={e => { props?.onItemRemoved(props.item); } }>
                <i className="fas fa-trash-alt"></i>
            </Button>
        </ButtonGroup>
    </Col>
</Row>
    )
}
