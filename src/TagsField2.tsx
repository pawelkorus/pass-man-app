import React from 'react'
import { Badge, ButtonGroup, Form, FormControl, InputGroup, Button, ButtonToolbar } from 'react-bootstrap'
import ReactChipInput from "react-chip-input";

type Props = {
    items:string[],
    onNewItem?: (item:string) => void
    onRemoveItem?: (item:string) => void
}

type State = {
    chips:string[]
}

export default class TagsField extends React.Component<Props, State> {
    constructor(props:Props) {
        super(props)

        this.state = {
            chips: []
        }
    }

    addChip(value:string) {
        const chips = this.state.chips.slice();
        chips.push(value);
        this.setState({ chips });
    };

    removeChip(index:number) {
        const chips = this.state.chips.slice();
        chips.splice(index, 1);
        this.setState({ chips });
    }

    render() {
        return <td>
            <ReactChipInput
                classes="class1 class2"
                chips={this.state.chips}
                onSubmit={(value:string) => this.addChip(value)}
                onRemove={(index:number) => this.removeChip(index)}
            />
        </td>
    }
}