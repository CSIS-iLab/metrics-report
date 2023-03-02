// import * as d3Fetch from 'd3-fetch'
import { getHelperData } from "./helper"

let helperDataset = {}

const googleAPIKey = "AIzaSyBXuQRRw4K4W8E4eGHoSFUSrK-ZwpD4Zz4";
const googleSpreadsheetKey = "1Dz-3ajTk7Q3UGZqZoH-6zMT-5ynGOFmSNBuGe23pzSk";
const googleSpreadsheet = "podcasts";

const URL = `https://content-sheets.googleapis.com/v4/spreadsheets/${googleSpreadsheetKey}/values/${googleSpreadsheet}?key=${googleAPIKey}&majorDimension=ROWS`

export async function getPodcastData() {
  const response = await fetch(URL)
  const data = await response.json()
  return formatData(data.values)
}

async function formatData(data) {
  helperDataset = await getHelperData()
  const columnNames = data.shift()
  const dataFormmated = data.map( ( row, index ) => {

    return {
      id: index,
      program: getProgramName(row[0]),
      productName: row[0],
      numberOfPosts: row[1],
      impressions: row[2],
      engagements: row[3]
    }
  })
  return {
    dataFormmated: dataFormmated,
    columnNames: formatColumnNames(columnNames)
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
    // console.log(
    //   "we have something. inside here get the program name to format the podcasts dataset."
    //   )
      helperDataset.dataFormatted.filter( (element) => {
      // console.log(productName)
      // console.log(element)
      if (productName === element.productName) programName = element.program
      // return element
    })
    // console.log(helperDataset.dataFormatted);
  }
  // return 'GHPC'
  return programName
}
