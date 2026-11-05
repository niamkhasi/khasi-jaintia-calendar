import { MarketDay, Holiday } from '../types/calendar';

export const KHASI_MONTHS = [
  "Kyllalyngkot",
  "Rymphang",
  "Lber",
  "Iaiong",
  "Jymmang",
  "Jylliew",
  "Naitung",
  "Nailar",
  "Nailur",
  "Risaw",
  "Naiwieng",
  "Nohprah"
];

export const ENG_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

export const KHASI_MONTH_DESCRIPTIONS: Record<number, { season: string; meaning: string }> = {
  0: { season: "Tlang (Winter)", meaning: "The coldest month of frost and hearth gatherings (Kyllalyngkot)." },
  1: { season: "Tlang (Late Winter)", meaning: "The month of gusty dry winds across the Khasi and Jaintia plateaus (Rymphang)." },
  2: { season: "Pyrem (Spring)", meaning: "The emergence of green buds and initial field clearing (Lber)." },
  3: { season: "Pyrem (Spring Rains)", meaning: "Thunderstorms and pre-monsoon showers for sowing maize and paddy (Iaiong)." },
  4: { season: "Lyiur (Early Summer)", meaning: "The month of blossoming wild orchids and lush greenery (Jymmang)." },
  5: { season: "Lyiur (Monsoon Begins)", meaning: "Continuous heavy rains, swelling waterfalls and rivers (Jylliew)." },
  6: { season: "Lyiur (Mid Monsoon)", meaning: "Warm monsoonal weather, weeding terrace fields (Naitung)." },
  7: { season: "Lyiur (Late Monsoon)", meaning: "Ripening paddy crops across the valleys (Nailar)." },
  8: { season: "Synrai (Autumn)", meaning: "Gentle autumn sunshine, drying of fields and clear skies (Nailur)." },
  9: { season: "Synrai (Harvest Season)", meaning: "Golden paddy harvest, pleasant festive season (Risaw)." },
  10: { season: "Synrai (Late Autumn)", meaning: "Harvest completion, cold crisp mountain breezes (Naiwieng)." },
  11: { season: "Tlang (Early Winter)", meaning: "The year's close, winter festivities, church gatherings and community feasts (Nohprah)." }
};

