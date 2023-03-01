// https://github.com/xkcdstickfigure/tyablo-api/blob/main/util/square.js

const circumference = 40075.017

export const square = (lat: number, lon: number, distance: number) => {
	let lat1 = calcLat(lat, -distance)
	let lon1 = calcLon(lon, -distance, lat1)

	let lat2 = calcLat(lat, distance)
	let lon2 = calcLon(lon, distance, lat2)

	return { lat1, lon1, lat2, lon2 }
}

export const calcLat = (from: number, distance: number) =>
	from + (360 * distance) / circumference

export const calcLon = (from: number, distance: number, lat: number) =>
	from + (360 * distance) / circumference / Math.cos((Math.PI / 180) * lat)
