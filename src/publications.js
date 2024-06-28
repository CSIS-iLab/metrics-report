import * as d3Fetch from 'd3-fetch'
import { get } from 'svelte/store'
import { yearShowing } from './store'
// import { getHelperData } from "./helper"
import { getHelperData } from "./publicationHelper"
// helper_internal_use_publications

let helperDataset = {}
let columnNames
let years = []
let months = []
let URL

export async function getPublicationData() {
  // if year is 2024
  if (get(yearShowing) === 2024)
    URL =
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vTj67l2D7wfqIr28Hx0eMvmXHMaMFxdqwL7yI3H-PoXvzfop0qHkPxaUT0RFCkGl0qqRrVMNbDuqgGa/pub?gid=404371537&single=true&output=csv'
  else // if year is 2023
    URL =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vT7w_KjpjOnWrTBRESsdR4B71EURLp-aFfOTqk5KnA9Y3uZ9FhfHndJtddFkq_jbbp5e1u346r1uG8V/pub?gid=404371537&single=true&output=csv"
  return await fetchData(URL)
}

async function fetchData(URL) {
  helperDataset = await getHelperData()
  const dataPromise = d3Fetch.csv( URL ).then( res => {
    const data = res.map( (row, index ) => {
      if (index == 0) {
        columnNames = Object.keys(row)
      }
      years = [get(yearShowing)]
      months.push(row.Month)

      return {
        id: index,
        program: row.Program,
        programsNames: getProgramsArray(row.Program),
        title: formatTitle(row.Title),
        url: 'https://www.csis.org' + row.Title,
        publication_type: row.Publication_Type,
        views: Number(row.Views),
        // engagements: Number(row.Engagements),
        month: row.Month,
        year: Number(row.Year)
      }
    })
    return {
      metrics: 'publications',
      data: data,
      columnNames: formatColumnNames(columnNames),
      years: [get(yearShowing)],
      months: [...new Set(months)]
    }
  })
  // console.log(dataPromise)
  return dataPromise
}

function formatTitle(title) {
  if (title == undefined) return
  // Extract the last part of the URL path
  const lastSegment = title.split('/').pop()
  // Replace hyphens with spaces and split into words
  const words = lastSegment.split('-')
  // Capitalize the first letter of each word
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  )
  // Join the words back into a string
  return capitalizedWords.join(' ')
}

function formatColumnNames(columnNames) {
  // return columnNames.map((name) => format(name))
  return columnNames
    .sort((a, b) => (a === 'Month' ? -1 : b === 'Month' ? 1 : 0))
    .map(format)
    .filter((name) => name !== 'Year')
}

function format(name) {
  return name.replaceAll("_", " ")
}

function getProgramsArray(string) {
  if (string === '#N/A' || string === undefined) {
    return
  }
  const names = string.split('|')
  const matchingElement = helperDataset.dataFormatted.filter( element => {
    return names.some(name => name === element.productName)
  })
  if (matchingElement.length > 0) {
    return matchingElement.map( name => replaceAMTI(name.program))
  }
  return names.map(name => replaceAMTI(name))
}

function replaceAMTI(programName) {
  if (programName === 'Asia Maritime Transparency Initiative') {
    return 'Southeast Asia Program'
  }

  const ispProgramNames = [
    'Transnational Threats Project',
    'Warfare, Irregular Threats, and Terrorism Program'
  ]

  if (ispProgramNames.includes(programName)) {
    return 'Warfare, Irregular Threats, and Terrorism Program'
  }

  return programName
}