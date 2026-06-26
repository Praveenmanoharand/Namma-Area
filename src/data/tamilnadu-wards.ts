// Tamil Nadu → District → Ward data
// Covers all 38 districts with their major municipal/town panchayat wards

export interface WardOption {
  district: string;
  ward: string;
  label: string; // "Ward 1 - Anna Nagar, Chennai"
}

export interface District {
  name: string;
  wards: string[];
}

export const TN_DISTRICTS: District[] = [
  {
    name: 'Chennai',
    wards: [
      'Ward 1 - Harbour', 'Ward 2 - Washermanpet', 'Ward 3 - Royapuram',
      'Ward 4 - Perambur', 'Ward 5 - Kolathur', 'Ward 6 - Villivakkam',
      'Ward 7 - Thiruvottiyur', 'Ward 8 - Madhavaram', 'Ward 9 - Sholinganallur',
      'Ward 10 - Velachery', 'Ward 11 - Alandur', 'Ward 12 - Adyar',
      'Ward 13 - Mylapore', 'Ward 14 - Egmore', 'Ward 15 - Anna Nagar',
      'Ward 16 - Ambattur', 'Ward 17 - Avadi', 'Ward 18 - Mogappair',
      'Ward 19 - Valasaravakkam', 'Ward 20 - Virugambakkam',
      'Ward 21 - Nandanam', 'Ward 22 - T. Nagar', 'Ward 23 - Kodambakkam',
      'Ward 24 - Aminjikarai', 'Ward 25 - Chintadripet', 'Ward 26 - Purasawalkam',
      'Ward 27 - Periamet', 'Ward 28 - Arumbakkam', 'Ward 29 - Ashok Nagar',
      'Ward 30 - Guindy', 'Ward 31 - Ayanavaram', 'Ward 32 - Tondiarpet',
      'Ward 33 - Basin Bridge', 'Ward 34 - Park Town', 'Ward 35 - Nungambakkam',
      'Ward 36 - Teynampet', 'Ward 37 - Saidapet', 'Ward 38 - Mandaveli',
      'Ward 39 - Besant Nagar', 'Ward 40 - Kotturpuram',
    ],
  },
  {
    name: 'Coimbatore',
    wards: [
      'Ward 1 - Ukkadam', 'Ward 2 - Ganapathy', 'Ward 3 - Saibaba Colony',
      'Ward 4 - RS Puram', 'Ward 5 - Ram Nagar', 'Ward 6 - Peelamedu',
      'Ward 7 - Singanallur', 'Ward 8 - Podanur', 'Ward 9 - Hopes College',
      'Ward 10 - Kuniyamuthur', 'Ward 11 - Vadavalli', 'Ward 12 - Thudiyalur',
      'Ward 13 - Sulur', 'Ward 14 - Kovaipudur', 'Ward 15 - Kavundampalayam',
      'Ward 16 - Perur', 'Ward 17 - Kalapatti', 'Ward 18 - Saravanampatti',
      'Ward 19 - Kurichi', 'Ward 20 - Velandipalayam',
      'Ward 21 - Edayarpalayam', 'Ward 22 - Pappanaickenpalayam',
      'Ward 23 - Kovilpalayam', 'Ward 24 - Kinathukadavu',
    ],
  },
  {
    name: 'Madurai',
    wards: [
      'Ward 1 - Goripalayam', 'Ward 2 - KK Nagar', 'Ward 3 - Anaiyur',
      'Ward 4 - Tallakulam', 'Ward 5 - Arappalayam', 'Ward 6 - Palanganatham',
      'Ward 7 - Krishnapuram', 'Ward 8 - Bibikulam', 'Ward 9 - Villapuram',
      'Ward 10 - Thiruppalai', 'Ward 11 - Avaniyapuram', 'Ward 12 - Nagamalai Pudukottai',
      'Ward 13 - Vandiyur', 'Ward 14 - Teppakulam', 'Ward 15 - Anna Nagar',
      'Ward 16 - Jaihindpuram', 'Ward 17 - Othakadai', 'Ward 18 - Madurai East',
      'Ward 19 - Iyer Bungalow', 'Ward 20 - Alwarpuram',
    ],
  },
  {
    name: 'Tiruchirappalli',
    wards: [
      'Ward 1 - Srirangam', 'Ward 2 - Thiruverumbur', 'Ward 3 - Ariyamangalam',
      'Ward 4 - Manachanallur', 'Ward 5 - Golden Rock', 'Ward 6 - Palakkarai',
      'Ward 7 - Woraiyur', 'Ward 8 - Puthur', 'Ward 9 - Kattur',
      'Ward 10 - KK Nagar', 'Ward 11 - Thillai Nagar', 'Ward 12 - Cantonment',
      'Ward 13 - Arulmigu Ramanathaswamy', 'Ward 14 - Ayyampalayam',
      'Ward 15 - Mannarpuram', 'Ward 16 - Kondayampettai',
    ],
  },
  {
    name: 'Salem',
    wards: [
      'Ward 1 - Hasthampatti', 'Ward 2 - Swarnapuri', 'Ward 3 - Suramangalam',
      'Ward 4 - Kondalampatti', 'Ward 5 - Ammapet', 'Ward 6 - Alagapuram',
      'Ward 7 - Gugai', 'Ward 8 - Ayothiyapattinam', 'Ward 9 - Mettur Road',
      'Ward 10 - Cherry Road', 'Ward 11 - Meyyanur', 'Ward 12 - Attur',
      'Ward 13 - Omalur', 'Ward 14 - Sangagiri', 'Ward 15 - Edappadi',
    ],
  },
  {
    name: 'Tirunelveli',
    wards: [
      'Ward 1 - Palayamkottai', 'Ward 2 - Tirunelveli Town', 'Ward 3 - Melapalayam',
      'Ward 4 - Vannarpet', 'Ward 5 - Krishnapuram', 'Ward 6 - Pettai',
      'Ward 7 - Nanguneri', 'Ward 8 - Radhapuram', 'Ward 9 - Alangulam',
      'Ward 10 - Cheranmahadevi', 'Ward 11 - Ambasamudram', 'Ward 12 - Tenkasi',
      'Ward 13 - Shenkottai', 'Ward 14 - Sankarankoil',
    ],
  },
  {
    name: 'Vellore',
    wards: [
      'Ward 1 - Vellore Town', 'Ward 2 - Katpadi', 'Ward 3 - Ranipet',
      'Ward 4 - Arcot', 'Ward 5 - Ambur', 'Ward 6 - Vaniyambadi',
      'Ward 7 - Tirupathur', 'Ward 8 - Jolarpet', 'Ward 9 - Gudiyattam',
      'Ward 10 - Arakkonam', 'Ward 11 - Anaicut', 'Ward 12 - Kaniyambadi',
    ],
  },
  {
    name: 'Erode',
    wards: [
      'Ward 1 - Erode Town', 'Ward 2 - Perundurai', 'Ward 3 - Bhavani',
      'Ward 4 - Gobichettipalayam', 'Ward 5 - Sathyamangalam',
      'Ward 6 - Anthiyur', 'Ward 7 - Bhavanisagar', 'Ward 8 - Modakurichi',
      'Ward 9 - Chithode', 'Ward 10 - Nambiyur', 'Ward 11 - Thindal',
      'Ward 12 - Uthukuli', 'Ward 13 - Kavundapadi',
    ],
  },
  {
    name: 'Tiruppur',
    wards: [
      'Ward 1 - Tiruppur Town', 'Ward 2 - Avinashi', 'Ward 3 - Palladam',
      'Ward 4 - Udumalaipettai', 'Ward 5 - Dharapuram', 'Ward 6 - Kangeyam',
      'Ward 7 - Vellakovil', 'Ward 8 - Mulanur', 'Ward 9 - Kundadam',
      'Ward 10 - Annur', 'Ward 11 - Mangalam', 'Ward 12 - Pongalur',
    ],
  },
  {
    name: 'Kanchipuram',
    wards: [
      'Ward 1 - Kanchipuram Town', 'Ward 2 - Sriperumbudur', 'Ward 3 - Chengalpattu',
      'Ward 4 - Maraimalai Nagar', 'Ward 5 - Uthiramerur', 'Ward 6 - Walajabad',
      'Ward 7 - Kattankulathur', 'Ward 8 - Tambaram', 'Ward 9 - Pallavaram',
      'Ward 10 - Guduvanchery', 'Ward 11 - Urapakkam', 'Ward 12 - Vandalur',
    ],
  },
  {
    name: 'Chengalpattu',
    wards: [
      'Ward 1 - Chengalpattu Town', 'Ward 2 - Mahabalipuram', 'Ward 3 - Tiruporur',
      'Ward 4 - Kelambakkam', 'Ward 5 - Padur', 'Ward 6 - Siruseri',
      'Ward 7 - Perungalathur', 'Ward 8 - Chrompet', 'Ward 9 - Sholinganallur',
      'Ward 10 - Medavakkam', 'Ward 11 - Thirukazhukundram', 'Ward 12 - Lathur',
    ],
  },
  {
    name: 'Ranipet',
    wards: [
      'Ward 1 - Ranipet Town', 'Ward 2 - Walajapet', 'Ward 3 - Arani',
      'Ward 4 - Arcot', 'Ward 5 - Sholinghur', 'Ward 6 - Nemili',
      'Ward 7 - Kaveripakkam',
    ],
  },
  {
    name: 'Tirupattur',
    wards: [
      'Ward 1 - Tirupattur Town', 'Ward 2 - Ambur', 'Ward 3 - Vaniyambadi',
      'Ward 4 - Jolarpet', 'Ward 5 - Natrampalli', 'Ward 6 - Gudiyattam',
    ],
  },
  {
    name: 'Krishnagiri',
    wards: [
      'Ward 1 - Krishnagiri Town', 'Ward 2 - Hosur', 'Ward 3 - Pochampalli',
      'Ward 4 - Bargur', 'Ward 5 - Mathur', 'Ward 6 - Kaveripattinam',
      'Ward 7 - Kelamangalam', 'Ward 8 - Shoolagiri',
    ],
  },
  {
    name: 'Dharmapuri',
    wards: [
      'Ward 1 - Dharmapuri Town', 'Ward 2 - Pappireddipatti', 'Ward 3 - Harur',
      'Ward 4 - Pennagaram', 'Ward 5 - Palacode', 'Ward 6 - Nallampalli',
      'Ward 7 - Bommidi',
    ],
  },
  {
    name: 'Namakkal',
    wards: [
      'Ward 1 - Namakkal Town', 'Ward 2 - Rasipuram', 'Ward 3 - Senthamangalam',
      'Ward 4 - Kolli Hills', 'Ward 5 - Paramathi', 'Ward 6 - Tiruchengode',
      'Ward 7 - Kumarapalayam', 'Ward 8 - Mohanur',
    ],
  },
  {
    name: 'Perambalur',
    wards: [
      'Ward 1 - Perambalur Town', 'Ward 2 - Veppur', 'Ward 3 - Alathur',
      'Ward 4 - Kunnam', 'Ward 5 - Jayankondam',
    ],
  },
  {
    name: 'Ariyalur',
    wards: [
      'Ward 1 - Ariyalur Town', 'Ward 2 - Andimadam', 'Ward 3 - Udayarpalayam',
      'Ward 4 - Sendurai', 'Ward 5 - Jayankondam',
    ],
  },
  {
    name: 'Villupuram',
    wards: [
      'Ward 1 - Villupuram Town', 'Ward 2 - Gingee', 'Ward 3 - Kallakurichi',
      'Ward 4 - Tindivanam', 'Ward 5 - Vikravandi', 'Ward 6 - Ulundurpet',
      'Ward 7 - Vanur', 'Ward 8 - Rishivandiyam',
    ],
  },
  {
    name: 'Kallakurichi',
    wards: [
      'Ward 1 - Kallakurichi Town', 'Ward 2 - Chinnasalem', 'Ward 3 - Sankarapuram',
      'Ward 4 - Ulundurpet', 'Ward 5 - Tirukoilur',
    ],
  },
  {
    name: 'Cuddalore',
    wards: [
      'Ward 1 - Cuddalore Town', 'Ward 2 - Chidambaram', 'Ward 3 - Kattumannarkoil',
      'Ward 4 - Kurinjipadi', 'Ward 5 - Panruti', 'Ward 6 - Neyveli',
      'Ward 7 - Virudhachalam', 'Ward 8 - Bhuvanagiri', 'Ward 9 - Srimushnam',
    ],
  },
  {
    name: 'Nagapattinam',
    wards: [
      'Ward 1 - Nagapattinam Town', 'Ward 2 - Vedaranyam', 'Ward 3 - Sirkali',
      'Ward 4 - Mayiladuthurai', 'Ward 5 - Kilvelur', 'Ward 6 - Tharangambadi',
    ],
  },
  {
    name: 'Mayiladuthurai',
    wards: [
      'Ward 1 - Mayiladuthurai Town', 'Ward 2 - Sirkazhi', 'Ward 3 - Kollidam',
      'Ward 4 - Kuthalam',
    ],
  },
  {
    name: 'Thanjavur',
    wards: [
      'Ward 1 - Thanjavur Town', 'Ward 2 - Kumbakonam', 'Ward 3 - Papanasam',
      'Ward 4 - Pattukottai', 'Ward 5 - Peravurani', 'Ward 6 - Thiruvaiyaru',
      'Ward 7 - Orathanadu', 'Ward 8 - Needamangalam', 'Ward 9 - Budalur',
      'Ward 10 - Ammapet',
    ],
  },
  {
    name: 'Tiruvarur',
    wards: [
      'Ward 1 - Tiruvarur Town', 'Ward 2 - Papanasam', 'Ward 3 - Mannargudi',
      'Ward 4 - Kodavasal', 'Ward 5 - Thiruvarur East',
    ],
  },
  {
    name: 'Pudukkottai',
    wards: [
      'Ward 1 - Pudukkottai Town', 'Ward 2 - Aranthangi', 'Ward 3 - Alangudi',
      'Ward 4 - Karambakudi', 'Ward 5 - Thirumayam', 'Ward 6 - Gandarvakottai',
      'Ward 7 - Kulathur',
    ],
  },
  {
    name: 'Sivaganga',
    wards: [
      'Ward 1 - Sivaganga Town', 'Ward 2 - Karaikudi', 'Ward 3 - Devakottai',
      'Ward 4 - Manamadurai', 'Ward 5 - Tiruppattur', 'Ward 6 - Ilayangudi',
    ],
  },
  {
    name: 'Ramanathapuram',
    wards: [
      'Ward 1 - Ramanathapuram Town', 'Ward 2 - Rameswaram', 'Ward 3 - Paramakudi',
      'Ward 4 - Mudukulathur', 'Ward 5 - Kadaladi',
    ],
  },
  {
    name: 'Thoothukudi',
    wards: [
      'Ward 1 - Thoothukudi Town', 'Ward 2 - Tiruchendur', 'Ward 3 - Kovilpatti',
      'Ward 4 - Ottapidaram', 'Ward 5 - Srivaikundam', 'Ward 6 - Sathankulam',
      'Ward 7 - Ettayapuram',
    ],
  },
  {
    name: 'Tenkasi',
    wards: [
      'Ward 1 - Tenkasi Town', 'Ward 2 - Shenkottai', 'Ward 3 - Sankarankoil',
      'Ward 4 - Courtallam', 'Ward 5 - Kadayanallur', 'Ward 6 - Alangulam',
    ],
  },
  {
    name: 'Virudhunagar',
    wards: [
      'Ward 1 - Virudhunagar Town', 'Ward 2 - Sivakasi', 'Ward 3 - Rajapalayam',
      'Ward 4 - Srivilliputhur', 'Ward 5 - Aruppukottai', 'Ward 6 - Sattur',
      'Ward 7 - Tiruttangal',
    ],
  },
  {
    name: 'Dindigul',
    wards: [
      'Ward 1 - Dindigul Town', 'Ward 2 - Palani', 'Ward 3 - Kodaikanal',
      'Ward 4 - Natham', 'Ward 5 - Nilakottai', 'Ward 6 - Oddanchatram',
      'Ward 7 - Vedasandur', 'Ward 8 - Athoor',
    ],
  },
  {
    name: 'Theni',
    wards: [
      'Ward 1 - Theni Town', 'Ward 2 - Periyakulam', 'Ward 3 - Bodinayakkanur',
      'Ward 4 - Uthamapalayam', 'Ward 5 - Andipatti', 'Ward 6 - Gudalur',
    ],
  },
  {
    name: 'Nilgiris',
    wards: [
      'Ward 1 - Ooty (Udhagamandalam)', 'Ward 2 - Coonoor', 'Ward 3 - Kotagiri',
      'Ward 4 - Gudalur', 'Ward 5 - Pandalur', 'Ward 6 - Wellington',
    ],
  },
  {
    name: 'Tiruppur',
    wards: [
      'Ward 1 - Tiruppur Town', 'Ward 2 - Avinashi', 'Ward 3 - Palladam',
      'Ward 4 - Udumalaipettai', 'Ward 5 - Dharapuram', 'Ward 6 - Kangeyam',
      'Ward 7 - Vellakovil', 'Ward 8 - Mulanur',
    ],
  },
  {
    name: 'Karur',
    wards: [
      'Ward 1 - Karur Town', 'Ward 2 - Aravakurichi', 'Ward 3 - Krishnarayapuram',
      'Ward 4 - Kulithalai', 'Ward 5 - Manmangalam',
    ],
  },
  {
    name: 'Tiruvallur',
    wards: [
      'Ward 1 - Tiruvallur Town', 'Ward 2 - Avadi', 'Ward 3 - Ambattur',
      'Ward 4 - Poonamallee', 'Ward 5 - Thiruvallur', 'Ward 6 - Gummidipoondi',
      'Ward 7 - Uthukottai', 'Ward 8 - Pallipat',
    ],
  },
  {
    name: 'Tiruvannamalai',
    wards: [
      'Ward 1 - Tiruvannamalai Town', 'Ward 2 - Polur', 'Ward 3 - Arni',
      'Ward 4 - Cheyyar', 'Ward 5 - Vandavasi', 'Ward 6 - Chetpet',
      'Ward 7 - Kalasapakkam',
    ],
  },
];

// Deduplicate districts (Tiruppur appears twice in source)
const seen = new Set<string>();
export const TN_DISTRICTS_UNIQUE: District[] = TN_DISTRICTS.filter(d => {
  if (seen.has(d.name)) return false;
  seen.add(d.name);
  return true;
});

/** Build full area string: "Ward 1 - Anna Nagar, Chennai, Tamil Nadu" */
export function buildAreaString(district: string, ward: string): string {
  return `${ward}, ${district}, Tamil Nadu`;
}
