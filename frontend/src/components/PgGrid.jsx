import { useState } from "react";

import {
  BedIcon,
  CloseIcon,
  HeartIcon,
  MapPinIcon,
  PhoneIcon,
  UtensilsIcon,
  WifiIcon,
} from "./icons";

import { roomImageFor } from "../constants/images";


const FAVORITES_KEY =
  "campusnest_favorites";


// ======================================================
// READ FAVORITES
// ======================================================

function readFavorites() {

  try {

    const raw =
      localStorage.getItem(
        FAVORITES_KEY
      );

    return raw
      ? JSON.parse(raw)
      : [];

  } catch {

    return [];

  }
}


// ======================================================
// AMENITY ICONS
// ======================================================

const AMENITY_ICONS = {

  wifi: WifiIcon,

  food: UtensilsIcon,

  mess: UtensilsIcon,

};


// ======================================================
// GET AMENITY ICON
// ======================================================

function amenityIcon(name) {

  const Icon =
    AMENITY_ICONS[
      name.toLowerCase()
    ];

  return Icon
    ? <Icon />
    : null;
}


// ======================================================
// GENDER TAG
// ======================================================

function genderTag(gender) {

  if (gender === "MALE") {

    return {
      label: "For Boys",
      className: "pg-tag-boys",
    };

  }

  if (gender === "FEMALE") {

    return {
      label: "For Girls",
      className: "pg-tag-girls",
    };

  }

  return null;
}


// ======================================================
// PG GRID
// ======================================================

