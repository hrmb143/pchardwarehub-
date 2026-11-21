export const RETAILERS = ['Amazon.in', 'MDComputers', 'PrimeABGB', 'Vedant'];

// Helper to generate realistic Indian retailer pricing across 4 stores
const p = (base) => ({
  'Amazon.in': Math.round(base * 1.05),
  'MDComputers': Math.round(base * 1.01),
  'PrimeABGB': Math.round(base * 1.02),
  'Vedant': base
});

const RAW_CPUS = [
  // AMD Ryzen 9000 Series (AM5 / DDR5)
  ['AMD Ryzen 9 9950X3D', 'AMD', 'S', 'AM5', 'DDR5', 170, '16C / 32T', '4.3 / 5.7 GHz', 99, 98, 86, 145, 2390, 3510, 24100, 440, 74999],
  ['AMD Ryzen 9 9950X', 'AMD', 'S', 'AM5', 'DDR5', 170, '16C / 32T', '4.3 / 5.7 GHz', 98, 97, 84, 144, 2380, 3480, 23900, 435, 62200],
  ['AMD Ryzen 9 9900X3D', 'AMD', 'S', 'AM5', 'DDR5', 120, '12C / 24T', '4.4 / 5.5 GHz', 96, 89, 90, 140, 1890, 3410, 21200, 355, 58500],
  ['AMD Ryzen 9 9900X', 'AMD', 'S', 'AM5', 'DDR5', 120, '12C / 24T', '4.4 / 5.6 GHz', 95, 88, 89, 139, 1860, 3390, 20900, 348, 45900],
  ['AMD Ryzen 7 9800X3D', 'AMD', 'S', 'AM5', 'DDR5', 120, '8C / 16T', '4.7 / 5.2 GHz', 95, 76, 92, 138, 1390, 3340, 18450, 265, 46200],
  ['AMD Ryzen 7 9700X', 'AMD', 'A', 'AM5', 'DDR5', 65, '8C / 16T', '3.8 / 5.5 GHz', 91, 71, 95, 135, 1290, 3310, 17800, 242, 33400],
  ['AMD Ryzen 5 9600X', 'AMD', 'A', 'AM5', 'DDR5', 65, '6C / 12T', '3.9 / 5.4 GHz', 87, 54, 93, 132, 1020, 3250, 15100, 188, 23650],
  ['AMD Ryzen 5 9600', 'AMD', 'A', 'AM5', 'DDR5', 65, '6C / 12T', '3.8 / 5.2 GHz', 85, 52, 94, 129, 980, 3180, 14600, 180, 21200],
  // AMD Ryzen 7000 & 8000 Series (AM5 / DDR5)
  ['AMD Ryzen 9 7950X3D', 'AMD', 'S', 'AM5', 'DDR5', 120, '16C / 32T', '4.2 / 5.7 GHz', 93, 94, 88, 124, 2140, 2980, 21800, 395, 56900],
  ['AMD Ryzen 9 7950X', 'AMD', 'S', 'AM5', 'DDR5', 170, '16C / 32T', '4.5 / 5.7 GHz', 91, 93, 79, 123, 2110, 2960, 21500, 390, 49500],
  ['AMD Ryzen 9 7900X3D', 'AMD', 'S', 'AM5', 'DDR5', 120, '12C / 24T', '4.4 / 5.6 GHz', 89, 84, 89, 121, 1650, 2910, 18900, 310, 43900],
  ['AMD Ryzen 9 7900X', 'AMD', 'A', 'AM5', 'DDR5', 170, '12C / 24T', '4.7 / 5.6 GHz', 88, 83, 78, 120, 1620, 2890, 18600, 305, 37800],
  ['AMD Ryzen 9 7900', 'AMD', 'A', 'AM5', 'DDR5', 65, '12C / 24T', '3.7 / 5.4 GHz', 86, 80, 94, 118, 1540, 2840, 17900, 288, 35500],
  ['AMD Ryzen 7 7800X3D', 'AMD', 'S', 'AM5', 'DDR5', 120, '8C / 16T', '4.2 / 5.0 GHz', 88, 68, 95, 121, 1140, 2890, 15800, 215, 37750],
  ['AMD Ryzen 7 7700X', 'AMD', 'A', 'AM5', 'DDR5', 105, '8C / 16T', '4.5 / 5.4 GHz', 83, 64, 79, 116, 1110, 2860, 15400, 208, 27900],
  ['AMD Ryzen 7 7700', 'AMD', 'A', 'AM5', 'DDR5', 65, '8C / 16T', '3.8 / 5.3 GHz', 81, 62, 91, 114, 1060, 2810, 14900, 198, 25400],
  ['AMD Ryzen 5 7600X3D', 'AMD', 'A', 'AM5', 'DDR5', 65, '6C / 12T', '4.1 / 4.7 GHz', 84, 48, 95, 112, 830, 2760, 13400, 155, 26500],
  ['AMD Ryzen 5 7600X', 'AMD', 'A', 'AM5', 'DDR5', 105, '6C / 12T', '4.7 / 5.3 GHz', 79, 42, 74, 115, 846, 2941, 13615, 158, 18600],
  ['AMD Ryzen 5 7600', 'AMD', 'A', 'AM5', 'DDR5', 65, '6C / 12T', '3.8 / 5.1 GHz', 77, 41, 89, 112, 815, 2850, 13100, 152, 17400],
  ['AMD Ryzen 5 7500F', 'AMD', 'B', 'AM5', 'DDR5', 65, '6C / 12T', '3.7 / 5.0 GHz', 75, 40, 90, 110, 795, 2780, 12800, 148, 15200],
  ['AMD Ryzen 7 8700G', 'AMD', 'A', 'AM5', 'DDR5', 65, '8C / 16T', '4.2 / 5.1 GHz', 78, 59, 90, 111, 1010, 2710, 14200, 186, 28900],
  ['AMD Ryzen 5 8600G', 'AMD', 'B', 'AM5', 'DDR5', 65, '6C / 12T', '4.3 / 5.0 GHz', 73, 40, 89, 106, 760, 2580, 12100, 142, 19800],
  // AMD Ryzen 5000 Series (AM4 / DDR4)
  ['AMD Ryzen 9 5950X', 'AMD', 'A', 'AM4', 'DDR4', 105, '16C / 32T', '3.4 / 4.9 GHz', 70, 78, 82, 96, 1520, 2260, 16900, 280, 32500],
  ['AMD Ryzen 9 5900X', 'AMD', 'A', 'AM4', 'DDR4', 105, '12C / 24T', '3.7 / 4.8 GHz', 69, 66, 81, 95, 1240, 2240, 14800, 232, 24800],
  ['AMD Ryzen 7 5800X3D', 'AMD', 'A', 'AM4', 'DDR4', 105, '8C / 16T', '3.4 / 4.5 GHz', 74, 49, 85, 89, 880, 2090, 11900, 164, 27500],
  ['AMD Ryzen 7 5700X3D', 'AMD', 'A', 'AM4', 'DDR4', 105, '8C / 16T', '3.0 / 4.1 GHz', 71, 46, 86, 85, 830, 1990, 11200, 154, 19200],
  ['AMD Ryzen 7 5700X', 'AMD', 'B', 'AM4', 'DDR4', 65, '8C / 16T', '3.4 / 4.6 GHz', 64, 45, 88, 91, 820, 2160, 11400, 151, 14900],
  ['AMD Ryzen 5 5600X', 'AMD', 'B', 'AM4', 'DDR4', 65, '6C / 12T', '3.7 / 4.6 GHz', 61, 30, 84, 90, 583, 2173, 10120, 112, 11800],
  ['AMD Ryzen 5 5600', 'AMD', 'B', 'AM4', 'DDR4', 65, '6C / 12T', '3.5 / 4.4 GHz', 59, 29, 86, 87, 560, 2080, 9750, 106, 10400],
  ['AMD Ryzen 5 5500', 'AMD', 'B', 'AM4', 'DDR4', 65, '6C / 12T', '3.6 / 4.2 GHz', 53, 27, 85, 81, 515, 1920, 8950, 96, 8200],
  // Intel Core Ultra 200S (LGA1851 / DDR5)
  ['Intel Core Ultra 9 285K', 'Intel', 'S', 'LGA1851', 'DDR5', 125, '24C / 24T', '3.7 / 5.7 GHz', 95, 98, 79, 141, 2340, 3360, 23800, 425, 57900],
  ['Intel Core Ultra 7 265K', 'Intel', 'S', 'LGA1851', 'DDR5', 125, '20C / 20T', '3.9 / 5.5 GHz', 91, 93, 80, 136, 2050, 3180, 21900, 368, 39999],
  ['Intel Core Ultra 7 265KF', 'Intel', 'S', 'LGA1851', 'DDR5', 125, '20C / 20T', '3.9 / 5.5 GHz', 91, 93, 81, 136, 2050, 3180, 21900, 368, 37800],
  ['Intel Core Ultra 5 245K', 'Intel', 'A', 'LGA1851', 'DDR5', 125, '14C / 14T', '4.2 / 5.2 GHz', 85, 76, 82, 128, 1510, 2990, 18100, 272, 29500],
  ['Intel Core Ultra 5 245KF', 'Intel', 'A', 'LGA1851', 'DDR5', 125, '14C / 14T', '4.2 / 5.2 GHz', 85, 76, 83, 128, 1510, 2990, 18100, 272, 27600],
  // Intel 14th, 13th & 12th Gen (LGA1700)
  ['Intel Core i9-14900KS', 'Intel', 'S', 'LGA1700', 'DDR5', 253, '24C / 32T', '3.2 / 6.2 GHz', 96, 97, 45, 138, 2260, 3260, 23100, 405, 58900],
  ['Intel Core i9-14900K', 'Intel', 'S', 'LGA1700', 'DDR5', 253, '24C / 32T', '3.2 / 6.0 GHz', 94, 96, 48, 136, 2210, 3210, 22600, 398, 48900],
  ['Intel Core i9-14900KF', 'Intel', 'S', 'LGA1700', 'DDR5', 253, '24C / 32T', '3.2 / 6.0 GHz', 94, 96, 49, 136, 2210, 3210, 22600, 398, 46500],
  ['Intel Core i7-14700K', 'Intel', 'S', 'LGA1700', 'DDR5', 253, '20C / 28T', '3.4 / 5.6 GHz', 89, 91, 52, 131, 1940, 3090, 21400, 345, 37100],
  ['Intel Core i7-14700KF', 'Intel', 'S', 'LGA1700', 'DDR5', 253, '20C / 28T', '3.4 / 5.6 GHz', 89, 91, 53, 131, 1940, 3090, 21400, 345, 34900],
  ['Intel Core i7-14700F', 'Intel', 'A', 'LGA1700', 'DDR5', 65, '20C / 28T', '2.1 / 5.4 GHz', 85, 84, 76, 125, 1720, 2940, 19600, 308, 31800],
  ['Intel Core i5-14600K', 'Intel', 'A', 'LGA1700', 'DDR5', 181, '14C / 20T', '3.5 / 5.3 GHz', 84, 73, 68, 124, 1420, 2860, 17600, 255, 25650],
  ['Intel Core i5-14600KF', 'Intel', 'A', 'LGA1700', 'DDR5', 181, '14C / 20T', '3.5 / 5.3 GHz', 84, 73, 69, 124, 1420, 2860, 17600, 255, 23900],
  ['Intel Core i5-14400F', 'Intel', 'A', 'LGA1700', 'DDR5', 65, '10C / 16T', '2.5 / 4.7 GHz', 71, 49, 81, 104, 960, 2540, 12950, 175, 16799],
  ['Intel Core i5-13600K', 'Intel', 'A', 'LGA1700', 'DDR5', 181, '14C / 20T', '3.5 / 5.1 GHz', 81, 70, 69, 119, 1360, 2760, 16900, 242, 22400],
  ['Intel Core i5-13400F', 'Intel', 'B', 'LGA1700', 'DDR5', 65, '10C / 16T', '2.5 / 4.6 GHz', 68, 47, 82, 100, 910, 2430, 12300, 166, 14200],
  ['Intel Core i5-12400F', 'Intel', 'B', 'LGA1700', 'DDR4', 65, '6C / 12T', '2.5 / 4.4 GHz', 62, 33, 86, 94, 645, 2210, 10200, 122, 9850],
  ['Intel Core i3-14100F', 'Intel', 'B', 'LGA1700', 'DDR4', 58, '4C / 8T', '3.5 / 4.7 GHz', 64, 24, 88, 98, 465, 2290, 7850, 88, 8600],
  ['Intel Core i3-12100F', 'Intel', 'B', 'LGA1700', 'DDR4', 58, '4C / 8T', '3.3 / 4.3 GHz', 58, 21, 89, 89, 415, 2080, 7100, 79, 7100],
  ['AMD Ryzen 3 4100', 'AMD', 'B', 'AM4', 'DDR4', 65, '4C / 8T', '3.8 / 4.0 GHz', 46, 19, 85, 72, 365, 1680, 6200, 68, 5999]
];

