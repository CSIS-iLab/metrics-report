import * as d3Fetch from 'd3-fetch'
import { getHelperData } from "./helper"

let helperDataset = {}
let columnNames
let test = {}
let years = []
let months = []

export async function getPressData() {
  const URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vT7w_KjpjOnWrTBRESsdR4B71EURLp-aFfOTqk5KnA9Y3uZ9FhfHndJtddFkq_jbbp5e1u346r1uG8V/pub?gid=71771517&single=true&output=csv"
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
      years = ['2023']

      // Validate if cells in rows are empty
      if ( validateCells( row ) ) return {}

      return {
        id: index,
        program: row.Program,
        totalMentions: row.Total_Mentions ? row.Total_Mentions : 0,
        topTierMentions: row.Top_Tier_Mentions ? row.Top_Tier_Mentions : 0,
        month: row.Month,
        year: row.Year
        // year: ['2022','2023'] // find way to pull years dinamically.
      }

    })
    return {
      metrics: "press",
      data: data,
      dataFormmated: formatData(data),
      columnNames: formatColumnNames(columnNames),
      years: [...new Set(years)].sort((a, b) => b - a),
      months: [...new Set(months)]
    };
  })
  return dataPromise
}


function validateCells( row, index ) {
  if ( row.Program == '' || row.Total_Mentions == '' || row.Top_Tier_Mentions == '' || row.Month == '' || row.Year == '' ) {
    return true
  }
}

function formatColumnNames(columnNames) {
  return columnNames.map((name) => format(name))
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
