import React, {useState} from "react";
import './tokenTable.css'
import {useNavigate} from 'react-router-dom';

// a component rendering TokenTable depending on input props (check App.js)
export const TokenTable = (props) => {
    // constants below control if there are default filters transmitted via props (if not - set 'All')
    const defaultStatus = props.data.filters.status !== ''
        ? props.data.filters.status.charAt(0).toUpperCase() + props.data.filters.status.slice(1) : 'All'
    const defaultType = props.data.filters.type !== ''
        ? props.data.filters.type : 'All'

    // constants below help us to rerender component if we apply filters or sorting (or both) to table
    const [chosenStatus, setChosenStatus] = useState(defaultStatus)
    const [chosenType, setChosenType] = useState(defaultType)
    const [sort, setSort] = useState('')

    // 'statuses' and 'tokenTypes' arrays will help to allow user set filters
    const statuses = ['All', 'Red', 'Yellow', 'Green']
    let tokenTypes = ['All']
    props.data.items.map(item => {
        if (!tokenTypes.includes(item.type)) {
            tokenTypes.push(item.type)
        }
    })

    // when rendering, an array function below will return necessary colors for items (both status circle and background)
    const getStatusColor = (status) => {
        if (status === 'green') {
            return {circle: '#00DC7D', bg: '#E8FFF5'}
        } else if (status === 'yellow') {
            return {circle: '#FFD600', bg: '#FFFBE8'}
        } else if (status === 'red') {
            return {circle: '#FE634E', bg: '#FFF7F8'}
        }
    }

    // an array function below is aimed to sort items by default or by clicking the column
    const sortItems = (itemsArray) => {
        let sortBy = props.data.sort // getting the name of a column (example: '-volume')
        let reverse = false // '-' char will change this variable
        const columns = ['name', 'type', 'conditions', 'volume', 'roi', 'free', 'hedge']
        if (sortBy[0] === '-') {
            sortBy = sortBy.slice(1, sortBy.length) // check if sort parameter includes '-' and process it
            reverse = true
        }
        if (sortBy === '' || !columns.includes(sortBy)) {
            return itemsArray // in cases when there's no sort parameter, we just return default array
        }
        // sorting in the TokenTable can be number-based (as for 'Free float' or 'ROI') and string-based (as for 'Name' and 'Token type')
        if (props.data.sort !== '' && columns.includes(sortBy) && itemsArray.length > 0) {
            if (typeof itemsArray[0][sortBy] === 'number') { // sorting method for number columns taking reverse into account
                let sortedArray = itemsArray.sort((prev, next) => prev[sortBy] - next[sortBy])
                return !reverse ? sortedArray : sortedArray.reverse()
            }
            else if (typeof itemsArray[0][sortBy] === 'string') { // sorting method for string columns taking reverse into account
                let sortedArray = itemsArray.sort(((prev, next) => {
                    if (prev[sortBy] < next[sortBy]) return -1;
                    if (prev[sortBy] < next[sortBy]) return 1;
                }))
                return !reverse ? sortedArray : sortedArray.reverse()
            }
        }
        else { return itemsArray }
    }

    // array function using basic filter() method to limit items by condition
    const filterItems = () => {
        // status and type from props.filters indicate current filter parameters (we also check if they are not empty)
        const statusFilter = props.data.filters.status
        const includesStatus = (statusFilter !== '' && ['red', 'yellow', 'green'].includes(statusFilter))
        const typeFilter = props.data.filters.type
        const includesType = (typeFilter !== '' && typeFilter !== 'All')

        // processing 3 cases below to provide rerendering depending on what parameter(s) have been changed
        if (includesType && includesStatus) {
            return props.data.items.filter(item => item.status === statusFilter && item.type === typeFilter)
        } else if (includesType && !includesStatus) {
            return props.data.items.filter(item => item.type === typeFilter)
        } else if (includesStatus && !includesType) {
            return props.data.items.filter(item => item.status === statusFilter)
        } else return props.data.items
    }

    // basic array function responsible for hiding and showing a dropdown menu of filter parameters
    const dropDown = (id) => {
        document.getElementById(id).classList.toggle("show");
    }

    // invoking onFilter() from props and hiding dropdown (type contains old value)
    const onChooseStatus = (status, id) => {
        setChosenStatus(status)
        dropDown(id)
        props.data.onFilter({status: status, type: props.data.filters.type})
    }

    // invoking onFilter() from props and hiding dropdown (status contains old value)
    const onChooseType = (type, id) => {
        setChosenType(type)
        dropDown(id)
        props.data.onFilter({status: props.data.filters.status, type: type})
    }

    // invoking onSort() function from props to change sort parameters and rerender table
    const onSortClick = (colName) => {
        props.data.onSort(colName)
        if (sort !== colName) {
            setSort(colName)
        }
        else { // as said in a task, clicking the same column again reverses the array of sorted items
            setSort('-' + colName)
        }
    }

    const navigate = useNavigate(); // useNavigate hook will help to jump to the necessary URL (check below in return part)

    return (
        <div className='tableContainer'>
            <table>
                <thead>
                <tr>
                    <th>
                        <div className='col-header'>
                            <button onClick={() => dropDown("status-dropdown")} className="dropdown-button">
                                <div>
                                    <img src="/DropDownArch.png" className='dropdown-arch' alt=""/>
                                </div>
                                <div className='chosen-filter'>{chosenStatus}</div>
                            </button>
                            <div id="status-dropdown" className="dropdown-content">
                                {statuses.map((status, idx) => {
                                    return <button key={Math.random()} className='dropdown-point'
                                                   onClick={() => onChooseStatus(status, "status-dropdown")}>{status}</button>
                                })}
                            </div>
                            <div>Project</div>
                        </div>
                    </th>
                    <th>
                        <div className='col-header'>
                            <button onClick={() => dropDown('type-dropdown')} className="dropdown-button">
                                <div>
                                    <img src="/DropDownArch.png" className='dropdown-arch' alt=""/>
                                </div>
                                <div className='chosen-filter'>{chosenType}</div>
                            </button>
                            <div id="type-dropdown" className="dropdown-content">
                                {tokenTypes.map((type, idx) => {
                                    return <button key={Math.random()} className='dropdown-point'
                                                   onClick={() => onChooseType(type, "type-dropdown")}>{type}</button>
                                })}
                            </div>
                            <div>Token type</div>
                        </div>
                    </th>
                    <th>Conditions</th>
                    <th>Volume</th>
                    <th>ROI</th>
                    <th>Free float</th>
                    <th>Insurance hedge</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {sortItems(filterItems()).map(item => {
                    const colors = getStatusColor(item.status)
                    return (
                        <tr style={{backgroundColor: colors.bg}} onClick={() => {
                            navigate(`/project/${item.id}`) // changing URL by template
                            }} key={item.id}>
                            <td onClick={() => { onSortClick('roi')} }>
                                <div className='status-circle' style={{backgroundColor: colors.circle}}></div>
                                {item.name}
                            </td>
                            <td onClick={() => { onSortClick('type') }}>{item.type}</td>
                            <td onClick={() => { onSortClick('conditions') }}>{item.conditions}</td>
                            <td onClick={() => { onSortClick('volume')}}>$ {item.volume}</td>
                            <td onClick={() => { onSortClick('roi') }}>{item.roi} %</td>
                            <td onClick={() => { onSortClick('free') }}>{item.free}</td>
                            <td onClick={() => { onSortClick('hedge') }}>{item.hedge} %</td>
                            <td><button className='buy-button' onClick={() => props.data.onBuy(item.id)}>Buy</button></td>
                        </tr>
                    )
                })}
                </tbody>
            </table>
        </div>
    )
}