import { useState } from "react";
import { handleApi } from "../services/api";
import { useQuery } from "@tanstack/react-query";

const init = { page: 1, totalPages: 1, totalResults: 1 };

export const usePaginationApi = ({
  query,
  url,
  body,
  queryKey,
  enabled = true,
}) => {
  const [pagination, setPagination] = useState(init);

  const fetchNextPage = () =>
    setPagination((obj) => ({ ...obj, page: +obj.page + 1 }));

  const fetchPreviousPage = () =>
    setPagination((obj) => ({
      ...obj,
      page: +obj.page < 1 ? 1 : +obj.page - 1,
    }));

  const fetchPage = (value) =>
    setPagination((obj) => ({ ...obj, page: +value }));

  const { refetch: fetch, ...obj } = useQuery({
    queryKey: [queryKey, pagination?.page],
    enabled,
    queryFn: async () => {
      const data = await handleApi({
        query: `?page=${pagination?.page ? +pagination?.page : 1}${
          query ? query : ""
        }`,
        url,
        body,
      });
      setPagination(data?.response);
      return data;
    },
  });

  const refetch = () => {
    setPagination(init);
    setTimeout(() => {
      fetch();
    }, 1000);
  };

  return {
    ...obj,
    refetch,
    fetchNextPage,
    fetchPreviousPage,
    pagination,
    fetchPage,
  };
};
