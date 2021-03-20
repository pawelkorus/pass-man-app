import React from 'react'
import { Table, Badge, Button, FormControl } from 'react-bootstrap'
import { Typeahead } from 'react-bootstrap-typeahead'
import { RealmDefinition } from './service'

type Props = {
    items:RealmDefinition[],

    onItemChanged?:(item:RealmDefinition) => void,
    onItemRemoved?:(item:RealmDefinition) => void
}

type State = {
    allTags: Tag[]
}

type Tag = {
    value:string
}

export default class CredentialsList extends React.Component<Props, State> {
    constructor(props:Props) {
        super(props);

        this.state = {
            allTags: []
        }
    }

    handleOnInputClick(e:React.MouseEvent<HTMLInputElement>) {
        e.preventDefault();
        (e.target as HTMLInputElement).readOnly = false;
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

    handleTagsChanged(item:RealmDefinition, items:Tag[]) {
        item.tags = items.map(obj => obj.value)
        if(this.props.onItemChanged) this.props.onItemChanged(item)
    }

    caclulateAllTags(items:RealmDefinition[]):Tag[] {
        let uniqueTags = items.map(item => item.tags)
            .reduce((accumulator, value) => accumulator.concat(value), [])
            .reduce((accumulator, value) => accumulator.add(value), new Set<string>())
            
        return [...uniqueTags].map(t => { return { value: t } })
    }

    componentDidUpdate(prevProps:Props) {
        if(prevProps.items != this.props.items) {
            this.setState({
                allTags: this.caclulateAllTags(this.props.items)
            })
        }
    }

    render() {
        return <Table>
            <tbody>
                { this.props.items.map(item => 
                <tr key={item.id}>
                    <td><FormControl 
                        readOnly={true}
                        defaultValue={item.realm} 
                        onBlur={ this.handleOnInputFocusLost.bind(this, "realm", item) }
                        onClick={ this.handleOnInputClick.bind(this) }/></td>
                    <td><FormControl 
                        readOnly={true} 
                        defaultValue={item.username} 
                        onBlur={ this.handleOnInputFocusLost.bind(this, "username", item) }
                        onClick={ this.handleOnInputClick.bind(this) }/></td>
                    <td><FormControl 
                        readOnly={true}
                        defaultValue={item.password} 
                        onBlur={ this.handleOnInputFocusLost.bind(this, "password", item) }
                        onClick={ this.handleOnInputClick.bind(this) }/></td>
                    <td>
                        <Typeahead
                            id={"tags-field-" + item.id}
                            labelKey="value"
                            multiple
                            defaultSelected={item.tags.map(v => { return {value: v}})}
                            options={this.state.allTags}
                            placeholder="Add tag"
                            allowNew
                            onChange={this.handleTagsChanged.bind(this, item)}
                        />
                    </td>
                    <td>
                        <Button variant="danger" onClick={e => { if(this.props.onItemRemoved) this.props.onItemRemoved(item); } }>
                            <i className="fas fa-trash-alt"></i>
                        </Button>
                    </td>
                </tr>) }
            </tbody>
        </Table>
    }
}

/*
<TagsField
onNewItem={ this.handleNewTag.bind(this, item) }
onRemoveItem={ this.handleRemoveTag.bind(this, item) }
items={item.tags}></TagsField>*/