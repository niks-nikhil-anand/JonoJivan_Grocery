import Link from "next/link";
import { LuArrowRight, LuHome, LuShoppingBasket, LuSmartphone } from "react-icons/lu";

export default function NotFound() {
  return (
    <main className="relative isolate overflow-hidden bg-cream px-4 py-12 sm:px-6 sm:py-16 lg:py-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-gradient-to-b from-brand-50 to-transparent" />

      <div className="mx-auto max-w-5xl">
        <div className="grid items-center gap-8 rounded-3xl border border-brand-100 bg-white p-6 shadow-card sm:gap-10 sm:p-10 lg:grid-cols-2 lg:p-14">
          <div aria-hidden="true" className="relative flex min-h-56 items-center justify-center rounded-2xl bg-brand-50 px-4 py-12 sm:min-h-72 lg:min-h-96">
            <div className="absolute h-44 w-44 rounded-full border border-brand-200 sm:h-60 sm:w-60" />
            <div className="relative flex items-center gap-1 font-display text-8xl font-bold tracking-tight text-brand-800 sm:gap-2 sm:text-9xl">
              <span>4</span>
              <span className="flex h-24 w-20 -rotate-12 items-center justify-center rounded-3xl border-2 border-brand-200 bg-white shadow-card sm:h-32 sm:w-28">
                <LuShoppingBasket className="h-12 w-12 text-brand-700 sm:h-16 sm:w-16" strokeWidth={1.5} />
              </span>
              <span>4</span>
            </div>
            <span className="absolute bottom-5 rounded-full border border-brand-200 bg-white px-4 py-2 text-xs font-semibold text-brand-800 sm:bottom-7">
              A little off the shopping list
            </span>
          </div>

          <div className="text-center lg:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">404 · Page not found</p>
            <h1 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
              This aisle is empty.
            </h1>
            <p className="mx-auto mt-4 max-w-md text-base leading-7 text-ink-muted lg:mx-0">
              We couldn’t find the page you’re looking for. It may have moved, or the link might be incorrect. Let’s get you back to your everyday essentials.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link href="/" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-700">
                <LuHome aria-hidden="true" className="h-5 w-5" />
                Back to home
              </Link>
              <Link href="/product/shopAllProducts" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-brand-200 bg-white px-5 py-3 text-sm font-semibold text-brand-800 transition hover:bg-brand-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-700">
                Shop groceries
                <LuArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <nav aria-label="Helpful links" className="mt-6 flex flex-col items-center justify-center gap-2 text-sm sm:mt-8 sm:flex-row sm:gap-6">
          <Link href="/recharge" className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 font-medium text-charge-700 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charge-700">
            <LuSmartphone aria-hidden="true" className="h-4 w-4" />
            Mobile & DTH recharge
          </Link>
          <span aria-hidden="true" className="hidden h-4 w-px bg-gray-200 sm:block" />
          <Link href="/contactUs" className="inline-flex min-h-11 items-center rounded-lg px-2 font-medium text-ink underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700">
            Need help? Contact us
          </Link>
        </nav>
      </div>
    </main>
  );
}
