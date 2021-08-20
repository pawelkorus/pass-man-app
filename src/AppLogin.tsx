import React from 'react';
import { authenticate } from "./service"
import { Config, fetchConfig } from "./config"
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

    componentDidMount() {
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