const RAW_GPUS = [
  // Flagship & Enthusiast S-Tier
  ['ASUS ROG Astral RTX 5090 OC 32GB', 'NVIDIA', 'S', 575, '32GB GDDR7', '512-bit', 100, 100, 82, 48500, 412000, 16400, 215, 188, 134, 229999],
  ['MSI Suprim SOC RTX 5080 16GB', 'NVIDIA', 'S', 360, '16GB GDDR7', '256-bit', 98, 97, 88, 34200, 294000, 11200, 176, 144, 92, 118999],
  ['Gigabyte AORUS Master RTX 4090 24GB', 'NVIDIA', 'S', 450, '24GB GDDR6X', '384-bit', 99, 98, 84, 36800, 318000, 11800, 185, 158, 104, 181900],
  ['ASUS TUF Gaming RTX 4080 SUPER OC 16GB', 'NVIDIA', 'S', 320, '16GB GDDR6X', '256-bit', 95, 94, 88, 28400, 245000, 8450, 162, 128, 78, 98999],
  ['Zotac Gaming Trinity RTX 4080 16GB', 'NVIDIA', 'S', 320, '16GB GDDR6X', '256-bit', 94, 93, 87, 27600, 238000, 8150, 158, 124, 75, 94500],
  ['MSI Gaming Trio OC RTX 5070 Ti 16GB', 'NVIDIA', 'S', 300, '16GB GDDR7', '256-bit', 93, 92, 91, 27100, 234000, 8300, 156, 123, 74, 84999],
  ['Gigabyte Windforce OC RTX 4070 Ti SUPER 16GB', 'NVIDIA', 'S', 285, '16GB GDDR6X', '256-bit', 89, 88, 90, 24800, 216000, 7480, 148, 115, 68, 78500],
  ['Inno3D iChill X3 RTX 4070 Ti 12GB', 'NVIDIA', 'S', 285, '12GB GDDR6X', '192-bit', 86, 85, 89, 22900, 201000, 6950, 141, 108, 62, 71900],
  ['Sapphire Nitro+ Radeon RX 7900 XTX 24GB', 'AMD', 'S', 355, '24GB GDDR6', '384-bit', 95, 92, 79, 29100, 238000, 5650, 166, 132, 81, 92100],
  ['PowerColor Hellhound Radeon RX 7900 XT 20GB', 'AMD', 'S', 315, '20GB GDDR6', '320-bit', 91, 89, 82, 26200, 218000, 4920, 154, 121, 72, 71200],
  ['Sapphire Pulse Radeon RX 9070 XT 16GB', 'AMD', 'S', 304, '16GB GDDR6', '256-bit', 90, 88, 86, 25400, 214000, 5480, 152, 119, 71, 64999],
  ['ASRock Challenger Radeon RX 7900 GRE 16GB', 'AMD', 'A', 260, '16GB GDDR6', '256-bit', 84, 82, 85, 22100, 191000, 4210, 139, 106, 61, 55900],
  // Upper-Mid & 1440p Sweet Spot A-Tier
  ['ASUS Dual OC RTX 5070 SUPER 12GB', 'NVIDIA', 'A', 250, '12GB GDDR7', '192-bit', 88, 87, 92, 24100, 209000, 7250, 145, 112, 65, 65999],
  ['Gigabyte Eagle OC RTX 5070 12GB', 'NVIDIA', 'A', 250, '12GB GDDR7', '192-bit', 85, 84, 93, 22800, 199000, 6850, 139, 107, 62, 61999],
  ['Zotac Twin Edge OC RTX 4070 SUPER 12GB', 'NVIDIA', 'A', 220, '12GB GDDR6X', '192-bit', 83, 82, 94, 21900, 194000, 6420, 134, 102, 58, 57800],
  ['MSI Ventus 2X OC RTX 4070 12GB', 'NVIDIA', 'A', 200, '12GB GDDR6X', '192-bit', 77, 76, 95, 18400, 168000, 5450, 121, 91, 51, 51500],
  ['ASUS Prime Radeon RX 9070 OC 16GB', 'AMD', 'A', 220, '16GB GDDR6', '256-bit', 83, 81, 92, 21600, 188000, 4650, 135, 103, 59, 54999],
  ['Sapphire Pure Radeon RX 7800 XT 16GB', 'AMD', 'A', 263, '16GB GDDR6', '256-bit', 80, 79, 81, 20400, 179000, 3780, 131, 99, 55, 48750],
  ['Gigabyte Gaming OC Radeon RX 7700 XT 12GB', 'AMD', 'A', 245, '12GB GDDR6', '192-bit', 73, 71, 80, 17200, 154000, 3180, 118, 86, 47, 39500],
  ['MSI Gaming X Trio RTX 5060 Ti 16GB', 'NVIDIA', 'A', 180, '16GB GDDR7', '128-bit', 76, 75, 92, 18100, 164000, 5150, 122, 87, 46, 47999],
  ['Zotac Twin Edge RTX 5060 Ti 8GB', 'NVIDIA', 'A', 180, '8GB GDDR7', '128-bit', 75, 74, 93, 17800, 161000, 5050, 119, 84, 44, 41999],
  ['PowerColor Reaper Radeon RX 9060 XT 16GB', 'AMD', 'A', 175, '16GB GDDR6', '128-bit', 75, 73, 89, 17900, 159000, 3680, 121, 86, 45, 39999],
  ['XFX Speedster MERC 319 RX 6950 XT 16GB', 'AMD', 'A', 335, '16GB GDDR6', '256-bit', 82, 78, 70, 21100, 181000, 3520, 134, 101, 56, 52900],
  ['ASRock Phantom Gaming RX 6800 XT 16GB', 'AMD', 'A', 300, '16GB GDDR6', '256-bit', 76, 73, 74, 18900, 162000, 3120, 124, 92, 50, 44900],
  ['Sapphire Pulse Radeon RX 6800 16GB', 'AMD', 'A', 250, '16GB GDDR6', '256-bit', 71, 68, 81, 16400, 144000, 2780, 114, 83, 44, 38900],
  ['EVGA FTW3 Ultra RTX 3090 Ti 24GB', 'NVIDIA', 'A', 450, '24GB GDDR6X', '384-bit', 84, 83, 62, 21800, 196000, 6120, 136, 104, 59, 89000],
  ['ASUS ROG Strix RTX 3090 OC 24GB', 'NVIDIA', 'A', 350, '24GB GDDR6X', '384-bit', 80, 79, 68, 20200, 182000, 5650, 128, 97, 54, 78000],
  ['MSI Suprim X RTX 3080 Ti 12GB', 'NVIDIA', 'A', 350, '12GB GDDR6X', '384-bit', 79, 78, 69, 19800, 178000, 5480, 126, 95, 53, 64000],
  ['Gigabyte Gaming OC RTX 3080 10GB', 'NVIDIA', 'A', 320, '10GB GDDR6X', '320-bit', 74, 73, 72, 17800, 161000, 4890, 118, 88, 48, 52000],
  ['ASRock Steel Legend Intel Arc B770 16GB', 'Intel', 'A', 225, '16GB GDDR6', '256-bit', 74, 72, 85, 17600, 157000, 4150, 118, 85, 46, 36999],
  ['Intel Limited Edition Arc B580 12GB', 'Intel', 'A', 190, '12GB GDDR6', '192-bit', 67, 65, 86, 14800, 134000, 3450, 105, 74, 39, 26900],
  // Mainstream & Budget 1080p B-Tier
  ['Galax EX Gamer RTX 5060 8GB', 'NVIDIA', 'B', 145, '8GB GDDR7', '128-bit', 68, 66, 95, 15100, 138000, 4280, 104, 73, 38, 31999],
  ['ASRock Challenger Radeon RX 9060 XT 8GB', 'AMD', 'B', 165, '8GB GDDR6', '128-bit', 73, 71, 90, 17200, 153000, 3520, 116, 81, 42, 33999],
  ['Sapphire Pulse Radeon RX 9060 8GB', 'AMD', 'B', 145, '8GB GDDR6', '128-bit', 66, 64, 91, 14600, 132000, 3180, 101, 70, 36, 26999],
  ['Inno3D Twin X2 RTX 5050 8GB', 'NVIDIA', 'B', 130, '8GB GDDR6', '128-bit', 56, 54, 94, 11400, 104000, 3120, 82, 56, 29, 24999],
  ['ASUS ProArt RTX 4060 Ti 16GB', 'NVIDIA', 'B', 165, '16GB GDDR6', '128-bit', 70, 69, 90, 15900, 143000, 4210, 111, 78, 43, 44500],
  ['Galax 1-Click OC RTX 4060 Ti 8GB', 'NVIDIA', 'B', 160, '8GB GDDR6', '128-bit', 69, 68, 91, 15600, 141000, 4120, 109, 76, 41, 36500],
  ['Zotac Gaming Solo RTX 4060 8GB', 'NVIDIA', 'B', 115, '8GB GDDR6', '128-bit', 62, 60, 95, 13200, 121000, 3450, 92, 64, 34, 27850],
  ['MSI Gaming X Trio RTX 3070 Ti 8GB', 'NVIDIA', 'B', 290, '8GB GDDR6X', '256-bit', 70, 69, 71, 15400, 142000, 4180, 108, 77, 41, 39500],
  ['ASUS TUF Gaming RTX 3070 8GB', 'NVIDIA', 'B', 220, '8GB GDDR6', '256-bit', 67, 66, 78, 14200, 131000, 3820, 102, 72, 38, 34500],
  ['Gigabyte Vision OC RTX 3060 Ti 8GB', 'NVIDIA', 'B', 200, '8GB GDDR6', '256-bit', 63, 62, 81, 12600, 116000, 3380, 94, 65, 34, 28900],
  ['Inno3D Twin X2 RTX 3060 12GB', 'NVIDIA', 'B', 170, '12GB GDDR6', '192-bit', 55, 54, 83, 9800, 92000, 2650, 79, 54, 28, 24800],
  ['Zotac Twin Edge OC RTX 3050 8GB', 'NVIDIA', 'B', 130, '8GB GDDR6', '128-bit', 44, 43, 84, 6400, 62000, 1780, 61, 41, 21, 18900],
  ['MSI Ventus 2X OC RTX 3050 6GB', 'NVIDIA', 'B', 70, '6GB GDDR6', '96-bit', 38, 37, 92, 5100, 49000, 1420, 52, 34, 17, 15800],
  ['Gigabyte Gaming OC RX 7600 XT 16GB', 'AMD', 'B', 190, '16GB GDDR6', '128-bit', 63, 60, 81, 13400, 121000, 2420, 95, 66, 35, 31200],
  ['ASUS Dual V2 Radeon RX 7600 8GB', 'AMD', 'B', 165, '8GB GDDR6', '128-bit', 59, 56, 83, 12400, 112000, 2240, 88, 60, 31, 23999],
  ['XFX Speedster QICK 308 RX 7650 GRE 8GB', 'AMD', 'B', 170, '8GB GDDR6', '128-bit', 61, 58, 84, 12900, 116000, 2340, 91, 63, 33, 25999],
  ['MSI Mech 2X OC RX 6750 XT 12GB', 'AMD', 'B', 250, '12GB GDDR6', '192-bit', 68, 65, 76, 14600, 132000, 2580, 104, 74, 39, 32900],
  ['PowerColor Fighter RX 6700 XT 12GB', 'AMD', 'B', 230, '12GB GDDR6', '192-bit', 65, 62, 79, 13600, 123000, 2390, 98, 69, 36, 29500],
  ['Sapphire Pulse RX 6650 XT 8GB', 'AMD', 'B', 176, '8GB GDDR6', '128-bit', 58, 55, 82, 11800, 106000, 2080, 86, 58, 30, 22800],
  ['ASRock Challenger D RX 6600 XT 8GB', 'AMD', 'B', 160, '8GB GDDR6', '128-bit', 55, 52, 84, 10900, 98000, 1920, 81, 54, 28, 20900],
  ['ASUS Dual Radeon RX 6600 8GB', 'AMD', 'B', 132, '8GB GDDR6', '128-bit', 50, 47, 88, 9200, 84000, 1680, 74, 49, 25, 18900],
  ['Gigabyte Eagle RX 6500 XT 4GB', 'AMD', 'B', 107, '4GB GDDR6', '64-bit', 33, 30, 85, 4900, 46000, 980, 48, 31, 15, 12800],
  ['Acer Predator BiFrost Arc A770 16GB', 'Intel', 'B', 225, '16GB GDDR6', '256-bit', 61, 59, 76, 13100, 119000, 2980, 91, 63, 33, 28500],
  ['Sparkle Orc OC Intel Arc B570 10GB', 'Intel', 'B', 150, '10GB GDDR6', '160-bit', 61, 59, 88, 12900, 118000, 2920, 93, 64, 34, 22900],
  ['Intel Limited Edition Arc A750 8GB', 'Intel', 'B', 225, '8GB GDDR6', '256-bit', 57, 55, 75, 12100, 109000, 2680, 84, 57, 29, 19800],
  ['ASRock Challenger Arc A580 8GB', 'Intel', 'B', 185, '8GB GDDR6', '256-bit', 51, 49, 77, 10200, 94000, 2240, 75, 50, 25, 16900],
  ['Zotac Gaming Twin Fan GTX 1660 SUPER 6GB', 'NVIDIA', 'B', 125, '6GB GDDR6', '192-bit', 41, 36, 86, 6100, 58000, 1340, 58, 38, 19, 16500],
  ['ASUS Phoenix GTX 1650 OC 4GB', 'NVIDIA', 'B', 75, '4GB GDDR6', '128-bit', 30, 26, 91, 3900, 38000, 890, 42, 27, 13, 12400],
  ['Sapphire Pulse Low-Profile RX 6400 4GB', 'AMD', 'B', 53, '4GB GDDR6', '64-bit', 28, 25, 94, 3600, 35000, 780, 39, 25, 12, 10900]
];

