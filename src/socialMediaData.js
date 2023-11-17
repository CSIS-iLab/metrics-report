import * as d3Fetch from 'd3-fetch'

let columnNames
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
  'Transnational Threats Project',
  'Intelligence, National Security, and Technology Program'
]
const mepSubPrograms = [
  'Brzezinski Chair in Global Security and Geostrategy',
  'Brzezinski Institute on Geostrategy'
]
const seapSubPrograms = ['Asia Maritime Transparency Initiative']

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
      years.push(row.Year)
      months.push(row.Month)

      // Validate if cells in rows are empty
      if (validateCells(row)) return {}

      return {
        id: index,
        program: row.Program,
        parentProgram: getParentProgram(row.Program),
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
