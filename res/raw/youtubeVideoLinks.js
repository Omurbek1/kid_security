import * as Utils from '../../Utils';
import json from './youtube.json';

export const getYoutubeVideoLink = async (lang, deviceModel, osVersion) => {
  const videosFromServerBlob = await fetch(`${Utils.getApiUrl()}config/youtube.json`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
  const videosFromServer = await videosFromServerBlob.json();
  return getData(videosFromServer, lang, deviceModel, osVersion) || getData(json);
};

const getData = (data, lang, deviceModel, osVersion) => {
  const vids = data[`${deviceModel}`.toLowerCase()];
  if (!vids) {
    return null;
  }
  const oses = vids[`os${parseInt(osVersion)}`];
  if (!oses) {
    return null;
  }

  let str = oses[`${lang}`];
  if (!str && '' !== str) {
    str = oses.en;
  }
  return str || null;
};
