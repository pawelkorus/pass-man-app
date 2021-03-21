import React from 'react'
import { Table, Badge, Button, FormControl, ButtonGroup, Col, Row } from 'react-bootstrap'
import { Typeahead } from 'react-bootstrap-typeahead'
import { RealmDefinition } from './service'

type Props = {
    item: RealmDefinition
    allTags: Tag[]

    onItemChanged?:(item:RealmDefinition) => void,
    onItemRemoved?:(item:RealmDefinition) => void
}

type State = {
    editEnabled: boolean
}

type Tag = {
    value:string
}

export default class RealmListItem extends React.Component<Props, State> {

    constructor(props:Props) {
        super(props)

        this.state = {
            editEnabled: false
        }
    }
    
    handleOnInputFocusLost(field: keyof RealmDefinition, item:RealmDefinition, e:React.FocusEvent<HTMLInputElement>) {
        e.preventDefault();
        e.target.readOnly = true;
        
        let newValue = e.target.value;
        if(field == 'tags') {
            return    
        } else {
            item[field] = newValue;
        }
        if(this.props.onItemChanged) this.props.onItemChanged(item);
    }

    handleItemChanged(field: keyof RealmDefinition, item:RealmDefinition, newValue:string) {
        if(field == 'tags') {
            return    
        } else {
            item[field] = newValue;
        }
        if(this.props.onItemChanged) this.props.onItemChanged(item);
    }

    handleTagsChanged(item:RealmDefinition, items:Tag[]) {
        item.tags = items.map(obj => obj.value)
    }

    handleSaveItem(item:RealmDefinition) {
        this.setState({
            editEnabled: false
        })
        if(this.props.onItemChanged) this.props.onItemChanged(this.props.item)
    }

    render() {
        return <Row className="align-items-center border-bottom pt-2 pb-2">
    <Col xs="3" className="text-break">
    { this.state.editEnabled?
        <FormControl 
            defaultValue={this.props.item.realm}
            onBlur={(e:React.FocusEvent<HTMLInputElement>) => this.handleItemChanged("realm", this.props.item, e.target.value)}></FormControl>
        : this.props.item.realm
    }
    </Col>
    <Col className="text-break">
    {this.state.editEnabled?
        <FormControl 
            defaultValue={this.props.item.username}
            onBlur={(e:React.FocusEvent<HTMLInputElement>) => this.handleItemChanged("username", this.props.item, e.target.value)}></FormControl>
        : this.props.item.username
    }
    </Col>
    <Col className="text-break">
    {this.state.editEnabled?
        <FormControl 
            defaultValue={this.props.item.password}
            onBlur={(e:React.FocusEvent<HTMLInputElement>) => this.handleItemChanged("password", this.props.item, e.target.value)}></FormControl>
        : this.props.item.password
    }
    </Col>
    <Col xs="3" className="text-break">
    {this.state.editEnabled?
        <Typeahead
            id={"tags-field-" + this.props.item.id}
            labelKey="value"
            multiple
            defaultSelected={this.props.item.tags.map(v => { return {value: v}})}
            options={this.props.allTags}
            placeholder="Add tag"
            allowNew
            onChange={this.handleTagsChanged.bind(this, this.props.item)}
        />
        : <div>
            {this.props.item.tags.map(t => <Badge className="mx-1" variant="info">{t}</Badge>)
            }
        </div>
    }
    </Col>
    <Col sm="auto">
        <ButtonGroup>
            { this.state.editEnabled?
                <Button onClick={e => { this.handleSaveItem(this.props.item) }}><i className="fas fa-save"></i></Button>
                : <Button onClick={e => { this.setState({ editEnabled: true })}}><i className="fas fa-edit"></i></Button>
            }
            <Button variant="danger" onClick={e => { if(this.props.onItemRemoved) this.props.onItemRemoved(this.props.item); } }>
                <i className="fas fa-trash-alt"></i>
            </Button>
        </ButtonGroup>
    </Col>
</Row>
    }

}