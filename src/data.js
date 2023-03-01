import * as d3Fetch from 'd3-fetch'
import { getPressData } from './press'
import { getSocialMediaDataa } from './socialMediaData'

let pressDataset = {}
let socialMediaDataset = {}
let data = {}

const showingProgram = 'Africa' //to control who program
// const showingProgram = "Americas"; //to control who program

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
  pressDataset = await getPressData()
  socialMediaDataset = await getSocialMediaDataa()
  if (pressDataset && socialMediaDataset) {
    data = formatData(pressDataset, socialMediaDataset)

  }
  // return await getPressData()
  return data
}

function formatData(pressDataset, socialMediaDataset) {
  // console.log(pressDataset)
  // console.log(socialMediaDataset)
  const dataFilteredByProgram = pressDataset.data.filter(
    (row) => row.program == showingProgram
  )
  console.log(dataFilteredByProgram)
  // const dataFormatted
  return {
    data: {
      filtered: dataFilteredByProgram,
      showingProgram: showingProgram,
      metrics: pressDataset.metrics,
      columnNames: pressDataset.columnNames,
      years: pressDataset.years,
      months: pressDataset.months,
      spreadsheetsTabs: spreadsheetsTabs,

    }
  };
}

const URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSZbsWyNWxgbsJJd2AuaoNIJ2KkEplWSNK77gxcS_WndRrj1rNnPoxtPNl60HjlmdvQo4UvxBUMEi1S/pub?output=csv";

const spreadsheetsTabs = ['press','social_media', 'websites', 'podcasts', 'videos', 'publications']

export default { getNewData, getSocialMediaData }
