import React from 'react';
import {Navbar, Form, InputGroup, FormControl, Button, ButtonGroup, Nav, Container, Row, Spinner} from 'react-bootstrap'
import RealmList from './RealmList'
import { setupRealms, 
    fetchRealms, 
    pushRealms, 
    authenticate, 
    RealmDefinition } from "./service"
import { Config, fetchConfig } from "./config"
import { v4 as uuidv4 } from 'uuid'

type Props = {

}

type State = {
    items:RealmDefinition[],
    filter:string,
    loading:boolean
}

export default class App extends React.Component<Props,State> {
    constructor(props:Props) {
        super(props);

        this.state = {
            items: [],
            filter: "",
            loading: true
        }
    }

    componentDidMount() {
        let component = this;
        let config:Config = null;

        fetchConfig()
            .then(v => config = v)
            .then(() => {
                if(config.cognito) {
                    return authenticate(config.cognito)
                        .then(creds => Promise.resolve())
                } else {
                    return Promise.resolve()
                }
            })
            .then(() => setupRealms(config.source))
            .then(() => fetchRealms())
            .then(realms => component.setState({
                items: realms,
            }))
            .then(() => this.setState({
                loading: false
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
        });
    }

    handleItemRemoved(removedItem:RealmDefinition) {
        let updatedItems = this.state.items.filter(item => item.id != removedItem.id)
        this.setState({
            items: updatedItems,
        });
    }

    handleItemChanged(changedItem:RealmDefinition) {   
        let updated = this.state.items.map(item => {
            if(item.id == changedItem.id) {
                console.log(changedItem)
                return changedItem;
            }
            return item;
        })

        this.setState({
            items: updated
        })
    }

    handleFilterChanged(event:React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            filter: event.target.value
        })
    }

    matchFilter(filter:string, item:RealmDefinition) {
        if(item.realm?.indexOf(filter) > -1) {
            return true
        }

        if(item.tags.filter(t => t.indexOf(filter) > -1).length > 0) {
            return true
        }

        return false
    }

    render() {
        return <div className="container-fluid h-100 d-flex flex-column">
    <Navbar expand="md" className="bg-light justify-content-between">
        <Navbar.Brand href="#">pass-man</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav>
            </Nav>
            <Form inline className="flex-grow-1">
                <InputGroup className="mx-auto w-75">
                    <FormControl placeholder="Search..." aria-label="Search" aria-describedby="basic-addon1" onChange={ this.handleFilterChanged.bind(this) }/>
                    <InputGroup.Append>
                        <InputGroup.Text className="bg-transparent"><i className="fa fa-search"></i></InputGroup.Text>
                    </InputGroup.Append>
                </InputGroup>
            </Form>
            <Form inline>
                <ButtonGroup>
                    <Button onClick={ this.handleAddBtnOnClick.bind(this) }><i className="fas fa-plus"></i></Button>
                    <Button onClick={ this.handleSaveOnClick.bind(this) }><i className="fas fa-cloud-upload-alt"></i></Button>
                </ButtonGroup>
            </Form>
        </Navbar.Collapse>
    </Navbar>

    <div className="row flex-fill">
    {this.state.loading?
        <div className="mx-auto my-auto">
            <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
            </Spinner>
        </div>
        : <RealmList    items={ this.state.items.filter(this.matchFilter.bind(this, this.state.filter)) }
                        onItemRemoved={ this.handleItemRemoved.bind(this) } 
                        onItemChanged={ this.handleItemChanged.bind(this) }></RealmList>
    }
    </div>
</div>
    }
}