import * as d3Fetch from 'd3-fetch'
import { getHelperData } from "./helper"

let helperDataset = {}
let columnNames
let years = []
let months = []

export async function getVideoEventsData() {
  const URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vT7w_KjpjOnWrTBRESsdR4B71EURLp-aFfOTqk5KnA9Y3uZ9FhfHndJtddFkq_jbbp5e1u346r1uG8V/pub?gid=287607348&single=true&output=csv"
  return await fetchData(URL)
}

async function fetchData(URL) {
  const dataPromise = d3Fetch.csv( URL ).then( res => {
    const data = res.map( (row, index ) => {
      if (index == 0) {
        columnNames = Object.keys(row)
        columnNames.pop()
      }
      years.push(row.Year)
      months.push(row.Month)
      return {
        id: index,
        // program: row.Program,
        program: getProgram(row.Description),
        videoTitle: row.Video_Title,
        description: row.Description,
        totalViews: row.Total_Views_First_30_days_of_preformance,
        totalWatchTime: row.Total_Watch_Time_Minutes,
        averagePercentageViewed: row.Average_Percentage_Viewed,
        permalink: row.Permalink_URL,
        month: row.Month,
        year: row.Year
      }
    })
    return {
      metrics: "videos_events",
      data: data,
      columnNames: formatColumnNames(columnNames),
      years: [...new Set(years)],
      months: [...new Set(months)]
    };
  })
  return dataPromise
}

function getProgram(string) {
  const array = string.split(' ')
  let n = 0
  let length = array.length
  let programNames = []
  while (n < length ) {
    if (array[n].charAt(0) === '#') {
      programNames.push(array[n].substring(1))
    }
    n++
  }
  return programNames[0]
}
function formatColumnNames(columnNames) {
  return columnNames.map( name  => format( name ) )
}

function format( name ) {
  return name.replaceAll( "_", " " )
}