export const CYCLE: MarketDay[] = [
  {
    index: 0,
    khasi: "Ïewduh",
    pnar: "Hat",
    khasiMeaning: "The grandest central market in Shillong (Ïewduh / Bara Bazar)",
    pnarMeaning: "Traditional village weekly market (Hat) in Jaiñtia hills",
    significance: "The premier central market day of the Hynniewtrep people, bustling with farmers, artisans, and merchants from all corners.",
    majorLocations: "Ïewduh (Shillong), rural market centers",
    activities: "Spices, agricultural produce, Ryndia eri silk, tools, textiles, traditional items."
  },
  {
    index: 1,
    khasi: "Lyngka",
    pnar: "Khyllaw",
    khasiMeaning: "Mid-cycle gathering in sacred groves and rural hills",
    pnarMeaning: "Commercial gathering and barter day in Jaiñtia hills",
    significance: "Follows Ïewduh day. A vibrant market where hill farmers and valley traders bring organic harvests.",
    majorLocations: "Mawphlang, Mylliem, Raliang",
    activities: "Fresh mountain greens, wild mushrooms, local tea, honey, and hand-spun wool."
  },
  {
    index: 2,
    khasi: "Nongkrem",
    pnar: "Pynsiñ",
    khasiMeaning: "Associated with the Syiemship of Khyrim (Smit)",
    pnarMeaning: "Traditional market and trading fair in Jaiñtia hills",
    significance: "Deep cultural history tied to the royal seat of Smit and indigenous governance.",
    majorLocations: "Smit, Nongkrem, Ummulong",
    activities: "Ceremonial garments, Ryndia silk, livestock, traditional musical instruments (Duitara, Ksing)."
  },
  {
    index: 3,
    khasi: "Mawlong",
    pnar: "Mulong",
    khasiMeaning: "Traditional wholesale and border trade market",
    pnarMeaning: "Trading eve and fair in Jaiñtia hills",
    significance: "The market gathering for wholesale trade, farm produce, and local exchanges.",
    majorLocations: "Mawlong, wholesale yards in Shillong and Jaiñtia hills",
    activities: "Wholesale bulk produce, sacks of Khasi potatoes, oranges, tejpatta, and pine timber."
  },
  {
    index: 4,
    khasi: "Rynghep",
    pnar: "Musiang",
    khasiMeaning: "Trade day in southern ridges and Sohra",
    pnarMeaning: "The grandest central market in Jowai (West Jaiñtia Hills)",
    significance: "A lively market day featuring the great Iawmusiang central market in Jowai alongside southern trade centers.",
    majorLocations: "Iawmusiang (Jowai), Cherrapunjee (Sohra), Pynursla, Amlarem",
    activities: "Poultry, smoked river fish, cane craft, iron tools, agricultural produce, and textiles."
  },
  {
    index: 5,
    khasi: "Shyllong",
    pnar: "Muchai",
    khasiMeaning: "Named after the historic Shyllong / Laitlyngkot trading hubs",
    pnarMeaning: "Sacred market day in Jaiñtia hills (Shangpung / Mukhla)",
    significance: "Follows the grand Musiang day. A day for village trade, crafts exchange, and regional barter.",
    majorLocations: "Laitlyngkot, Laban, Shangpung, Mukhla",
    activities: "Hill produce barter, iron implements, woven cane, kitchen ware."
  },
  {
    index: 6,
    khasi: "Pomtiah",
    pnar: "Pyngkat",
    khasiMeaning: "Day of betel nut & forest produce exchange",
    pnarMeaning: "Traditional exchange day in West & East Jaiñtia Hills",
    significance: "Famous for betel leaf (Tympew), areca nut (Kwai), seasonal fruits, and pottery.",
    majorLocations: "Nongpoh area, Sohra borders, Dawki foothill markets",
    activities: "Trading of Kwai, wild berries, honey, bamboo crafts, and garden vegetables."
  },
  {
    index: 7,
    khasi: "Umni",
    pnar: "Thymbleiñ",
    khasiMeaning: "Agricultural trade & seed exchange day",
    pnarMeaning: "Jaiñtia agrarian barter day",
    significance: "Crucial market for regional farmers trading seeds, black sesame (Neiiong), and legumes.",
    majorLocations: "Umsning, Bhoirymbong, Nartiang",
    activities: "Spices, ginger, black pepper, seed grains, handmade baskets (Khoh)."
  }
];

// Base reference: 24 October 2026 is index 0 (Ïewduh / Hat)
export const BASE_YEAR = 2026;
export const BASE_MONTH = 9; // October (0-indexed: 9 = October)
export const BASE_DAY = 24;
export const BASE_INDEX = 0;

/**
 * Calculates the exact 8-day cycle index for a Gregorian date (year, 0-indexed month, day)
 * Uses UTC to avoid timezone drift and daylight saving shifts.
 */
export function getCycleIndex(year: number, month: number, day: number): number {
  const baseUtc = Date.UTC(BASE_YEAR, BASE_MONTH, BASE_DAY);
  const targetUtc = Date.UTC(year, month, day);
  const diffDays = Math.round((targetUtc - baseUtc) / 86400000);
  let idx = (BASE_INDEX + diffDays) % 8;
  if (idx < 0) idx += 8;
  return idx;
}

export function getCycleForDate(year: number, month: number, day: number): MarketDay {
  const idx = getCycleIndex(year, month, day);
  return CYCLE[idx];
}

