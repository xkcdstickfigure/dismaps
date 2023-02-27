// https://github.com/xkcdstickfigure/tyablo-api/blob/main/util/square.js

const circumference = 40075.017

export default (lat: number, lon: number, distance: number) => {
	const lat1 = lat - (360 * distance) / circumference
	const lon1 =
		lon - (360 * distance) / circumference / Math.cos((Math.PI / 180) * lat1)

	const lat2 = lat + (360 * distance) / circumference
	const lon2 =
		lon + (360 * distance) / circumference / Math.cos((Math.PI / 180) * lat2)

	return { lat1, lon1, lat2, lon2 }
}
