import * as d3Fetch from 'd3-fetch'
import { get } from 'svelte/store'
import { yearShowing } from './store'
import { getHelperData } from './helper'

let helperDataset = {}
let columnNames
let years = []
let months = []
let URL
const ispSubPrograms = [
  'Aerospace Security Project',
  'Arleigh A. Burke Chair in Strategy',
  // 'Defending Democratic Institutions',
  'Defense-Industrial Initiatives Group',
  // 'Defense Budget Analysis',
  'Emeritus Chair in Strategy',
  'Missile Defense Project',
  // 'Project on Fragility and Mobility',
  'Project on Nuclear Issues',
  'Smart Women, Smart Power',
  'Transnational Threats Project',
  'Intelligence, National Security, and Technology Program',
  'Warfare, Irregular Threats, and Terrorism Program',
  'Defending Democratic Institutions',
  'Futures Lab'
]
const mepSubPrograms = [
  'Brzezinski Chair in Global Security and Geostrategy',
  'Brzezinski Institute on Geostrategy'
]
const seapSubPrograms = ['Asia Maritime Transparency Initiative']

export async function getPodcastData() {
  // if year is 2024
  if (get(yearShowing) === 2024)
    URL =
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vTj67l2D7wfqIr28Hx0eMvmXHMaMFxdqwL7yI3H-PoXvzfop0qHkPxaUT0RFCkGl0qqRrVMNbDuqgGa/pub?gid=553537768&single=true&output=csv'
  // if year is 2023
  else
    URL =
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7w_KjpjOnWrTBRESsdR4B71EURLp-aFfOTqk5KnA9Y3uZ9FhfHndJtddFkq_jbbp5e1u346r1uG8V/pub?gid=553537768&single=true&output=csv'
  return await fetchData(URL)
}

async function fetchData(URL) {
  helperDataset = await getHelperData()
  const dataPromise = d3Fetch.csv(URL).then((res) => {
    const data = res.map((row, index) => {
      if (index == 0) {
        columnNames = []
        columnNames.push('Program')
        columnNames.push(...Object.keys(row))
      }
      // years.push(row.Year)
      years = [get(yearShowing)]
      months.push(row.Month)

      // Validate if cells in rows are empty
      if (validateCells(row)) return {}

      return {
        id: index,
        program: getProgramName(row.Podcast),
        parentProgram: getParentProgram(getProgramName(row.Podcast)),
        podcast: fixPodcastsName(row.Podcast),
        total_listens: row.Total_Listens,
        month: row.Month,
        year: Number(row.Year)
      }
    })
    return {
      metrics: 'podcasts',
      data: data,
      columnNames: formatColumnNames(columnNames),
      years: [get(yearShowing)],
      months: [...new Set(months)]
    }
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
  // return columnNames.map((name) => format(name))
  return columnNames
    .sort((a, b) => (a === 'Month' ? -1 : b === 'Month' ? 1 : 0))
    .map(format)
    .filter((name) => name !== 'Year')
}

function format(name) {
  return name.replaceAll('_', ' ')
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

// IMPORTANT make sure to add the podcast name in the 2023 spreadsheet under the tab helper_internal_use
function getProgramName(productName) {
  if (helperDataset.dataFormatted.length > 1) {
    const matchingElement = helperDataset.dataFormatted
      .filter(
        (element) => element !== '' && productName === element.productName
      )
      .find((element) => element !== '')

    if (matchingElement) {
      console.log(matchingElement)
      const ispProgramNames = [
        'Transnational Threats Project',
        'Warfare, Irregular Threats, and Terrorism Program'
      ]

      if (ispProgramNames.includes(matchingElement.program)) {
        matchingElement.program =
          'Warfare, Irregular Threats, and Terrorism Program'
      }
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

// function updateISPProgramName(name) {
//   console.log(name)
//   const ispProgramNames = [
//     'Transnational Threats Project',
//     'Warfare, Irregular Threats, and Terrorism Program'
//   ]

//   if (ispProgramNames.includes(name)) {
//     return 'Warfare, Irregular Threats, and Terrorism Program'
//   }

//   return name
// }

function fixPodcastsName(name) {
  const nameMapping = {
    'NATOâ€™s Road to Madrid': 'NATO’s Road to Madrid',
    'Energy 360Â°': 'Energy 360°'
    // Add more name mappings as needed
  }

  const fixedName = nameMapping[name] || name

  return fixedName
}
