/*
  English copy. Every sentence here is either a fact the client published or
  confirmed (see lib/site.ts) or plain navigation/label text. No invented
  clients, prices, certifications or numbers. APOLO origin is never claimed.
  The Burmese file (content.my.ts) must keep exactly this shape.
*/

export type Item = { title: string; text: string };

export type Content = {
  siteName: string;
  nav: {
    home: string; about: string; paper: string; stationery: string;
    services: string; group: string; contact: string;
    enquire: string; menu: string; close: string; skip: string; language: string;
  };
  meta: Record<"home" | "about" | "paper" | "stationery" | "services" | "group" | "contact" | "privacy" | "notFound", { title: string; description: string }>;
  home: {
    /** Hero slider: one entry per campus photo, in the order the photos are listed in app/[lang]/page.tsx. */
    slides: Array<{ tab: string; kicker: string; title: string; text: string }>;
    ctaPrimary: string; ctaSecondary: string;
    statement: string;
    proof: Array<{ k: string; label: string }>;
    pillarsKicker: string;
    pillars: Array<{ title: string; text: string; tags: string[]; cta: string }>;
    catalogueKicker: string; catalogueTitle: string; catalogueText: string; catalogueCta: string;
    brandsKicker: string; brandsTitle: string;
    apoloKicker: string; apoloTitle: string; apoloText: string; apoloCta: string; apoloShop: string;
    facilityKicker: string; facilityTitle: string; facilityText: string;
    facilityPoints: Array<{ k: string; label: string }>;
    servicesKicker: string; servicesTitle: string; servicesText: string;
    services: Array<{ title: string; text: string }>;
    groupKicker: string; groupTitle: string; groupText: string; groupCta: string;
    contactTitle: string; contactText: string;
  };
  about: {
    kicker: string; h1: string; lead: string;
    storyTitle: string; story: string[];
    timelineTitle: string; timeline: Array<{ year: string; text: string }>;
    placesTitle: string;
    hq: { label: string; name: string; address: string };
    showroom: { label: string; name: string; address: string };
    visionTitle: string; vision: string; missionTitle: string; mission: string;
    ctaTitle: string; ctaText: string;
    photoAlt: string;
  };
  paper: {
    kicker: string; h1: string; lead: string;
    categories: Array<{ title: string; blurb: string; grades: string[] }>;
    copyTitle: string; copyText: string;
    note: string;
    ctaTitle: string; ctaText: string;
  };
  stationery: {
    kicker: string; h1: string; lead: string;
    familiesTitle: string; families: Item[];
    forBuyersTitle: string; forBuyersText: string;
    shopTitle: string; shopText: string; shopCta: string;
  };
  services: {
    kicker: string; h1: string; lead: string;
    blocks: Array<{ title: string; text: string; list: string[] }>;
    processTitle: string; processLead: string;
    steps: string[];
    ctaTitle: string; ctaText: string;
  };
  group: {
    kicker: string; h1: string; lead: string;
    companies: Item[];
    note: string;
  };
  contact: {
    kicker: string; h1: string; lead: string;
    channelsTitle: string;
    channels: { call: string; viber: string; messenger: string; email: string };
    placesTitle: string;
    hoursNote: string;
    formTitle: string; formLead: string;
    form: {
      name: string; company: string; phone: string; email: string; emailHint: string;
      who: string; whoOptions: string[];
      about: string; aboutOptions: string[];
      message: string; messagePlaceholder: string;
      viber: string; send: string; sending: string;
      required: string;
      okTitle: string; okText: string;
      errTitle: string; errText: string; errMail: string;
      unconfigured: string;
    };
  };
  footer: {
    tagline: string; explore: string; reach: string; addresses: string;
    group: string; rights: string; apoloNote: string;
  };
  contactBar: { call: string; viber: string; messenger: string; email: string };
  notFound: { title: string; text: string; back: string };
  placeholders: {
    photo: string; milestones: string; hours: string; specs: string; logo: string;
  };
};

