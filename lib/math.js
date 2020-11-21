export function myceil(x, base = 5) {
  return base * Math.ceil(x / base);
}

export function myround(x, base = 5) {
  return base * Math.round(x / base);
}

export function formatNumber(str) {
  return parseFloat(
    (str + (str.slice(str.length - 1) === "." ? "00" : "")).replace(",", "")
  );
}

export function commafyNum(string) {
  return string.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function parseNum(num) {
  return Number(
    num
      .toString()
      .replace(/\s?k/, "000")
      .replace(/\s?mil.?(lion)?/, "000000")
      .replace(/[^0-9.]/g, "")
  );
}

export function rangeIndex(query, array, type) {
  if (query && ["range", "date"].indexOf(type) > -1) {
    const n = Number(query.toString().replace(/[^0-9.-]/, ""));
    let i = 0;
    while (n >= array[i]) {
      i += 1;
    }

    return i === 0 ? i : i - 1;
  } else if (query && ["range", "date"].indexOf(type) === -1) {
    if (!array) {
      return -1;
    }
    return array.indexOf(query);
  } else return -1;
}

const quantile = (sorted, q) => {
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (sorted[base + 1] !== undefined) {
    return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
  } else {
    return sorted[base];
  }
};

export function subrange(
  data,
  nRanges,
  distribution = "symmetric",
  date = false
) {
  let roundn;
  if (data && data.length) {
    let sortedNums;
    let earliest;
    let dateRound;
    if (date) {
      const dates = data.map((date) =>
        Date.parse(date?.toString().replace(/\b-/g, "/"))
      );
      earliest = Math.min(...dates);
      const dateRange = Math.max(...dates) - earliest;
      if (dateRange > 6.307e10) {
        dateRound = 3.16224e10;
      } else if (dateRange <= 6.307e10 && dateRange > 1.556e10) {
        dateRound = 2.592e9;
      } else {
        dateRound = 1.044e8;
      }
      sortedNums = dates
        .map((date) => Math.floor((date - earliest) / dateRound))
        .sort(function (a, b) {
          return a - b;
        });
      sortedNums = sortedNums.filter((x, i, a) => a.indexOf(x) === i);
    } else {
      sortedNums = data
        .filter((x) => x || x === 0)
        .map((num) =>
          typeof num === "number" ? num : Number(num.replace(/[^0-9.-]/, ""))
        )
        .sort(function (a, b) {
          return a - b;
        });
    }

    const nDivisions =
      nRanges <= sortedNums.length ? nRanges : sortedNums.length;
    let res;
    if (distribution === "symmetric") {
      const quantiles = Array.from(
        { length: nDivisions },
        (_, idx) => idx * (1 / nDivisions)
      ).map((q) => quantile(sortedNums, q));
      const sIQR =
        (quantile(sortedNums, 0.75) - quantile(sortedNums, 0.25)) / 2;
      roundn = myceil(
        sIQR / 10,
        5 * Math.pow(10, Math.floor(Math.log10(Math.abs(sIQR))) - 1)
      );
      res = quantiles.map((q) => myround(q, roundn));
    } else if (distribution === "normal") {
      const n = sortedNums.length;
      const mean = sortedNums.reduce((a, b) => a + b) / n;
      const s = Math.sqrt(
        sortedNums.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n
      );
      const sIncrement = 3 / (nRanges - 1);
      const normRanges = Array.from(
        { length: nRanges },
        (_, idx) => mean + (-sIncrement + sIncrement * idx) * s
      );

      roundn = myceil(s / 10, 5 * Math.pow(10, Math.floor(Math.log10(s)) - 1));
      res = normRanges.map((n) => myround(n, roundn));
    }
    if (!sortedNums.some((x) => x % 1) && res.some((x) => x % 1)) {
      res = res.map((x) => Math.round(x));
    }
    if (date) {
      return res.map((div, i) => earliest + div * dateRound);
    } else {
      if (res.every((x, i) => res.indexOf(x) === i)) {
        return res;
      } else {
        let repNum = 0;
        res = res.map((x, i) => {
          if (res.indexOf(x) === i) {
            repNum = 0;
            return x;
          } else {
            let nReps = 1;
            while (res[res.indexOf(x) + nReps] === x) {
              nReps += 1;
            }
            let increment = myround(
              (res[res.indexOf(x) + nReps] - x) / nReps,
              roundn / 10
            );
            if (!sortedNums.some((x) => x % 1) && !(increment % 1)) {
              increment = Math.round(increment);
            }
            repNum += 1;
            return x + increment * repNum;
          }
        });
        return res;
      }
    }
  } else {
    return [0];
  }
}

export function mode(array) {
  if (array.length == 0) return null;
  var modeMap = {};
  var maxEl = array[0],
    maxCount = 1;
  for (var i = 0; i < array.length; i++) {
    var el = array[i];
    if (modeMap[el] == null) modeMap[el] = 1;
    else modeMap[el]++;
    if (modeMap[el] > maxCount) {
      maxEl = el;
      maxCount = modeMap[el];
    }
  }
  return maxEl;
}
