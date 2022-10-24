import './App.css';
import {ProgressBar} from "./Components/ProgressBar/ProgressBar";
import {TokenTable} from "./Components/TokenTable/TokenTable";

const progressBarData = {
    items: [{name: 'Sold', color: '#BD1FBE', value: 677},
        {name: 'Got free', color: '#FC64FF', value: 23},
        {name: 'Zero', color: 'black', value: 0},
        {name: 'Burned', color: 'lightgreen', value: 202},
        {name: 'Free float', color: 'gray', value: 323}
    ],
    height: 15,
    width: 100
}

let tokenTableData = {
    items: [
        {id: 1, name: 'Pyshky.net', status: 'green', type: 'TRST', conditions: 'x2,6 months', volume: 120000, roi: 4, free: 20, hedge: 20},
        {id: 2, name: 'NFT-Flowershop', status: 'yellow', type: 'THT', conditions: 'x4,2 years', volume: 80000, roi: 23, free: 12, hedge: 0},
        {id: 3, name: 'Tokenhunt.club', status: 'green', type: 'THC', conditions: 'x2,1 years', volume: 120000, roi: 23, free: 2, hedge: 20},
        {id: 4, name: 'Web3 P2P University', status: 'red', type: 'TRST', conditions: 'x2,1 years', volume: 200000, roi: 6, free: 1, hedge: 0}
    ],
    sort: '',
    filters: {status: '', type: ''},
    onSort: function (param) {
        if (tokenTableData.sort !== param || tokenTableData.sort === '') {
            tokenTableData.sort = param
        }
        else if (tokenTableData.sort === param) {
            tokenTableData.sort = '-' + tokenTableData.sort.slice()
        }
    },
    onFilter: function(filter) {
        tokenTableData.filters.status = filter.status.toLowerCase()
        tokenTableData.filters.type = filter.type
    },
    onBuy: function (id) {
        console.log(`Item ${id} is bought`)
        return id
    }
}

function App() {
    return (
        <div className="App">
            <ProgressBar data={progressBarData}/>
            <TokenTable data={tokenTableData}/>
        </div>
    );
}

export default App;
