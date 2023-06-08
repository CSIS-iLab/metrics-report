import * as d3Fetch from 'd3-fetch'
import { getHelperData } from './videoHelper'

let helperDataset = {}
let columnNames = []
let years = []
let months = []

export async function getVideoPodcastsData() {
  const URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vT7w_KjpjOnWrTBRESsdR4B71EURLp-aFfOTqk5KnA9Y3uZ9FhfHndJtddFkq_jbbp5e1u346r1uG8V/pub?gid=1592016981&single=true&output=csv"
  return await fetchData(URL)
}

async function fetchData(URL) {
  helperDataset = await getHelperData()
  const dataPromise = d3Fetch.csv( URL ).then( res => {
    const data = res.map( (row, index ) => {
      if (index == 0) {
        columnNames.push('Program')
        columnNames.push(...Object.keys(row))
        columnNames.pop()
      }
      years.push(row.Year)
      months.push(row.Month)
      return {
        id: index,
        program: getProgram(row.Description),
        videoTitle: row.Video_Title,
        description: row.Description,
        totalViews: row.Total_Views_First_30_Days_of_Performance,
        totalWatchTime: row.Total_Watch_Time_Minutes,
        averagePercentageViewed: row.Average_Percentage_Viewed,
        permalink: row.Permalink_URL,
        month: row.Month,
        year: row.Year
      }
    })
    return {
      metrics: 'podcasts_(Video)',
      data: data,
      columnNames: formatColumnNames(columnNames),
      years: [...new Set(years)],
      months: [...new Set(months)]
    }
  })
  return dataPromise
}

function getProgram(string) {
  let programName
  const array = string
    .split(' ')
    .filter((v) => v.startsWith('#'))
    .slice(0, 2)
  if (helperDataset.dataFormatted.length > 1) {
    helperDataset.dataFormatted
      .filter((element) => element !== '')
      .filter((element) => {
        if (array[0] === element.productName) programName = element.program
      })
  }
  let n = 0
  let length = array.length
  let programNames = array[0]
  return programName
}

function formatColumnNames(columnNames) {
  return columnNames.map( name  => format( name ) )
}

function format( name ) {
  return name.replaceAll( "_", " " )
}
