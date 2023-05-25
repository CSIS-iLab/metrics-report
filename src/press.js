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
      // years.push(row.Year)
      months.push(row.Month)
      // console.log(row)
      // const year = row.Year
      years = ['2022', '2023']
      // console.log(year)
      // if (row.Year) {
      //   test.year.push(row)
      // } else {
      //   test[year] = [row]
      // }

      return {
        id: index,
        program: row.Program,
        totalMentions: row.Total_Mentions,
        topTierMentions: row.Top_Tier_Mentions,
        month: row.Month,
        year: row.Year
        // year: ['2022','2023'] // find way to pull years dinamically.
      }
    })
    return {
      metrics: "press",
      data: data,
      hola: test,
      dataFormmated: formatData(data),
      columnNames: formatColumnNames(columnNames),
      years: [...new Set(years)].sort((a, b) => b - a),
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

function formatData(data) {
  // console.log(data)
  let newData = []
  let years = []
  let months = []
  data.forEach(element => {
    // console.log(element)
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