const RAW_MBS = [
  // AM5 Motherboards (22)
  ['ASUS ROG CROSSHAIR X870E HERO', 'ASUS', 'S', 'AM5', 'DDR5', 55, 'E-ATX • AM5 • 18+2+2 VRM • Dual USB4', 64500],
  ['MSI MEG X870E GODLIKE', 'MSI', 'S', 'AM5', 'DDR5', 60, 'E-ATX • AM5 • 24+2+1 VRM • Wi-Fi 7', 98000],
  ['Gigabyte X870E AORUS MASTER', 'Gigabyte', 'S', 'AM5', 'DDR5', 50, 'ATX • AM5 • 16+2+2 VRM • Wi-Fi 7', 47500],
  ['ASUS ROG STRIX X870-A GAMING WIFI', 'ASUS', 'S', 'AM5', 'DDR5', 45, 'ATX • AM5 • PCIe 5.0 • Dual USB4', 32800],
  ['MSI MAG X870 TOMAHAWK WIFI', 'MSI', 'S', 'AM5', 'DDR5', 45, 'ATX • AM5 • 14+2+1 VRM • Wi-Fi 7', 30200],
  ['Gigabyte X870 EAGLE WIFI7', 'Gigabyte', 'A', 'AM5', 'DDR5', 40, 'ATX • AM5 • DDR5 • Wi-Fi 7', 24900],
  ['ASRock X870 Pro RS WiFi', 'ASRock', 'A', 'AM5', 'DDR5', 40, 'ATX • AM5 • White PCB • PCIe 5.0', 23800],
  ['ASUS TUF GAMING X670E-PLUS WIFI', 'ASUS', 'S', 'AM5', 'DDR5', 45, 'ATX • AM5 • 14+2 Teamed VRM • PCIe 5.0', 28900],
  ['MSI MAG X670E TOMAHAWK WIFI', 'MSI', 'S', 'AM5', 'DDR5', 45, 'ATX • AM5 • 4x M.2 Slots • Wi-Fi 6E', 27400],
  ['ASUS ROG STRIX B650E-F GAMING WIFI', 'ASUS', 'S', 'AM5', 'DDR5', 40, 'ATX • AM5 • PCIe 5.0 GPU & M.2', 26800],
  ['MSI MAG B650 TOMAHAWK WIFI', 'MSI', 'A', 'AM5', 'DDR5', 35, 'ATX • AM5 • DDR5 • Wi-Fi 6E', 20650],
  ['Gigabyte B650 AORUS ELITE AX V2', 'Gigabyte', 'A', 'AM5', 'DDR5', 35, 'ATX • AM5 • 12+2+2 VRM • Wi-Fi 6E', 19800],
  ['ASUS TUF GAMING B650-PLUS WIFI', 'ASUS', 'A', 'AM5', 'DDR5', 35, 'ATX • AM5 • DDR5 • 2.5G LAN', 19200],
  ['MSI B650 GAMING PLUS WIFI', 'MSI', 'A', 'AM5', 'DDR5', 32, 'ATX • AM5 • Extended Heatsink', 16900],
  ['Gigabyte B650M GAMING X AX', 'Gigabyte', 'A', 'AM5', 'DDR5', 30, 'mATX • AM5 • DDR5 • Wi-Fi 6E', 15500],
  ['MSI PRO B650M-A WIFI', 'MSI', 'A', 'AM5', 'DDR5', 30, 'mATX • AM5 • Core Boost • Wi-Fi 6E', 14800],
  ['ASUS PRIME B650M-A WIFI II', 'ASUS', 'B', 'AM5', 'DDR5', 28, 'mATX • AM5 • Aura Sync • Wi-Fi 6', 13900],
  ['ASRock B650M-HDV/M.2', 'ASRock', 'B', 'AM5', 'DDR5', 28, 'mATX • AM5 • 8+2+1 Dr.MOS VRM', 11700],
  ['Gigabyte B650M D3HP', 'Gigabyte', 'B', 'AM5', 'DDR5', 26, 'mATX • AM5 • Dual M.2 • 2.5GbE', 10900],
  ['MSI PRO A620M-E', 'MSI', 'B', 'AM5', 'DDR5', 25, 'mATX • AM5 • Budget DDR5 Entry', 7800],
  ['ASUS ROG STRIX B650E-I GAMING WIFI', 'ASUS', 'S', 'AM5', 'DDR5', 38, 'Mini-ITX • AM5 • PCIe 5.0 • SFF', 31500],
  ['Gigabyte B650I AORUS ULTRA', 'Gigabyte', 'S', 'AM5', 'DDR5', 38, 'Mini-ITX • AM5 • Triple M.2 • SFF', 28900],
  // LGA1851 & LGA1700 Motherboards (15)
  ['ASUS ROG MAXIMUS Z890 HERO', 'ASUS', 'S', 'LGA1851', 'DDR5', 55, 'ATX • LGA1851 • 22+1+2 VRM • Wi-Fi 7', 62000],
  ['MSI MPG Z890 CARBON WIFI', 'MSI', 'S', 'LGA1851', 'DDR5', 50, 'ATX • LGA1851 • 20+1+1 VRM • TB4', 44500],
  ['Gigabyte Z890 AORUS ELITE WIFI7', 'Gigabyte', 'S', 'LGA1851', 'DDR5', 45, 'ATX • LGA1851 • 16+1+2 VRM • Wi-Fi 7', 29800],
  ['MSI PRO Z890-P WIFI', 'MSI', 'A', 'LGA1851', 'DDR5', 45, 'ATX • LGA1851 • DDR5 • Thunderbolt 4', 27400],
  ['ASRock Z890 Pro-A WiFi', 'ASRock', 'A', 'LGA1851', 'DDR5', 40, 'ATX • LGA1851 • 16+1+1 VRM', 23500],
  ['ASUS ROG STRIX Z790-E GAMING WIFI II', 'ASUS', 'S', 'LGA1700', 'DDR5', 50, 'ATX • LGA1700 • 18+1+2 VRM • Wi-Fi 7', 42900],
  ['MSI MAG Z790 TOMAHAWK MAX WIFI', 'MSI', 'S', 'LGA1700', 'DDR5', 45, 'ATX • LGA1700 • 16+1+1 VRM • Wi-Fi 7', 29500],
  ['Gigabyte Z790 AORUS ELITE AX', 'Gigabyte', 'A', 'LGA1700', 'DDR5', 42, 'ATX • LGA1700 • 16+1+2 VRM', 24800],
  ['MSI PRO Z790-P WIFI DDR5', 'MSI', 'A', 'LGA1700', 'DDR5', 40, 'ATX • LGA1700 • DDR5 • 14+1+1 VRM', 21100],
  ['ASUS TUF GAMING B760-PLUS WIFI', 'ASUS', 'A', 'LGA1700', 'DDR5', 35, 'ATX • LGA1700 • DDR5 • PCIe 5.0', 18400],
  ['MSI MAG B760M MORTAR WIFI II', 'MSI', 'A', 'LGA1700', 'DDR5', 35, 'mATX • LGA1700 • 12+1+1 VRM', 17200],
  ['Gigabyte B760M DS3H AX DDR5', 'Gigabyte', 'B', 'LGA1700', 'DDR5', 30, 'mATX • LGA1700 • DDR5 • Wi-Fi 6E', 13400],
  ['MSI PRO B760M-A WIFI DDR4', 'MSI', 'B', 'LGA1700', 'DDR4', 28, 'mATX • LGA1700 • DDR4 • Wi-Fi 6E', 12600],
  ['Gigabyte H610M H V2 DDR4', 'Gigabyte', 'B', 'LGA1700', 'DDR4', 22, 'mATX • LGA1700 • Budget DDR4', 6850],
  ['ASUS PRIME H610M-E D4', 'ASUS', 'B', 'LGA1700', 'DDR4', 22, 'mATX • LGA1700 • Dual M.2 • DDR4', 6999],
  // AM4 Motherboards (7)
  ['ASUS ROG STRIX B550-F GAMING WIFI II', 'ASUS', 'A', 'AM4', 'DDR4', 32, 'ATX • AM4 • DDR4 • Wi-Fi 6E • 2.5G', 16800],
  ['MSI MAG B550 TOMAHAWK MAX WIFI', 'MSI', 'A', 'AM4', 'DDR4', 32, 'ATX • AM4 • DDR4 • Extended Heatsink', 15900],
  ['Gigabyte B550 AORUS ELITE AX V2', 'Gigabyte', 'A', 'AM4', 'DDR4', 30, 'ATX • AM4 • DDR4 • 12+2 Digital VRM', 14200],
  ['MSI B550M PRO-VDH WIFI', 'MSI', 'B', 'AM4', 'DDR4', 26, 'mATX • AM4 • DDR4 • Wi-Fi + BT', 10200],
  ['Gigabyte B550M DS3H AC', 'Gigabyte', 'B', 'AM4', 'DDR4', 25, 'mATX • AM4 • DDR4 • Wi-Fi', 8950],
  ['ASUS PRIME B450M-K II', 'ASUS', 'B', 'AM4', 'DDR4', 22, 'mATX • AM4 • BIOS FlashBack', 5650],
  ['MSI A520M-A PRO', 'MSI', 'B', 'AM4', 'DDR4', 20, 'mATX • AM4 • Ultra-Budget DDR4', 4650]
];

