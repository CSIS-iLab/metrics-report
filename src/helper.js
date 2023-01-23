import * as d3Fetch from 'd3-fetch'

const googleAPIKey = "AIzaSyBXuQRRw4K4W8E4eGHoSFUSrK-ZwpD4Zz4";
const googleSpreadsheetKey = "1Dz-3ajTk7Q3UGZqZoH-6zMT-5ynGOFmSNBuGe23pzSk";
const googleSpreadsheet = "helper";

const URL = `https://content-sheets.googleapis.com/v4/spreadsheets/${googleSpreadsheetKey}/values/${googleSpreadsheet}?key=${googleAPIKey}&majorDimension=ROWS`;

export async function getHelperData() {
  const response = await fetch(URL)
  const data = await response.json()
  return formatData(data.values)
}

function formatData(data) {
  const columnNames = data.shift()
  const dataFormmated = data.map( ( row, index ) => {
    return {
      id: index,
      program: row[0],
      productName: row[1],
      typeOfMetric: row[2]
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
