const googleAPIKey = "AIzaSyBXuQRRw4K4W8E4eGHoSFUSrK-ZwpD4Zz4";
const googleSpreadsheetKey = "1Dz-3ajTk7Q3UGZqZoH-6zMT-5ynGOFmSNBuGe23pzSk";
const googleSpreadsheet = 'helper_internal_use_publications'

const URL = `https://content-sheets.googleapis.com/v4/spreadsheets/${googleSpreadsheetKey}/values/${googleSpreadsheet}?key=${googleAPIKey}&majorDimension=ROWS`;

export async function getHelperData() {
  const response = await fetch(URL)
  const data = await response.json()
  return {
    dataFormatted: formatData(data.values),
    columnNames: data.values[0].map(format)
  }
}

function formatData(data) {
  const columnNames = data.shift()
  return data.map((row, index) => ({
    id: index,
    program: row[0]
  }))
}

function format(name) {
  return name.replaceAll('_', ' ')
}
