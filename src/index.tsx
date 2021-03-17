import './main.scss';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

/*jQuery(() => {
    Papa.parse(testCSV, {
        download: true,
        worker: true,
        step: function(row) {
            console.log("Row:", row.data);
        },
        complete: function() {
            console.log("All done!");
        }
    });
});*/

ReactDOM.render(<App />, document.querySelector('#root'));