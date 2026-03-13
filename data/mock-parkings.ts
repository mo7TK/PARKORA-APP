export type ParkingStatus = "available" | "low" | "full";

export interface Parking {
  id: string;
  name: string;
  address: string;
  total: number;
  available: number;
  distance: string;
  status: ParkingStatus;
  price: string;
  rating: number;
  isFavorite: boolean;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  lastUpdated: string;
}

export const MOCK_PARKINGS: Parking[] = [
  {
    id: "1",
    name: "Parking 8 Mai ",
    address: "Place du 8 Mai 1945, Sétif",
    total: 120,
    available: 47,
    distance: "0.3 km",
    status: "available",
    price: "20 DA/h",
    rating: 4.7,
    isFavorite: true,
    coordinate: { latitude: 36.746893693140606, longitude: 5.054851197743028 },
    lastUpdated: "Il y a 2 min",
  },
  {
    id: "2",
    name: "Parking Aïn Fouara",
    address: "Rue Aïn Fouara, Centre-ville",
    total: 80,
    available: 5,
    distance: "0.6 km",
    status: "low",
    price: "20 DA/h",
    rating: 4.2,
    isFavorite: false,
    coordinate: { latitude: 36.1895, longitude: 5.4132 },
    lastUpdated: "Il y a 1 min",
  },
  {
    id: "3",
    name: "Parking El Hidhab",
    address: "Boulevard El Hidhab, Sétif",
    total: 200,
    available: 0,
    distance: "1.1 km",
    status: "full",
    price: "10 DA/h",
    rating: 3.9,
    isFavorite: false,
    coordinate: { latitude: 36.1875, longitude: 5.4075 },
    lastUpdated: "Il y a 5 min",
  },
  {
    id: "4",
    name: "Parking Rue de France",
    address: "Rue de France, Sétif",
    total: 60,
    available: 22,
    distance: "1.4 km",
    status: "available",
    price: "20 DA/h",
    rating: 4.5,
    isFavorite: true,
    coordinate: { latitude: 36.192, longitude: 5.4155 },
    lastUpdated: "Il y a 3 min",
  },
  {
    id: "5",
    name: "Parking Marché Central",
    address: "Marché Central, Sétif",
    total: 95,
    available: 11,
    distance: "1.8 km",
    status: "low",
    price: "20 DA/h",
    rating: 4.1,
    isFavorite: false,
    coordinate: { latitude: 36.1932, longitude: 5.409 },
    lastUpdated: "Il y a 4 min",
  },
  {
    id: "6",
    name: "Parking Hôtel de Ville",
    address: "Hôtel de Ville, Centre",
    total: 50,
    available: 18,
    distance: "0.9 km",
    status: "available",
    price: "Gratuit",
    rating: 4.6,
    isFavorite: false,
    coordinate: { latitude: 36.1885, longitude: 5.412 },
    lastUpdated: "Il y a 1 min",
  },
];
