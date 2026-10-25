import { NextResponse } from "next/server";
import { getPolicy, savePolicy } from "@/lib/policyStore";
export async function POST(req){try{const content=(await req.formData()).get("content");if(!content)return NextResponse.json({msg:"Please provide the shipping policy content."},{status:400});await savePolicy("shipping",content);return NextResponse.json({msg:"Shipping policy updated successfully"});}catch(error){return NextResponse.json({msg:"Error updating shipping policy",error:error.message},{status:500});}}
export async function GET(){try{return NextResponse.json(await getPolicy("shipping"));}catch(error){return NextResponse.json({msg:"Error fetching shipping policy",error:error.message},{status:500});}}