export const en: Content = {
  siteName: "Deco-Land",
  nav: {
    home: "Home", about: "About", paper: "Paper", stationery: "Stationery",
    services: "Services", group: "Group", contact: "Contact",
    enquire: "Enquire", menu: "Menu", close: "Close", skip: "Skip to content", language: "Language",
  },
  meta: {
    home: {
      title: "Deco-Land | Paper, APOLO Stationery & Printing, Yangon",
      description: "Paper wholesale since 1997 in Yangon: printing, packaging and special papers, APOLO stationery, and custom printing and packaging.",
    },
    about: {
      title: "About Deco-Land | Myanmar Paper House Since 1997",
      description: "Deco-Land was established in 1997 and pioneered wholesale and retail trade in Myanmar's paper industry. Factory and showroom in Yangon.",
    },
    paper: {
      title: "Paper Wholesale in Yangon | Deco-Land",
      description: "Copy, printing, packaging, special and stationery papers for distributors, printers and businesses. Ask Deco-Land for current availability.",
    },
    stationery: {
      title: "APOLO Stationery | Deco-Land Myanmar",
      description: "APOLO is Deco-Land's own stationery brand: books, ledgers, vouchers, envelopes, files and desk supplies for schools and offices.",
    },
    services: {
      title: "Custom Printing, Packaging & Disposables | Deco-Land",
      description: "Custom printed paper cups, plates and lunch boxes, commercial printing and finishing, and custom printed packaging in Yangon.",
    },
    group: {
      title: "The Deco-Land Group | Main Label, Hitachi Elevator, Deco-TBSP, Modern Tech",
      description: "Deco-Land is part of a wider group of Myanmar companies in label printing, elevators, security printing and racking.",
    },
    contact: {
      title: "Contact Deco-Land | Call, Viber, Messenger or Email",
      description: "Reach Deco-Land's sales team by phone, Viber, Messenger, email or the enquiry form. Factory and showroom addresses in Yangon.",
    },
    privacy: { title: "Privacy | Deco-Land", description: "How Deco-Land handles the details you send through this website." },
    notFound: { title: "Page not found | Deco-Land", description: "This page could not be found." },
  },
  home: {
    slides: [
      {
        tab: "Hlaing Thar Yar campus",
        kicker: "Deco-Land Group · since 1997",
        title: "Myanmar's No.1 paper wholesaler.",
        text: "Paper, APOLO® stationery and custom printing and packaging, from our 25,000 m² facility in Hlaing Thar Yar.",
      },
      {
        tab: "Head office",
        kicker: "Paper · Stationery · Print",
        title: "One house for paper, stationery and print.",
        text: "Printing, packaging, special and stationery papers, our own APOLO® brand, and custom production for businesses.",
      },
      {
        tab: "Main gate",
        kicker: "Paper One™ in Myanmar",
        title: "Main distributor of Paper One copy paper.",
        text: "Copy paper and a vast range of printing and packaging grades for distributors, printers and offices.",
      },
      {
        tab: "Warehouse",
        kicker: "For distributors and businesses",
        title: "Paper stock for the whole trade.",
        text: "Wholesale supply for distributors, shops, printers, corporate and government buyers.",
      },
    ],
    ctaPrimary: "Send an enquiry",
    ctaSecondary: "Explore our products",
    statement: "More than 25 years of experience in Myanmar's paper industry.",
    proof: [
      { k: "1997", label: "Founded in Yangon" },
      { k: "25,000 m²", label: "Facility in Hlaing Thar Yar" },
      { k: "200+", label: "People at Deco-Land" },
      { k: "No.1", label: "Paper wholesaler in Myanmar" },
    ],
    pillarsKicker: "What we do",
    pillars: [
      {
        title: "Paper",
        text: "We supply a vast range of paper, including printing, packaging, special and stationery papers, and we are the main distributor of Paper One™ copy paper in Myanmar.",
        tags: ["Copy", "Printing", "Packaging", "Special", "Stationery"],
        cta: "Paper range",
      },
      {
        title: "Stationery",
        text: "APOLO® is our own stationery brand: books, ledgers, vouchers, envelopes, files and a wide range of school and office supplies, sold across the country.",
        tags: ["Books", "Ledgers", "Vouchers", "Envelopes", "Files"],
        cta: "APOLO stationery",
      },
      {
        title: "Services",
        text: "Mass production on customised orders: printed paper cups, plates and lunch boxes, commercial printing, and custom printed packaging.",
        tags: ["Disposables", "Printing", "Packaging"],
        cta: "Our services",
      },
    ],
    catalogueKicker: "Paper range",
    catalogueTitle: "Five categories, from copy paper to packaging board.",
    catalogueText: "Art card, duplex, kraft liner, NCR, thermal rolls and more. Ask us for grades, weights and current availability.",
    catalogueCta: "See all paper",
    brandsKicker: "Brands we carry",
    brandsTitle: "Leading copy paper brands, from one supplier.",
    apoloKicker: "APOLO®",
    apoloTitle: "Our own stationery brand.",
    apoloText: "Exercise books, note books, hard cover, wire binding, sketch and colouring books, plus ledgers, vouchers, files and desk supplies.",
    apoloCta: "The APOLO range",
    apoloShop: "Shop APOLO online",
    facilityKicker: "Our facility",
    facilityTitle: "Built for supply at scale.",
    facilityText: "Our head office, factory and warehouse sit on one campus in Hlaing Thar Yar Industrial Zone, with our showroom on Strand Road in Latha.",
    facilityPoints: [
      { k: "25,000 m²", label: "Hlaing Thar Yar campus" },
      { k: "Strand Road", label: "Showroom, Latha Township" },
      { k: "200+", label: "People" },
    ],
    servicesKicker: "Custom production",
    servicesTitle: "Printed, packed and made to your order.",
    servicesText: "We specialise in disposable items, printing and packaging services for businesses.",
    services: [
      { title: "Paper cups and bowls", text: "Custom printed cups, bowls, plates and lunch boxes." },
      { title: "Printing", text: "Books, calendars, brochures, labels and business documents." },
      { title: "Packaging", text: "Custom printed boxes and shopping bags in your sizes and designs." },
    ],
    groupKicker: "Deco-Land Group",
    groupTitle: "Part of a wider group of Myanmar companies.",
    groupText: "Label printing, elevators and escalators, security printing, and racking and pallets.",
    groupCta: "Meet the group",
    contactTitle: "Talk to our sales team.",
    contactText: "Call, message on Viber or Messenger, or email us. Tell us what you need and we will come back to you.",
  },
  about: {
    kicker: "About",
    h1: "Since 1997, paper is what we do.",
    lead: "Deco-Land pioneered wholesale and retail trade in Myanmar's paper industry, and has grown into a paper house that also makes and prints.",
    storyTitle: "The story",
    story: [
      "Deco-Land was established in 1997. It began as a paper trading company and pioneered wholesale and retail trade in Myanmar's paper industry.",
      "Today Deco-Land supplies foreign and copy paper, makes paper products for school and office, and produces customised paper products for disposable items, printing and packaging. It serves distributors and end users.",
    ],
    timelineTitle: "Milestones",
    timeline: [
      { year: "1997", text: "Deco-Land is established." },
      { year: "2012", text: "The APOLO brand is launched." },
      { year: "2014", text: "Mass-production printing and packaging services are added." },
      { year: "2015", text: "Hitachi Elevator is established." },
      { year: "2016", text: "Main Label is formed in a joint venture with Japan SHIDO Corporation." },
      { year: "2017", text: "Deco-TBSP is founded for security printing." },
    ],
    placesTitle: "Where to find us",
    hq: {
      label: "Head office and factory",
      name: "Hlaing Thar Yar Industrial Zone",
      address: "No.3 (C1 & 2), Ward (9), U Tun Nyo Street, Hlaing Thar Yar Industrial Zone (6), Hlaing Thar Yar Township, Yangon",
    },
    showroom: {
      label: "Showroom",
      name: "Strand Road",
      address: "No.326/328, Strand Road, corner of 24th Street, Latha Township, Yangon",
    },
    visionTitle: "Vision",
    vision: "To lead paper trading and paper product manufacturing in Myanmar.",
    missionTitle: "Mission",
    mission: "To share success by providing quality products and service at superior value.",
    ctaTitle: "Work with Deco-Land",
    ctaText: "Tell us what you are looking for and we will point you to the right person.",
    photoAlt: "The Deco-Land head office entrance and signage in Yangon",
  },
  paper: {
    kicker: "Paper",
    h1: "Paper, by grade.",
    lead: "Five categories from copy paper to packaging board. Specifications and current availability are confirmed when you enquire.",
    categories: [
      { title: "Copy paper", blurb: "Everyday office paper, including colour copy paper.", grades: ["Copy paper", "Colour copy paper"] },
      {
        title: "Printing papers",
        blurb: "Papers for books, brochures, posters and commercial print.",
        grades: ["Art Card", "Art Paper", "Art Paper (Matt)", "Woodfree", "Newsprint"],
      },
      {
        title: "Packaging papers",
        blurb: "Boards and papers for cartons, boxes, cups and wrapping.",
        grades: ["Cast Coated 2S", "Duplex", "Grey Chip Board", "Triplex", "Yaeni Paper", "Medium Paper", "Test Liner", "Kraft Liner", "PE Coated / Cup Stock"],
      },
      {
        title: "Special papers",
        blurb: "Coloured, embossed, metallic and functional papers.",
        grades: ["Brief Card and Colour Brief Card", "Colour Embossed Card", "Colour Paper", "Gold / Silver Card", "NCR Carbonless", "Pearlescent", "Sticker", "Tracing"],
      },
      {
        title: "Stationery papers",
        blurb: "Forms and rolls for offices, shops and point of sale.",
        grades: ["Continuous Form", "Fax Roll", "NCR Register Roll", "Register Roll", "Thermal Paper Roll"],
      },
    ],
    copyTitle: "Copy paper",
    copyText: "Deco-Land is the main distributor of Paper One copy paper in Myanmar. Weights, sizes and brands are confirmed when you enquire.",
    note: "Prices are not listed online. Ask our sales team for current prices and availability.",
    ctaTitle: "Can't see your grade or size?",
    ctaText: "Send us the grade, weight and size you need and we will tell you what we can supply.",
  },
  stationery: {
    kicker: "APOLO®",
    h1: "APOLO® stationery.",
    lead: "APOLO is Deco-Land's own stationery brand, for schools, offices and shops. Launched in 2012.",
    familiesTitle: "The range",
    families: [
      { title: "Envelopes", text: "Everyday and office envelopes." },
      { title: "File folders", text: "Clip board, paper file, half file, File Master, PP file, PVC lever box and ring file." },
      { title: "Books", text: "Exercise books and notebooks for school and office." },
      { title: "Ledgers", text: "Daily, journal, accounting journal, general, cash, office and stock ledgers." },
      { title: "Vouchers", text: "Voucher books for business records." },
      { title: "Writing instruments", text: "Pens and other writing instruments." },
      { title: "Other supplies", text: "Desk accessories and other office supplies." },
    ],
    forBuyersTitle: "Buying in volume?",
    forBuyersText: "Distributors, shops, schools and offices can order APOLO in quantity. Tell us what you need.",
    shopTitle: "Shop APOLO online",
    shopText: "APOLO has its own online store for everyday orders.",
    shopCta: "Go to the APOLO store",
  },
  services: {
    kicker: "Services",
    h1: "Printed, cut, folded and stamped to your design.",
    lead: "Custom manufacturing for businesses: printed disposables, commercial printing and printed packaging.",
    blocks: [
      {
        title: "Disposable items",
        text: "Custom printed disposables for cafés, restaurants and food businesses.",
        list: ["Paper cups", "Paper plates", "Paper lunch boxes"],
      },
      {
        title: "Printing services",
        text: "Commercial printing and the finishing processes behind it.",
        list: [
          "Backdrops, booklets, books, brochures", "Business documents, calendars, envelopes", "Flag liners, flyers, folders",
          "Invitation cards, labels, letterheads", "Posters and time cards",
        ],
      },
      {
        title: "Packaging services",
        text: "Custom printed packaging in a choice of sizes and designs.",
        list: ["Printed boxes and cartons", "Choice of sizes", "Choice of designs"],
      },
    ],
    processTitle: "From design to finish",
    processLead: "The printing and finishing processes Deco-Land offers.",
    steps: ["Design", "CTP developing", "Offset printing", "UV coating and calendaring", "Plastic lamination", "Die cutting and laser knife moulds", "Hot stamping", "Gluing and folding"],
    ctaTitle: "Send a project brief",
    ctaText: "Tell us what you want made, the quantity and when you need it.",
  },
  group: {
    kicker: "The group",
    h1: "Part of the Deco-Land Group.",
    lead: "Deco-Land has grown alongside a wider group of Myanmar companies.",
    companies: [
      { title: "Main Label", text: "Label printing. A joint venture with Japan SHIDO Corporation, formed in 2016." },
      { title: "Hitachi Elevator", text: "Elevators and escalators. Established in 2015." },
      { title: "Deco-TBSP", text: "Security printing. Founded in 2017." },
      { title: "Modern Tech", text: "Racking and pallets." },
    ],
    note: "These companies run separately from Deco-Land's paper and stationery business.",
  },
  contact: {
    kicker: "Contact",
    h1: "Talk to us your way.",
    lead: "Call, message, email or use the form. Our sales team will come back to you.",
    channelsTitle: "Reach us",
    channels: { call: "Call", viber: "Viber", messenger: "Messenger", email: "Email" },
    placesTitle: "Visit",
    hoursNote: "Opening hours",
    formTitle: "Send an enquiry",
    formLead: "For prices, availability, distributor orders or a custom printing and packaging brief.",
    form: {
      name: "Your name", company: "Business name", phone: "Phone", email: "Email", emailHint: "optional",
      who: "I am a", whoOptions: ["Distributor or shop", "Corporate or government buyer", "Printer or packaging maker", "School or office", "Other"],
      about: "I am asking about", aboutOptions: ["Paper", "APOLO stationery", "Custom printing", "Packaging", "Paper cups, plates or lunch boxes", "Something else"],
      message: "Message", messagePlaceholder: "What do you need, how much, and by when?",
      viber: "You can reach me on Viber at this number", send: "Send enquiry", sending: "Sending…",
      required: "Please add your name, a phone number and a short message.",
      okTitle: "Thank you.", okText: "Your enquiry has been sent. Our team will come back to you.",
      errTitle: "We couldn't send that.", errText: "Please try again, or reach us directly.", errMail: "Email us instead",
      unconfigured: "This form isn't connected to our inbox yet. Please call, message us on Viber or Messenger, or email us.",
    },
  },
  footer: {
    tagline: "Paper, APOLO® stationery and custom printing and packaging. Yangon, Myanmar.",
    explore: "Explore", reach: "Reach us", addresses: "Visit",
    group: "Deco-Land is part of a group of Myanmar companies.",
    rights: "Deco-Land Co., Ltd. All rights reserved.",
    apoloNote: "APOLO® is Deco-Land's own stationery brand.",
  },
  contactBar: { call: "Call", viber: "Viber", messenger: "Chat", email: "Email" },
  notFound: {
    title: "This page didn't make it through the die cutter.",
    text: "The page you were looking for doesn't exist or has moved.",
    back: "Back to the home page",
  },
  placeholders: {
    photo: "Photo to supply: finished products, showroom or paper stock",
    milestones: "Milestones 2018 to today",
    hours: "Opening hours for the office and showroom",
    specs: "MOQ, lead times, cup and box sizes, artwork requirements",
    logo: "Vector logo file",
  },
};
