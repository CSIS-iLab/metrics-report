import * as d3Fetch from 'd3-fetch'

// const googleAPIKey = "AIzaSyAImbihK2tiRewSFzuJTF_lcgPlGSr7zcg";
const googleAPIKey = "AIzaSyBXuQRRw4K4W8E4eGHoSFUSrK-ZwpD4Zz4";
const googleSpreadsheetKey = "1Dz-3ajTk7Q3UGZqZoH-6zMT-5ynGOFmSNBuGe23pzSk";
const googleSpreadsheetSocialMedia = "social_media";

const socialMediaPubURL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vT7w_KjpjOnWrTBRESsdR4B71EURLp-aFfOTqk5KnA9Y3uZ9FhfHndJtddFkq_jbbp5e1u346r1uG8V/edit#gid=0/pub?output=csv";
const socialMediaURL = `https://content-sheets.googleapis.com/v4/spreadsheets/${googleSpreadsheetKey}/values/${googleSpreadsheetSocialMedia}?key=${googleAPIKey}&majorDimension=ROWS`;
let socialMediaDataset = {}

// export async function getSocialMediaData() {
//   const response = await fetch(socialMediaURL)
//   const data = await response.json()
//   socialMediaDataset = data.values.map( (row, index) => {
//     return {
//       id: index,
//       program: 
//     }
//   })
//   console.log(socialMediaDataset) 
//   return socialMediaDataset;
// }

export function getSocialMediaData() {
  const dataPromise = d3Fetch.csv(socialMediaPubURL).then( res => {
    console.log(res)
    const data = res.map( (row, index ) => {
      return {
        id: index,

      }
    })

    return {
      data: data
    }
  })
  return dataPromise
}

export default { getSocialMediaData }

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
