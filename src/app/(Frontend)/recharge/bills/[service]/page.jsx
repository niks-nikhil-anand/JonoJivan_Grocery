import { notFound } from "next/navigation";
import BillPaymentExperience from "@/components/recharge/BillPaymentExperience";
import { BILL_SERVICES, getBillService } from "@/config/billPayments";

export function generateStaticParams() { return BILL_SERVICES.map(({ slug }) => ({ service: slug })); }
export function generateMetadata({ params }) { const service = getBillService(params.service); return service ? { title: `${service.action} | JonoJivan`, description: service.description } : {}; }
export default function BillServicePage({ params }) { const service = getBillService(params.service); if (!service) notFound(); return <BillPaymentExperience service={service} />; }
