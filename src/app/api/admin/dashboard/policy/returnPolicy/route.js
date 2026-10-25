import { NextResponse } from "next/server";
import { getPolicy, savePolicy } from "@/lib/policyStore";
export async function POST(req) { try { const content=(await req.formData()).get("content"); if(!content)return NextResponse.json({msg:"Please provide the return policy content."},{status:400}); await savePolicy("return",content); return NextResponse.json({msg:"Return policy updated successfully"}); } catch(error){return NextResponse.json({msg:"Error updating return policy",error:error.message},{status:500});} }
export async function GET(){try{return NextResponse.json(await getPolicy("return"));}catch(error){return NextResponse.json({msg:"Error fetching privacy policy",error:error.message},{status:500});}}