export const PARTS_DB = {
  cpu: RAW_CPUS.map((c, idx) => ({
    id: `cpu-${idx + 1}`,
    name: c[0], brand: c[1], tier: c[2], socket: c[3], ramType: c[4], tdp: c[5],
    cores: c[6], clock: c[7], singleScore: c[8], multiScore: c[9], effScore: c[10],
    cb24Single: c[11], cb24Multi: c[12], gb6Single: c[13], gb6Multi: c[14], blender: c[15],
    prices: p(c[16]),
    advantages: [
      `${c[6]} architecture running up to ${c[7].split('/')[1]?.trim() || c[7]} boost clock`,
      `Cinebench 2024 Multi: ${c[12]} pts • Geekbench 6 Multi: ${c[14].toLocaleString()} pts`,
      `${c[3]} platform with ${c[4]} memory controller (${c[5]}W TDP)`
    ]
  })),
  gpu: RAW_GPUS.map((g, idx) => ({
    id: `gpu-${idx + 1}`,
    name: g[0], brand: g[1], tier: g[2], tdp: g[3],
    vram: g[4], bus: g[5], singleScore: g[6], multiScore: g[7], effScore: g[8],
    cb24Single: g[6], cb24Multi: g[9], gb6Single: g[10], gb6Multi: g[10], blender: g[11],
    fps1080: { cp2077: g[12], wukong: Math.round(g[12] * 0.72), rdr2: Math.round(g[12] * 1.12), alanwake: Math.round(g[12] * 0.68), fh5: Math.round(g[12] * 1.34), cs2: Math.round(g[12] * 2.85) },
    fps1440: { cp2077: g[13], wukong: Math.round(g[13] * 0.71), rdr2: Math.round(g[13] * 1.14), alanwake: Math.round(g[13] * 0.66), fh5: Math.round(g[13] * 1.38), cs2: Math.round(g[13] * 3.05) },
    fps4k: { cp2077: g[14], wukong: Math.round(g[14] * 0.72), rdr2: Math.round(g[14] * 1.19), alanwake: Math.round(g[14] * 0.67), fh5: Math.round(g[14] * 1.54), cs2: Math.round(g[14] * 3.35) },
    prices: p(g[15]),
    advantages: [
      `${g[4]} memory on a ${g[5]} interface (${g[3]}W TGP)`,
      `Blender 4.2 Monster score: ${g[11].toLocaleString()} samples/min (${(g[11] / g[3]).toFixed(2)} smp/W)`,
      `Delivers ${g[12]} FPS @ 1080p & ${g[13]} FPS @ 1440p in Cyberpunk 2077 Ultra`
    ]
  })),
  motherboard: RAW_MBS.map((m, idx) => ({
    id: `mb-${idx + 1}`,
    name: m[0], brand: m[1], tier: m[2], socket: m[3], ramType: m[4], tdp: m[5], spec: m[6],
    prices: p(m[7])
  })),
  ram: [
    { id: 'ram-1', name: 'G.Skill Trident Z5 Neo RGB 64GB (2x32) 6000MHz CL30', brand: 'G.Skill', tier: 'S', ramType: 'DDR5', tdp: 12, spec: 'DDR5-6000 • CL30 • AMD EXPO & XMP', prices: p(29800) },
    { id: 'ram-2', name: 'Corsair Dominator Titanium 64GB (2x32) 6400MHz CL32', brand: 'Corsair', tier: 'S', ramType: 'DDR5', tdp: 12, spec: 'DDR5-6400 • CL32 • DHX Cooling', prices: p(32400) },
    { id: 'ram-3', name: 'G.Skill Trident Z5 Neo RGB 32GB (2x16) 6000MHz CL30', brand: 'G.Skill', tier: 'S', ramType: 'DDR5', tdp: 10, spec: 'DDR5-6000 • CL30 • AMD EXPO', prices: p(15850) },
    { id: 'ram-4', name: 'Corsair Vengeance RGB 32GB (2x16) 6000MHz CL30', brand: 'Corsair', tier: 'S', ramType: 'DDR5', tdp: 10, spec: 'DDR5-6000 • CL30 • Dual Profile', prices: p(15500) },
    { id: 'ram-5', name: 'Kingston FURY Beast 32GB (2x16) 6000MHz CL36', brand: 'Kingston', tier: 'A', ramType: 'DDR5', tdp: 9, spec: 'DDR5-6000 • CL36 • Low Profile', prices: p(14100) },
    { id: 'ram-6', name: 'TeamGroup T-Force Delta RGB 32GB (2x16) 5600MHz CL32', brand: 'TeamGroup', tier: 'A', ramType: 'DDR5', tdp: 9, spec: 'DDR5-5600 • CL32 • RGB', prices: p(13100) },
    { id: 'ram-7', name: 'Crucial Pro 32GB (2x16) 5600MHz DDR5', brand: 'Crucial', tier: 'A', ramType: 'DDR5', tdp: 8, spec: 'DDR5-5600 • CL46 • Plug & Play', prices: p(12050) },
    { id: 'ram-8', name: 'ADATA XPG Lancer Blade 32GB (2x16) 6000MHz CL30', brand: 'ADATA', tier: 'A', ramType: 'DDR5', tdp: 9, spec: 'DDR5-6000 • CL30 • Compact Heatsink', prices: p(13900) },
    { id: 'ram-9', name: 'Kingston FURY Beast 16GB (1x16) 5600MHz DDR5', brand: 'Kingston', tier: 'B', ramType: 'DDR5', tdp: 5, spec: 'DDR5-5600 • CL36 • Single Stick', prices: p(6950) },
    { id: 'ram-10', name: 'Corsair Vengeance LPX 32GB (2x16) 3200MHz CL16', brand: 'Corsair', tier: 'A', ramType: 'DDR4', tdp: 8, spec: 'DDR4-3200 • CL16 • Dual Channel', prices: p(9299) },
    { id: 'ram-11', name: 'G.Skill Ripjaws V 16GB (2x8) 3200MHz CL16', brand: 'G.Skill', tier: 'B', ramType: 'DDR4', tdp: 6, spec: 'DDR4-3200 • CL16 • XMP 2.0', prices: p(5100) },
    { id: 'ram-12', name: 'ADATA XPG Gammix D35 16GB (2x8) 3200MHz CL16', brand: 'ADATA', tier: 'B', ramType: 'DDR4', tdp: 6, spec: 'DDR4-3200 • CL16 • Budget Kit', prices: p(4750) }
  ],
  storage: [
    { id: 'ssd-1', name: 'Samsung 990 PRO 4TB PCIe 4.0 NVMe', brand: 'Samsung', tier: 'S', tdp: 8, spec: '7,450 MB/s Read • 6,900 MB/s Write • DRAM', prices: p(31500) },
    { id: 'ssd-2', name: 'Crucial T705 2TB PCIe 5.0 NVMe', brand: 'Crucial', tier: 'S', tdp: 11, spec: '14,500 MB/s Read • Gen5 Flagship', prices: p(26800) },
    { id: 'ssd-3', name: 'Samsung 990 PRO 2TB PCIe 4.0 NVMe', brand: 'Samsung', tier: 'S', tdp: 7, spec: '7,450 MB/s Read • 6,900 MB/s Write • DRAM', prices: p(16300) },
    { id: 'ssd-4', name: 'WD Black SN850X 2TB PCIe 4.0 NVMe', brand: 'Western Digital', tier: 'S', tdp: 7, spec: '7,300 MB/s Read • Game Mode 2.0', prices: p(14850) },
    { id: 'ssd-5', name: 'Kingston KC3000 2TB PCIe 4.0 NVMe', brand: 'Kingston', tier: 'S', tdp: 7, spec: '7,000 MB/s Read • Graphene Heatsink', prices: p(13900) },
    { id: 'ssd-6', name: 'Samsung 990 PRO 1TB PCIe 4.0 NVMe', brand: 'Samsung', tier: 'S', tdp: 6, spec: '7,450 MB/s Read • 6,900 MB/s Write • DRAM', prices: p(9200) },
    { id: 'ssd-7', name: 'WD Black SN850X 1TB PCIe 4.0 NVMe', brand: 'Western Digital', tier: 'S', tdp: 6, spec: '7,300 MB/s Read • 6,300 MB/s Write', prices: p(8400) },
    { id: 'ssd-8', name: 'Kingston KC3000 1TB PCIe 4.0 NVMe', brand: 'Kingston', tier: 'A', tdp: 6, spec: '7,000 MB/s Read • 6,000 MB/s Write', prices: p(7750) },
    { id: 'ssd-9', name: 'Samsung 980 PRO 1TB PCIe 4.0 NVMe', brand: 'Samsung', tier: 'A', tdp: 6, spec: '7,000 MB/s Read • 5,000 MB/s Write', prices: p(7950) },
    { id: 'ssd-10', name: 'ADATA XPG Gammix S70 Blade 1TB Gen4', brand: 'ADATA', tier: 'A', tdp: 6, spec: '7,400 MB/s Read • PS5 & PC Ready', prices: p(6999) },
    { id: 'ssd-11', name: 'Crucial P3 Plus 2TB PCIe 4.0 NVMe', brand: 'Crucial', tier: 'A', tdp: 6, spec: '5,000 MB/s Read • High Capacity Value', prices: p(10400) },
    { id: 'ssd-12', name: 'Crucial P3 Plus 1TB PCIe 4.0 NVMe', brand: 'Crucial', tier: 'B', tdp: 5, spec: '5,000 MB/s Read • 3,600 MB/s Write', prices: p(5400) },
    { id: 'ssd-13', name: 'WD Blue SN580 1TB PCIe 4.0 NVMe', brand: 'Western Digital', tier: 'B', tdp: 5, spec: '4,150 MB/s Read • nCache 4.0', prices: p(5300) },
    { id: 'ssd-14', name: 'Kingston NV3 1TB PCIe 4.0 NVMe', brand: 'Kingston', tier: 'B', tdp: 4, spec: '6,000 MB/s Read • Low Power Gen4', prices: p(5150) },
    { id: 'ssd-15', name: 'WD Green SN350 500GB PCIe 3.0 NVMe', brand: 'Western Digital', tier: 'B', tdp: 4, spec: '2,400 MB/s Read • Entry OS Drive', prices: p(3150) }
  ],
  cooler: [
    // Liquid Coolers (AIO) - 8
    { id: 'cool-1', name: 'ARCTIC Liquid Freezer III 360 A-RGB (Liquid AIO)', brand: 'ARCTIC', tier: 'S', tdp: 12, spec: '360mm Liquid AIO • VRM Fan • Offset Mount', prices: p(11550) },
    { id: 'cool-2', name: 'NZXT Kraken Elite 360 RGB LCD (Liquid AIO)', brand: 'NZXT', tier: 'S', tdp: 14, spec: '360mm Liquid AIO • 2.36" IPS LCD Pump', prices: p(24500) },
    { id: 'cool-3', name: 'Corsair iCUE H150i ELITE CAPELLIX XT (Liquid AIO)', brand: 'Corsair', tier: 'S', tdp: 14, spec: '360mm Liquid AIO • AF120 RGB Elite Fans', prices: p(17800) },
    { id: 'cool-4', name: 'Lian Li Galahad II Trinity Performance 360 (Liquid AIO)', brand: 'Lian Li', tier: 'S', tdp: 14, spec: '360mm Liquid AIO • High Static Pressure', prices: p(15400) },
    { id: 'cool-5', name: 'DeepCool LS720 SE 360mm ARGB (Liquid AIO)', brand: 'DeepCool', tier: 'S', tdp: 12, spec: '360mm Liquid AIO • 4th Gen Dual-Chamber Pump', prices: p(9199) },
    { id: 'cool-6', name: 'MSI MAG CORELIQUID E360 ARGB (Liquid AIO)', brand: 'MSI', tier: 'A', tdp: 12, spec: '360mm Liquid AIO • Rotatable Blockhead', prices: p(9650) },
    { id: 'cool-7', name: 'ARCTIC Liquid Freezer III 240 (Liquid AIO)', brand: 'ARCTIC', tier: 'A', tdp: 10, spec: '240mm Liquid AIO • 38mm Thick Radiator', prices: p(8450) },
    { id: 'cool-8', name: 'DeepCool LE520 240mm ARGB (Liquid AIO)', brand: 'DeepCool', tier: 'A', tdp: 9, spec: '240mm Liquid AIO • Anti-Leak Tech', prices: p(5750) },
    // Air Coolers - 7
    { id: 'cool-9', name: 'Noctua NH-D15 G2 Chromax.Black (Dual-Tower Air)', brand: 'Noctua', tier: 'S', tdp: 6, spec: 'Dual-Tower Air Cooler • 8 Heatpipes • NF-A14x25', prices: p(11900) },
    { id: 'cool-10', name: 'be quiet! Dark Rock Pro 5 (Dual-Tower Air)', brand: 'be quiet!', tier: 'S', tdp: 6, spec: 'Dual-Tower Air Cooler • 270W TDP • Silent Wings', prices: p(9400) },
    { id: 'cool-11', name: 'DeepCool Assassin IV VC Vision (Dual-Tower Air)', brand: 'DeepCool', tier: 'S', tdp: 6, spec: 'Dual-Tower Air Cooler • Vapor Chamber + Temp Display', prices: p(8900) },
    { id: 'cool-12', name: 'DeepCool AK620 Digital (Dual-Tower Air)', brand: 'DeepCool', tier: 'A', tdp: 5, spec: 'Dual-Tower Air Cooler • 260W TDP • Status Screen', prices: p(6100) },
    { id: 'cool-13', name: 'Thermalright Peerless Assassin 120 SE (Dual-Tower Air)', brand: 'Thermalright', tier: 'A', tdp: 5, spec: 'Dual-Tower Air Cooler • 6x6mm Heatpipes', prices: p(4100) },
    { id: 'cool-14', name: 'Cooler Master Hyper 212 Halo Black (Single-Tower Air)', brand: 'Cooler Master', tier: 'B', tdp: 4, spec: 'Single-Tower Air Cooler • MF120 Halo2 Fan', prices: p(3250) },
    { id: 'cool-15', name: 'DeepCool AG400 ARGB (Single-Tower Air)', brand: 'DeepCool', tier: 'B', tdp: 3, spec: 'Single-Tower Air Cooler • 220W TDP Budget King', prices: p(1950) }
  ],
  psu: [
    { id: 'psu-1', name: 'Corsair HX1200i 1200W 80+ Platinum ATX 3.1', brand: 'Corsair', tier: 'S', wattage: 1200, tdp: 0, spec: '1200W • 80+ Platinum • Fully Modular', prices: p(24500) },
    { id: 'psu-2', name: 'Corsair RM1000e 1000W 80+ Gold ATX 3.1', brand: 'Corsair', tier: 'S', wattage: 1000, tdp: 0, spec: '1000W • 80+ Gold • Native 12V-2x6', prices: p(14500) },
    { id: 'psu-3', name: 'MSI MPG A1000G PCIE5 1000W 80+ Gold', brand: 'MSI', tier: 'S', wattage: 1000, tdp: 0, spec: '1000W • 80+ Gold • Japanese 105°C Caps', prices: p(13900) },
    { id: 'psu-4', name: 'Corsair RM850e 850W 80+ Gold ATX 3.0', brand: 'Corsair', tier: 'S', wattage: 850, tdp: 0, spec: '850W • 80+ Gold • Fully Modular', prices: p(10200) },
    { id: 'psu-5', name: 'MSI MAG A850GL PCIE5 850W 80+ Gold', brand: 'MSI', tier: 'S', wattage: 850, tdp: 0, spec: '850W • 80+ Gold • Dual-Color 12VHPWR', prices: p(9200) },
    { id: 'psu-6', name: 'DeepCool PN850M 850W 80+ Gold ATX 3.1', brand: 'DeepCool', tier: 'A', wattage: 850, tdp: 0, spec: '850W • 80+ Gold • Fully Modular', prices: p(8650) },
    { id: 'psu-7', name: 'DeepCool PM750D 750W 80+ Gold', brand: 'DeepCool', tier: 'A', wattage: 750, tdp: 0, spec: '750W • 80+ Gold • Non-Modular Value', prices: p(5950) },
    { id: 'psu-8', name: 'Corsair CX750 750W 80+ Bronze', brand: 'Corsair', tier: 'A', wattage: 750, tdp: 0, spec: '750W • 80+ Bronze • Low-Noise Fan', prices: p(5650) },
    { id: 'psu-9', name: 'Cooler Master MWE 650 V2 80+ Bronze', brand: 'Cooler Master', tier: 'B', wattage: 650, tdp: 0, spec: '650W • 80+ Bronze • DC-to-DC', prices: p(4600) },
    { id: 'psu-10', name: 'Cooler Master MWE 550W V2 80+ Bronze', brand: 'Cooler Master', tier: 'B', wattage: 550, tdp: 0, spec: '550W • 80+ Bronze • Entry Builds', prices: p(3720) }
  ],
  case: [
    { id: 'case-1', name: 'HYTE Y70 Touch Infinite Dual-Chamber', brand: 'HYTE', tier: 'S', tdp: 0, spec: '4K Capacitive Touchscreen • Panoramic Glass', prices: p(33900) },
    { id: 'case-2', name: 'Lian Li O11 Vision Compact Dual-Chamber', brand: 'Lian Li', tier: 'S', tdp: 0, spec: '3-Sided Tempered Glass • Back-Connect', prices: p(10650) },
    { id: 'case-3', name: 'Lian Li Lancool 216 Mesh E-ATX', brand: 'Lian Li', tier: 'S', tdp: 0, spec: '2x160mm ARGB Fans • Top Airflow Champion', prices: p(7850) },
    { id: 'case-4', name: 'Fractal Design North XL Charcoal Mesh', brand: 'Fractal', tier: 'S', tdp: 0, spec: 'Real Walnut Wood Front • E-ATX Airflow', prices: p(16400) },
    { id: 'case-5', name: 'NZXT H6 Flow RGB Dual-Chamber', brand: 'NZXT', tier: 'A', tdp: 0, spec: 'Angled Front Fans • Panoramic Glass', prices: p(11200) },
    { id: 'case-6', name: 'NZXT H5 Flow RGB Tempered Glass', brand: 'NZXT', tier: 'A', tdp: 0, spec: 'ATX Mid-Tower • Dedicated GPU Duct', prices: p(8300) },
    { id: 'case-7', name: 'Corsair 4000D Airflow Mid-Tower', brand: 'Corsair', tier: 'A', tdp: 0, spec: 'ATX • High-Airflow Steel Front Panel', prices: p(6400) },
    { id: 'case-8', name: 'Montech AIR 903 MAX E-ATX Mesh', brand: 'Montech', tier: 'A', tdp: 0, spec: '4x140mm PWM ARGB Fans • High Value', prices: p(5950) },
    { id: 'case-9', name: 'DeepCool CC560 V2 Mid-Tower', brand: 'DeepCool', tier: 'B', tdp: 0, spec: 'ATX • 4x Pre-installed LED Fans', prices: p(3850) },
    { id: 'case-10', name: 'Ant Esports ICE-112 Auto RGB', brand: 'Ant Esports', tier: 'B', tdp: 0, spec: 'ATX • Budget Mesh Airflow', prices: p(3150) }
  ]
};

