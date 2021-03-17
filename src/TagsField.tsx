import React from 'react'
import { Badge, ButtonGroup, Form, FormControl, InputGroup, Button, ButtonToolbar } from 'react-bootstrap'


type Props = {
    items:string[],
    onNewItem?: (item:string) => void
    onRemoveItem?: (item:string) => void
}

type State = {
    inputHidden: boolean
    inputValue: string
}

export default class TagsField extends React.Component<Props, State> {
    constructor(props:Props) {
        super(props)

        this.state = {
            inputHidden: true,
            inputValue: ""
        }
    }

    handleOnClick(e:React.MouseEvent<HTMLElement>) {
        this.setState({
            inputHidden: false
        })
    }

    handleOnBlur(e:React.FocusEvent<HTMLElement>) {
        let sanitizedValue = this.state.inputValue.trim()
        if(sanitizedValue.length > 0) {
            if(this.props.onNewItem) this.props.onNewItem(sanitizedValue)
        }

        this.setState({
            inputHidden: true,
            inputValue: ""
        })
    }

    handleOnKey(e:React.KeyboardEvent<HTMLElement>) {
        if(e.key == "Enter") {
            let sanitizedValue = this.state.inputValue.trim()
            if(sanitizedValue.length > 0) {
                if(this.props.onNewItem) this.props.onNewItem(sanitizedValue)
            }
            this.setState({
                inputHidden: true,
                inputValue: ""
            })
        }
    }

    handleOnInputChange(e:React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            inputValue: e.target.value
        })
    }

    handleRemove(item:string, e:React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        if(this.props.onRemoveItem) this.props.onRemoveItem(item)
    }

    render() {
        return <td
                onBlur={ this.handleOnBlur.bind(this) }
                onClick={ this.handleOnClick.bind(this) }>
            <ButtonToolbar>
                {this.props.items.map(t => 
                <ButtonGroup key={t} className="mr-2">
                    <Button disabled={true}>{t}</Button>
                    <Button onClick={ this.handleRemove.bind(this, t) }><i className="fas fa-trash-alt"></i></Button>
                </ButtonGroup>)
                }
                <InputGroup>
                    <InputGroup.Append>
                        <InputGroup.Text><i className="fas fa-plus"></i></InputGroup.Text>
                    </InputGroup.Append>
                    <FormControl
                        hidden={this.state.inputHidden} 
                        value={this.state.inputValue} 
                        onChange={ this.handleOnInputChange.bind(this) }
                        onKeyPress={ this.handleOnKey.bind(this) }></FormControl>
                </InputGroup>
            </ButtonToolbar>
        </td>
    }
}