"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Loader from "@/components/loader/loader";
import waveSvg from "../../../../../public/frontend/SvgAssets/wave-white.svg";
import Image from "next/image";
import DOMPurify from "dompurify";

const Page = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const COMPANY_INFO = {
    name: "JonoJivan Grocery Distribution Pvt Ltd",
    address: "UTTAR KHATOWAL RUPAHIHAT NAGAON ASSAM PIN 782124",
    website: "https://www.jonojivangrocery.in/",
    contactUrl: "https://www.jonojivangrocery.in/contactUs",
    email: "jonojivangrocery@gmail.com",
    phone: "+91 9435266783",
    country: "Assam, India"
  };

  const LAST_UPDATED = "September 17, 2025";
  const SERVICE_NAME = "JonoJivan Grocery";

  if (error) {
    return (
      <div className="text-center text-red-500 text-lg p-4">Error: {error}</div>
    );
  }

  // Sanitize the HTML content before rendering
  const sanitizedContent = DOMPurify.sanitize(data?.content || '');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-white flex flex-col"
    >
      <div className="w-full bg-blue-500 h-[60vh] flex justify-center items-center relative">
        <h1 className="text-white md:text-6xl text-3xl text-center">
          Terms And Condition{" "}
        </h1>
      </div>

      {/* Wave SVG */}
      <div className="relative w-full overflow-hidden md:-mt-[4rem] -mt-[1rem]">
        <Image
          src={waveSvg}
          alt="Wave"
          layout="responsive"
          objectFit="cover"
          className="w-full"
          priority
        />
      </div>

      {/* Content */}
     <div className="max-w-4xl mx-auto px-6 py-8 bg-white">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Terms and Conditions</h1>
        <p className="text-gray-600 mb-6">Last updated: {LAST_UPDATED}</p>
        <p className="mb-8">Please read these terms and conditions carefully before using Our Service.</p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Interpretation and Definitions</h2>
        
        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Interpretation</h3>
        <p className="mb-4">
          The words of which the initial letter is capitalized have meanings defined under the following conditions. 
          The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Definitions</h3>
        <p className="mb-4">For the purposes of these Terms and Conditions:</p>
        
        <ul className="list-disc pl-6 space-y-3 mb-6">
          <li>
            <p>
              <strong>Affiliate</strong> means an entity that controls, is controlled by or is under common control with a party, 
              where &ldquo;control&rdquo; means ownership of 50% or more of the shares, equity interest or other securities entitled to vote 
              for election of directors or other managing authority.
            </p>
          </li>
          <li>
            <p><strong>Country</strong> refers to: {COMPANY_INFO.country}</p>
          </li>
          <li>
            <p>
              <strong>Company</strong> (referred to as either &ldquo;the Company&rdquo;, &ldquo;We&rdquo;, &ldquo;Us&rdquo; or &ldquo;Our&rdquo; in this Agreement) refers to {COMPANY_INFO.name}, {COMPANY_INFO.address}.
            </p>
          </li>
          <li>
            <p><strong>Device</strong> means any device that can access the Service such as a computer, a cellphone or a digital tablet.</p>
          </li>
          <li>
            <p><strong>Service</strong> refers to the Website.</p>
          </li>
          <li>
            <p>
              <strong>Terms and Conditions</strong> (also referred as &ldquo;Terms&rdquo;) mean these Terms and Conditions that form the entire agreement 
              between You and the Company regarding the use of the Service.
            </p>
          </li>
          <li>
            <p>
              <strong>Third-party Social Media Service</strong> means any services or content (including data, information, products or services) 
              provided by a third-party that may be displayed, included or made available by the Service.
            </p>
          </li>
          <li>
            <p>
              <strong>Website</strong> refers to {SERVICE_NAME}, accessible from{' '}
              <a href={COMPANY_INFO.website} className="text-blue-600 hover:underline" target="_blank" rel="external nofollow noopener">
                {COMPANY_INFO.website}
              </a>
            </p>
          </li>
          <li>
            <p>
              <strong>You</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of 
              which such individual is accessing or using the Service, as applicable.
            </p>
          </li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Acknowledgment</h2>
        <p className="mb-4">
          These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company. 
          These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.
        </p>
        <p className="mb-4">
          Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms and Conditions. 
          These Terms and Conditions apply to all visitors, users and others who access or use the Service.
        </p>
        <p className="mb-4">
          By accessing or using the Service You agree to be bound by these Terms and Conditions. If You disagree with any part of these 
          Terms and Conditions then You may not access the Service.
        </p>
        <p className="mb-4">
          You represent that you are over the age of 18. The Company does not permit those under 18 to use the Service.
        </p>
        <p className="mb-6">
          Your access to and use of the Service is also conditioned on Your acceptance of and compliance with the Privacy Policy of the Company. 
          Our Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your personal information when You use 
          the Application or the Website and tells You about Your privacy rights and how the law protects You. Please read Our Privacy Policy 
          carefully before using Our Service.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Links to Other Websites</h2>
        <p className="mb-4">Our Service may contain links to third-party web sites or services that are not owned or controlled by the Company.</p>
        <p className="mb-4">
          The Company has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites 
          or services. You further acknowledge and agree that the Company shall not be responsible or liable, directly or indirectly, for any damage or 
          loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods or services available on or 
          through any such web sites or services.
        </p>
        <p className="mb-6">
          We strongly advise You to read the terms and conditions and privacy policies of any third-party web sites or services that You visit.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Termination</h2>
        <p className="mb-4">
          We may terminate or suspend Your access immediately, without prior notice or liability, for any reason whatsoever, including without 
          limitation if You breach these Terms and Conditions.
        </p>
        <p className="mb-6">Upon termination, Your right to use the Service will cease immediately.</p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Limitation of Liability</h2>
        <p className="mb-4">
          Notwithstanding any damages that You might incur, the entire liability of the Company and any of its suppliers under any provision of 
          this Terms and Your exclusive remedy for all of the foregoing shall be limited to the amount actually paid by You through the Service 
          or 100 USD if You haven&rsquo;t purchased anything through the Service.
        </p>
        <p className="mb-4">
          To the maximum extent permitted by applicable law, in no event shall the Company or its suppliers be liable for any special, incidental, 
          indirect, or consequential damages whatsoever (including, but not limited to, damages for loss of profits, loss of data or other information, 
          for business interruption, for personal injury, loss of privacy arising out of or in any way related to the use of or inability to use the 
          Service, third-party software and/or third-party hardware used with the Service, or otherwise in connection with any provision of this Terms), 
          even if the Company or any supplier has been advised of the possibility of such damages and even if the remedy fails of its essential purpose.
        </p>
        <p className="mb-6">
          Some states do not allow the exclusion of implied warranties or limitation of liability for incidental or consequential damages, which means 
          that some of the above limitations may not apply. In these states, each party&rsquo;s liability will be limited to the greatest extent permitted by law.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">&quot;AS IS&quot; and &quot;AS AVAILABLE&quot; Disclaimer</h2>
        <p className="mb-4">
          The Service is provided to You &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; and with all faults and defects without warranty of any kind. To the maximum 
          extent permitted under applicable law, the Company, on its own behalf and on behalf of its Affiliates and its and their respective licensors 
          and service providers, expressly disclaims all warranties, whether express, implied, statutory or otherwise, with respect to the Service, 
          including all implied warranties of merchantability, fitness for a particular purpose, title and non-infringement, and warranties that may 
          arise out of course of dealing, course of performance, usage or trade practice.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Governing Law</h2>
        <p className="mb-6">
          The laws of the Country, excluding its conflicts of law rules, shall govern this Terms and Your use of the Service. Your use of the 
          Application may also be subject to other local, state, national, or international laws.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Disputes Resolution</h2>
        <p className="mb-6">
          If You have any concern or dispute about the Service, You agree to first try to resolve the dispute informally by contacting the Company.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Changes to These Terms and Conditions</h2>
        <p className="mb-4">
          We reserve the right, at Our sole discretion, to modify or replace these Terms at any time. If a revision is material We will make 
          reasonable efforts to provide at least 30 days&rsquo; notice prior to any new terms taking effect. What constitutes a material change will 
          be determined at Our sole discretion.
        </p>
        <p className="mb-6">
          By continuing to access or use Our Service after those revisions become effective, You agree to be bound by the revised terms. If You 
          do not agree to the new terms, in whole or in part, please stop using the website and the Service.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Contact Us</h2>
        <p className="mb-4">If you have any questions about these Terms and Conditions, You can contact us:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <p>By email: {COMPANY_INFO.email}</p>
          </li>
          <li>
            <p>
              By visiting this page on our website:{' '}
              <a href={COMPANY_INFO.contactUrl} className="text-blue-600 hover:underline" target="_blank" rel="external nofollow noopener">
                {COMPANY_INFO.contactUrl}
              </a>
            </p>
          </li>
          <li>
            <p>By phone number: {COMPANY_INFO.phone}</p>
          </li>
        </ul>
      </div>
    </div>
    </motion.div>
  );
};

export default Page;
