import * as d3Fetch from 'd3-fetch'
import { getHelperData } from "./helper"

let helperDataset = {}
let columnNames
let years = []
let months = []
// let n = 1

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
        page: row.Page,
        pageType: row.Page_Type,
        views: Number(row.Views),
        engagements: Number(row.Engagements),
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
  return columnNames.map((name) => format(name))
}

function format(name) {
  return name.replaceAll("_", " ")
}

function getProgramsArray(string) { 
  if (string === '#N/A') {
    return
  }

  // if (n == 1) {
  //   console.log(helperDataset.dataFormatted)
  // }
  // n++
  return string.split('|')
    .filter((name) => {
      return helperDataset.dataFormatted.some((elem) => elem.program === name)
    }).filter( name => name !== undefined)
}
