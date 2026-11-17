import { SearchPage } from "@/components/vendorPanel/Commerce";
export default function Page({ searchParams }) { return <SearchPage query={typeof searchParams.q === "string" ? searchParams.q : ""}/>; }
