import { useQuery } from "@tanstack/react-query";
import { fetchCertificateApplications } from "../api/fetchCertificateApplications";
import { queryKeys } from "../lib/queryKeys";

export function useCertificateApplications({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: queryKeys.certApplications.all(),
    queryFn: fetchCertificateApplications,
    enabled,
  });
}
