"use client";
import Link from "next/link";
export default function Error({reset}) { return <section className="v-panel space-y-4 p-8"><h1 className="text-xl font-semibold">Something went wrong</h1><p className="v-muted">We couldn’t load this page. Please try again.</p><button className="v-button" onClick={reset}>Try again</button> <Link className="v-button secondary" href="/vendor/dashboard">Back to dashboard</Link></section>; }