// Fixed and calculated holidays in Meghalaya
export const FIXED_HOLIDAYS: Omit<Holiday, 'id'>[] = [
  {
    name: "New Year's Day",
    khasiName: "Sngi Snem Thymmai",
    month: 0,
    day: 1,
    isFixed: true,
    type: "state",
    description: "Celebration of the New Year across Meghalaya.",
    wishKhasi: "Khublei Snem Thymmai ba suk ba kmen!",
    wishEnglish: "Wishing you and your family abundant peace, joy, and blessings throughout the New Year!"
  },
  {
    name: "U Woh Tep Kyndait Day",
    khasiName: "Ka Sngi Kynmoo Burom ia u Woh Tep Kyndait U Khla Wait ka Jait Bru Tuber",
    month: 0,
    day: 17,
    isFixed: true,
    type: "state",
    description: "Ka Sngi Kynmoo Burom ia u Woh Tep Kyndait U Khla Wait ka Jait Bru Tuber. Commemorating the patriotism, bravery, and martyrdom of the legendary Jaiñtia warrior and hero of the Tuber people.",
    wishKhasi: "Ka burom kaba khraw ia u Woh Tep Kyndait, u Khla Wait ka Jait Bru Tuber!",
    wishEnglish: "Remembering and honoring U Woh Tep Kyndait, the valiant patriot and sword-hero of the Tuber people! May his courage and supreme sacrifice inspire our community forever."
  },
  {
    name: "Meghalaya Day",
    khasiName: "Sngi Meghalaya",
    month: 0,
    day: 21,
    isFixed: true,
    type: "state",
    description: "Commemorates the formation of the state of Meghalaya in 1972 under the North Eastern Areas Act.",
    wishKhasi: "Khublei Sngi Meghalaya ba pura!",
    wishEnglish: "Happy Meghalaya Day! Celebrating the enduring pride, heritage, and unity of our hill state."
  },
  {
    name: "Republic Day",
    khasiName: "Sngi Republic",
    month: 0,
    day: 26,
    isFixed: true,
    type: "national",
    description: "National holiday celebrating the Constitution of India.",
    wishKhasi: "Khublei Sngi Republic ka Ri India!",
    wishEnglish: "Happy Republic Day! Honoring the constitutional spirit and freedom of our nation."
  },
  {
    name: "Sengkhihlang Day",
    khasiName: "Sngi Sengkhihlang",
    month: 2, // March
    day: 9,
    isFixed: true,
    type: "cultural",
    description: "Ka Sngi Kynmoo Burom ia ka Sengkhihlang. Commemorating the foundation, unity, and cultural preservation of the indigenous Niam Tynrai and Niamtre faith across the Khasi and Jaiñtia hills.",
    wishKhasi: "Khublei Sngi Sengkhihlang ba pura ia phi baroh!",
    wishEnglish: "Happy Sengkhihlang Day! Celebrating the sacred heritage, unity, and moral virtues of our indigenous faith."
  },
  {
    name: "May Day",
    khasiName: "Sngi ki Nongtrei",
    month: 4,
    day: 1,
    isFixed: true,
    type: "state",
    description: "International Workers' Day observed across all offices and institutions.",
    wishKhasi: "Khublei Sngi ki Nongtrei!",
    wishEnglish: "Happy May Day! Saluting the dignity, labor, and dedication of all working people."
  },
  {
    name: "World Environment Day",
    khasiName: "Sngi Mariang ka Pyrthei",
    month: 5,
    day: 5,
    isFixed: true,
    type: "national",
    description: "International celebration on June 5 promoting environmental protection, climate action, planting native trees, and guarding Meghalaya's sacred groves (Ki Law Kyntang) and living root bridges.",
    wishKhasi: "Khublei Sngi Mariang ka Pyrthei! Ri bad da ia ka mei-mariang ba kordor jong ka Ri Hynniewtrep.",
    wishEnglish: "Happy World Environment Day! Let us protect our sacred forests, living root bridges, and pristine mountain rivers for future generations."
  },
  {
    name: "Rev. Thomas Jones Day",
    khasiName: "Sngi Thomas Jones",
    month: 5,
    day: 22,
    isFixed: true,
    type: "state",
    description: "Honors Rev. Thomas Jones, the Welsh missionary who formulated the Khasi alphabet in the Roman script.",
    wishKhasi: "Khublei burom ia u Kpa ka Thoh ka Tar Khasi, Thomas Jones!",
    wishEnglish: "Honoring the Father of Khasi Literature! Celebrating the gift of our written language."
  },
  {
    name: "U Tirot Sing Day",
    khasiName: "Sngi U Tirot Sing Syiem",
    month: 6,
    day: 17,
    isFixed: true,
    type: "state",
    description: "Memorial day of U Tirot Sing Syiem, hero of the Anglo-Khasi war (1829–1833) who fought for Khasi independence.",
    wishKhasi: "Ka burom kaba khraw ia u Syiem U Tirot Sing!",
    wishEnglish: "Saluting the brave hero of the Hynniewtrep people! May his courage and love for freedom inspire us always."
  },
  {
    name: "World's Indigenous Peoples Day",
    khasiName: "Sngi ki Riewtra ka Pyrthei",
    month: 7,
    day: 9,
    isFixed: true,
    type: "cultural",
    description: "International Day of the World's Indigenous Peoples on August 9, honoring indigenous pride, native languages, ancestral wisdom, customary rights, and the sacred cultural heritage of indigenous tribes.",
    wishKhasi: "Khublei Sngi ki Riewtra ka Pyrthei! Sah kynmaw bad pynneh ia ka dustur, ka riti, bad ka burom ka jaidbynriew.",
    wishEnglish: "Happy International Day of the World's Indigenous Peoples! Celebrating indigenous pride, ancestral wisdom, and cultural preservation across the globe."
  },
  {
    name: "Independence Day",
    khasiName: "Sngi Jinglaitluid",
    month: 7,
    day: 15,
    isFixed: true,
    type: "national",
    description: "National Independence Day celebrations.",
    wishKhasi: "Khublei Sngi Jinglaitluid ka Ri!",
    wishEnglish: "Happy Independence Day! Cherishing freedom, harmony, and national pride."
  },
  {
    name: "Unitarian Day",
    khasiName: "Sngi Unitarian",
    month: 8,
    day: 18,
    isFixed: true,
    type: "state",
    description: "Commemorates the founding of the Unitarian movement in the Khasi Hills by Babu Hajom Kissor Sing in 1887.",
    wishKhasi: "Khublei Sngi Unitarian!",
    wishEnglish: "Remembering Babu Hajom Kissor Sing and the pursuit of truth, love, and service to humanity."
  },
  {
    name: "Mahatma Gandhi's Birthday",
    khasiName: "Sngi Kha U Mahatma Gandhi",
    month: 9,
    day: 2,
    isFixed: true,
    type: "national",
    description: "National holiday honoring the Father of the Nation.",
    wishKhasi: "Khublei Sngi Kha U Mahatma Gandhi!",
    wishEnglish: "Remembering the path of truth, peace, and non-violence."
  },
  {
    name: "All Souls' Day",
    khasiName: "Ka Sngi ki Mynsiem Ba La Iap (All Souls' Day)",
    month: 10, // November
    day: 2,
    isFixed: true,
    type: "religious",
    description: "Ka Sngi Kynmaw ia ki Ba la Iap (All Souls' Day) is observed across Meghalaya to remember, honor, and pray for departed souls and loved ones, visiting cemeteries and lighting candles.",
    wishKhasi: "Ka jingduwai bad jingkynmaw ieit ia baroh ki mynsiem kiba la dep leit noh ha kane ka Sngi All Souls!",
    wishEnglish: "May the cherished memories and peaceful prayers for our departed loved ones bring eternal comfort, hope, and solace on All Souls' Day."
  },
  {
    name: "Seng Kut Snem",
    khasiName: "Seng Kut Snem",
    month: 10,
    day: 23,
    isFixed: true,
    type: "cultural",
    description: "The grand festival of the Seng Khasi movement founded in 1899 to preserve and celebrate indigenous Khasi faith, culture, and traditions.",
    wishKhasi: "Khublei Seng Kut Snem ba kmen ia phi baroh!",
    wishEnglish: "Happy Seng Kut Snem! Celebrating the sacred heritage, customs, and indigenous spirit of Ka Niam Khasi!"
  },
  {
    name: "U Soso Tham Day",
    khasiName: "Sngi U Soso Tham",
    month: 11,
    day: 18,
    isFixed: true,
    type: "state",
    description: "Remembering U Soso Tham, the celebrated national poet of the Khasi people who penned 'Ki Sngi Barim U Hynniewtrep'.",
    wishKhasi: "Ka burom ia u Myllung U Soso Tham!",
    wishEnglish: "Remembering the national poet of the Khasi people and the immortal verses of our ancestry."
  },
  {
    name: "Christmas Eve",
    khasiName: "Ka Miet Khristmas",
    month: 11,
    day: 24,
    isFixed: true,
    type: "religious",
    description: "Christmas celebrations begin across the hills with church carols and festive illuminations.",
    wishKhasi: "Khublei Miet Khristmas ba shongsuk!",
    wishEnglish: "Wishing you a peaceful and wonder-filled Christmas Eve filled with light and carols."
  },
  {
    name: "Christmas Day",
    khasiName: "Sngi Khristmas",
    month: 11,
    day: 25,
    isFixed: true,
    type: "religious",
    description: "Christmas Day festival celebrated with church services, community feasts, and joy.",
    wishKhasi: "Khublei Khristmas ba kmen bad ba suk ia phi baroh!",
    wishEnglish: "Merry Christmas! Wishing you and your loved ones heartfelt joy, peace, and divine blessings!"
  },
  {
    name: "Boxing Day",
    khasiName: "Boxing Day",
    month: 11,
    day: 26,
    isFixed: true,
    type: "religious",
    description: "Traditional Meghalaya state holiday following Christmas Day.",
    wishKhasi: "Khublei Boxing Day ba kmen!",
    wishEnglish: "Happy Boxing Day! Continuing the warmth, feasts, and fellowship of the Christmas season."
  },
  {
    name: "U Kiang Nangbah Day",
    khasiName: "Sngi U Kiang Nangbah",
    month: 11,
    day: 30,
    isFixed: true,
    type: "state",
    description: "Memorial of U Kiang Nangbah, the valiant Jaintia leader who led the resistance against the British and was martyred on Dec 30, 1862.",
    wishKhasi: "Ka burom kaba khraw ia u Shongknor U Kiang Nangbah!",
    wishEnglish: "Saluting the immortal patriot and martyr of the Jaintia hills! His courage lives on forever in our hearts."
  },
  {
    name: "New Year's Eve",
    khasiName: "Ka Miet Snem Thymmai",
    month: 11,
    day: 31,
    isFixed: true,
    type: "state",
    description: "End of the year celebration across the state.",
    wishKhasi: "Khublei Miet Snem Thymmai!",
    wishEnglish: "A blessed and joyful farewell to the passing year, with bright hope for the dawn of the New Year!"
  }
];

