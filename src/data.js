import { getPressData } from './press'
import { getSocialMediaDataa } from './socialMediaData'
import { getWebsitesData } from './websites'
import { getPodcastData } from './podcasts'
import { getVideoData } from './videos'
import { getPublicationData } from './publications'
import { getAboutContent } from './about'


let pressDataset = {}
let socialMediaDataset = {}
let websiteDataset = {}
let podcastDataset = {}
let aboutDataset = {}
let videoDataset = {}
let publicationDataset = {}
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

export async function getNewData() {
  pressDataset = await getPressData()
  socialMediaDataset = await getSocialMediaDataa()
  websiteDataset = await getWebsitesData()
  podcastDataset  = await getPodcastData()
  videoDataset = await getVideoData()
  publicationDataset = await getPublicationData()
  aboutDataset = await getAboutContent()
  if (pressDataset && socialMediaDataset && websiteDataset && podcastDataset && videoDataset && publicationDataset && aboutDataset) {
    data = formatData(
      pressDataset,
      socialMediaDataset,
      websiteDataset,
      podcastDataset,
      videoDataset,
      publicationDataset,
      aboutDataset
    )
  }
  return data
}

function formatData(pressDataset, socialMediaDataset, websiteDataset, podcastDataset, videoDataset, publicationDataset) {
  return {
    data: {
      filtered: pressDataset.data,
      metrics: pressDataset.metrics,
      about: aboutDataset,
      tabs: unifiedData([pressDataset, socialMediaDataset, websiteDataset, podcastDataset, videoDataset, publicationDataset]),
      years: pressDataset.years.sort((a, b) => b - a),
      months: months,
      spreadsheetsTabs: spreadsheetsTabs
    }
  }
}

function unifiedData( params ) {
  const data = params.map( element => {
    // const tab = element.metrics
    return {
      tab: element.metrics,
      dataForm: element.data,
      dataColNames: element.columnNames
    }
  });
  return data
}


const spreadsheetsTabs = ['press','social_media', 'websites', 'podcasts', 'videos', 'publications']

export default { getNewData }
