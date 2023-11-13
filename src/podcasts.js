import * as d3Fetch from 'd3-fetch'
import { getHelperData } from "./helper"

let helperDataset = {}
let columnNames = []
let years = []
let months = []
const ispSubPrograms = [
  'Aerospace Security Project',
  'Arleigh A. Burke Chair in Strategy',
  'Defending Democratic Institutions',
  'Defense-Industrial Initiatives Group',
  'Defense Budget Analysis',
  'Emeritus Chair in Strategy',
  'Missile Defense Project',
  'Project on Fragility and Mobility',
  'Project on Nuclear Issues',
  'Smart Women, Smart Power',
  'Transnational Threats Project'
]
const mepSubPrograms = [
  'Brzezinski Chair in Global Security and Geostrategy',
  'Brzezinski Institute on Geostrategy'
]
const seapSubPrograms = ['Asia Maritime Transparency Initiative']

export async function getPodcastData() {
  const URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7w_KjpjOnWrTBRESsdR4B71EURLp-aFfOTqk5KnA9Y3uZ9FhfHndJtddFkq_jbbp5e1u346r1uG8V/pub?gid=553537768&single=true&output=csv'
  return await fetchData(URL)
}

async function fetchData(URL) {
  helperDataset = await getHelperData()
  const dataPromise = d3Fetch.csv( URL ).then( res => {
    const data = res.map( (row, index ) => {
      if (index == 0) {
        columnNames.push('Program')
        columnNames.push(...Object.keys(row))
      }
      years.push(row.Year)
      months.push(row.Month)
      
      // Validate if cells in rows are empty
      if (validateCells(row)) return {}

      return {
        id: index,
        program: getProgramName(row.Podcast),
        parentProgram: getParentProgram(getProgramName(row.Podcast)),
        podcast: row.Podcast,
        totalDownloads: row.Total_Listens,
        month: row.Month,
        year: row.Year
      }
    })
    return {
      metrics: "podcasts",
      data: data,
      columnNames: formatColumnNames(columnNames),
      years: [...new Set(years)],
      months: [...new Set(months)]
    };
  })
  return dataPromise
}

function validateCells(row) {
  if (
    row.Program == '' ||
    row.Number_of_Posts == '' ||
    row.Impressions == '' ||
    row.Engagements == '' ||
    row.Month == '' ||
    row.Year == ''
  ) {
    return true
  }
}

function formatColumnNames(columnNames) {
  return columnNames.map((name) => format(name))
}

function format(name) {
  return name.replaceAll("_", " ")
}

// function getProgramName(productName) {
//   let programName
//   if (helperDataset.dataFormatted.length > 1) {
//       helperDataset.dataFormatted
//       .filter( element => element !== '')
//       .filter( element => {
//       if (productName === element.productName) programName = element.program
//     })
//   }
//   return programName
// }

function getProgramName(productName) {
  if (helperDataset.dataFormatted.length > 1) {
    const matchingElement = helperDataset.dataFormatted
      .filter(
        (element) => element !== '' && productName === element.productName
      )
      .find((element) => element !== '')

    if (matchingElement) {
      return matchingElement.program
    }
  }

  return undefined // or null, or any other appropriate value if no match is found
}


function getParentProgram(name) {
  if (ispSubPrograms.includes(name)) {
    return 'International Security Program'
  }

  if (mepSubPrograms.includes(name)) {
    return 'Middle East Program'
  }

  if (seapSubPrograms.includes(name)) {
    return 'Southeast Asia Program'
  }

  return name
}
