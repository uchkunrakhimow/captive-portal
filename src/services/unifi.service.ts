export const authorize_guest = async (
  unifi: any,
  mac: any,
  minutes = null,
  up = null,
  down = null,
  megabytes = null,
  ap_mac: string | any = null,
) => {
  const response = await unifi.authorizeGuest(
    mac,
    minutes,
    up,
    down,
    megabytes,
    ap_mac,
  );
  console.log('Authorize Guest Response:', response);
  return response;
};

export const unauthorize_guest = async (unifi: any, mac: any) => {
  const response = await unifi.unauthorizeGuest(mac);
  console.log('Unauthorize Guest Response:', response);
  return response;
};

export const getWLAN = async (unifi: any, ssid: any) => {
  const wlans = await unifi.getWLanSettings();
  const wlan = wlans.find((wlan: any) => wlan.name === ssid);
  const wlanInfo = {
    id: wlan._id,
    ssid: wlan.name,
    enabled: wlan.enabled,
  };
  console.log('Get WLAN Response:', wlanInfo);
  return wlanInfo;
};

export const toggleWLAN = async (unifi: any, ssid: any) => {
  const { id, enabled } = await getWLAN(unifi, ssid);
  const response = await unifi.disableWLan(id, enabled);
  console.log('Toggle WLAN Response:', response);
  return response;
};
