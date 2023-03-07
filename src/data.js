import * as d3Fetch from 'd3-fetch'
import { getPressData } from './press'
import { getSocialMediaDataa } from './socialMediaData'
import { getAboutContent } from './about'


let pressDataset = {}
let socialMediaDataset = {}
let aboutDataset ={}
let data = {}
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const showingProgram = '' //to control who program
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
  aboutDataset = await getAboutContent()
  if (pressDataset && socialMediaDataset) {
    data = formatData(pressDataset, socialMediaDataset, aboutDataset)
  }
  // return await getPressData()
  return data
}

export async function getContentData() {
  
}

function formatData(pressDataset, socialMediaDataset) {
  if (!showingProgram) {
    return {
      data: {
        filtered: ['no data'],
        showingProgram: null,
      }
    }
  }
  const dataFilteredByProgram = pressDataset.data.filter(
    (row) => row.program == showingProgram
  )
  console.log(dataFilteredByProgram)
  return {
    data: {
      filtered: dataFilteredByProgram,
      showingProgram: showingProgram,
      metrics: pressDataset.metrics,
      about: aboutDataset,
      tabs: unifiedData([pressDataset, socialMediaDataset]),
      columnNames: pressDataset.columnNames,
      years: pressDataset.years,
      months: months,
      spreadsheetsTabs: spreadsheetsTabs,

    }
  };
}

function unifiedData(params) {
  console.log('unifiedData')
  console.log(params)
  const data = params.map(element => {
    const tab = element.metrics
    return {
      tab: tab,
      dataForm: element.data
    }
  });
  return data
}

const URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSZbsWyNWxgbsJJd2AuaoNIJ2KkEplWSNK77gxcS_WndRrj1rNnPoxtPNl60HjlmdvQo4UvxBUMEi1S/pub?output=csv";

const spreadsheetsTabs = ['press','social_media', 'websites', 'podcasts', 'videos', 'publications']

export default { getNewData, getSocialMediaData }
