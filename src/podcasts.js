import * as d3Fetch from 'd3-fetch'
import { getHelperData } from "./helper"

let helperDataset = {}
let columnNames = []
let years = []
let months = []

export async function getPodcastData() {
  const URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7w_KjpjOnWrTBRESsdR4B71EURLp-aFfOTqk5KnA9Y3uZ9FhfHndJtddFkq_jbbp5e1u346r1uG8V/pub?gid=553537768&single=true&output=csv'
  return await fetchData(URL)
}

async function fetchData(URL) {
  helperDataset = await getHelperData()
  const dataPromise = d3Fetch.csv( URL ).then( res => {
    const data = res.map( (row, index ) => {
      if (index == 0) {
        columnNames.push('Program')
        columnNames.push(...Object.keys(row))
      }
      years.push(row.Year)
      months.push(row.Month)
      return {
        id: index,
        program: getProgramName(row.Podcast),
        podcast: row.Podcast,
        totalDownloads: row.Total_Downloads,
        month: row.Month,
        year: row.Year
      }
    })
    return {
      metrics: "podcasts",
      data: data,
      columnNames: formatColumnNames(columnNames),
      years: [...new Set(years)],
      months: [...new Set(months)]
    };
  })
  return dataPromise
}

function formatColumnNames(columnNames) {
  return columnNames.map((name) => format(name))
}

function format(name) {
  return name.replaceAll("_", " ")
}

function getProgramName(productName) {
  console.log(productName)
  let programName
  if (helperDataset.dataFormatted.length > 1) {
    console.log(helperDataset.dataFormatted
    .filter( element => element !== ''))
    
  }
  if (helperDataset.dataFormatted.length > 1) {
      helperDataset.dataFormatted
      .filter( element => element !== '')
      .filter( element => {
      if (productName === element.productName) programName = element.program
    })
  }
  return programName
}
