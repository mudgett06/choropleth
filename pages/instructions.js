import React from "react";
import Layout from "../components/Layout";
import styles from "../styles/instructions.module.css";

export default function instructions() {
  return (
    <Layout>
      <div className={styles.container}>
        <p>
          Choropleth.net is a simple web app designed for quick visualization of
          geographic data on an interactive{" "}
          <a href="https://leafletjs.com/">Leaflet.js</a> map. Check out the <a href="https://github.com/mudgett06/choropleth">Github Repository</a>.
        </p>
        <h2 id="getting-started">Getting Started</h2>
        <p>
          Create an account to start making maps. Once you are logged in, go to
          your "My Maps" page to create your first map.
        </p>
        <h2 id="file-formatting">File Formatting</h2>
        <p>
          Choropleth.net currently has the ability to parse any
          standard-delimited text files (.csv, .tab, etc.) and .xls(x) files.
          The file should have headers in the first row and data beneath. To
          help guide the parser, it is advised to use column names representing
          the type of geography you wish to map. The supported geography types
          and formats are:
        </p>
        <ul className={styles.outerUl}>
          <li className={styles.outerLi}>
            <b>Country</b>
            <ul className={styles.innerUl}>
              <li>Name</li>
              <li>ISO-A3</li>
            </ul>
          </li>
          <li className={styles.outerLi}>
            <b>U.S. State</b>
            <ul className={styles.innerUl}>
              <li>Name</li>
              <li>Two-letter abbreviation</li>
              <li>2-digit state FIPS code (0-56)</li>
            </ul>
          </li>
          <li className={styles.outerLi}>
            <b>U.S. County*</b>
            <ul className={styles.innerUl}>
              <li>Name (with or without the word "County")</li>
              <li>3/5-digit county FIPS code</li>
            </ul>
          </li>
          <li className={styles.outerLi}>
            <b>
              U.S. City<em> (</em>unstable*)
            </b>
            <ul className={styles.innerUl}>
              <li>Name</li>
              <li>City FIPS code</li>
            </ul>
          </li>
          <li className={styles.outerLi}>
            <b>U.S. Zip Code</b>
            <ul className={styles.innerUl}>
              <li>5-digit zip code</li>
            </ul>
          </li>
          <li className={styles.outerLi}>
            <b>U.S. Census Tract**</b>
            <ul className={styles.innerUl}>
              <li>
                Census tract name (formatted "102.1" or "Census Tract "102.1")
              </li>
              <li>11-digit census tract FIPS code</li>
            </ul>
          </li>
        </ul>
        <p>
          <em>
            * If mapping counties or cities formatted as names, a column
            including the containing state must also be included.
          </em>
        </p>
        <p>
          <em>
            ** If mapping census tracts formatted as names, a column including
            the containing state and county must also be included.
          </em>
        </p>
        <h3 id="example-of-a-csv-containing-county-data-">
          Example of a .csv containing county data:
        </h3>
        <p>
          State, County, Pop. Density (Pop./mi2)
          <br />
          New York, New York, 46961
          <br />
          New York, Kings, 25848
          <br />
          New York, Bronx, 24118{" "}
        </p>
        <h2 id="editing-maps">Editing Maps</h2>
        <p>
          Once your file is parsed, you will be brought to the editor page for
          your new map. The icon bar on the left shows the aspects of the map
          you are able to edit. The different editor sections are described in
          detail below.
        </p>
        <em>
          <p>
            The column names of the parsed file will henceforth be called
            "properties", and the rows containing data about a certain geography
            will be referred to as "features". Each feature is described by its
            properties.
          </p>
        </em>
        <h3 id="info">Info</h3>
        <p>
          Begin by giving your map a unique title, description, and any tags to
          index your map in searches (unavailable as of 11/21/20). The title
          will be displayed above the map, and if you add a description or tags
          they will be displayed when hovering over the info button on the upper
          left side of the map. There is also a link to a full-screen map that
          can be embedded in your own HTML.
        </p>
        <h3 id="data-formatting">Data Formatting</h3>
        <p>
          This section of the editor shows a list of all of the properties from
          the uploaded file. The properties can be rearranged by dragging them
          up or down, hidden by unchecking them, or given aliases to use within
          the map interface. You can also specify the type of data the property
          describes, which will affect how each data point is displayed in the
          data box seen when hovering over features on the map.
        </p>
        <h3 id="filters">Filters</h3>
        <p>
          Users can <strong>filter</strong> features on the map to display only
          those which meet certain property criteria by clicking the filter icon
          on the toolbar in the upper right corner of the map, and selecting
          filter options. When your file was uploaded, any column that contained
          numerical data, or categorical data with fewer than 10 unique entries,
          was determined eligible as a filter. All filters are enabled by
          default, but they can be added or removed in this page of the editor.
          The options for the filters are determined automatically, but support
          for custom options will be available in a future update.
        </p>
        <h3 id="choropleths">Choropleths</h3>
        <p>
          Users can <strong>color</strong> features by their value for a certain
          property, either in a sequential fashion for numerical data, or simply
          by their categorical values. One property can be used as a choropleth
          at a time, and users can select from active choropleths by clicking
          the paint bucket icon on the toolbar in the top right corner of the
          map. Similar to filters, any file column that contained numerical
          data, or categorical data with fewer than 10 unique entries, was
          determined eligible as a choropleth, and every eligible choropleth is
          active by default. This section of the editor is used to change the
          color scheme of each choropleth, and to add or remove a user&#39;s
          ability to color the map by a certain property.
        </p>
        <h3 id="search-fields">Search Fields</h3>
        <p>
          Users can search for property values by clicking the search icon on
          the toolbar and typing a query. The search field page of the editor is
          used to add or remove properties from the search index.
        </p>
        <h3 id="map-settings">Map Settings</h3>
        <p>
          Change the map background, display/hide automatic geography labels,
          and set the boundary for the map on this editor page. To set the
          boundary, clear the current bondary, and move the map to the new
          desired boundary, then click "Capture current view."
        </p>
      </div>
    </Layout>
  );
}
