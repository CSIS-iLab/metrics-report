import * as d3Fetch from 'd3-fetch'

const googleAPIKey = "AIzaSyBXuQRRw4K4W8E4eGHoSFUSrK-ZwpD4Zz4";
const googleSpreadsheetKey = "1Dz-3ajTk7Q3UGZqZoH-6zMT-5ynGOFmSNBuGe23pzSk";
const googleSpreadsheetSocialMedia = "social_media";

const socialMediaURL = `https://content-sheets.googleapis.com/v4/spreadsheets/${googleSpreadsheetKey}/values/${googleSpreadsheetSocialMedia}?key=${googleAPIKey}&majorDimension=ROWS`;
let socialMediaDataset = {}

export async function getSocialMediaData() {
  const response = await fetch(socialMediaURL)
  const data = await response.json()
  socialMediaDataset = formatData(data.values)
  return socialMediaDataset;
}

function formatData(data) {
  const columnNames = data.shift()
  const dataFormmated = data.map( ( row, index ) => {
    return {
      id: index,
      program: row[0],
      numberOfPosts: row[1],
      impressions: row[2],
      engagements: row[3],
      month: row[4]
    };
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
