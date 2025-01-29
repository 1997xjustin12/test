"use client";
import { useState, useEffect } from "react";
import FilterChip from "@/app/components/atom/FilterChip";

export default function FilterChipsWrapper({ filters, onChipClose }) {
  const [chips, setChips] = useState([]);

  useEffect(() => {
    if (filters) {
      console.log("ChipsWrap", filters);
      const combinedOptions = Object.values(filters).flatMap(
        (filter) => filter.options
      );
      setChips(combinedOptions.filter(({ is_checked }) => is_checked));
    }
  }, [filters]);

  const handleCloseChips = (filter) => {
    onChipClose(filter);
  };

  if (chips.length > 0) {
    return (
      <section className="py-[10px] flex gap-[2px] flex-wrap">
        {chips &&
          chips.length > 0 &&
          chips.map((item, index) => (
            <FilterChip
              key={`filter-chip-${index}`}
              filter={item}
              onClose={handleCloseChips}
            />
          ))}
      </section>
    );
  }
}
