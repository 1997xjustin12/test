import BXCartIcon from "./BXCartIcon";
import BXHeartIcon from "./BXHeartIcon";
import MSLDeliveryTruckSpeedIcon from "./MSLDeliveryTruckSpeedIcon";
import IconMoonSearchIcon from "./IconMoonSearchIcon";
import FacebookCircleIcon from "./FacebookCirleIcon";
import InstagramCircleIcon from "./InstagramCirleIcon";
import YoutubeCircleIcon from "./YoutubeCirleIcon";
import PinterestCircleIcon from "./PinterestCircleIcon";

import FluentChevronRightIcon from "./FluentChevronRightIcon";
import FluentChevronLeftIcon from "./FluentChevronLeftIcon";

export const CartIcon = ({ color, width, height }) => {
  return <BXCartIcon color={color} width={width} height={height} />;
};

export const HeartIcon = ({ color, width, height }) => {
  return <BXHeartIcon color={color} width={width} height={height} />;
};

export const DeliveryTruckSpeedIcon = ({ color, width, height }) => {
  return (
    <MSLDeliveryTruckSpeedIcon color={color} width={width} height={height} />
  );
};

export const SearchIcon = ({ color, width, height }) => {
  return <IconMoonSearchIcon color={color} width={width} height={height} />;
};

export const FacebookIcon = ({ color, width, height }) => {
  return <FacebookCircleIcon color={color} width={width} height={height} />;
};

export const InstagramIcon = ({ color, width, height }) => {
  return <InstagramCircleIcon color={color} width={width} height={height} />;
};

export const YoutubeIcon = ({ color, width, height }) => {
  return <YoutubeCircleIcon color={color} width={width} height={height} />;
};

export const PinterestIcon = ({ color, width, height }) => {
  return <PinterestCircleIcon color={color} width={width} height={height} />;
};
export const FluentChevronLeft = ({ color, width, height }) => {
  return <FluentChevronLeftIcon color={color} width={width} height={height} />;
};
export const FluentChevronRight = ({ color, width, height }) => {
  return <FluentChevronRightIcon color={color} width={width} height={height} />;
};
