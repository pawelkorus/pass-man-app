import React from 'react'
import { Container } from 'react-bootstrap'
import { RealmDefinition } from '../api'
import RealmListItem from './RealmListItem'

type Props = {
    items:RealmDefinition[]

    onItemChanged?:(item:RealmDefinition) => void,
    onItemRemoved?:(item:RealmDefinition) => void
}

export default (props:Props):React.ReactElement => {
    
    function notPersistedFirst(left:RealmDefinition, right:RealmDefinition) {
        if(left.persisted && !right.persisted) return 1
        else if(left.persisted == right.persisted) return 0
        else return -1
    }
 
    return (
<Container>
    { props.items.sort(notPersistedFirst).map(item => 
    <RealmListItem
        key={item.id}
        item={item}
        onItemChanged={props?.onItemChanged}
        onItemRemoved={props?.onItemRemoved}
        />) }
</Container>
    )
}