function PgGrid({ pgs, loading }) {

  const [active, setActive] =
    useState(null);

  const [favorites, setFavorites] =
    useState(readFavorites);


  // ====================================================
  // FAVORITE
  // ====================================================

  const toggleFavorite = (id) => {

    setFavorites((current) => {

      const next =
        current.includes(id)

          ? current.filter(
              (item) => item !== id
            )

          : [...current, id];

      try {

        localStorage.setItem(
          FAVORITES_KEY,
          JSON.stringify(next)
        );

      } catch {
        // Ignore localStorage errors
      }

      return next;

    });

  };


  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {

    return (

      <div className="nearby-panel nearby-loading">

        <div className="spinner"></div>

        <p>
          Loading PG listings...
        </p>

      </div>

    );

  }


  // ====================================================
  // EMPTY
  // ====================================================

  if (!pgs || pgs.length === 0) {

    return (

      <div className="nearby-panel nearby-empty">

        <div className="nearby-idle-icon">
          <BedIcon />
        </div>

        <h3>
          No PGs found
        </h3>

        <p>
          Try another college or
          change your filters.
        </p>

      </div>

    );

  }


  return (

    <>

      {/* =================================================
          PG GRID
      ================================================= */}

      <div className="pg-grid">

        {pgs.map((pg) => {

          const tag =
            genderTag(pg.gender);

          const amenityList =
            (pg.amenities || "")
              .split(",")
              .map(
                (item) => item.trim()
              )
              .filter(Boolean);

          const isFavorite =
            favorites.includes(pg.id);


          return (

            <div
              className="pg-card"
              key={pg.id}
            >

              {/* =================================================
                  IMAGE
              ================================================= */}

              <div className="pg-image">

                <img
                  src={roomImageFor(
                    pg.id ?? pg.name
                  )}
                  alt={
                    pg.name ||
                    "PG room"
                  }
                />


                {/* GENDER */}

                {tag && (

                  <span
                    className={`pg-tag ${tag.className}`}
                  >
                    {tag.label}
                  </span>

                )}


                {/* FAVORITE */}

                <button
                  type="button"
                  className={`pg-favorite ${
                    isFavorite
                      ? "pg-favorite-active"
                      : ""
                  }`}

                  onClick={() =>
                    toggleFavorite(
                      pg.id
                    )
                  }

                  aria-label={
                    isFavorite
                      ? "Remove from favorites"
                      : "Save to favorites"
                  }
                >

                  <HeartIcon
                    filled={isFavorite}
                  />

                </button>


                {/* DISTANCE */}

                {pg.distanceKm !== null &&
                  pg.distanceKm !== undefined && (

                    <span className="pg-distance-badge">

                      {pg.distanceKm.toFixed(1)}
                      {" "}km away

                    </span>

                  )}

              </div>


              {/* =================================================
                  CARD BODY
              ================================================= */}

              <div className="pg-card-body">

                <h3>
                  {pg.name ||
                    "CampusNest PG"}
                </h3>


                {/* LOCATION */}

                <p className="pg-location">

                  <MapPinIcon />

                  {pg.address ||
                    pg.city ||
                    "Location unavailable"}

                </p>


                {/* RENT + ROOMS */}

                <div className="pg-details">

                  <div>

                    <span>
                      Monthly Rent
                    </span>

                    <strong>
                      ₹{pg.rent ?? "N/A"}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Available Rooms
                    </span>

                    <strong>
                      {pg.availableRooms ??
                        "N/A"}
                    </strong>

                  </div>

                </div>


                {/* AMENITIES */}

                {amenityList.length > 0 && (

                  <div className="pg-amenities">

                    {amenityList
                      .slice(0, 4)
                      .map((amenity) => (

                        <span
                          className="pg-amenity-chip"
                          key={amenity}
                        >

                          {amenityIcon(
                            amenity
                          )}

                          {amenity}

                        </span>

                      ))}


                    {amenityList.length > 4 && (

                      <span className="pg-amenity-chip pg-amenity-more">

                        +{amenityList.length - 4}

                      </span>

                    )}

                  </div>

                )}


                {/* DETAILS BUTTON */}

                <button
                  className="btn btn-outline btn-block"

                  onClick={() =>
                    setActive(pg)
                  }
                >

                  View Details

                </button>

              </div>

            </div>

          );

        })}

      </div>


      {/* =================================================
          DETAILS MODAL
      ================================================= */}

      {active && (

        <div
          className="modal-overlay"
          onClick={() =>
            setActive(null)
          }
        >

          <div
            className="modal-card"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* CLOSE */}

            <button
              className="modal-close"

              onClick={() =>
                setActive(null)
              }

              aria-label="Close"
            >

              <CloseIcon />

            </button>


            {/* IMAGE */}

            <img
              src={roomImageFor(
                active.id ??
                  active.name
              )}
              alt={active.name}
              className="modal-image"
            />


            {/* NAME */}

            <h3>
              {active.name ||
                "CampusNest PG"}
            </h3>


            {/* ADDRESS */}

            <p className="pg-location">

              <MapPinIcon />

              {active.address ||
                active.city ||
                "Location unavailable"}

            </p>


            {/* DETAILS */}

            <div className="pg-details">

              <div>

                <span>
                  Monthly Rent
                </span>

                <strong>
                  ₹{active.rent ??
                    "N/A"}
                </strong>

              </div>


              <div>

                <span>
                  Available Rooms
                </span>

                <strong>
                  {active.availableRooms ??
                    "N/A"}
                </strong>

              </div>


              <div>

                <span>
                  Gender
                </span>

                <strong>
                  {active.gender ||
                    "Any"}
                </strong>

              </div>

            </div>


            {/* DISTANCE */}

            {active.distanceKm !==
              null &&
              active.distanceKm !==
                undefined && (

                <div className="modal-distance">

                  <MapPinIcon />

                  {active.distanceKm.toFixed(
                    1
                  )}{" "}
                  km from selected college

                </div>

              )}


            {/* DESCRIPTION */}

            {active.description && (

              <p className="modal-description">

                {active.description}

              </p>

            )}


            {/* AMENITIES */}

            {active.amenities && (

              <div className="pg-amenities">

                {active.amenities
                  .split(",")
                  .map(
                    (item) =>
                      item.trim()
                  )
                  .filter(Boolean)
                  .map((amenity) => (

                    <span
                      className="pg-amenity-chip"
                      key={amenity}
                    >

                      {amenityIcon(
                        amenity
                      )}

                      {amenity}

                    </span>

                  ))}

              </div>

            )}


            {/* CALL */}

            {active.phone && (

              <a
                className="btn btn-primary btn-block"
                href={`tel:${active.phone}`}
              >

                <PhoneIcon />

                Call {active.phone}

              </a>

            )}

          </div>

        </div>

      )}

    </>

  );

}

export default PgGrid;