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

export default (props:Props):React.ReactElement => {
    return (
<Container>
    { props.items.map(item => 
    <RealmListItem
        key={item.id}
        item={item}
        allTags={props.tags}
        onItemChanged={props?.onItemChanged}
        onItemRemoved={props?.onItemRemoved}
        />) }
</Container>
    )
}
