import { validateFullAmenities } from "./helpers";
import { Resolvers } from "./types";

var counter = 0;
export const resolvers: Resolvers = {
  Query: {
    featuredListings: (_, __, { dataSources }) => {
      return dataSources.listingAPI.getFeaturedListings();
    },
    listing: (_, { id }, { dataSources }) => {
      return dataSources.listingAPI.getListing(id);
    },
  },
  Listing: {
    amenities: ({ id, amenities }, _, { dataSources }) => {
      console.log("form Listing parent of Amenities", amenities);
      // If `amenities` contains full-fledged Amenity objects, return them
      // Otherwise make a follow-up request to /listings/{listing_id}/amenities
      if (validateFullAmenities(amenities)) {
        return amenities;
      }
      return dataSources.listingAPI.getAmenities(id);
    },
    // description: ({id}) => {
    //   console.log(++counter);
    //   console.log(id);
    //   return "nny nny";
    // },
  },

  Amenity: {
    name: ({ name }) => {
      console.log("form Amenity parent of name", name);
      return name.toUpperCase() + "-NNY";
    },
  },

  Mutation: {
    createListing: async (_, { input }, { dataSources }) => {
      dataSources.listingAPI.createListing(input);
      try {
        const response = await dataSources.listingAPI.createListing(input);
        return {
          code: 200,
          success: true,
          message: "Listing successfully created!",
          listing: response,
        };
      } catch (err) {
        return {
          code: 500,
          success: false,
          message: `Something went wrong: ${(err as any).extensions.response.body}`,
          listing: null,
        };
      }
    },
  },
};
