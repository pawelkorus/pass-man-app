import React from 'react';
import { authenticateCognito } from "./service"
import { fetchConfig } from "./config"
import { Spinner } from 'react-bootstrap'

type Props = {
}

type State = {
}

export default class AppLogin extends React.Component<Props,State> {
    constructor(props:Props) {
        super(props);

        this.state = {
        }
    }

    async componentDidMount() {
        let config = await fetchConfig()

        if(config.cognito) {
            await authenticateCognito(config.cognito)
        }
    }

    render() {
        return <div className="container-fluid h-100 d-flex flex-column">
    <div className="row flex-fill">
        <div className="mx-auto my-auto">
            <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
            </Spinner>
        </div>
    </div>
</div>
    }
}
