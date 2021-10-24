import React from 'react';
import {Navbar, Form, InputGroup, FormControl, Button, ButtonGroup, Nav, Spinner} from 'react-bootstrap'
import RealmList from './RealmList'
import { setupRealms, 
    fetchRealms, 
    pushRealms,  
    RealmDefinition } from "./service"
import { v4 as uuidv4 } from 'uuid'
import { Config } from './config'
import { ConfigContext } from './context/config.context'
import { AuthContext } from './context/auth.context'

type Props = {
}

export default ({}:Props):JSX.Element => {
    var [items, setItems] = React.useState([])
    var [tags, setTags] = React.useState([])
    var [filter, setFilter] = React.useState('')
    var [loading, setLoading] = React.useState(true)
    var configContext = React.useContext(ConfigContext)
    var authContext = React.useContext(AuthContext)
    React.useEffect(() => { componentDidMount() }, [configContext.state.config, authContext.state.credentials])

    async function componentDidMount() {
        if(configContext.state.config && authContext.state.credentials) {
            let config:Config = configContext.state.config
            
            await setupRealms(config.source, () => Promise.resolve(authContext.state.credentials))
            let realms = await fetchRealms()
            
            setItems(realms)
            setTags(caclulateAllTags(realms))
            setLoading(false)
        }
    }

    function handleSaveOnClick(e:React.MouseEvent) {
        e.preventDefault();
        pushRealms(items)
    }

    function handleAddBtnOnClick(e:React.MouseEvent) {
        e.preventDefault();

        let updatedItems = items.concat({
            id: uuidv4(),
            realm: "",
            username: "",
            password: "",
            tags: []
        });

        setItems(updatedItems)
    }

    function handleItemRemoved(removedItem:RealmDefinition) {
        let updatedItems = items.filter(item => item.id != removedItem.id)
        let tags = caclulateAllTags(updatedItems)
        setItems(updatedItems)
        setTags(tags)
    }

    function handleItemChanged(changedItem:RealmDefinition) {   
        let updated = items.map(item => {
            if(item.id == changedItem.id) {
                console.log(changedItem)
                return changedItem;
            }
            return item;
        })

        let tags = caclulateAllTags(updated)

        setItems(updated)
        setTags(tags)
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

        return false
    }

    function caclulateAllTags(items:RealmDefinition[]):string[] {
        let uniqueTags = items.map(item => item.tags)
            .reduce((accumulator, value) => accumulator.concat(value), [])
            .reduce((accumulator, value) => accumulator.add(value), new Set<string>())

        return [...uniqueTags]
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
                <Form inline className="flex-grow-1">
                    <InputGroup className="mx-auto w-75">
                        <FormControl placeholder="Search..." aria-label="Search" aria-describedby="basic-addon1" onChange={ handleFilterChanged }/>
                        <InputGroup.Append>
                            <InputGroup.Text className="bg-transparent"><i className="fa fa-search"></i></InputGroup.Text>
                        </InputGroup.Append>
                    </InputGroup>
                </Form>
                <Form inline>
                    <ButtonGroup>
                        <Button onClick={ handleAddBtnOnClick }><i className="fas fa-plus"></i></Button>
                        <Button onClick={ handleSaveOnClick }><i className="fas fa-cloud-upload-alt"></i></Button>
                    </ButtonGroup>
                </Form>
            </Navbar.Collapse>
        </div>
    </Navbar>

    <div className="row flex-fill">
    {loading?
        <div className="mx-auto my-auto">
            <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
            </Spinner>
        </div>
        : <RealmList    items={ items.filter(matchFilter) }
                        tags={tags}
                        onItemRemoved={handleItemRemoved} 
                        onItemChanged={handleItemChanged}></RealmList>
    }
    </div>
</div>
    )
}
