import * as d3Fetch from "d3-fetch";

import { getPressData } from "./press"
import { getSocialMediaData } from "./socialMediaData"

// const googleAPIKey = "AIzaSyAImbihK2tiRewSFzuJTF_lcgPlGSr7zcg";
const googleAPIKey = "AIzaSyBXuQRRw4K4W8E4eGHoSFUSrK-ZwpD4Zz4";
const googleSpreadsheetKey = "1Dz-3ajTk7Q3UGZqZoH-6zMT-5ynGOFmSNBuGe23pzSk";
const googleSpreadsheetSocialMedia = "social_media";

const socialMediaURL = `https://content-sheets.googleapis.com/v4/spreadsheets/${googleSpreadsheetKey}/values/${googleSpreadsheetSocialMedia}?key=${googleAPIKey}&majorDimension=ROWS`;
let socialMediaDataset = {}
let pressDataset = {}

async function socialMediaData() {
  // const response = await fetch(socialMediaURL)
  // const data = await response.json()
  socialMediaDataset = await getSocialMediaData()
  // console.log(socialMediaDataset)
  return socialMediaDataset
}

async function pressData() {
  // console.log(socialMediaDataset)
  pressDataset = await getPressData()
  return pressDataset
}

async function formatData() {
  // await socialMediaData()
  // await pressData()
  pressDataset = await getPressData()
  socialMediaDataset = await getSocialMediaData()
  // console.log(socialMediaDataset)
  // console.log(pressDataset)
  const data = {
    press: await getPressData(),
    socialMedia: socialMediaDataset,
  };
  // console.log(data)
  return data
}

const URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSZbsWyNWxgbsJJd2AuaoNIJ2KkEplWSNK77gxcS_WndRrj1rNnPoxtPNl60HjlmdvQo4UvxBUMEi1S/pub?output=csv";

const spreadsheetsTabs = [
  "press",
  "social_media",
  "websites",
  "podcasts",
  "videos",
  "publications",
];
const policyGoals = [
  "Emissions_Reduction",
  "Economic_Development",
  "Resilience",
];
const tags = [
  "Anticipating_Climate_Impacts",
  "Comprehensive_Planning_Grid_Modernization",
  "Data_Transparency_or_Visualization",
  "Electric_Vehicles",
  "Energy_Storage",
  "Environmental_Justice",
  "Innovation_and_Clusters",
  "Local-Level_Planning_or_Support",
  "Microgrids",
  "Distributed_Energy_Resources_(DERs)",
  "Technology_or_System_Standards",
  "Workforce_Development",
];

export async function getData() {
  const newData = await formatData()
  const dataPromise = d3Fetch.csv(URL).then((res) => {
    // console.log(res)
    const data = res.map((row, index) => {
      return {
        id: index,
        policy_goals: policyGoals.filter((goalName) => row[goalName]),
        tags: tags
          .filter((tagName) => row[tagName])
          .map((tagName) => tagName.split("_").join(" ")),
        activity: {
          title: row.title,
          description: row.description,
          link: row.URL,
        },
        state: row.state,
        state_name: row.state_name,
        authority: row.authority,
        type_of_resource: row.type_of_resource,
      };
    });

    const authority = formatAuthority(data);

    const resourceTypes = formatResourceType(data);

    const states = formatStates(data);

    return {
      data: data,
      states: states,
      newData: newData,
      tags: tags.map((tagName) => tagName.split("_").join(" ")),
      authority: authority,
      resourceTypes: resourceTypes,
      policyGoals: policyGoals,
      spreadsheetsTabs: spreadsheetsTabs,
    };
  });
  return dataPromise;
}

function formatAuthority(array) {
  return [...new Set(array.map((el) => el.authority))];
}

function formatResourceType(array) {
  return [...new Set(array.map((el) => el.type_of_resource))];
}

function formatStates(row) {
  return [...new Set(row.map((r) => r.state))].map((state) => {
    return {
      name: row.find((r) => r.state === state).state_name,
      value: row.find((r) => r.state === state).state,
    };
  });
}

export default { getData }
