import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SearchBar from "../components/SearchBar";
import PgGrid from "../components/PgGrid";

import { getAllPGs, searchColleges, searchPGs } from "../api/client";
import { distanceKm } from "../utils/distance";
import { HOME_HERO_IMAGE } from "../constants/images";

import {
  ArrowRightIcon,
  BedIcon,
  BriefcaseIcon,
  CompassIcon,
  FilterIcon,
  MapPinIcon,
  PhoneIcon,
  SearchIcon,
  ShieldIcon,
  SparkleIcon,
} from "../components/icons";

function HomePage() {
  const [pgs, setPgs] = useState([]);
  const [pgLoading, setPgLoading] = useState(true);

  const [searchLabel, setSearchLabel] = useState("");
  const [searchNote, setSearchNote] = useState("");

  // Load all PGs initially
  useEffect(() => {
    const loadPGs = async () => {
      setPgLoading(true);

      try {
        const data = await getAllPGs();
        setPgs(data);
      } catch (error) {
        console.error(error);
        setPgs([]);
      } finally {
        setPgLoading(false);
      }
    };

    loadPGs();
  }, []);

  // --------------------------------------------------
  // SEARCH PGs
  // --------------------------------------------------
  const handleSearch = async ({
    collegeName,
    college,
    gender,
    minRent,
    maxRent,
    distanceRadius,
    amenities,
  }) => {
    setPgLoading(true);
    setSearchNote("");

    try {
      // First get PGs according to backend filters
      let results = await searchPGs({
        gender,
        minRent,
        maxRent,
      });

      // ------------------------------------------------
      // AMENITIES FILTER
      // Food is also treated as an amenity
      // ------------------------------------------------
      if (amenities.length > 0) {
        results = results.filter((pg) => {
          const pgAmenities = (pg.amenities || "").toLowerCase();

          return amenities.every((amenity) =>
            pgAmenities.includes(amenity.toLowerCase())
          );
        });
      }

      // ------------------------------------------------
      // COLLEGE SEARCH
      // ------------------------------------------------
      if (collegeName.trim()) {
        let collegeData = college;

        // If user typed the name but did not select suggestion
        if (!collegeData) {
          const colleges = await searchColleges(collegeName);
          collegeData = colleges[0] || null;
        }

        if (collegeData) {
          results = results
            .map((pg) => {
              const distance = distanceKm(
                collegeData.latitude,
                collegeData.longitude,
                pg.latitude,
                pg.longitude
              );

              return {
                ...pg,
                distanceKm: distance,
              };
            })
            .filter(
              (pg) =>
                pg.distanceKm !== null &&
                pg.distanceKm <= Number(distanceRadius)
            )
            .sort((a, b) => a.distanceKm - b.distanceKm);

          setSearchLabel(collegeName);
        } else {
          setSearchLabel("");

          setSearchNote(
            `We couldn't find "${collegeName}" in our college list.`
          );
        }
      } else {
        setSearchLabel("");

        // If no college selected, distance is not calculated
        results = results.map((pg) => ({
          ...pg,
          distanceKm: null,
        }));
      }

      setPgs(results);

      // Scroll automatically to PG listing
      setTimeout(() => {
        document
          .getElementById("pg-listings")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }, 100);
    } catch (error) {
      console.error(error);
      setPgs([]);
      setSearchNote("Unable to search PGs right now.");
    } finally {
      setPgLoading(false);
    }
  };

  return (
    <div className="page">

      {/* ================= NAVBAR ================= */}
      <Navbar />

      {/* ================= HERO ================= */}
      <section
        className="hero"
        id="college-search"
        style={{
          backgroundImage: `
            linear-gradient(
              90deg,
              rgba(255,255,255,0.97) 0%,
              rgba(255,255,255,0.90) 38%,
              rgba(255,255,255,0.35) 65%,
              rgba(255,255,255,0.05) 100%
            ),
            url(${HOME_HERO_IMAGE})
          `,
        }}
      >
        <div className="hero-content">

          <div className="hero-copy">

            <p className="eyebrow">
              <SparkleIcon />
              Ahmedabad Colleges & Universities
            </p>

            <h1>
              Find the Best{" "}
              <span>Hostels & PGs</span>
              <br />
              Near Your{" "}
              <span>College or University</span>
            </h1>

            <p>
              Comfortable stays
              <span className="hero-dot">•</span>
              Safe environment
              <span className="hero-dot">•</span>
              Verified listings
            </p>

          </div>

          {/* SEARCH + FILTERS */}
          <SearchBar
            onSearch={handleSearch}
            loading={pgLoading}
          />

        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="feature-strip">

        <div className="feature-card">
          <div className="feature-icon feature-blue">
            <CompassIcon />
          </div>

          <h3>Search by College/University</h3>

          <p>
            Find PGs near your college or university
            in Ahmedabad.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon feature-green">
            <FilterIcon />
          </div>

          <h3>Smart Filters</h3>

          <p>
            Filter by rent, gender, food,
            amenities and distance.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon feature-purple">
            <ShieldIcon />
          </div>

          <h3>Verified Listings</h3>

          <p>
            Get clear PG information
            and available rooms.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon feature-red">
            <MapPinIcon />
          </div>

          <h3>Distance From College</h3>

          <p>
            Check PG distance from
            your selected college.
          </p>
        </div>

        <Link
          to="/register"
          state={{ role: "OWNER" }}
          className="feature-card feature-card-link"
        >
          <div className="feature-icon feature-yellow">
            <BriefcaseIcon />
          </div>

          <h3>Owner Registration</h3>

          <p>
            Are you a PG/Hostel owner?
            List your property with us.
          </p>
        </Link>

      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section
        className="how-it-works"
        id="how-it-works"
      >

        <div className="how-intro">

          <span className="section-line"></span>

          <h2>How It Works</h2>

          <p>
            Find your perfect stay in just 3 simple steps.
          </p>

        </div>

        <div className="how-steps">

          {/* STEP 1 */}
          <div className="how-step">

            <span className="step-number">1</span>

            <SearchIcon />

            <div>
              <h3>Search</h3>

              <p>
                Enter your college or university
                name and search nearby PGs.
              </p>
            </div>

          </div>

          <ArrowRightIcon className="how-arrow" />

          {/* STEP 2 */}
          <div className="how-step">

            <span className="step-number">2</span>

            <FilterIcon />

            <div>
              <h3>Filter & Compare</h3>

              <p>
                Choose rent, gender, food,
                amenities and distance.
              </p>
            </div>

          </div>

          <ArrowRightIcon className="how-arrow" />

          {/* STEP 3 */}
          <div className="how-step">

            <span className="step-number">3</span>

            <PhoneIcon />

            <div>
              <h3>Contact</h3>

              <p>
                Check PG details and
                contact the owner.
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* ================= PG LISTINGS ================= */}
      <section
        className="listings-section"
        id="pg-listings"
      >

        <div className="section-heading section-heading-row">

          <div>

            <p className="eyebrow">

              <span className="eyebrow-dot"></span>

              {searchLabel
                ? "Search results"
                : "Browse listings"}

            </p>

            <h2>

              <BedIcon />

              {searchLabel
                ? `PGs Near ${searchLabel}`
                : "Top Rated PGs Near Your College"}

            </h2>

            <p className="section-sub">

              {searchLabel
                ? `Showing PGs within your selected distance from ${searchLabel}.`
                : "Explore PGs and hostels available across Ahmedabad."}

            </p>

          </div>

        </div>

        {/* SEARCH MESSAGE */}
        {searchNote && (
          <div className="alert alert-error search-note">
            {searchNote}
          </div>
        )}

        {/* PG CARDS */}
        <PgGrid
          pgs={pgs}
          loading={pgLoading}
        />

      </section>

      {/* ================= FOOTER ================= */}
      <Footer />

    </div>
  );
}

export default HomePage;