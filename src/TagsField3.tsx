import React from 'react'
import { Badge, ButtonGroup, Form, FormControl, InputGroup, Button, ButtonToolbar } from 'react-bootstrap'
import { Typeahead } from 'react-bootstrap-typeahead';

type Item = {
    value: string
}

type Props = {
    items:string[],
    onNewItem?: (item:string) => void
    onRemoveItem?: (item:string) => void
}

type State = {
}

export default class TagsField extends React.Component<Props, State> {
    constructor(props:Props) {
        super(props)

        this.state = {
            aitems: [
                {value: "aaa"}, {value: "bbb"}
            ]
        }
    }

    render() {
        return <td>
            <Typeahead
                id="public-methods-example"
                labelKey="value"
                multiple
                options={this.props.items.map(v => { return {value: v}})}
                placeholder="Add tag"
                allowNew
            />
        </td>
    }
}