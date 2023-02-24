import * as d3Fetch from 'd3-fetch'
import { gettPressData } from './press'
import { getSocialMediaDataa } from './socialMediaData'

let pressDataset = {}
let socialMediaDataset = {}
let data = {}

const showingProgram = 'Africa' //to control who program

// const googleAPIKey = "AIzaSyAImbihK2tiRewSFzuJTF_lcgPlGSr7zcg";
const googleAPIKey = "AIzaSyBXuQRRw4K4W8E4eGHoSFUSrK-ZwpD4Zz4";
const googleSpreadsheetKey = "1Dz-3ajTk7Q3UGZqZoH-6zMT-5ynGOFmSNBuGe23pzSk";
const googleSpreadsheetSocialMedia = "social_media";

const socialMediaURL = `https://content-sheets.googleapis.com/v4/spreadsheets/${googleSpreadsheetKey}/values/${googleSpreadsheetSocialMedia}?key=${googleAPIKey}&majorDimension=ROWS`;

export async function getSocialMediaData() {
  const response = await fetch(socialMediaURL)
  const data = await response.json()
  socialMediaDataset = data.values
  // console.log(socialMediaDataset)
  return data;
}


export async function getNewData() {
  pressDataset = await gettPressData()
  socialMediaDataset = await getSocialMediaDataa()
  if (pressDataset && socialMediaDataset) {
    data = formatData(pressDataset, socialMediaDataset)

  }
  // return await gettPressData()
  return data
}

function formatData(pressDataset, socialMediaDataset) {
  console.log(pressDataset)
  console.log(socialMediaDataset)
  const dataFilteredByProgram = pressDataset.data.filter(
    (row) => row.program == showingProgram
  )
  console.log(dataFilteredByProgram)
  // const dataFormatted
  return {
    data: {
      filtered: dataFilteredByProgram,
      metrics: pressDataset.metrics,
      columnNames: pressDataset.columnNames
    }
  };
}

const URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSZbsWyNWxgbsJJd2AuaoNIJ2KkEplWSNK77gxcS_WndRrj1rNnPoxtPNl60HjlmdvQo4UvxBUMEi1S/pub?output=csv";

const spreadsheetsTabs = ['press','social_media', 'websites', 'podcasts', 'videos', 'publications']
const policyGoals = ['Emissions_Reduction', 'Economic_Development', 'Resilience']
const tags = ['Anticipating_Climate_Impacts', 'Comprehensive_Planning_Grid_Modernization', 'Data_Transparency_or_Visualization', 'Electric_Vehicles', 'Energy_Storage', 'Environmental_Justice', 'Innovation_and_Clusters', 'Local-Level_Planning_or_Support', 'Microgrids', 'Distributed_Energy_Resources_(DERs)', 'Technology_or_System_Standards', 'Workforce_Development']

export async function getDataa() {
  const dataPromise = d3Fetch.csv(URL).then(res => {
    // console.log(res)
    const data = res.map((row, index) => {
      return {
        id: index,
        policy_goals: policyGoals.filter((goalName) => row[goalName]),
        tags: tags.filter((tagName) => row[tagName]).map(tagName => tagName.split('_').join(' ')),
        activity: {
          title: row.title,
          description: row.description,
          link: row.URL
        },
        state: row.state,
        state_name: row.state_name,
        authority: row.authority,
        type_of_resource: row.type_of_resource,
      }
    })

    const authority = formatAuthority(data)

    const resourceTypes = formatResourceType(data)

    const states = formatStates(data)

    return {
      data: data,
      press: pressDataset,
      states: states,
      tags: tags.map(tagName => tagName.split('_').join(' ')),
      authority: authority,
      resourceTypes: resourceTypes,
      policyGoals: policyGoals,
      spreadsheetsTabs: spreadsheetsTabs
    }
  })
  return dataPromise
}

export default { getDataa, getNewData, getSocialMediaData }

function formatAuthority(array) {
  return [...new Set(array.map(el => el.authority))]
}

function formatResourceType(array) {
  return [...new Set(array.map(el => el.type_of_resource))]
}

function formatStates(row) {
  return [...new Set(row.map(r => r.state))]
    .map(state => {
      return {
        name: row.find(r => r.state === state).state_name,
        value: row.find(r => r.state === state).state,
      }
    })
}
