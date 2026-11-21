// ======================================================
// CAMPUSNEST IMAGES
// ======================================================

const unsplash = (id, width = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=85`;


// ======================================================
// HOME HERO
// ======================================================

// PG room with:
// - bed
// - study table
// - laptop
// - window
// - natural daylight

export const HOME_HERO_IMAGE =
  unsplash(
    "1768289269971-6171457bed13",
    1600
  );


// ======================================================
// LOGIN IMAGE
// ======================================================

export const LOGIN_SIDE_IMAGE =
  unsplash(
    "1570570665905-346e1b6be193",
    1400
  );


// ======================================================
// REGISTRATION IMAGE
// ======================================================

// Simple student PG room.
// Not a luxury hotel image.

export const REGISTER_SIDE_IMAGE =
  unsplash(
    "1721742736249-144eb3893c71",
    1400
  );


// ======================================================
// PG CARD IMAGES
// ======================================================

// Only plain, empty room/interior photos - no people,
// so a photo never visually clashes with a "For Boys" /
// "For Girls" tag on a listing.
export const ROOM_IMAGES = [

  unsplash(
    "1721742736249-144eb3893c71",
    800
  ),

  unsplash(
    "1570570665905-346e1b6be193",
    800
  ),

  unsplash(
    "1768289269971-6171457bed13",
    800
  ),

  unsplash(
    "1643897903946-b7ddb32c4780",
    800
  ),

  unsplash(
    "1691439053985-53c339604008",
    800
  ),

  // Simple single bed + desk, plain walls.
  unsplash(
    "1697899131342-2f311347f1c5",
    800
  ),

  // Attic single room, bed + small desk + window.
  unsplash(
    "1768080315797-892a70ce05ee",
    800
  ),

  // Plain desk/monitor setup, visible cables, blinds.
  unsplash(
    "1599502452586-113783ca7d82",
    800
  ),

  // Shared room, metal bunk beds.
  unsplash(
    "1555854877-bab0e564b8d5",
    800
  ),

  // Shared room, wooden bunk beds.
  unsplash(
    "1709805619372-40de3f158e83",
    800
  ),

  // Single bed, plain mattress, no decor.
  unsplash(
    "1549881567-c622c1080d78",
    800
  ),

];


// ======================================================
// GET IMAGE FOR PG
// ======================================================

export function roomImageFor(seed) {

  const number =
    typeof seed === "number"
      ? seed
      : String(seed || "").length;

  const index =
    ((number % ROOM_IMAGES.length) +
      ROOM_IMAGES.length) %
    ROOM_IMAGES.length;

  return ROOM_IMAGES[index];
}