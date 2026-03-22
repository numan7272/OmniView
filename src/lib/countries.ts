import { CountrySource } from "./types";

export const COUNTRIES: CountrySource[] = [
  { code: "us", name: "United States", language: "en", flagEmoji: "\u{1F1FA}\u{1F1F8}", newsOutlets: ["CNN", "Fox News", "NYT", "Washington Post", "AP"] },
  { code: "gb", name: "United Kingdom", language: "en", flagEmoji: "\u{1F1EC}\u{1F1E7}", newsOutlets: ["BBC", "The Guardian", "Reuters", "The Times"] },
  { code: "de", name: "Germany", language: "de", flagEmoji: "\u{1F1E9}\u{1F1EA}", newsOutlets: ["Der Spiegel", "Die Zeit", "FAZ", "Bild"] },
  { code: "fr", name: "France", language: "fr", flagEmoji: "\u{1F1EB}\u{1F1F7}", newsOutlets: ["Le Monde", "Le Figaro", "AFP", "France 24"] },
  { code: "jp", name: "Japan", language: "ja", flagEmoji: "\u{1F1EF}\u{1F1F5}", newsOutlets: ["NHK", "Asahi Shimbun", "Nikkei", "Kyodo News"] },
  { code: "cn", name: "China", language: "zh", flagEmoji: "\u{1F1E8}\u{1F1F3}", newsOutlets: ["Xinhua", "People's Daily", "CGTN", "Global Times"] },
  { code: "ru", name: "Russia", language: "ru", flagEmoji: "\u{1F1F7}\u{1F1FA}", newsOutlets: ["TASS", "RT", "RIA Novosti", "Kommersant"] },
  { code: "in", name: "India", language: "hi", flagEmoji: "\u{1F1EE}\u{1F1F3}", newsOutlets: ["The Hindu", "Times of India", "NDTV", "Indian Express"] },
  { code: "br", name: "Brazil", language: "pt", flagEmoji: "\u{1F1E7}\u{1F1F7}", newsOutlets: ["Folha de S.Paulo", "O Globo", "Agencia Brasil"] },
  { code: "za", name: "South Africa", language: "en", flagEmoji: "\u{1F1FF}\u{1F1E6}", newsOutlets: ["News24", "Mail & Guardian", "SABC"] },
  { code: "au", name: "Australia", language: "en", flagEmoji: "\u{1F1E6}\u{1F1FA}", newsOutlets: ["ABC News AU", "Sydney Morning Herald", "The Australian"] },
  { code: "kr", name: "South Korea", language: "ko", flagEmoji: "\u{1F1F0}\u{1F1F7}", newsOutlets: ["Yonhap", "Korea Herald", "KBS"] },
  { code: "mx", name: "Mexico", language: "es", flagEmoji: "\u{1F1F2}\u{1F1FD}", newsOutlets: ["El Universal", "Reforma", "Proceso"] },
  { code: "ng", name: "Nigeria", language: "en", flagEmoji: "\u{1F1F3}\u{1F1EC}", newsOutlets: ["Punch", "Vanguard", "ThisDay"] },
  { code: "eg", name: "Egypt", language: "ar", flagEmoji: "\u{1F1EA}\u{1F1EC}", newsOutlets: ["Al-Ahram", "Egypt Today", "Daily News Egypt"] },
  { code: "tr", name: "Turkey", language: "tr", flagEmoji: "\u{1F1F9}\u{1F1F7}", newsOutlets: ["Hurriyet", "Anadolu Agency", "Daily Sabah"] },
  { code: "sa", name: "Saudi Arabia", language: "ar", flagEmoji: "\u{1F1F8}\u{1F1E6}", newsOutlets: ["Arab News", "Saudi Gazette", "Al Arabiya"] },
  { code: "il", name: "Israel", language: "he", flagEmoji: "\u{1F1EE}\u{1F1F1}", newsOutlets: ["Haaretz", "Jerusalem Post", "Times of Israel"] },
  { code: "ar", name: "Argentina", language: "es", flagEmoji: "\u{1F1E6}\u{1F1F7}", newsOutlets: ["Clarin", "La Nacion", "Pagina 12"] },
  { code: "id", name: "Indonesia", language: "id", flagEmoji: "\u{1F1EE}\u{1F1E9}", newsOutlets: ["Kompas", "Jakarta Post", "Tempo"] },
  { code: "it", name: "Italy", language: "it", flagEmoji: "\u{1F1EE}\u{1F1F9}", newsOutlets: ["Corriere della Sera", "La Repubblica", "ANSA"] },
  { code: "ca", name: "Canada", language: "en", flagEmoji: "\u{1F1E8}\u{1F1E6}", newsOutlets: ["CBC", "Globe and Mail", "National Post"] },
  { code: "pl", name: "Poland", language: "pl", flagEmoji: "\u{1F1F5}\u{1F1F1}", newsOutlets: ["Gazeta Wyborcza", "TVN24", "Rzeczpospolita"] },
  { code: "se", name: "Sweden", language: "sv", flagEmoji: "\u{1F1F8}\u{1F1EA}", newsOutlets: ["Dagens Nyheter", "SVT", "Aftonbladet"] },
  { code: "th", name: "Thailand", language: "th", flagEmoji: "\u{1F1F9}\u{1F1ED}", newsOutlets: ["Bangkok Post", "The Nation", "Thai PBS"] },
  { code: "ke", name: "Kenya", language: "en", flagEmoji: "\u{1F1F0}\u{1F1EA}", newsOutlets: ["Daily Nation", "The Standard", "KBC"] },
  { code: "co", name: "Colombia", language: "es", flagEmoji: "\u{1F1E8}\u{1F1F4}", newsOutlets: ["El Tiempo", "El Espectador", "Semana"] },
  { code: "ph", name: "Philippines", language: "tl", flagEmoji: "\u{1F1F5}\u{1F1ED}", newsOutlets: ["Philippine Star", "Inquirer", "Rappler"] },
  { code: "ua", name: "Ukraine", language: "uk", flagEmoji: "\u{1F1FA}\u{1F1E6}", newsOutlets: ["Ukrinform", "Kyiv Independent", "Ukrainska Pravda"] },
  { code: "cl", name: "Chile", language: "es", flagEmoji: "\u{1F1E8}\u{1F1F1}", newsOutlets: ["El Mercurio", "La Tercera", "BioBio Chile"] },
  { code: "pe", name: "Peru", language: "es", flagEmoji: "\u{1F1F5}\u{1F1EA}", newsOutlets: ["El Comercio", "La Republica", "RPP"] },
  { code: "my", name: "Malaysia", language: "ms", flagEmoji: "\u{1F1F2}\u{1F1FE}", newsOutlets: ["The Star", "New Straits Times", "Malaysiakini"] },
  { code: "sg", name: "Singapore", language: "en", flagEmoji: "\u{1F1F8}\u{1F1EC}", newsOutlets: ["Straits Times", "CNA", "TODAY"] },
  { code: "nz", name: "New Zealand", language: "en", flagEmoji: "\u{1F1F3}\u{1F1FF}", newsOutlets: ["NZ Herald", "Stuff", "RNZ"] },
  { code: "no", name: "Norway", language: "no", flagEmoji: "\u{1F1F3}\u{1F1F4}", newsOutlets: ["VG", "Aftenposten", "NRK"] },
  { code: "ae", name: "UAE", language: "ar", flagEmoji: "\u{1F1E6}\u{1F1EA}", newsOutlets: ["Gulf News", "The National", "Khaleej Times"] },
  { code: "pk", name: "Pakistan", language: "ur", flagEmoji: "\u{1F1F5}\u{1F1F0}", newsOutlets: ["Dawn", "Geo News", "The News International"] },
  { code: "bd", name: "Bangladesh", language: "bn", flagEmoji: "\u{1F1E7}\u{1F1E9}", newsOutlets: ["Daily Star", "Prothom Alo", "Dhaka Tribune"] },
  { code: "vn", name: "Vietnam", language: "vi", flagEmoji: "\u{1F1FB}\u{1F1F3}", newsOutlets: ["VnExpress", "Tuoi Tre", "Thanh Nien"] },
  { code: "gh", name: "Ghana", language: "en", flagEmoji: "\u{1F1EC}\u{1F1ED}", newsOutlets: ["Daily Graphic", "Citi FM", "GhanaWeb"] },
];

export function getCountryByCode(code: string): CountrySource | undefined {
  return COUNTRIES.find((c) => c.code === code);
}

export function getFlagEmoji(countryCode: string): string {
  return getCountryByCode(countryCode)?.flagEmoji ?? "\u{1F30D}";
}

export function getCountryName(countryCode: string): string {
  return getCountryByCode(countryCode)?.name ?? countryCode.toUpperCase();
}
