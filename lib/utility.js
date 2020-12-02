export function toProperCase() {
  return this.replace(/\w[^\s\.\-]*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export function remToPx(rem) {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

export function formatDate(primitive) {
  var date = new Date(primitive);
  const todaydd = String(date.getDate()).padStart(2, "0");
  const todaymm = String(date.getMonth() + 1).padStart(2, "0"); //
  const todayyyyy = date.getFullYear();
  return todayyyyy + "-" + todaymm + "-" + todaydd;
}

export function commafy(number) {
  return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "";
}

export function abbrevNum(num) {
  if (!num) {
    return null;
  }
  if (num < 1) {
    return (Math.round((num + Number.EPSILON) * 100) / 100).toString();
  }
  const str = num.toString();
  if (str.length > 4) {
    switch (str.length) {
      case 5:
      case 6:
        return str.slice(0, Math.floor(str.length / 2)) + "k";
      case 7:
        return str.search(/00/) > 1
          ? str[0] + "." + str.slice(1, str.search(/00/)) + " mil."
          : str[0] + " mil.";
      case 8:
      case 9:
        return str.slice(0, Math.ceil(str.length / 4)) + " mil.";
      case 10:
      default:
        return str.search(/00/) > 1
          ? str[0] + "." + str.slice(1, str.search(/00/)) + " bil."
          : str[0] + " bil.";
    }
  } else {
    return str;
  }
}

export function formatRanges(ranges, date = false) {
  let rangeBounds;
  if (ranges.indexOf("N/A") > -1) {
    rangeBounds = ranges.splice(ranges.indexOf("N/A"), 1);
  } else {
    rangeBounds = ranges;
  }
  let res;
  if (date) {
    const dateRange = Math.max(...rangeBounds) - Math.min(...rangeBounds);
    if (dateRange > 6.307e10) {
      res = rangeBounds.map((date) => new Date(date).getFullYear());
    } else if (dateRange <= 6.307e10 && dateRange > 1.556e10) {
      res = rangeBounds.map((date) => {
        const d = Date.parse(date);
        const ye = new Intl.DateTimeFormat("en", {
          year: "numeric",
        }).format(d);
        const mo = new Intl.DateTimeFormat("en", {
          month: "short",
        }).format(d);
        return `${mo} ${ye}`;
      });
    } else {
      res = rangeBounds.map((date) => {
        const d = Date.parse(date);
        const ye = new Intl.DateTimeFormat("en", {
          year: "2-digit",
        }).format(d);
        const mo = new Intl.DateTimeFormat("en", {
          month: "numeric",
        }).format(d);
        const da = new Intl.DateTimeFormat("en", {
          day: "numeric",
        }).format(d);
        return `${mo}/${da}/${ye}`;
      });
    }
  } else {
    res = rangeBounds;
  }
  res = res.map((limit, i) => {
    let format;
    switch (i) {
      case 0:
        format = (date ? "Before " : "<") + (date ? res[1] : abbrevNum(res[1]));
        break;
      case res.length - 1:
        format = date ? "After " + res[i] : abbrevNum(res[i]) + "+";
        break;
      default:
        format =
          (date ? res[i] : abbrevNum(res[i])) +
          "–" +
          (date ? res[i + 1] : abbrevNum(res[i + 1]));
        break;
    }

    if (format) {
      return date ? format : commafy(format);
    } else {
      return null;
    }
  });
  if (ranges.indexOf("N/A") > -1) {
    return ["N/A", ...res];
  } else {
    return res;
  }
}

export function determineColorScheme(hex) {
  const colors = {
    Reds: [255, 0, 0],
    Oranges: [255, 102, 0],
    Greens: [0, 255, 0],
    Blues: [0, 0, 255],
    Purples: [162, 0, 255],
  };
  const rgb = hexToRgb(hex);
  return Object.keys(colors).reduce(
    (bestMatch, color) => {
      const distanceToColor = colors[color].reduce(
        (acc, val, i) => acc + Math.pow(val - Object.keys(rgb)[i], 2),
        0
      );
      return bestMatch.distanceToColor < distanceToColor
        ? bestMatch
        : { color, distanceToColor };
    },
    { color: null, distanceToColor: Infinity }
  ).color;
}

export function unique(array) {
  return array.filter((x, i) => array.indexOf(x) === i);
}

export const reorderArray = (array, startIndex, endIndex) => {
  const resultArray = [...array];
  const [removed] = resultArray.splice(startIndex, 1);
  resultArray.splice(endIndex, 0, removed);

  return resultArray;
};

export const spliceOutCopy = (array, index) => {
  const resultArray = [...array];
  resultArray.splice(index, 1);
  return resultArray;
};

export const spliceUpdateCopy = (array, index, update) => {
  const resultArray = [...array];

  resultArray.splice(index, 1);

  resultArray.splice(index, 0, update);
  return resultArray;
};

export const lightenHex = (hexString) => {
  return (
    "#" +
    hexString
      .slice(1)
      .match(/.{2}/g)
      .map((hex) => {
        const lightenedHex = Math.floor(parseInt(hex, 16) * 1.4).toString(16);
        return lightenedHex.length > 2
          ? "ff"
          : lightenedHex.length < 2
          ? "0" + lightenedHex
          : lightenedHex;
      })
      .join("")
  );
};

export function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

export function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function getTextColor(bgColor) {
  const colors = hexToRgb(bgColor);
  return colors
    ? colors.r * 0.299 + colors.g * 0.587 + colors.b * 0.114 < 186
      ? "white"
      : "black"
    : "black";
}

var sort_by;
(function () {
  // utility functions
  var default_cmp = function (a, b) {
      if (a == b) return 0;
      return a < b ? -1 : 1;
    },
    getCmpFunc = function (primer, reverse) {
      var cmp = default_cmp;
      if (primer) {
        cmp = function (a, b) {
          return default_cmp(primer(a), primer(b));
        };
      }
      if (reverse) {
        return function (a, b) {
          return -1 * cmp(a, b);
        };
      }
      return cmp;
    };

  // actual implementation
  sort_by = function () {
    var fields = [],
      n_fields = arguments.length,
      field,
      name,
      reverse,
      cmp;

    // preprocess sorting options
    for (var i = 0; i < n_fields; i++) {
      field = arguments[i];
      if (typeof field === "string") {
        name = field;
        cmp = default_cmp;
      } else {
        name = field.name;
        cmp = getCmpFunc(field.primer, field.reverse);
      }
      fields.push({
        name: name,
        cmp: cmp,
      });
    }

    return function (A, B) {
      var a, b, name, cmp, result;
      for (var i = 0, l = n_fields; i < l; i++) {
        result = 0;
        field = fields[i];
        name = field.name;
        cmp = field.cmp;

        result = cmp(A[name], B[name]);
        if (result !== 0) break;
      }
      return result;
    };
  };
})();

export var sort_by;

//County
export const cascadeCounties = (features) =>
  features.reduce((res, feat) => {
    const stateIndex = res.findIndex((obj) => obj?.state === feat.state);
    if (stateIndex === -1) {
      res.push({
        state: feat.state,
        STATEFP: feat.STATEFP,
        county: [feat.county],
      });
    } else {
      res[stateIndex].county.push(feat.county);
    }
    return res;
  }, []);

//Tract

export const cascadeTracts = (features) =>
  features.reduce((res, feat) => {
    const stateIndex = res.findIndex((obj) => obj?.state === feat.state);
    if (stateIndex === -1) {
      res.push({
        state: feat.state,
        county: [{ county: feat.county, tract: [feat.tract] }],
      });
    } else {
      const countyIndex = res[stateIndex].county.findIndex(
        (countyObj) => countyObj.county === feat.county
      );
      if (countyIndex === -1) {
        res[stateIndex].county.push({
          county: feat.county,
          tract: [feat.tract],
        });
      } else {
        res[stateIndex].county[countyIndex].tract.push(feat.tract);
      }
    }
    return res;
  }, []);
