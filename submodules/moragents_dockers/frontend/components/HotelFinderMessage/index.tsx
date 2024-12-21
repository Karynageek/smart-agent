import React, { FC } from "react";
import { HotelFinderForm } from "../HotelFinderForm/HotelFinderForm";
import { HotelFinderMessagePayload } from "@/services/types";

type HotelFinderMessageProps = {
  isActive: boolean;
  selectedAgent: string;
  fromMessage: HotelFinderMessagePayload;
  onSearchHotels: (searchData: HotelFinderMessagePayload) => void;
};

export const HotelFinderMessage: FC<HotelFinderMessageProps> = ({
  isActive,
  selectedAgent,
  fromMessage,
  onSearchHotels,
}) => {
  console.log("HotelFinderMessage received fromMessage:", fromMessage);
  if (!fromMessage) {
    return <div>Error: Hotel search data is not available.</div>;
  }

  return (
    <HotelFinderForm
      onSubmit={(searchData) => {
        console.log("Hotel search data submitted:", searchData);
        onSearchHotels(searchData);
      }}
    />
  );
};