export const SLOT_LABELS = [
  { key: 'cpu', label: 'CPU / Processor' },
  { key: 'cooler', label: 'CPU Cooler' },
  { key: 'motherboard', label: 'Motherboard' },
  { key: 'ram', label: 'Memory (RAM)' },
  { key: 'gpu', label: 'Video Card (GPU)' },
  { key: 'storage', label: 'NVMe Storage' },
  { key: 'psu', label: 'Power Supply' },
  { key: 'case', label: 'PC Case' }
];

export const COMPLETED_BUILDS = [
  {
    title: '1440p Ultra Competitive & AAA Rig',
    author: 'Raghav_Coimbatore',
    tag: 'Best Price-to-FPS',
    total: 147799,
    parts: { cpu: 'cpu-18', cooler: 'cool-13', motherboard: 'mb-11', ram: 'ram-3', gpu: 'gpu-14', storage: 'ssd-6', psu: 'psu-7', case: 'case-3' },
    notes: 'AM5 upgradeable platform paired with RTX 4070 SUPER & 32GB DDR5-6000 CL30 hits 102 FPS average in Cyberpunk 2077 at 1440p High.'
  },
  {
    title: '4K Path-Tracing & Blender AI Workstation',
    author: 'TechAudit_Lab',
    tag: 'Flagship S-Tier',
    total: 249999,
    parts: { cpu: 'cpu-5', cooler: 'cool-1', motherboard: 'mb-4', ram: 'ram-3', gpu: 'gpu-4', storage: 'ssd-3', psu: 'psu-4', case: 'case-2' },
    notes: 'Ryzen 7 9800X3D + RTX 4080 SUPER delivers 8,450 Blender samples/min and effortless 4K gaming.'
  },
  {
    title: 'Esports & Student Coding Value Build',
    author: 'SKASC_Builder',
    tag: 'Under ₹68,000',
    total: 67548,
    parts: { cpu: 'cpu-28', cooler: 'cool-15', motherboard: 'mb-42', ram: 'ram-11', gpu: 'gpu-31', storage: 'ssd-12', psu: 'psu-10', case: 'case-10' },
    notes: '310 FPS in Counter-Strike 2 and smooth compilation workflows on a student-friendly budget.'
  }
];