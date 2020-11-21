import { getChoroplethColor, styleClosure } from "./style";
import { lightenHex } from "../utility";

export default function onEachFeatureClosure(
  map,
  choropleth,
  styles,
  setActiveData
) {
  function deactivateFeature(layer) {
    layer.options.active = false;
    layer.setStyle({
      fillColor: choropleth
        ? getChoroplethColor(layer.feature, choropleth)
        : styles.fillColor,
      fillOpacity: styles.fillOpacity,
    });
    setActiveData(null);
  }

  function activateFeature(layerToActivate) {
    const activeFeature = Object.values(map._layers).find(
      (layer) => layer.options.active
    );
    if (activeFeature) {
      deactivateFeature(activeFeature);
    }
    layerToActivate.options.active = true;
    layerToActivate.setStyle({
      fillColor: lightenHex(
        choropleth
          ? getChoroplethColor(layerToActivate.feature, choropleth)
          : styles.fillColor
      ),
      fillOpacity: 0.9,
    });
    setActiveData(layerToActivate.feature.properties);
  }

  const lockedFeatureMouseEvents = {
    click: function (e) {
      if (e.target.options.active) {
        map.eachLayer((layer) => {
          if (layer.feature) {
            layer.off(lockedFeatureMouseEvents);
            layer.on(defaultMouseEvents);
          }
        });
      } else {
        activateFeature(e.target);
      }
    },
  };

  const defaultMouseEvents = {
    click: function () {
      map.eachLayer((layer) => {
        if (layer.feature) {
          layer.off(defaultMouseEvents);
          layer.on(lockedFeatureMouseEvents);
        }
      });
    },
    mouseover: function (e) {
      activateFeature(e.target);
    },
    mouseout: function (e) {
      deactivateFeature(e.target);
    },
  };
  return function (feature, layer) {
    layer.on(defaultMouseEvents);
  };
}
