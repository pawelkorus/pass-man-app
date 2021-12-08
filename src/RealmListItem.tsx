import React from 'react'
import { Badge, Button, FormControl, ButtonGroup, Col, Row } from 'react-bootstrap'
import { RealmDefinition } from './service'
import { RealmTagsInput } from './RealmTagsInput'

type Props = {
    item: RealmDefinition

    onItemChanged?:(item:RealmDefinition) => void,
    onItemRemoved?:(item:RealmDefinition) => void
}

export default (props:Props):JSX.Element => {
    var [editEnabled, setEditEnabled] = React.useState(false)

    function handleItemChanged(field: keyof RealmDefinition, item:RealmDefinition, newValue:string|string[]) {
        if(field == 'tags') {
            item[field] = newValue as string[]
        } else if(field == 'persisted') {
            // skip
        } else {
            item[field] = newValue as string
        }
        props?.onItemChanged(item)
    }

    function handleSaveItem(item:RealmDefinition) {
        setEditEnabled(false)
        props?.onItemChanged(props.item)
    }

    return (
<Row className="align-items-center border-bottom pt-2 pb-2">
    <Col xs="3" className="text-break">
    {editEnabled?
        <FormControl 
            defaultValue={props.item.realm}
            onBlur={(e:React.FocusEvent<HTMLInputElement>) => handleItemChanged("realm", props.item, e.target.value)}></FormControl>
        : props.item.realm
    }
    </Col>
    <Col className="text-break">
    {editEnabled?
        <FormControl 
            defaultValue={props.item.username}
            onBlur={(e:React.FocusEvent<HTMLInputElement>) => handleItemChanged("username", props.item, e.target.value)}></FormControl>
        : props.item.username
    }
    </Col>
    <Col className="text-break">
    {editEnabled?
        <FormControl 
            defaultValue={props.item.password}
            onBlur={(e:React.FocusEvent<HTMLInputElement>) => handleItemChanged("password", props.item, e.target.value)}></FormControl>
        : props.item.password
    }
    </Col>
    <Col xs="3" className="text-break">
    {editEnabled?
        <RealmTagsInput
            id={"tags-field-" + props.item.id}
            tags={props.item.tags}
            onChange={handleItemChanged.bind(this, "tags", props.item)}
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
                : <Button onClick={e => { setEditEnabled(true)}}><i className="fas fa-edit"></i></Button>
            }
            <Button variant="danger" onClick={e => { props?.onItemRemoved(props.item); } }>
                <i className="fas fa-trash-alt"></i>
            </Button>
        </ButtonGroup>
    </Col>
</Row>
    )
}
