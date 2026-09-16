// Haversine distance between two coordinates
// Result is returned in kilometers.

export function distanceKm(
  lat1,
  lon1,
  lat2,
  lon2
) {

  if (
    [lat1, lon1, lat2, lon2].some(
      (value) =>
        value === null ||
        value === undefined ||
        Number.isNaN(Number(value))
    )
  ) {
    return null;
  }


  const toRad = (degree) =>
    (degree * Math.PI) / 180;


  const R = 6371;


  const dLat =
    toRad(
      Number(lat2) -
      Number(lat1)
    );


  const dLon =
    toRad(
      Number(lon2) -
      Number(lon1)
    );


  const a =
    Math.sin(dLat / 2) ** 2 +

    Math.cos(
      toRad(Number(lat1))
    ) *

    Math.cos(
      toRad(Number(lat2))
    ) *

    Math.sin(dLon / 2) ** 2;


  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );


  return R * c;
}