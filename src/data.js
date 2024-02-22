import { getPressData } from './press'
import { getSocialMediaDataa } from './socialMediaData'
// import { getWebsitesData } from './websites'
import { getPodcastData } from './podcasts'
import { getVideoData } from './videos'
import { getVideoEventsData } from './videosEvents'
import { getVideoPodcastsData } from './videosPodcasts'
import { getVideoShortsData } from './videosShorts'
import { getPublicationData } from './publications'
import { getAboutContent } from './about'

/* -------------------------------------------------------------------------- */
/*          Website and Videos shorts will be included in the phase 2         */
/* -------------------------------------------------------------------------- */

let pressDataset = {}
let socialMediaDataset = {}
let websiteDataset = {}
let podcastDataset = {}
let aboutDataset = {}
let videoDataset = {}
let videoEventsDataset = {}
let videoShortsDataset = {}
let videoPodcastsDataset = {}
let publicationDataset = {}
let data = {}
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

// Mapping of month names to their chronological order
const monthOrder = {
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12,
}

const publication_type = ['Brief', 'Commentary', 'Critical Questions', 'Report']

export async function getNewData() {
  pressDataset = await getPressData()
  socialMediaDataset = await getSocialMediaDataa()
  // websiteDataset = await getWebsitesData()
  podcastDataset = await getPodcastData()
  videoDataset = await getVideoData()
  videoEventsDataset = await getVideoEventsData()
  videoShortsDataset = await getVideoShortsData()
  videoPodcastsDataset = await getVideoPodcastsData()
  publicationDataset = await getPublicationData()
  aboutDataset = await getAboutContent()
  if (
    pressDataset &&
    socialMediaDataset &&
    websiteDataset &&
    podcastDataset &&
    videoDataset &&
    videoEventsDataset &&
    videoShortsDataset &&
    videoPodcastsDataset &&
    publicationDataset &&
    aboutDataset
  ) {
    data = formatData(
      pressDataset,
      socialMediaDataset,
      websiteDataset,
      podcastDataset,
      videoDataset,
      videoEventsDataset,
      videoShortsDataset,
      videoPodcastsDataset,
      publicationDataset,
      aboutDataset
    )
  }
  return data
}

function formatData(
  pressDataset,
  socialMediaDataset,
  websiteDataset,
  podcastDataset,
  videoDataset,
  videoEventsDataset,
  videoShortsDataset,
  videoPodcastsDataset,
  publicationDataset
) {
  return {
    data: {
      about: aboutDataset,
      tabs: unifiedData([
        pressDataset,
        socialMediaDataset,
        websiteDataset,
        podcastDataset,
        videoDataset,
        videoEventsDataset,
        videoShortsDataset,
        videoPodcastsDataset,
        publicationDataset
      ]),
      // years: pressDataset.years.sort((a, b) => b - a),
      months: months,
      monthOrder: monthOrder,
      publication_type: publication_type,
      spreadsheetsTabs: spreadsheetsTabs
    }
  }
}

function unifiedData(params) {
  const data = params.map((element) => {
    return {
      tab: element.metrics,
      dataForm: element.data,
      dataColNames: element.columnNames
    }
  })
  return data
}

const spreadsheetsTabs = [
  'press',
  'social_media',
  // 'program_sites',
  'podcasts',
  'podcasts_(Video)',
  'videos', // this is pulling from the videos_ilab tab
  'events',
  'YouTube_shorts',
  'publications'
]

export default { getNewData }
