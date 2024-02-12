import * as d3Fetch from 'd3-fetch'
// import { getHelperData } from "./helper"
import { getHelperData } from "./publicationHelper"
// helper_internal_use_publications

let helperDataset = {}
let columnNames
let years = []
let months = []

export async function getPublicationData() {
  const URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vT7w_KjpjOnWrTBRESsdR4B71EURLp-aFfOTqk5KnA9Y3uZ9FhfHndJtddFkq_jbbp5e1u346r1uG8V/pub?gid=404371537&single=true&output=csv"
  return await fetchData(URL)
}

async function fetchData(URL) {
  helperDataset = await getHelperData()
  const dataPromise = d3Fetch.csv( URL ).then( res => {
    const data = res.map( (row, index ) => {
      if (index == 0) {
        columnNames = Object.keys(row)
      }
      years.push(row.Year)
      months.push(row.Month)
      return {
        id: index,
        program: row.Program,
        programsNames: getProgramsArray(row.Program),
        title: row.Title,
        publication_type: row.Publication_Type,
        views: Number(row.Views),
        // engagements: Number(row.Engagements),
        month: row.Month,
        year: row.Year
      }
    })
    return {
      metrics: "publications",
      data: data,
      columnNames: formatColumnNames(columnNames),
      years: [...new Set(years)],
      months: [...new Set(months)]
    }
  })
  // console.log(dataPromise)
  return dataPromise
}

function formatColumnNames(columnNames) {
  // return columnNames.map((name) => format(name))
  return columnNames
    .sort((a, b) => (a === 'Month' ? -1 : b === 'Month' ? 1 : 0))
    .map(format)
    .filter((name) => name !== 'Year')
}

function format(name) {
  return name.replaceAll("_", " ")
}

function getProgramsArray(string) {
  if (string === '#N/A') {
    return
  }
  const names = string.split('|')
  const matchingElement = helperDataset.dataFormatted.filter( element => {
    return names.some(name => name === element.productName)
  })
  if (matchingElement.length > 0) {
    return matchingElement.map( name => replaceAMTI(name.program))
  }
  return names.map(name => replaceAMTI(name))
}

function replaceAMTI(programName) {
  if (programName === 'Asia Maritime Transparency Initiative') {
    return 'Southeast Asia Program'
  }
  return programName
}