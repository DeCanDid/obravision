import { fullAddress, site } from "@/lib/site";

/* ---------- Details you can change in one place ---------- */
export const company = {
  name: "Obravision Limited",
  cac: "2002090",
  hours: "Monday to Sat: 9:00 a.m. – 6:00 p.m.",
  updated: "Last updated: Nov 05, 2026",
};

/* ---------- Types ---------- */
export type Block =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "h3"; text: string };

export type Section = { heading: string; blocks: Block[] };

export type Policy = {
  slug: string;
  title: string;
  summary: string;
  updated: string;
  numbered: boolean;
  intro: string[];
  sections: Section[];
  contactNote: string;
};

/* ---------- Small helpers to keep the content readable ---------- */
const p = (text: string): Block => ({ type: "p", text });
const ul = (...items: string[]): Block => ({ type: "ul", items });
const ol = (...items: string[]): Block => ({ type: "ol", items });
const h3 = (text: string): Block => ({ type: "h3", text });
const sec = (heading: string, ...blocks: Block[]): Section => ({ heading, blocks });

export const sectionId = (heading: string) =>
  heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const name = company.name;

/* ---------- The policies ---------- */
export const policies: Policy[] = [
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    summary:
      "How Obravision Limited collects, uses, stores and protects your personal information when you visit our website, buy from us or contact us.",
    updated: company.updated,
    numbered: true,
    intro: [
      `${name} is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and protect your personal information when you visit our website, make a purchase, or interact with us online or in person.`,
      "By using our website or services, you agree to the collection and use of information in accordance with this policy.",
    ],
    sections: [
      sec(
        "Business Information",
        ul(
          `Company Name: ${name}`,
          `Address: ${fullAddress}, Nigeria`,
          "Contact: Customers may contact us via email, phone, WhatsApp, or by visiting our physical store for any privacy-related concerns."
        )
      ),
      sec(
        "Information We Collect",
        p("We may collect the following types of information:"),
        h3("a) Personal Information"),
        ul(
          "Full name",
          "Phone number",
          "Email address and account login details",
          "Billing and delivery address",
          "Payment confirmation details (we do not store card details)"
        ),
        h3("b) Transaction Information"),
        ul("Products purchased", "Order history", "Invoices and receipts"),
        h3("c) Technical and Usage Information"),
        ul(
          "IP address",
          "Browser type and device information",
          "Pages visited and interaction with our website",
          "Cookies and similar tracking technologies"
        )
      ),
      sec(
        "How We Use Your Information",
        p("We use your information to:"),
        ul(
          "Process and fulfil orders",
          "Deliver products and provide customer support",
          "Communicate order updates and service information",
          "Improve our website, products, and user experience",
          "Detect and prevent fraud or unauthorised activity",
          "Comply with legal and regulatory obligations"
        ),
        p("We do not sell, rent, or trade your personal information to third parties.")
      ),
      sec(
        "Cookies and Tracking Technologies",
        p("Our website may use cookies and similar technologies to:"),
        ul("Ensure the website functions properly", "Analyse website traffic and performance", "Improve user experience"),
        p(
          "You can choose to disable cookies through your browser settings; however, some features of the website may not function properly."
        )
      ),
      sec(
        "Third-Party Services",
        p("We may use trusted third-party services such as:"),
        ul(
          "Payment processors",
          "Delivery and logistics partners",
          "Website analytics tools (e.g. Google Analytics)",
          "Website hosting, email delivery and account services that help us run our website"
        ),
        p("These third parties only receive the information necessary to perform their services and are required to protect your data.")
      ),
      sec(
        "Data Security",
        p(
          "We take reasonable technical and organisational measures to protect your personal information from unauthorised access, loss, misuse, or disclosure. While we strive to protect your data, no method of transmission over the internet is completely secure."
        )
      ),
      sec(
        "Data Retention",
        p("We retain personal information only for as long as necessary to:"),
        ul("Fulfil the purposes outlined in this policy", "Meet legal, accounting, or regulatory requirements"),
        p("When information is no longer required, it is securely deleted or anonymised.")
      ),
      sec(
        "Your Rights",
        p("You have the right to:"),
        ul(
          "Request access to your personal information",
          "Request correction of inaccurate information",
          "Request deletion of your data (subject to legal obligations)",
          "Withdraw consent for marketing communications"
        ),
        p("To exercise these rights, please contact us using the details at the bottom of this page.")
      ),
      sec(
        "Children’s Privacy",
        p(
          "Our website and services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children."
        )
      ),
      sec(
        "Changes to This Privacy Policy",
        p(
          `${name} reserves the right to update this Privacy Policy at any time. Changes will be posted on this page and will take effect immediately upon publication.`
        )
      ),
    ],
    contactNote: `If you have any questions or concerns about this Privacy Policy or how your data is handled, please contact ${name} through any of the channels below.`,
  },

  {
    slug: "warranty-policy",
    title: "Warranty Policy",
    summary:
      "The Obravision Limited 30-day limited warranty on pre-owned devices: what it covers, what it excludes and how to make a claim.",
    updated: company.updated,
    numbered: false,
    intro: [],
    sections: [
      sec(
        "Coverage",
        p(
          "All pre-owned devices purchased from our store (online or physical) come with a 30-day limited warranty. This is an Obravision warranty. Manufacturer warranty may not apply to pre-owned devices."
        ),
        p(
          "This warranty covers repairs only for hardware or functional issues that arise under normal use during the warranty period. The warranty does not cover replacement of the device."
        )
      ),
      sec(
        "Conditions",
        p(
          "Warranty applies only to devices purchased directly from our store. Customers must present proof of purchase (receipt or invoice) when making a warranty claim. Repairs will be carried out by our in-house technicians or authorised service partners."
        ),
        p("The warranty excludes issues caused by:"),
        ul(
          "Accidental damage, misuse, or neglect",
          "Unauthorised repairs or modifications",
          "Software problems, viruses, or data loss",
          "Normal wear and tear (e.g. battery degradation, cosmetic scratches)"
        )
      ),
      sec(
        "Process",
        p(
          "To initiate a warranty claim, please contact us via email, phone, or visit our physical store within the 30-day period. Our team will inspect the device to determine if the issue is covered under warranty."
        ),
        p("If covered, repairs will be provided at no cost. If the issue is not covered, customers may choose to proceed with paid repair services.")
      ),
      sec(
        "Limitations",
        ul(
          "The warranty is non-transferable and applies only to the original purchaser.",
          "The warranty does not extend beyond the 30-day period.",
          "We are not liable for any indirect damages, loss of data, or downtime resulting from device issues."
        ),
        p(
          `This warranty policy is designed to protect both our valued customers and ${name}. By purchasing from us, you acknowledge and agree to abide by these warranty terms and conditions.`
        )
      ),
    ],
    contactNote:
      "For warranty claims, contact us using the details below. For questions about refunds and returns, please see our Return and Refund Policy.",
  },

  {
    slug: "shipping-policy",
    title: "Shipping Policy",
    summary:
      "How Obravision Limited processes, ships and delivers orders: processing time, delivery timeframes, delivery fees and what to do if there is a problem.",
    updated: company.updated,
    numbered: true,
    intro: [
      `This Shipping Policy explains how ${name} processes, ships, and delivers orders placed through our website or purchased directly from our physical store.`,
    ],
    sections: [
      sec(
        "Order Processing",
        p(
          "Orders placed through our website are processed after confirmation of payment. Once payment is confirmed, customers will receive an order confirmation. Orders are dispatched within 48 hours of payment confirmation."
        )
      ),
      sec(
        "Delivery Timeframes",
        p("Delivery timelines depend on the customer’s location within Nigeria and typically take 1 to 5 business days from the shipping date."),
        p("Delivery times may vary due to logistics provider delays, weather conditions, or other factors beyond our control.")
      ),
      sec(
        "Shipping Fees",
        p("A flat delivery fee of ₦10,000 applies. Orders above ₦500,000 qualify for free shipping."),
        p("Shipping fees are communicated clearly at checkout or during order confirmation.")
      ),
      sec(
        "Delivery Address",
        p(
          `Customers are responsible for providing a complete and accurate delivery address at the time of purchase. ${name} is not liable for delays or failed deliveries caused by incorrect or incomplete address details.`
        ),
        p("We also provide pickup points for your convenience in Lagos, Abuja and Port Harcourt.")
      ),
      sec(
        "Delivery Partners",
        p(
          "We use trusted third-party logistics providers to deliver orders. Once an item has been dispatched, delivery timelines are subject to the logistics provider’s operations."
        )
      ),
      sec(
        "Delays and Unforeseen Circumstances",
        p(`While we aim to meet stated delivery timelines, ${name} is not responsible for delays caused by:`),
        ul("Courier or logistics disruptions", "Weather conditions", "Public holidays", "Force majeure events"),
        p("Customers will be notified where possible if significant delays occur.")
      ),
      sec(
        "Order Inspection Upon Delivery",
        p(
          "Customers are advised to inspect items immediately upon delivery. If an item appears damaged, defective, or incorrect, customers should contact us immediately so the issue can be addressed in line with our Return and Refund Policy."
        )
      ),
    ],
    contactNote: `For shipping-related enquiries, customers may contact ${name} via email, phone, WhatsApp, or by visiting our physical store.`,
  },

  {
    slug: "return-and-refund-policy",
    title: "Return and Refund Policy",
    summary:
      "When and how you can return a laptop to Obravision Limited, how refunds and exchanges work, and what is not eligible for return.",
    updated: company.updated,
    numbered: true,
    intro: [
      `At ${name}, we specialise in high-quality used laptops that are fully tested before sale. Our return policy is designed to ensure fairness, transparency, and customer satisfaction while protecting the integrity of our products.`,
    ],
    sections: [
      sec(
        "Return Window",
        p("Returns are accepted within 7 days from the date the item is delivered to the customer."),
        p("The return window does not begin on the purchase date or shipping date.")
      ),
      sec(
        "Eligibility for Returns",
        p("Because we sell only used laptops, returns are accepted only if the product is defective."),
        p("A laptop is considered defective if:"),
        ul(
          "It has a hardware or functional issue not caused by customer misuse",
          "It fails to perform basic functions as described at the time of purchase"
        ),
        p("Eligible outcomes:"),
        ul("Repair", "Replacement (subject to availability)", "Refund")
      ),
      sec(
        "Non-Defective Returns",
        p("We do not accept returns for non-defective used laptops, including situations such as:"),
        ul(
          "Change of mind",
          "Performance expectations not aligned with product specifications",
          "Cosmetic wear that was disclosed or visible at purchase",
          "Battery health within the normal used-device range"
        )
      ),
      sec(
        "Items Not Eligible for Return",
        p("Returns will be rejected if the laptop shows:"),
        ul(
          "Physical damage after delivery",
          "Liquid damage",
          "Unauthorised repairs or tampering",
          "Software corruption caused by customer actions",
          "Missing components (charger, RAM, SSD, battery, etc.)",
          "Removal of warranty stickers or seals",
          "Issues reported after the 7-day return window"
        )
      ),
      sec(
        "Return Process",
        p("To initiate a return:"),
        ol(
          `Email ${site.email} within the 7-day return window`,
          "Provide your order number, delivery date, and a description of the issue",
          "Our team will assess and provide return instructions"
        ),
        p("All returns must be delivered to:"),
        p(`${name} – Returns Department, ${fullAddress}, Nigeria`)
      ),
      sec(
        "Refunds",
        p("Refunds are processed within 7 business days after inspection confirms the defect."),
        p("Refund method:"),
        ul("Same payment method used for purchase", "Or store credit (customer’s choice)"),
        p("Items failing inspection will not be refunded; customers may opt for paid repair services.")
      ),
      sec("Exchanges", p("Exchanges are available only for defective laptops, subject to stock availability.")),
      sec(
        "Return Fees",
        ul(
          `Defective items: ${name} covers the return shipping fee`,
          "Non-defective items: Not accepted",
          "There is no re-stocking fee"
        )
      ),
      sec(
        "Warranty and Related Policies",
        p("This Return and Refund Policy applies in the event that a defective item is received from us."),
        p("For repairs or hardware issues covered by our 30-day warranty, please refer to our Warranty Policy.")
      ),
    ],
    contactNote: "For any questions regarding returns or refunds, please contact us:",
  },

  {
    slug: "terms-and-conditions",
    title: "Terms and Conditions",
    summary:
      "The terms and conditions for using the Obravision website and buying from Obravision Limited. Full terms coming soon.",
    updated: company.updated,
    numbered: false,
    intro: [],
    sections: [
      sec(
        "Terms and Conditions",
        p("[Terms and Conditions content to be added]"),
        p(
          "Our full Terms and Conditions are being prepared and will be published on this page. If you have any questions in the meantime, please contact us using the details below."
        )
      ),
    ],
    contactNote: "For any questions about these terms, please contact us:",
  },
];

export const getPolicy = (slug: string) => policies.find((x) => x.slug === slug);

export const obracompany = {
  name: "Obravision Limited",
  cac: "2002090",
  registeredAddress: "10 Palm Springs Road Ikate, Lekki, Lagos, Nigeria, 101245",
  hours: "Monday to Sat: 9:00 a.m. – 6:00 p.m.",
  updated: "Last updated: Nov 05, 2026",
};