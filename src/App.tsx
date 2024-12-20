import React from 'react';
import {Navbar, Form, InputGroup, FormControl, Button, ButtonGroup, Spinner, Container} from 'react-bootstrap'
import { RealmList } from './ui'
import { v4 as uuidv4 } from 'uuid'
import { useRealms, RealmDefinition, State } from './api' 

type Props = {
}

export default ({}:Props):React.ReactElement => {
    var [filter, setFilter] = React.useState('')
    var realmsContext = useRealms()

    function handleSaveOnClick(e:React.MouseEvent) {
        e.preventDefault();
        // setState((cur, propse):State => { State.SAVING } ,   )
        realmsContext.actions.pushRealms()
        // setState(State.READY)
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

    function matchFilter(item:RealmDefinition) {
        if(filter == '') {
            return true
        }

        var filterLowerCase = filter.toLowerCase()
        var realmLowerCase = item.realm.toLowerCase()
        var tagsLowerCase = item.tags.map(tag => tag.toLowerCase()).join()

        return realmLowerCase.includes(filterLowerCase) || tagsLowerCase.includes(filterLowerCase)
    }

    var content = (
<div className="d-flex flex-column w-100 h-100">
    <div className="mx-auto my-auto">
        <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
        </Spinner>
    </div>
</div>
    )

    if(realmsContext.state.state == State.SAVING) {
        content = (
<div className="d-flex flex-column w-100 h-100">
    <div className="mx-auto my-auto">
        <Spinner animation="border" role="status">
            <span className="sr-only">Saving...</span>
        </Spinner>
    </div>
</div>
        )
    } else if(realmsContext.state.state == State.READY) {
        content = (
<>
    <Navbar bg="light" expand="md">
        <Container fluid="md">
            <Navbar.Brand href="#">
                pass-man
            </Navbar.Brand>

            <Navbar.Toggle aria-controls="basic-navbar-nav" />

            <Navbar.Collapse id="basic-navbar-nav">
                <Form className="flex-fill">
                    <InputGroup className="mb-1 mt-1 mb-md-0 mt-md-0">
                        <FormControl type="search" placeholder="Search..." className="" aria-label="Search" onChange={ handleFilterChanged } />
                        <InputGroup.Text className="bg-transparent"><i className="fa fa-search"></i></InputGroup.Text>
                    </InputGroup>
                </Form>
                <ButtonGroup className="ms-0 ms-md-1">
                    <Button onClick={ handleAddBtnOnClick }><i className="fas fa-plus"></i></Button>
                    <Button onClick={ handleSaveOnClick }><i className="fas fa-cloud-upload-alt"></i></Button>
                </ButtonGroup>
            </Navbar.Collapse>
        </Container>
    </Navbar>

    <RealmList
        items={ realmsContext.state.realms.filter(matchFilter) }
        onItemRemoved={handleItemRemoved} 
        onItemChanged={handleItemChanged}></RealmList>
</>
        )}

    return content
}
