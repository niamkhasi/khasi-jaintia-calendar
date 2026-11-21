export interface RegionMarketGroup {
  regionKey: string;
  regionName: string;
  chipLabel: string;
  markets: string[];
}

export interface SngiIewGuideDay {
  index: number;
  name: string;
  khasi: string;
  pnar: string;
  regions: RegionMarketGroup[];
}

export const REGIONS_LIST = [
  { key: 'hynniew_trep', name: 'Sngi Ïew Heh U Hynniew Trep', chipLabel: 'Hynniew Trep' },
  { key: 'mihngi', name: 'Ha Ri Lum Mihngi', chipLabel: 'Mihngi' },
  { key: 'jaintia', name: 'Ha Ri Lum Jaintia', chipLabel: 'Jaintia' },
  { key: 'ri_bhoi', name: 'Ha Them Ri Bhoi', chipLabel: 'Ri Bhoi' },
  { key: 'sepngi', name: 'Ha Ri Lum Sepngi', chipLabel: 'Sepngi' },
];

export const SNGI_IEW_GUIDE_DATA: SngiIewGuideDay[] = [
  {
    index: 0,
    name: 'Ïewduh/Hat',
    khasi: 'Ïewduh',
    pnar: 'Hat',
    regions: [
      {
        regionKey: 'hynniew_trep',
        regionName: 'Sngi Ïew Heh U Hynniew Trep',
        chipLabel: 'Hynniew Trep',
        markets: ['Shillong']
      },
      {
        regionKey: 'mihngi',
        regionName: 'Ha Ri Lum Mihngi',
        chipLabel: 'Mihngi',
        markets: ['Laban', 'Langkyrdem']
      },
      {
        regionKey: 'jaintia',
        regionName: 'Ha Ri Lum Jaintia',
        chipLabel: 'Jaintia',
        markets: ['Borkhat', 'Nongjngi', 'Mookaiaw']
      },
      {
        regionKey: 'ri_bhoi',
        regionName: 'Ha Them Ri Bhoi',
        chipLabel: 'Ri Bhoi',
        markets: ['Umsohphria']
      },
      {
        regionKey: 'sepngi',
        regionName: 'Ha Ri Lum Sepngi',
        chipLabel: 'Sepngi',
        markets: ['Rangblang', 'Maweit']
      }
    ]
  },
  {
    index: 1,
    name: 'Lyngka/Khyllaw',
    khasi: 'Lyngka',
    pnar: 'Khyllaw',
    regions: [
      {
        regionKey: 'hynniew_trep',
        regionName: 'Sngi Ïew Heh U Hynniew Trep',
        chipLabel: 'Hynniew Trep',
        markets: ['Nongstoïn']
      },
      {
        regionKey: 'mihngi',
        regionName: 'Ha Ri Lum Mihngi',
        chipLabel: 'Mihngi',
        markets: ['Tyrsad', 'Laitryngew']
      },
      {
        regionKey: 'jaintia',
        regionName: 'Ha Ri Lum Jaintia',
        chipLabel: 'Jaintia',
        markets: ['Sutnga', 'Dawki', 'Namdong', 'Jowai']
      },
      {
        regionKey: 'ri_bhoi',
        regionName: 'Ha Them Ri Bhoi',
        chipLabel: 'Ri Bhoi',
        markets: ['Mawhati']
      },
      {
        regionKey: 'sepngi',
        regionName: 'Ha Ri Lum Sepngi',
        chipLabel: 'Sepngi',
        markets: ['Nongstoïn', 'Maroit']
      }
    ]
  },
  {
    index: 2,
    name: 'Nongkrem/Pynsiñ',
    khasi: 'Nongkrem',
    pnar: 'Pynsiñ',
    regions: [
      {
        regionKey: 'hynniew_trep',
        regionName: 'Sngi Ïew Heh U Hynniew Trep',
        chipLabel: 'Hynniew Trep',
        markets: ['Pynursla']
      },
      {
        regionKey: 'mihngi',
        regionName: 'Ha Ri Lum Mihngi',
        chipLabel: 'Mihngi',
        markets: ['Shella', 'Mawsmai']
      },
      {
        regionKey: 'jaintia',
        regionName: 'Ha Ri Lum Jaintia',
        chipLabel: 'Jaintia',
        markets: ['Wahiajer', 'Rymbai']
      },
      {
        regionKey: 'ri_bhoi',
        regionName: 'Ha Them Ri Bhoi',
        chipLabel: 'Ri Bhoi',
        markets: ['Umden']
      },
      {
        regionKey: 'sepngi',
        regionName: 'Ha Ri Lum Sepngi',
        chipLabel: 'Sepngi',
        markets: ['Rambrai', 'Myrïaw']
      }
    ]
  },
  {
    index: 3,
    name: 'Mawlong/Mulong',
    khasi: 'Mawlong',
    pnar: 'Mulong',
    regions: [
      {
        regionKey: 'hynniew_trep',
        regionName: 'Sngi Ïew Heh U Hynniew Trep',
        chipLabel: 'Hynniew Trep',
        markets: ['Nongpoh']
      },
      {
        regionKey: 'mihngi',
        regionName: 'Ha Ri Lum Mihngi',
        chipLabel: 'Mihngi',
        markets: ['Mawsynram', 'Lyngkhat']
      },
      {
        regionKey: 'jaintia',
        regionName: 'Ha Ri Lum Jaintia',
        chipLabel: 'Jaintia',
        markets: ['Nartiang', 'Raliang', 'Jaraïñ', 'Muktapur']
      },
      {
        regionKey: 'ri_bhoi',
        regionName: 'Ha Them Ri Bhoi',
        chipLabel: 'Ri Bhoi',
        markets: ['Nongpoh']
      },
      {
        regionKey: 'sepngi',
        regionName: 'Ha Ri Lum Sepngi',
        chipLabel: 'Sepngi',
        markets: ['Markasa', 'Ingding']
      }
    ]
  },
  {
    index: 4,
    name: 'Rynghep/Musiang',
    khasi: 'Rynghep',
    pnar: 'Musiang',
    regions: [
      {
        regionKey: 'hynniew_trep',
        regionName: 'Sngi Ïew Heh U Hynniew Trep',
        chipLabel: 'Hynniew Trep',
        markets: ['Jowai']
      },
      {
        regionKey: 'mihngi',
        regionName: 'Ha Ri Lum Mihngi',
        chipLabel: 'Mihngi',
        markets: ['Sohra', 'Langkyrdem']
      },
      {
        regionKey: 'jaintia',
        regionName: 'Ha Ri Lum Jaintia',
        chipLabel: 'Jaintia',
        markets: ['Jowai']
      },
      {
        regionKey: 'ri_bhoi',
        regionName: 'Ha Them Ri Bhoi',
        chipLabel: 'Ri Bhoi',
        markets: ['Mawlasnai', 'Patharkhmah']
      },
      {
        regionKey: 'sepngi',
        regionName: 'Ha Ri Lum Sepngi',
        chipLabel: 'Sepngi',
        markets: ['Nongum']
      }
    ]
  },
  {
    index: 5,
    name: 'Shyllong/Muchai',
    khasi: 'Shyllong',
    pnar: 'Muchai',
    regions: [
      {
        regionKey: 'hynniew_trep',
        regionName: 'Sngi Ïew Heh U Hynniew Trep',
        chipLabel: 'Hynniew Trep',
        markets: ['Mawkyrwat']
      },
      {
        regionKey: 'mihngi',
        regionName: 'Ha Ri Lum Mihngi',
        chipLabel: 'Mihngi',
        markets: ['Laitlyngkot']
      },
      {
        regionKey: 'jaintia',
        regionName: 'Ha Ri Lum Jaintia',
        chipLabel: 'Jaintia',
        markets: ['Shangpung', 'Dawki']
      },
      {
        regionKey: 'ri_bhoi',
        regionName: 'Ha Them Ri Bhoi',
        chipLabel: 'Ri Bhoi',
        markets: ['Umroi']
      },
      {
        regionKey: 'sepngi',
        regionName: 'Ha Ri Lum Sepngi',
        chipLabel: 'Sepngi',
        markets: ['Mawkyrwat', 'Nongkhlaw']
      }
    ]
  },
  {
    index: 6,
    name: 'Pomtiah/Pyngkat',
    khasi: 'Pomtiah',
    pnar: 'Pyngkat',
    regions: [
      {
        regionKey: 'hynniew_trep',
        regionName: 'Sngi Ïew Heh U Hynniew Trep',
        chipLabel: 'Hynniew Trep',
        markets: ['Mawryngkneng']
      },
      {
        regionKey: 'mihngi',
        regionName: 'Ha Ri Lum Mihngi',
        chipLabel: 'Mihngi',
        markets: ['Mawngap', 'Shella', 'Pynursla']
      },
      {
        regionKey: 'jaintia',
        regionName: 'Ha Ri Lum Jaintia',
        chipLabel: 'Jaintia',
        markets: ['Khliehriat', 'Mynso', 'Iooksi', 'Wahiajer']
      },
      {
        regionKey: 'ri_bhoi',
        regionName: 'Ha Them Ri Bhoi',
        chipLabel: 'Ri Bhoi',
        markets: ['Tyrso']
      },
      {
        regionKey: 'sepngi',
        regionName: 'Ha Ri Lum Sepngi',
        chipLabel: 'Sepngi',
        markets: ['Kynshi']
      }
    ]
  },
  {
    index: 7,
    name: 'Umni/Thymbleiñ',
    khasi: 'Umni',
    pnar: 'Thymbleiñ',
    regions: [
      {
        regionKey: 'hynniew_trep',
        regionName: 'Sngi Ïew Heh U Hynniew Trep',
        chipLabel: 'Hynniew Trep',
        markets: ['Mairang', 'Langstieh']
      },
      {
        regionKey: 'mihngi',
        regionName: 'Ha Ri Lum Mihngi',
        chipLabel: 'Mihngi',
        markets: ['Smit', 'Lyngkhat']
      },
      {
        regionKey: 'jaintia',
        regionName: 'Ha Ri Lum Jaintia',
        chipLabel: 'Jaintia',
        markets: ['Muktapur', 'Khanduli', 'Barato', 'Sohkymphor', 'Wapung']
      },
      {
        regionKey: 'ri_bhoi',
        regionName: 'Ha Them Ri Bhoi',
        chipLabel: 'Ri Bhoi',
        markets: ['Umsning']
      },
      {
        regionKey: 'sepngi',
        regionName: 'Ha Ri Lum Sepngi',
        chipLabel: 'Sepngi',
        markets: ['Langstieh', 'Umdohlun']
      }
    ]
  }
];

export interface MarketSearchResult {
  marketName: string;
  sngiIewName: string;
  sngiIewIndex: number;
  regionName: string;
  regionKey: string;
}

// Flat list of all market occurrences for instant search
export function searchMarkets(query: string): MarketSearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: MarketSearchResult[] = [];

  for (const day of SNGI_IEW_GUIDE_DATA) {
    for (const region of day.regions) {
      for (const market of region.markets) {
        if (market.toLowerCase().includes(q)) {
          results.push({
            marketName: market,
            sngiIewName: day.name,
            sngiIewIndex: day.index,
            regionName: region.regionName,
            regionKey: region.regionKey,
          });
        }
      }
    }
  }

  return results;
}
