"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleWLAN = exports.getWLAN = exports.unauthorize_guest = exports.authorize_guest = void 0;
const authorize_guest = async (unifi, mac, minutes = null, up = null, down = null, megabytes = null, ap_mac = null) => {
    const response = await unifi.authorizeGuest(mac, minutes, up, down, megabytes, ap_mac);
    console.log('Authorize Guest Response:', response);
    return response;
};
exports.authorize_guest = authorize_guest;
const unauthorize_guest = async (unifi, mac) => {
    const response = await unifi.unauthorizeGuest(mac);
    console.log('Unauthorize Guest Response:', response);
    return response;
};
exports.unauthorize_guest = unauthorize_guest;
const getWLAN = async (unifi, ssid) => {
    const wlans = await unifi.getWLanSettings();
    const wlan = wlans.find((wlan) => wlan.name === ssid);
    const wlanInfo = {
        id: wlan._id,
        ssid: wlan.name,
        enabled: wlan.enabled,
    };
    console.log('Get WLAN Response:', wlanInfo);
    return wlanInfo;
};
exports.getWLAN = getWLAN;
const toggleWLAN = async (unifi, ssid) => {
    const { id, enabled } = await (0, exports.getWLAN)(unifi, ssid);
    const response = await unifi.disableWLan(id, enabled);
    console.log('Toggle WLAN Response:', response);
    return response;
};
exports.toggleWLAN = toggleWLAN;
