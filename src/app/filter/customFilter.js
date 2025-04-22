export class CustomFilter {
  getIdentifier() {
    return "CustomFilter";
  }

  getFilters(filters) {
    return {
      bool: {
        filter:[
        {
            "nested": {
                "path": "categories",
                "query": {
                "bool": {
                    "should": 
                    filters.map((filter) => ({
                      match: { "categories.id": filter.value },
                    })),
                    "minimum_should_match": 1
                }
                }
            }
            }
        ],
        // filters.map((filter) => ({
        //   term: { tag: {id:filter.value} },
        // })),
      },
    };
  }

  getSelectedFilter(filterSet) {
    return {
      type: "ValueSelectedFilter",
      id: `${this.getIdentifier()}_${filterSet.value}`,
      identifier: "categories.id",
      label: "Category Filter",
      value: filterSet.value,
      display: "Custom",
    };
  }
}
