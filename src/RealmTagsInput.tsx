import React from 'react'
import { Typeahead } from 'react-bootstrap-typeahead'
import { useRealms, RealmDefinition } from './api'  

type Tag = {
    value:string
}

type Props = {
    id:string
    tags:string[]

    onChange?: (tags:string[]) => void
}

export const RealmTagsInput:React.FC<Props> = props => {
    const [allTags, setAllTags] = React.useState([])
    const realmsContext = useRealms()
    React.useEffect(updateTags, [realmsContext.state.realms])

    function updateTags() {
        if(realmsContext.state.realms)
            setAllTags(caclulateAllTags(realmsContext.state.realms))
    }

    function caclulateAllTags(items:RealmDefinition[]):string[] {
        let uniqueTags = items.map(item => item.tags)
            .reduce((accumulator, value) => accumulator.concat(value), [])
            .reduce((accumulator, value) => accumulator.add(value), new Set<string>())

        return [...uniqueTags]
    }

    function handleOnChange(updatedTags:Tag[]) {
        props?.onChange(updatedTags.map(obj => obj.value))
    }

    return (
<Typeahead
    id={props.id}
    labelKey="value"
    multiple
    defaultSelected={props.tags.map(v => { return {value: v}})}
    options={allTags.map(v => { return {value: v}})}
    placeholder="Add tag"
    allowNew
    onChange={handleOnChange}/>    
    )
}

export default RealmTagsInput
