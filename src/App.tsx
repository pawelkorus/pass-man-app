import React from 'react';
import {Navbar, Form, InputGroup, FormControl, Button, ButtonGroup, Nav, Spinner} from 'react-bootstrap'
import RealmList from './RealmList'
import { v4 as uuidv4 } from 'uuid'
import { useRealms, RealmDefinition } from './api' 

type Props = {
}

export default ({}:Props):JSX.Element => {
    var [filter, setFilter] = React.useState('')
    var [loading, setLoading] = React.useState(true)
    var realmsContext = useRealms()
    React.useEffect(componentDidMount, [realmsContext.state.realms])

    function componentDidMount() {
        if(realmsContext.state.realms && loading) {
            setLoading(false)
        }
    }

    function handleSaveOnClick(e:React.MouseEvent) {
        e.preventDefault();
        realmsContext.actions.pushRealms()
    }

    function handleAddBtnOnClick(e:React.MouseEvent) {
        e.preventDefault();

        realmsContext.actions.addRealm({
            id: uuidv4(),
            realm: "",
            username: "",
            password: "",
            tags: [],
            persisted: false
        })
    }

    function handleItemRemoved(removedItem:RealmDefinition) {
        realmsContext.actions.removeRealm(removedItem)
    }

    function handleItemChanged(changedItem:RealmDefinition) {   
        realmsContext.actions.updateRealm(changedItem)
    }

    function handleFilterChanged(event:React.ChangeEvent<HTMLInputElement>) {
        setFilter(event.target.value)
    }

    function matchFilter(item:RealmDefinition):boolean {
        if(item.realm?.indexOf(filter) > -1) {
            return true
        }

        if(item.tags.filter(t => t.indexOf(filter) > -1).length > 0) {
            return true
        }

        if(!item.persisted) {
            return true
        }

        return false
    }

    return (
<div className="container-fluid h-100 d-flex flex-column">
    <Navbar expand="md" className="bg-light justify-content-between">
        <div className="container">
            <Navbar.Brand href="#">pass-man</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav>
                </Nav>
                <Form className="flex-grow-1">
                    <InputGroup className="mx-auto w-75">
                        <FormControl placeholder="Search..." aria-label="Search" aria-describedby="basic-addon1" onChange={ handleFilterChanged }/>
                        <InputGroup.Text className="bg-transparent"><i className="fa fa-search"></i></InputGroup.Text>
                    </InputGroup>
                </Form>
                <Form>
                    <ButtonGroup>
                        <Button onClick={ handleAddBtnOnClick }><i className="fas fa-plus"></i></Button>
                        <Button onClick={ handleSaveOnClick }><i className="fas fa-cloud-upload-alt"></i></Button>
                    </ButtonGroup>
                </Form>
            </Navbar.Collapse>
        </div>
    </Navbar>

    <div className="flex-fill">
    {loading?
        <div className="mx-auto my-auto">
            <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
            </Spinner>
        </div>
        : <RealmList    items={ realmsContext.state.realms.filter(matchFilter) }
                        onItemRemoved={handleItemRemoved} 
                        onItemChanged={handleItemChanged}></RealmList>
    }
    </div>
</div>
    )
}