/**
 * Computes Western Easter date for any Gregorian year
 */
function getEasterSunday(year: number): { month: number; day: number } {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1; // 0-indexed
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return { month, day };
}

/**
 * Returns all holidays (fixed + dynamic + custom) for a given year,
 * filtering out any holidays that have been deleted or hidden.
 */
export function getHolidaysForYear(
  year: number, 
  customHolidays: Holiday[] = [],
  deletedHolidayKeys: string[] = []
): Holiday[] {
  const isDeleted = (id: string, name: string) => {
    if (!deletedHolidayKeys || deletedHolidayKeys.length === 0) return false;
    const lowerName = name.trim().toLowerCase();
    const lowerId = id.trim().toLowerCase();
    return deletedHolidayKeys.some(key => {
      const lowerKey = key.trim().toLowerCase();
      return lowerKey === lowerId || lowerKey === lowerName;
    });
  };

  const list: Holiday[] = FIXED_HOLIDAYS
    .filter(h => !isDeleted(`fixed-${h.name}`, h.name))
    .map((h, i) => ({
      ...h,
      id: `fixed-${i}-${year}`
    }))
    .filter(h => !isDeleted(h.id, h.name));

  // Dynamic Easter-based holidays
  const easter = getEasterSunday(year);
  const easterDate = new Date(Date.UTC(year, easter.month, easter.day));

  // Good Friday (2 days before Easter)
  const goodFridayDate = new Date(easterDate.getTime() - 2 * 86400000);
  if (!isDeleted(`dyn-good-friday-${year}`, "Good Friday")) {
    list.push({
      id: `dyn-good-friday-${year}`,
      name: "Good Friday",
      khasiName: "Sngi Thohdieng",
      month: goodFridayDate.getUTCMonth(),
      day: goodFridayDate.getUTCDate(),
      isFixed: false,
      type: "religious",
      description: "Solemn Christian holy day commemorating the crucifixion of Jesus Christ.",
      wishKhasi: "Khublei Sngi Thohdieng ba kyntang!",
      wishEnglish: "May the divine grace, peace, and sacrifice of Good Friday bring solace and blessing to your home."
    });
  }

  // Easter Sunday
  if (!isDeleted(`dyn-easter-sun-${year}`, "Easter Sunday")) {
    list.push({
      id: `dyn-easter-sun-${year}`,
      name: "Easter Sunday",
      khasiName: "Sngi Ieshu Mihpat",
      month: easter.month,
      day: easter.day,
      isFixed: false,
      type: "religious",
      description: "Celebration of the resurrection of Jesus Christ.",
      wishKhasi: "Khublei Sngi Ieshu Mihpat ba kmen!",
      wishEnglish: "Happy Easter! Celebrating victorious life, renewed hope, and boundless joy!"
    });
  }

  // Easter Monday (1 day after Easter)
  const easterMondayDate = new Date(easterDate.getTime() + 86400000);
  if (!isDeleted(`dyn-easter-mon-${year}`, "Easter Monday")) {
    list.push({
      id: `dyn-easter-mon-${year}`,
      name: "Easter Monday",
      khasiName: "Easter Monday",
      month: easterMondayDate.getUTCMonth(),
      day: easterMondayDate.getUTCDate(),
      isFixed: false,
      type: "religious",
      description: "Traditional public holiday following Easter Sunday in Meghalaya.",
      wishKhasi: "Khublei Easter Monday!",
      wishEnglish: "Wishing you joyous festive gatherings and peace on Easter Monday."
    });
  }

  // 2026-only temporary cultural festivals and Lympung (not shown in other years)
  if (year === 2026) {
    ALL_2026_TEMPLATES.forEach((tmpl, idx) => {
      const tmplId = `temp-2026-${idx}`;
      if (isDeleted(tmplId, tmpl.name)) return;

      const isOverridden = customHolidays.some(
        ch => ch.name.toLowerCase() === tmpl.name.toLowerCase() && (ch.year === 2026 || ch.year === 0)
      );
      if (!isOverridden) {
        list.push({
          id: tmplId,
          name: tmpl.name,
          khasiName: tmpl.khasiName,
          month: tmpl.defaultMonth,
          day: tmpl.defaultDay,
          year: 2026,
          isFixed: false,
          type: tmpl.type || "cultural",
          description: tmpl.description,
          wishKhasi: tmpl.wishKhasi,
          wishEnglish: tmpl.wishEnglish
        });
      }
    });
  }

  // Merge custom holidays from Firebase (paid holidays + custom festivals)
  if (customHolidays && customHolidays.length > 0) {
    customHolidays.forEach(ch => {
      if (isDeleted(ch.id, ch.name)) return;

      // Do not duplicate or override official permanent holidays (like All Souls' Day)
      const isFixedDuplicate = list.some(
        lh => lh.name.trim().toLowerCase() === ch.name.trim().toLowerCase() ||
              (ch.name.toLowerCase().includes('soul') && lh.name.toLowerCase().includes('soul'))
      );
      if (isFixedDuplicate) return;

      if (ch.year === undefined || ch.year === 0 || ch.year === year) {
        list.push(ch);
      }
    });
  }

  return list;
}

