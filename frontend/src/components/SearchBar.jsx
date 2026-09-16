import { useEffect, useRef, useState } from "react";

import { searchColleges } from "../api/client";
import { AMENITIES } from "../constants/amenities";

import {
  BuildingIcon,
  MapPinIcon,
  SearchIcon,
  UsersIcon,
  WalletIcon,
  UtensilsIcon,
} from "./icons";

import FilterDropdown from "./FilterDropdown";


// ======================================================
// RENT FILTER
// ======================================================

const RENT_RANGES = [
  {
    label: "Any",
    minRent: "",
    maxRent: "",
  },
  {
    label: "Under ₹5,000",
    minRent: "",
    maxRent: "5000",
  },
  {
    label: "₹5,000 – ₹10,000",
    minRent: "5000",
    maxRent: "10000",
  },
  {
    label: "Above ₹10,000",
    minRent: "10000",
    maxRent: "",
  },
];


// ======================================================
// SEARCH BAR
// ======================================================

function SearchBar({ onSearch, loading }) {

  const [query, setQuery] = useState("");

  const [suggestions, setSuggestions] = useState([]);

  const [showSuggestions, setShowSuggestions] =
    useState(false);

  const [selectedCollege, setSelectedCollege] =
    useState(null);

  const boxRef = useRef(null);


  // ====================================================
  // FILTER STATES
  // ====================================================

  const [gender, setGender] = useState("");

  const [rentRange, setRentRange] =
    useState(RENT_RANGES[0]);

  const [distanceRadius, setDistanceRadius] =
    useState("5");

  const [amenities, setAmenities] =
    useState([]);


  // ====================================================
  // COLLEGE SEARCH
  // ====================================================

  const skipLookup =
    !query.trim() ||
    (selectedCollege &&
      selectedCollege.name === query);


  useEffect(() => {

    if (skipLookup) {
      return;
    }

    const timer = setTimeout(async () => {

      try {

        const results =
          await searchColleges(query);

        setSuggestions(
          results.slice(0, 6)
        );

        setShowSuggestions(true);

      } catch (error) {

        console.error(error);

        setSuggestions([]);

      }

    }, 300);


    return () => clearTimeout(timer);

  }, [query, skipLookup]);


  // ====================================================
  // CLOSE SUGGESTIONS OUTSIDE CLICK
  // ====================================================

  useEffect(() => {

    const handleClickOutside = (event) => {

      if (
        boxRef.current &&
        !boxRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }

    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };

  }, []);


  // ====================================================
  // SELECT COLLEGE
  // ====================================================

  const pickSuggestion = (college) => {

    setSelectedCollege(college);

    setQuery(college.name);

    setSuggestions([]);

    setShowSuggestions(false);

  };


  // ====================================================
  // TOGGLE AMENITY
  // ====================================================

  const toggleAmenity = (amenity) => {

    setAmenities((current) => {

      if (current.includes(amenity)) {

        return current.filter(
          (item) => item !== amenity
        );

      }

      return [...current, amenity];

    });

  };


  // ====================================================
  // SEARCH
  // ====================================================

  const runSearch = (event) => {

    event.preventDefault();

    onSearch({

      collegeName: query.trim(),

      college:
        selectedCollege &&
        selectedCollege.name === query
          ? selectedCollege
          : null,

      gender,

      minRent: rentRange.minRent,

      maxRent: rentRange.maxRent,

      distanceRadius:
        Number(distanceRadius),

      amenities,

    });

  };


  return (

    <form
      className="search-bar"
      onSubmit={runSearch}
    >

      {/* =================================================
          MAIN SEARCH ROW
      ================================================= */}

      <div
        className="search-bar-row"
        ref={boxRef}
      >

        {/* COLLEGE SEARCH */}

        <div className="input-with-icon search-bar-input">

          <BuildingIcon />

          <input
            id="college-input"
            type="text"
            placeholder="Search by College / University"
            value={query}

            onChange={(event) => {

              const value =
                event.target.value;

              setQuery(value);

              setSelectedCollege(null);

              if (!value.trim()) {

                setSuggestions([]);

                setShowSuggestions(false);

              }

            }}

            onFocus={() => {

              if (suggestions.length > 0) {
                setShowSuggestions(true);
              }

            }}

            autoComplete="off"
          />

        </div>


        {/* =================================================
            COLLEGE SUGGESTIONS
        ================================================= */}

        {showSuggestions &&
          suggestions.length > 0 && (

            <ul className="suggestion-list search-bar-suggestions">

              {suggestions.map((college) => (

                <li key={college.id}>

                  <button
                    type="button"
                    onClick={() =>
                      pickSuggestion(college)
                    }
                  >

                    <strong>
                      {college.name}
                    </strong>

                    {(college.university ||
                      college.city) && (

                      <span>
                        {[
                          college.university,
                          college.city,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>

                    )}

                  </button>

                </li>

              ))}

            </ul>

          )}


        {/* =================================================
            SEARCH BUTTON
        ================================================= */}

        <button
          type="submit"
          className="btn btn-primary search-bar-btn"
          disabled={loading}
        >

          <SearchIcon />

          {loading
            ? "Searching..."
            : "Search"}

        </button>

      </div>


      {/* EXAMPLE */}
      <p className="field-hint search-bar-example">

        e.g. Gujarat University, LD College,
        Nirma University...

      </p>


      {/* =================================================
          FILTERS
      ================================================= */}

      <div className="search-bar-filters">


        {/* =================================================
            GENDER
        ================================================= */}

        <FilterDropdown
          icon={<UsersIcon />}
          label="Gender"
          summary={
            gender
              ? gender === "MALE"
                ? "Male"
                : "Female"
              : "Any"
          }
          isActive={!!gender}
        >

          {({ close }) => (

            <div className="dropdown-options">

              {[
                {
                  value: "",
                  label: "Any",
                },
                {
                  value: "MALE",
                  label: "Male",
                },
                {
                  value: "FEMALE",
                  label: "Female",
                },
              ].map((option) => (

                <button
                  type="button"
                  key={
                    option.value || "any"
                  }

                  className={
                    gender === option.value
                      ? "dropdown-option-active"
                      : ""
                  }

                  onClick={() => {

                    setGender(
                      option.value
                    );

                    close();

                  }}
                >

                  {option.label}

                </button>

              ))}

            </div>

          )}

        </FilterDropdown>


        {/* =================================================
            RENT
        ================================================= */}

        <FilterDropdown
          icon={<WalletIcon />}
          label="Rent Range"
          summary={rentRange.label}
          isActive={
            rentRange.label !== "Any"
          }
        >

          {({ close }) => (

            <div className="dropdown-options">

              {RENT_RANGES.map((option) => (

                <button
                  type="button"
                  key={option.label}

                  className={
                    rentRange.label ===
                    option.label
                      ? "dropdown-option-active"
                      : ""
                  }

                  onClick={() => {

                    setRentRange(option);

                    close();

                  }}
                >

                  {option.label}

                </button>

              ))}

            </div>

          )}

        </FilterDropdown>


        {/* =================================================
            DISTANCE
        ================================================= */}

        <FilterDropdown
          icon={<MapPinIcon />}
          label="Distance"
          summary={
            `Within ${distanceRadius} km`
          }
          isActive={
            distanceRadius !== "5"
          }
        >

          {({ close }) => (

            <div className="dropdown-options">

              {["1", "3", "5"].map(
                (distance) => (

                  <button
                    type="button"
                    key={distance}

                    className={
                      distanceRadius ===
                      distance
                        ? "dropdown-option-active"
                        : ""
                    }

                    onClick={() => {

                      setDistanceRadius(
                        distance
                      );

                      close();

                    }}
                  >

                    Within {distance} km

                  </button>

                )
              )}

            </div>

          )}

        </FilterDropdown>


        {/* =================================================
            AMENITIES
            FOOD IS INCLUDED HERE
        ================================================= */}

        <FilterDropdown
          icon={<UtensilsIcon />}
          label="Amenities"
          summary={
            amenities.length > 0
              ? `${amenities.length} selected`
              : "Any"
          }
          isActive={
            amenities.length > 0
          }
        >

          {() => (

            <div className="dropdown-options dropdown-checklist">

              {AMENITIES.map((amenity) => (

                <label
                  key={amenity}
                  className="dropdown-checkbox"
                >

                  <input
                    type="checkbox"
                    checked={
                      amenities.includes(
                        amenity
                      )
                    }

                    onChange={() =>
                      toggleAmenity(
                        amenity
                      )
                    }
                  />

                  {amenity}

                </label>

              ))}

            </div>

          )}

        </FilterDropdown>

      </div>


      {/* =================================================
          AHMEDABAD ONLY
      ================================================= */}

      <p className="search-bar-scope">

        <MapPinIcon />

        Only for Ahmedabad

      </p>

    </form>

  );
}

export default SearchBar;