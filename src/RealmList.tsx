import React from 'react'
import { Container } from 'react-bootstrap'
import { RealmDefinition } from './service'
import RealmListItem from './RealmListItem'

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
        return <Container>
    { this.props.items.map(item => 
    <RealmListItem
        key={item.id}
        item={item}
        allTags={this.state.allTags}
        >
    </RealmListItem>) }
</Container>
    }
}