import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  refetchOnFocus: true,
  tagTypes: ["Posts"],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/`
      : "/api/",
  }),
  endpoints: (builder) => ({
    getPosts: builder.query<any[], void>({
      query: () => ({ url: "/posts", method: "GET" }),
      providesTags: ["Posts"],
    }),
  }),
});

export const { useGetPostsQuery } = apiSlice;
