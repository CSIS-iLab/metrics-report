import * as d3Fetch from 'd3-fetch'
import { getHelperData } from "./helper"

let helperDataset = {}

const googleAPIKey = "AIzaSyBXuQRRw4K4W8E4eGHoSFUSrK-ZwpD4Zz4";
const googleSpreadsheetKey = "1Dz-3ajTk7Q3UGZqZoH-6zMT-5ynGOFmSNBuGe23pzSk";
const googleSpreadsheet = "press";
const URL = `https://content-sheets.googleapis.com/v4/spreadsheets/${googleSpreadsheetKey}/values/${googleSpreadsheet}?key=${googleAPIKey}&majorDimension=ROWS`

export async function getPressData() {
  const response = await fetch(URL)
  const data = await response.json()
  return formatData(data.values)
}

export async function gettPressData() {
  const newURL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vT7w_KjpjOnWrTBRESsdR4B71EURLp-aFfOTqk5KnA9Y3uZ9FhfHndJtddFkq_jbbp5e1u346r1uG8V/pub?gid=71771517&single=true&output=csv"
  return await fetchData(newURL)
}

async function fetchData(URL) {
  const dataPromise = d3Fetch.csv( URL ).then( res => {
    const data = res.map( (row, index ) => {
      // console.log(row)
      return {
        id: index,
        program: row.Program,
        totalMentions: row.Total_Mentions,
        topTierMentions: row.Top_Tier_Mentions,
        month: row.Month,
        year: row.Year
      }
    })
    return {
      metrics: 'press',
      data: data
    }
  })
  return dataPromise
}

async function formatData(data) {
  helperDataset = await getHelperData()
  const columnNames = data.shift()
  const dataFormmated = data.map( ( row, index ) => {
    return {
      id: index,
      // program: getProgramName(row[0]),
      program: row[0],
      totalMentions: row[1],
      topTierMentions: row[2],
      month: row[3],
      year: row[4]
    }
  })
  return {
    metrics: 'press',
    data: {
      dataFormmated: dataFormmated,
      columnNames: formatColumnNames(columnNames)
    }
  };
}

function formatColumnNames(columnNames) {
  return columnNames.map((name) => format(name))
}

function format(name) {
  return name.replaceAll("_", " ")
}

function getProgramName(productName) {
  let programName
  if (helperDataset.dataFormatted.length > 1) {
    console.log(
      "we have something. inside here get the program name to format the podcasts dataset."
      );
      helperDataset.dataFormatted.filter( (element) => {
      console.log(productName)
      console.log(element)
      if (productName === element.productName) programName = element.program
      // return element
    })
    console.log(helperDataset.dataFormatted);
  }
  // return 'GHPC'
  return programName
}