export interface HolidayTemplate {
  name: string;
  khasiName: string;
  defaultMonth: number;
  defaultDay: number;
  type?: 'cultural' | 'state' | 'religious' | 'national';
  description: string;
  wishKhasi: string;
  wishEnglish: string;
}

export const LYMPUNG_2026_TEMPLATES: HolidayTemplate[] = [
  {
    name: "Ka Lympung ki Khynnah Sengkhasi Seiñraij",
    khasiName: "Ka Lympung ki Khynnah Sengkhasi Seiñraij",
    defaultMonth: 0, // January
    defaultDay: 18,
    type: "cultural",
    description: "The annual children's gathering of Seng Khasi and Seiñ Raij (Ka Lympung ki Khynnah Sengkhasi Seiñraij), nurturing ancestral wisdom, cultural pride, and moral virtues (Akor Babha) in our young generation.",
    wishKhasi: "Khublei Lympung ki Khynnah Sengkhasi Seiñraij ba kmen ba suk!",
    wishEnglish: "Warm greetings on Ka Lympung ki Khynnah Sengkhasi Seiñraij! Blessing our children with joy, virtue, and cultural pride."
  },
  {
    name: "Ka Lympung SKSR 12 Daloi",
    khasiName: "Ka Lympung SKSR 12 Daloi",
    defaultMonth: 0, // January
    defaultDay: 25,
    type: "cultural",
    description: "The sacred annual conference of the Seng Khasi Seiñ Raij and the 12 Daloi (Elaka chiefs) upholding traditional indigenous governance, culture, and Niamtre customs.",
    wishKhasi: "Khublei Ka Lympung SKSR 12 Daloi!",
    wishEnglish: "Warm wishes on the sacred Ka Lympung SKSR 12 Daloi! Honoring our indigenous governance and living traditions."
  },
  {
    name: "Kiew Lum Sohpet Bneng",
    khasiName: "Ka Kiew Lum Sohpet Bneng",
    defaultMonth: 1, // February
    defaultDay: 1,
    type: "cultural",
    description: "The sacred annual pilgrimage to Lum Sohpet Bneng (Navel of the Earth), commemorating the celestial golden bridge (Jingkieng Ksiar) linking the Hynniewtrep (Seven Huts) with U Blei Nongthaw.",
    wishKhasi: "Khublei Kiew Lum Sohpet Bneng ba kyntang ba suk!",
    wishEnglish: "Blessed pilgrimage to Lum Sohpet Bneng! May U Blei Nongthaw shower divine grace, health, and peace upon all."
  },
  {
    name: "Lympung Ki Khun Samla Sengkhihlang",
    khasiName: "Ka Lympung ki Khun Samla Sengkhihlang",
    defaultMonth: 1, // February
    defaultDay: 15,
    type: "cultural",
    description: "The annual youth convention of the Sengkhihlang inspiring the younger generation with indigenous values, Akor Babha (moral virtue), and pride in the Niam Tynrai.",
    wishKhasi: "Khublei Lympung ki Khun Samla Sengkhihlang!",
    wishEnglish: "Heartfelt greetings to all youth on Lympung Ki Khun Samla Sengkhihlang! Standing tall in truth and righteousness."
  },
  {
    name: "Nguh Blei Ka Sengbah ki Nongshat Nongkheiñ",
    khasiName: "Ka Nguh Blei Ka Sengbah ki Nongshat Nongkheiñ",
    defaultMonth: 3, // April
    defaultDay: 3,
    type: "religious",
    description: "Sacred day of solemn thanksgiving and divine invocation (Nguh Blei) performed by the venerable elders and diviners (Nongshat Nongkheiñ), seeking cosmic balance and divine protection.",
    wishKhasi: "Ka Nguh Blei ba kyntang ia U Blei Nongthaw Nongbuh!",
    wishEnglish: "Solemn prayers and divine invocations on Nguh Blei Ka Sengbah ki Nongshat Nongkheiñ for peace, health, and harmony."
  },
  {
    name: "Lympung Sengkhihlang",
    khasiName: "Ka Lympung Bah Sengkhihlang",
    defaultMonth: 3, // April
    defaultDay: 19,
    type: "cultural",
    description: "The grand annual gathering and festival of the Sengkhihlang uniting devotees of Niam Tynrai and Niamtre across all hills to foster unity, moral living, and cultural heritage.",
    wishKhasi: "Khublei Lympung Sengkhihlang ba kmen bad ba phyrnai!",
    wishEnglish: "Happy Lympung Sengkhihlang! Celebrating our eternal unity, truth, and cultural heritage."
  }
];

