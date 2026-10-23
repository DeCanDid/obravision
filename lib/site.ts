export const site = {
  name: "Obravision",
  tagline: "Laptops for individuals, schools and businesses in Lagos",
  description:
    "Obravision is a laptop store in Victoria Island, Lagos. Buy HP, Dell, ASUS, Apple, Microsoft and Samsung laptops as a single unit or in bulk at wholesale prices.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  phone: { display: "0903 083 2685", tel: "+2349030832685" },
  whatsapp: "2349030832685", // international format, no + or spaces
  email: "Info@obravision.com",
  address: {
    street: "Tele Plaza, Unit A19, 5 Saka Tinubu Street",
    area: "Victoria Island",
    city: "Lagos",
    country: "NG",
  },
  brands: ["HP", "Dell", "ASUS", "Apple", "Microsoft", "Samsung"],
  nav: [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Laptops", href: "/laptops" },
    { label: "Contact", href: "/contact" },
  ],
  payment: {
    bankName: "Moniepoint",
    accountName: "Techobra",
    accountNumber: "5799925092",
  },
};

export const fullAddress = `${site.address.street}, ${site.address.area}, ${site.address.city}`;

export const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${fullAddress}, Nigeria`
)}`;

export function whatsappLink(message: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

  // Fill in the client's real account details. Shown on the order page only when accountNumber is set.
  