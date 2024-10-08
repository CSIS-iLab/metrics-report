import * as d3Fetch from 'd3-fetch'
import { get } from 'svelte/store'
import { yearShowing } from './store'
import { getHelperData } from './videoHelper'

let helperDataset = {}
let columnNames = []
let years = []
let months = []
let URL

/* -------------------------------------------------------------------------- */
/*                  Pulling from the videos_ilab tab                          */
/* -------------------------------------------------------------------------- */
export async function getVideoData() {
  // if year is 2024
  if (get(yearShowing) === 2024)
    URL =
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vTj67l2D7wfqIr28Hx0eMvmXHMaMFxdqwL7yI3H-PoXvzfop0qHkPxaUT0RFCkGl0qqRrVMNbDuqgGa/pub?gid=387650855&single=true&output=csv'
  else // if year is 2023
    URL =
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7w_KjpjOnWrTBRESsdR4B71EURLp-aFfOTqk5KnA9Y3uZ9FhfHndJtddFkq_jbbp5e1u346r1uG8V/pub?gid=387650855&single=true&output=csv'
  return await fetchData(URL)
}

async function fetchData(URL) {
  helperDataset = await getHelperData()
  const dataPromise = d3Fetch.csv(URL).then((res) => {
    const data = res.map((row, index) => {
      if (index == 0) {
        columnNames.push('Program')
        columnNames.push(...Object.keys(row))
        columnNames.pop()
      }
      years = [get(yearShowing)]
      months.push(row.Month)
      return {
        id: index,
        program: getProgram(row.Tags),
        programsVideos: getProgramsArray(row.Tags),
        video_title: row.Video_Title,
        // description: row.Description,
        views: row.Views,
        total_watch_time_minutes: row.Total_Watch_Time_Minutes,
        average_percentage_viewed: row.Average_Percentage_Viewed,
        permalink: row.Permalink_URL,
        month: row.Month,
        year: Number(row.Year),
        tags: row.Tags
      }
    })
    return {
      metrics: 'videos',
      data: data,
      columnNames: removeDescriptionColumn(formatColumnNames(columnNames.slice(0, 8))),
      years: [get(yearShowing)],
      months: [...new Set(months)]
    }
  })
  return dataPromise
}

// function getProgram(string) {
//   let programName
//   const array = string
//     .split(' ')
//     .filter((v) => v.startsWith('#'))
//     .slice(0, 2)
//   if (helperDataset.dataFormatted.length > 1) {
//     helperDataset.dataFormatted
//       .filter((element) => element !== '')
//       .filter((element) => {
//         if (array[0] === element.productName) programName = element.program
//       })
//   }
//   return programName
// }

// function getProgramsArray(string) {
//   let programName = []
//   const array = string
//     .split(' ')
//     .filter((v) => v.startsWith('#'))
//     .slice(0, 2)
//   if (helperDataset.dataFormatted.length > 1) {
//     helperDataset.dataFormatted
//       .filter((element) => element !== '')
//       .filter((element) => {
//         if (array.includes(element.productName)) {
//           programName.push(element.program)
//         }
//       })
//   }
//   return programName
// }

function getProgram(string) {
  const array = string.split(' ').filter((v) => v.startsWith('#'))
  // .slice(0, 2)

  // Use the find method to get the first matching element
  const matchingElement = helperDataset.dataFormatted.find(
    (element) => element !== '' && array.includes(element.productName)
    // (element) => element !== '' && array[0] === element.productName
  )

  // Return the program if a matching element was found, or null otherwise
  // matchingElement ? console.log('matching', matchingElement.program) : console.log('nada')
  // return matchingElement ? matchingElement.program : null

  if (matchingElement) {
    // console.log(matchingElement)
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
  return null
}

function getProgramsArray(string) {
  const array = string
    .split(' ')
    .filter((v) => v.startsWith('#'))
    // .slice(0, 2)

  // Use a single filter statement to filter elements in helperDataset.dataFormatted
  const programName = helperDataset.dataFormatted
    .filter((element) => element !== '' && array.includes(element.productName))
    .map((element) => element.program)

  return programName
}

function removeDescriptionColumn(columnNames) {
  return columnNames.filter( name => name !== 'Description')
}

function formatColumnNames(columnNames) {
  // return columnNames.map((name) => format(name))
  return columnNames
    .sort((a, b) => (a === 'Month' ? -1 : b === 'Month' ? 1 : 0))
    .map(format)
    .filter((name) => name !== 'Year')
}

function format(name) {
  const formattedName = name.replaceAll('_', ' ')

  const specialCases = {
    'Total Watch Time Minutes': 'Total Watch Time (Minutes)',
    'Average Percentage Viewed': 'Average Percentage Viewed (%)'
  }

  return specialCases[formattedName] || formattedName
}
