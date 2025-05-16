import { getAllNavigationItems, getSideNavItems } from "@/app/api/rest"
import { useQuery } from "react-query"

const useGetSideBarData = (role: string) => {
  const navData = useQuery({
    queryKey: ["side-nav-item", role],
    queryFn: () => getSideNavItems(role, true),
    initialData: [],
    enabled: !!role,
  })

  return { navData: navData.data }
}

const useGetAllSideBarData = () => {
  const navData = useQuery({
    queryKey: ["all-side-nav-item"],
    queryFn: () => getAllNavigationItems(),
    initialData: [],
  })

  return { navData: navData.data, loading: navData?.isLoading }
}

export { useGetAllSideBarData, useGetSideBarData }
