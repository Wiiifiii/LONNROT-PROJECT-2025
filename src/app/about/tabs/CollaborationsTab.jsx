"use client";
import React from "react";
import Image from "next/image";

export default function CollaborationsTab() {
  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-semibold">Cultural Collaborations & Digital Archives</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="space-y-4 text-lg">
          <p>
            This project draws inspiration from a lineage of digital and literary pioneers. Elias Lönnrot (1802–1884), the compiler of the Kalevala,
            helped preserve Finnish folklore and shaped national identity through literature. Continuing in that spirit, Lönnrot.net was among the earliest
            Finnish platforms to host public-domain literature online. We're also proud to align with global efforts like Project Gutenberg, which offers
            over 60,000 free eBooks, and the Distributed Proofreaders project, a community working together to digitize, proofread, and preserve public-domain
            texts for future generations. Together, these efforts uphold the mission of making knowledge accessible to all.
          </p>
        </div>
        <div className="flex justify-center">
          <Image
            src="/images/Collaborations.png"
            alt="Illustration representing collaborations: Elias Lönnrot, Lonnrot.net, Project Gutenberg, and DP Project"
            width={400}
            height={400}
            className="rounded shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}
