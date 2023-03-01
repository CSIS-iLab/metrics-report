import * as d3Fetch from 'd3-fetch'

// const googleAPIKey = "AIzaSyBXuQRRw4K4W8E4eGHoSFUSrK-ZwpD4Zz4";
// const googleSpreadsheetKey = "1Dz-3ajTk7Q3UGZqZoH-6zMT-5ynGOFmSNBuGe23pzSk";
// const googleSpreadsheetSocialMedia = "social_media";

// const socialMediaURL = `https://content-sheets.googleapis.com/v4/spreadsheets/${googleSpreadsheetKey}/values/${googleSpreadsheetSocialMedia}?key=${googleAPIKey}&majorDimension=ROWS`;

// export async function getSocialMediaData() {
//   const response = await fetch(socialMediaURL)
//   const data = await response.json()
//   // socialMediaDataset = formatData(data.values)
//   // return socialMediaDataset;
//   return formatData(data.values)
// }
let columnNames
let years = []
let months = []

export async function getSocialMediaDataa() {
  const newURL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vT7w_KjpjOnWrTBRESsdR4B71EURLp-aFfOTqk5KnA9Y3uZ9FhfHndJtddFkq_jbbp5e1u346r1uG8V/pub?gid=833450828&single=true&output=csv"
  return await fetchData(newURL)
}

async function fetchData(URL) {
  const dataPromise = d3Fetch.csv( URL ).then( res => {
    const data = res.map( (row, index ) => {
      if (index == 0) {
        console.log(row);
        columnNames = Object.keys(row)
      }
      years.push(row.Year);
      months.push(row.Month);
      return {
        id: index,
        program: row.Program,
        numberOfPosts: row.Number_of_Posts,
        impressions: row.Impressions,
        engagements: row.Engagements,
        month: row.Month,
        year: row.Year
      }
    })
    return {
      metrics: "social_media",
      data: data,
      columnNames: formatColumnNames(columnNames),
      years: [...new Set(years)],
      months: [...new Set(months)],
    };
  })
  return dataPromise
}

// async function formatData(data) {
//   const columnNames = data.shift()
//   const dataFormmated = data.map( ( row, index ) => {
//     return {
//       id: index,
//       program: row[0],
//       numberOfPosts: row[1],
//       impressions: row[2],
//       engagements: row[3],
//       month: row[4]
//     };
//   })
//   return {
//     metrics: 'social_media',
//     data: {
//       dataFormmated: dataFormmated,
//       columnNames: formatColumnNames(columnNames)
//     }
//   }
// }

function formatColumnNames(columnNames) {
  return columnNames.map((name) => format(name))
}

function format(name) {
  return name.replaceAll("_", " ")
}
