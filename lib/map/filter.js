export function getDefaultFilters(filters) {
  if (!filters) {
    return [];
  } else {
    return filters.reduce((obj, filter) => {
      return {
        ...obj,
        [filter?.name]: filter.options,
      };
    }, {});
  }
}

export default function filterClosure(filters, filterState) {
  return function filter(feature) {
    if (!feature.properties) {
      return false;
    }
    return filters
      ? filters.every((filter) => {
          const filterName = filter.name;
          const filterType = filter.type;
          const query =
            filterType === "date"
              ? new Date(
                  Date.parse(
                    feature.properties[filterName]
                      ?.toString()
                      .replace(/\b-/g, "/")
                  )
                )
              : feature.properties[filterName];
          const selectedOptions = filterState[filterName];
          const includeNA = selectedOptions?.indexOf("N/A") > -1;
          const allOptions = filter.options;
          if (query && selectedOptions) {
            switch (filterType) {
              case "category":
                return selectedOptions.indexOf(query) > -1;
              case "multiCategory":
                const queries = query.split(/, ?/);
                return selectedOptions.filter((opt) => !queries.includes(opt))
                  .length;
              case "range":
              case "date":
                return selectedOptions.some((rangeBound) => {
                  const queryArray =
                    filterType === "range"
                      ? query
                          .toString()
                          .match(/(\d{1,3},?)+(\.\d+)?/g)
                          .map((n) => Number(n.replace(/[^0-9.]/, "")))
                      : [Date.parse(query.toString().replace(/\b-/g, "/"))];

                  return queryArray.some((num) => {
                    switch (allOptions.indexOf(rangeBound)) {
                      case 1 && includeNA:
                      case 0 && !includeNA:
                        return num <= allOptions[1];
                      case allOptions.length - 1:
                        return num >= rangeBound;
                      case -1:
                        return num >= rangeBound[0] && num <= rangeBound[1];
                      default:
                        return (
                          num >= rangeBound &&
                          num <= allOptions[allOptions.indexOf(rangeBound) + 1]
                        );
                    }
                  });
                });
            }
          } else if (!query && selectedOptions?.indexOf("N/A") === -1) {
            return false;
          } else {
            return true;
          }
        })
      : true;
  };
}
