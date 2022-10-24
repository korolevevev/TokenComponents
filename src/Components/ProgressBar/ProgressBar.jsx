import React from "react";
import './progressBar.css'

// a component rendering ProgressBar depending on input props (check App.js)
export const ProgressBar = (props) => {
    const colors = props.data.items.map(item => item.color) // collecting colors of items
    const inputHeight = props.data.height + 'px' // as height is transmitted via props, we have to create a string of CSS property

    // summarizing 'value' field of all items
    const getTotal = () => {
        let total = 0
        props.data.items.map(item => {
            total += item.value
        })
        return total // number
    }

    // counting percentage and quantity of bars of each item
    const getDistribution = () => {
        const singleBarPercentage = Math.round(100/props.data.width) // counting the share of one bar
        let distribution = [] // here will be objects for each item
        props.data.items.map(item => {
            // getting percentage of each item and limiting the number of decimal places
            let percentage = Number((item.value/getTotal()*100).toFixed(1))
            // rounding down quantity of bars for each item to the bottom and adding 1 additional bar to the last item
            let barsQuantity = Math.floor(percentage/singleBarPercentage)
            if (percentage % singleBarPercentage > singleBarPercentage/2) {
                barsQuantity += 1
            }
            distribution.push({percentage: percentage, barsQuantity: barsQuantity})
        })
        return distribution // array of objects
    }
    // array function below is responsible for rendering ProgressBar distribution
    const renderColorfulBars = () => {
        let barsHTML = [] // an array of divs for each bar
        let sum100, counter = 0 // sum100 checks if distribution's total is 100%, counter helps to change color of bars when needed
        getDistribution().map(item => {
            sum100 += item.barsQuantity // summarizing the percentage of a single item
            if (sum100 === props.data.width - 1) {
                item.barsQuantity += 1 // the last item gets 1 additional bar if there's an odd one
            }
            for (let i = 0; i < item.barsQuantity; i++) { // render divs using bars quantity for each item and adding color and height
                barsHTML.push(<div key={Math.random()} className='single-bar'
                                   style={{backgroundColor: colors[counter], height: inputHeight}}></div>)
            }
            counter++
        })
        return <>{ barsHTML.map(el => el) }</> // completed part of html page
    }
    // to get access to items' properties faster, I decided to combine them into single array of objects
    const combineStats = () => {
        let stats = []
        for (let i=0; i<props.data.items.length; i++) {
            stats.push({
                color: colors[i],
                name: props.data.items[i].name,
                value: props.data.items[i].value,
                percentage: getDistribution()[i].percentage})
        }
        return stats
    }

    return(
        <div className='pb-wrapper'>
            <div className='pb-container'>{renderColorfulBars()}</div>
            <div className='stats-container'>
                {combineStats().map(item => {
                    return <div key={Math.random()} className='single-stats'>
                        <div className='color-indicator' style={{backgroundColor: item.color}}></div>
                        <div>{item.name}: {item.value} ({item.percentage} %)</div>
                    </div>
                })}
            </div>
        </div>
    )
}