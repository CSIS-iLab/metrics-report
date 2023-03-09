import * as d3Fetch from 'd3-fetch'
import { getPressData } from './press'
import { getSocialMediaDataa } from './socialMediaData'
import { getWebsitesData } from './websites'
import { getAboutContent } from './about'


let pressDataset = {}
let socialMediaDataset = {}
let websiteDataset = {}
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
  websiteDataset = await getWebsitesData()
  aboutDataset = await getAboutContent()
  if (pressDataset && socialMediaDataset && websiteDataset) {
    data = formatData(
      pressDataset,
      socialMediaDataset,
      websiteDataset,
      aboutDataset
    )
  }
  // return await getPressData()
  return data
}

export async function getContentData() {
  
}

function formatData(pressDataset, socialMediaDataset, websiteDataset) {
  // if (!showingProgram) {
  //   return {
  //     data: {
  //       filtered: ['no data'],
  //       showingProgram: null,
  //     }
  //   }
  // }
  // const dataFilteredByProgram = pressDataset.data.filter(
  //   (row) => row.program == showingProgram
  // )
  const dataFilteredByProgram = pressDataset.data
  // console.log(dataFilteredByProgram)
  return {
    data: {
      filtered: pressDataset.data,
      // to test the filter by program in the main container after doing the login
      // filtered: dataFilteredByProgram,
      // showingProgram: showingProgram,
      metrics: pressDataset.metrics,
      about: aboutDataset,
      tabs: unifiedData([pressDataset, socialMediaDataset, websiteDataset]),
      columnNames: pressDataset.columnNames,
      years: pressDataset.years.sort((a, b) => b - a),
      months: months,
      spreadsheetsTabs: spreadsheetsTabs
    }
  }
}

function unifiedData( params ) {
  // console.log('unifiedData')
  // console.log(params)
  const data = params.map( element => {
    const tab = element.metrics
    console.log( element )
    return {
      tab: tab,
      dataForm: element.data,
      dataColNames: element.columnNames

    }
  });
  return data
}

const URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSZbsWyNWxgbsJJd2AuaoNIJ2KkEplWSNK77gxcS_WndRrj1rNnPoxtPNl60HjlmdvQo4UvxBUMEi1S/pub?output=csv";

const spreadsheetsTabs = ['press','social_media', 'websites', 'podcasts', 'videos', 'publications']

export default { getNewData, getSocialMediaData }
