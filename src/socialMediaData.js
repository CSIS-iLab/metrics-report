import * as d3Fetch from 'd3-fetch'

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

function formatColumnNames(columnNames) {
  return columnNames.map((name) => format(name))
}

function format(name) {
  return name.replaceAll("_", " ")
}
