import * as d3Fetch from 'd3-fetch'

let columnNames

export async function getAboutContent() {
  const URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vT7w_KjpjOnWrTBRESsdR4B71EURLp-aFfOTqk5KnA9Y3uZ9FhfHndJtddFkq_jbbp5e1u346r1uG8V/pub?gid=1156569014&single=true&output=csv"
  return await fetchData(URL)
}

async function fetchData(URL) {
  const dataPromise = d3Fetch.csv( URL ).then( res => {
    const data = res.map( (row, index ) => {
      if (index == 0) {
        columnNames = Object.keys(row)
      }
      return {
        id: index,
        content: row.about
      }
    })
    return {
      data: data,
      columnNames: formatColumnNames(columnNames)
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
