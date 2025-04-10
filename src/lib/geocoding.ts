import { Client } from "@googlemaps/google-maps-services-js";

const client = new Client({});

type Address = {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postcode: string;
};

export async function geocodeAddress(address: Address) {
  const response = await client.geocode({
    params: {
      address: `${address.addressLine1}${address.addressLine2 ? `, ${address.addressLine2}` : ""}, ${address.city}, ${address.postcode}, UK`,
      key: process.env.MAPS_API_KEY!,
    },
  });

  if (response.data.results.length === 0) {
    throw new Error("Address not found");
  }

  const { lat, lng } = response.data.results[0].geometry.location;
  return { lat, lng };
}
