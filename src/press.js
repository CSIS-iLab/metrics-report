import * as d3Fetch from 'd3-fetch'
import { get } from 'svelte/store'
import { yearShowing } from './store'
// import { getHelperData } from "./helper"

let helperDataset = {}
let columnNames
let test = {}
let years = []
let months = []
let URL
// exclude these from the press
// const excludeFromPress = [
//   'Defending Democratic Institutions',
//   'Defense Budget Analysis',
//   'Project on Fragility and Mobility'
// ]

const ispSubPrograms = [
  'Aerospace Security Project',
  'Arleigh A. Burke Chair in Strategy',
  // 'Defending Democratic Institutions',
  'Defense-Industrial Initiatives Group',
  // 'Defense Budget Analysis',
  'Emeritus Chair in Strategy',
  'Missile Defense Project',
  // 'Project on Fragility and Mobility',
  'Project on Nuclear Issues',
  'Smart Women, Smart Power',
  'Transnational Threats Project',
  'Intelligence, National Security, and Technology Program'
]
const mepSubPrograms = [
  'Brzezinski Chair in Global Security and Geostrategy',
  'Brzezinski Institute on Geostrategy'
]
const seapSubPrograms = ['Asia Maritime Transparency Initiative']

export async function getPressData() {
  // if year is 2024 
  if (get(yearShowing) === 2024)
    URL =
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vTj67l2D7wfqIr28Hx0eMvmXHMaMFxdqwL7yI3H-PoXvzfop0qHkPxaUT0RFCkGl0qqRrVMNbDuqgGa/pub?gid=71771517&single=true&output=csv'
  // if year is 2023
  else
    URL =
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7w_KjpjOnWrTBRESsdR4B71EURLp-aFfOTqk5KnA9Y3uZ9FhfHndJtddFkq_jbbp5e1u346r1uG8V/pub?gid=71771517&single=true&output=csv'
  return await fetchData(URL)
}

async function fetchData(URL) {
  const dataPromise = d3Fetch.csv( URL ).then( res => {
    const data = res.map( (row, index ) => {
      if (index == 0) {
        columnNames = Object.keys(row)
      }
      // TODO: pull years dinamically
      months.push(row.Month)
      // years = [2023]
      years = [get(yearShowing)]
      // years = ['2023']

      // Validate if cells in rows are empty
      if ( validateCells( row ) ) return {}

      return {
        id: index,
        program: row.Program,
        parentProgram: getParentProgram(row.Program),
        total_mentions: row.Total_Mentions ? row.Total_Mentions : 0,
        top_tier_mentions: row.Top_Tier_Mentions ? row.Top_Tier_Mentions : 0,
        month: row.Month,
        year: Number(row.Year)
        // year: ['2022','2023'] // find way to pull years dinamically.
      }

    })
    return {
      metrics: 'press',
      data: data,
      dataFormmated: formatData(data),
      columnNames: formatColumnNames(columnNames),
      years: [get(yearShowing)],
      months: [...new Set(months)]
    }
  })
  // console.log(dataPromise)
  return dataPromise
}

function getParentProgram( name ) {
  if (ispSubPrograms.includes( name )) {
    return 'International Security Program'
  }

  if (mepSubPrograms.includes( name )) {
    return 'Middle East Program'
  }

  if (seapSubPrograms.includes(name)) {
    return 'Southeast Asia Program'
  }

  return name
}

function validateCells( row ) {
  if ( row.Program == '' || row.Total_Mentions == '' || row.Top_Tier_Mentions == '' || row.Month == '' || row.Year == '' ) {
    return true
  }
}
//copy this to remove year column and move month to the first col
function formatColumnNames(columnNames) {
  return columnNames
    .sort((a, b) => (a === 'Month' ? -1 : b === 'Month' ? 1 : 0))
    .map(format)
    .filter((name) => name !== 'Year')
}

function format(name) {
  return name.replaceAll("_", " ")
}

function formatData(data) {
  let newData = []
  let years = []
  let months = []
  data.forEach(element => {
    years.push(element.year)
    months.push(element.month)
    newData.push({})
  })
  const yrs = [... new Set( years )].sort((a, b) => b - a)
  const monthss = [... new Set( months )]
  return {
    data: newData
  }
}
