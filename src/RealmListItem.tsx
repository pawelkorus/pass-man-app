import React from 'react'
import { Badge, Button, FormControl, ButtonGroup, Col, Row } from 'react-bootstrap'
import { Typeahead } from 'react-bootstrap-typeahead'
import { RealmDefinition } from './service'

type Props = {
    item: RealmDefinition
    allTags: string[]

    onItemChanged?:(item:RealmDefinition) => void,
    onItemRemoved?:(item:RealmDefinition) => void
}

type Tag = {
    value:string
}

export default (props:Props):JSX.Element => {
    var [editEnabled, setEditEnabled] = React.useState(false)

    function handleItemChanged(field: keyof RealmDefinition, item:RealmDefinition, newValue:string) {
        if(field == 'tags') {
            return    
        } else {
            item[field] = newValue;
        }
        props?.onItemChanged(item);
    }

    function handleTagsChanged(item:RealmDefinition, items:Tag[]) {
        item.tags = items.map(obj => obj.value)
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
        <Typeahead
            id={"tags-field-" + props.item.id}
            labelKey="value"
            multiple
            defaultSelected={props.item.tags.map(v => { return {value: v}})}
            options={props.allTags.map(v => { return {value: v}})}
            placeholder="Add tag"
            allowNew
            onChange={handleTagsChanged.bind(this, props.item)}
        />
        : <div>
            {props.item.tags.map(t => <Badge key={t} className="mx-1" variant="info">{t}</Badge>)
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
