import { externalApi, handleApi } from "../services/api";
import { useQuery } from "@tanstack/react-query";

export const useQueryApi = ({
  query,
  url,
  body,
  queryKey,
  enabled = true,
  external = false,
}) => {
  const obj = useQuery({
    queryKey: [queryKey],
    enabled,
    queryFn: () =>
      external
        ? externalApi({
            query: `${query ? query : ""}`,
            url,
            body,
          })
        : handleApi({
            query: `${query ? query : ""}`,
            url,
            body,
          }),
  });

  return obj;
};
