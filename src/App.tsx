import React from 'react';
import {Navbar, Form, InputGroup, FormControl, Button} from 'react-bootstrap'
import RealmList from './RealmList'
import RealmDefinition from './RealmDefinition'
import { fetchRealms, pushRealms } from "./service"
import { v4 as uuidv4 } from 'uuid';

const testCSV = require('./test.csv')

type Props = {

}

type State = {
    items:RealmDefinition[],
    filteredItems:RealmDefinition[]
}

export default class App extends React.Component<Props,State> {
    constructor(props:Props) {
        super(props);

        this.state = {
            items: [],
            filteredItems: []
        }
    }

    componentDidMount() {
        let component = this;

        fetchRealms(testCSV)
            .then(realms => component.setState({
                items: realms,
                filteredItems: realms
            }))
    }

    handleSaveOnClick(e:React.MouseEvent) {
        e.preventDefault();
        pushRealms(this.state.items)
    }

    handleAddBtnOnClick(e:React.MouseEvent) {
        e.preventDefault();

        let updatedItems = this.state.items.concat({
            id: uuidv4(),
            realm: "",
            username: "",
            password: "",
            tags: []
        });

        this.setState({
            items: updatedItems,
            filteredItems: updatedItems
        });
    }

    handleItemRemoved(removedItem:RealmDefinition) {
        let updatedItems = this.state.items.filter(item => item.id != removedItem.id)
        this.setState({
            items: updatedItems,
            filteredItems: updatedItems
        });
    }

    handleItemChanged(changedItem:RealmDefinition) {
        console.log("dsc")
        
        let updated = this.state.items.map(item => {
            if(item.id == changedItem.id) {
                console.log(changedItem)
                return changedItem;
            }
            return item;
        })

        console.log(updated)

        this.setState({
            items: updated,
            filteredItems: updated
        })
    }

    render() {
        return <div>
    <Navbar className="bg-light justify-content-between">
        <Navbar.Brand href="#">pass-man</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <Form inline className="mx-auto">
                <InputGroup>
                    <FormControl placeholder="Search..." aria-label="Search" aria-describedby="basic-addon1"/>
                    <InputGroup.Append>
                        <InputGroup.Text className="bg-transparent"><i className="fa fa-search"></i></InputGroup.Text>
                    </InputGroup.Append>
                </InputGroup>
            </Form>
            <Form inline>
                <Button onClick={ this.handleAddBtnOnClick.bind(this) }><i className="fas fa-plus"></i></Button>
            </Form>
            <Form inline>
                <Button onClick={ this.handleSaveOnClick.bind(this) }>Save</Button>
            </Form>
        </Navbar.Collapse>
    </Navbar>

    <RealmList items={ this.state.filteredItems } onItemRemoved={ this.handleItemRemoved.bind(this) } onItemChanged={ this.handleItemChanged.bind(this) }></RealmList>
</div>
    }
}