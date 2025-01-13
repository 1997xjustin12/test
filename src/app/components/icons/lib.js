import BXCartIcon from "./BXCartIcon";
import BXHeartIcon from "./BXHeartIcon";
import MSLDeliveryTruckSpeedIcon from "./MSLDeliveryTruckSpeedIcon";
import IconMoonSearchIcon from "./IconMoonSearchIcon";

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