export const BEHDEINKHLAM_TEMPLATES: HolidayTemplate[] = [
  {
    name: "Behdeiñkhlam Raij Chyrmang",
    khasiName: "Behdeiñkhlam Raij Chyrmang",
    defaultMonth: 3, // April
    defaultDay: 26,
    type: "cultural",
    description: "The sacred traditional festival of Behdeiñkhlam celebrated by Raij Chyrmang in the Jaiñtia hills.",
    wishKhasi: "Khublei Behdeiñkhlam Raij Chyrmang ba kmen ba suk!",
    wishEnglish: "Wishing all people of Raij Chyrmang a joyous, prosperous, and blessed Behdeiñkhlam festival!"
  },
  {
    name: "Behdeiñkhlam Raij Jowai",
    khasiName: "Behdeiñkhlam Raij Jowai",
    defaultMonth: 6, // July
    defaultDay: 9,
    type: "cultural",
    description: "The premier sacred Behdeiñkhlam festival celebrated at Aitnar, Jowai, chasing away plagues and invoking divine blessing and harvest prosperity.",
    wishKhasi: "Khublei Behdeiñkhlam Raij Jowai ba kmen bad ba kyntang!",
    wishEnglish: "Heartiest greetings on Behdeiñkhlam Raij Jowai! May divine grace bring peace, health, and abundant harvests to all."
  },
  {
    name: "Behdeiñkhlam Raij Tuber",
    khasiName: "Behdeiñkhlam Raij Tuber",
    defaultMonth: 6, // July
    defaultDay: 17,
    type: "cultural",
    description: "The grand annual Behdeiñkhlam festival celebrated by Raij Tuber at the sacred Biar of Tuber Kmaishnong.",
    wishKhasi: "Khublei Behdeiñkhlam Raij Tuber ba suk ba kmen!",
    wishEnglish: "Wishing the people of Raij Tuber and all devotees a sacred, vibrant, and blessed Behdeiñkhlam festival!"
  },
  {
    name: "Behdeiñkhlam Raij Muthlong",
    khasiName: "Behdeiñkhlam Raij Muthlong",
    defaultMonth: 7, // August
    defaultDay: 3,
    type: "cultural",
    description: "The traditional Behdeiñkhlam festival celebrated by Raij Muthlong with sacred rituals and community unity.",
    wishKhasi: "Khublei Behdeiñkhlam Raij Muthlong ba kmen!",
    wishEnglish: "Warm greetings and blessings on Behdeiñkhlam Raij Muthlong to all communities and families."
  },
  {
    name: "Behdeiñkhlam Raij Ialong",
    khasiName: "Behdeiñkhlam Raij Ialong",
    defaultMonth: 7, // August
    defaultDay: 10,
    type: "cultural",
    description: "The traditional Behdeiñkhlam festival observed by Raij Ialong with deep spiritual devotion and sacred ceremonies.",
    wishKhasi: "Khublei Behdeiñkhlam Raij Ialong ba suk ba kmen!",
    wishEnglish: "Wishing a joyous and peaceful Behdeiñkhlam to the people of Raij Ialong and all visitors."
  },
  {
    name: "Behdeiñkhlam Raij Sohkymphor",
    khasiName: "Behdeiñkhlam Raij Sohkymphor",
    defaultMonth: 7, // August
    defaultDay: 11,
    type: "cultural",
    description: "The annual Behdeiñkhlam festival celebrated by Raij Sohkymphor invoking ancestral blessings and driving away evil.",
    wishKhasi: "Khublei Behdeiñkhlam Raij Sohkymphor ba kmen!",
    wishEnglish: "Heartfelt wishes on Behdeiñkhlam Raij Sohkymphor for good health, peace, and prosperity."
  },
  {
    name: "Behdeiñkhlam Raij Mukhla",
    khasiName: "Behdeiñkhlam Raij Mukhla",
    defaultMonth: 7, // August
    defaultDay: 26,
    type: "cultural",
    description: "The sacred Behdeiñkhlam festival celebrated with colorful Rots and traditional rituals by Raij Mukhla.",
    wishKhasi: "Khublei Behdeiñkhlam Raij Mukhla ba suk ba kmen!",
    wishEnglish: "Warm greetings on Behdeiñkhlam Raij Mukhla! Celebrating cultural unity and festive joy."
  }
];

export const ALL_2026_TEMPLATES: HolidayTemplate[] = [
  ...LYMPUNG_2026_TEMPLATES,
  ...BEHDEINKHLAM_TEMPLATES
];

export function getHolidaysForDate(
  year: number, 
  month: number, 
  day: number, 
  customHolidays: Holiday[] = [],
  deletedHolidayKeys: string[] = []
): Holiday[] {
  const all = getHolidaysForYear(year, customHolidays, deletedHolidayKeys);
  return all.filter(h => h.month === month && h.day === day);
}
