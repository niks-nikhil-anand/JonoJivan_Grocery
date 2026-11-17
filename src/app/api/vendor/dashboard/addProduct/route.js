import { GET as get, POST as post } from "../../workspace/[...path]/route";
export const dynamic = "force-dynamic";
export const GET = req => get(req, { params: { path: ["products"] } });
export const POST = req => post(req, { params: { path: ["products"] } });
