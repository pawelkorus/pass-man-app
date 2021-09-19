import React from 'react'
import { Container } from 'react-bootstrap'
import { RealmDefinition } from './service'
import RealmListItem from './RealmListItem'

type Props = {
    items:RealmDefinition[],
    tags: string[]

    onItemChanged?:(item:RealmDefinition) => void,
    onItemRemoved?:(item:RealmDefinition) => void
}

type State = {
}
export default class CredentialsList extends React.Component<Props, State> {
    constructor(props:Props) {
        super(props);
    }

    render() {
        return <Container>
    { this.props.items.map(item => 
    <RealmListItem
        key={item.id}
        item={item}
        allTags={this.props.tags}
        onItemChanged={this.props?.onItemChanged}
        onItemRemoved={this.props?.onItemRemoved}
        >
    </RealmListItem>) }
</Container>
    }
}
