import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'ga_rooms'

const SEED_ROOMS = [
  {
    id: 1,
    name: 'The Ocean Suite',
    type: 'Suite',
    status: 'Available',
    shortDescription: 'Uninterrupted ocean panoramas with a private terrace and plunge pool.',
    description: 'The Ocean Suite is the crown jewel of the Azure wing. Spanning 95 square metres on the eighth floor, it offers uninterrupted views of the horizon from every room. The terrace, lined with sun loungers and a heated plunge pool, becomes a private world suspended between sky and sea. Interiors are rendered in warm ivory and driftwood tones, with hand-thrown ceramics and linen bedding that invites you to linger long past dawn. A dedicated butler is on call throughout your stay.',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&auto=format&fit=crop'
    ],
    pricePerNight: 850,
    maxGuests: 2,
    sizeSqm: 95,
    floor: 8,
    view: 'Ocean',
    features: ['Ocean View', 'Private Terrace', 'Plunge Pool'],
    amenities: ['King Bed', 'Private Plunge Pool', 'Ocean-facing Terrace', 'Butler Service', 'In-room Spa Treatment', 'Complimentary Minibar', 'Nespresso Machine', '75" Smart TV', 'Rainfall Shower', 'Freestanding Soaking Tub', 'Heated Floors', 'Double Vanity'],
    likes: 47,
    likedBy: []
  },
  {
    id: 2,
    name: 'Mountain Retreat',
    type: 'Suite',
    status: 'Available',
    shortDescription: 'Nestled against the alpine ridge, a serene retreat wrapped in natural timber and wool.',
    description: 'The Mountain Retreat occupies a private corner of the estate\'s upper wing, looking directly toward the highest peaks of the range. The interiors draw from the landscape itself: raw timber, hand-woven textiles, burnished copper, and the scent of cedar. A wood-burning fireplace anchors the living space. Floor-to-ceiling windows frame the mountains like living paintings. In winter, the suite becomes a sanctuary of firelight and snowfall. In summer, the private balcony opens onto still, cool air and the sound of distant streams.',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&auto=format&fit=crop'
    ],
    pricePerNight: 720,
    maxGuests: 2,
    sizeSqm: 88,
    floor: 6,
    view: 'Mountain',
    features: ['Mountain View', 'Fireplace', 'Private Balcony'],
    amenities: ['King Bed', 'Wood-burning Fireplace', 'Private Balcony', 'Butler Service', 'Nespresso Machine', 'Complimentary Minibar', '65" Smart TV', 'Rainfall Shower', 'Soaking Tub', 'Heated Floors', 'In-room Yoga Mat & Blocks', 'Curated Book Collection'],
    likes: 38,
    likedBy: []
  },
  {
    id: 3,
    name: 'Azure Penthouse',
    type: 'Penthouse',
    status: 'Available',
    shortDescription: 'The entire top floor — panoramic 270° views, private rooftop terrace, and a dedicated chef.',
    description: 'The Azure Penthouse is an experience unlike any other in our collection. Occupying the entire top floor, it commands 270-degree panoramic views stretching from the mountain range to the open sea. The 180-square-metre living space moves between indoor luxury and outdoor grandeur via walls of sliding glass. The private rooftop terrace features a heated infinity pool, outdoor kitchen, and dining area for eight. A dedicated in-suite chef prepares all meals from a private kitchen. For guests seeking absolute privacy and the finest expression of Grand Azure hospitality, the Penthouse has no equal.',
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop'
    ],
    pricePerNight: 1500,
    maxGuests: 4,
    sizeSqm: 180,
    floor: 12,
    view: 'Panoramic',
    features: ['Panoramic View', 'Rooftop Terrace', 'Private Pool'],
    amenities: ['2 King Bedrooms', 'Private Rooftop Terrace', 'Heated Infinity Pool', 'Dedicated In-Suite Chef', 'Butler Service', 'Private Dining for 8', 'Home Cinema System', 'Steinway Grand Piano', 'Full Spa Bathroom', 'Steam Room', 'Private Gym Equipment', 'Complimentary Premium Bar'],
    likes: 91,
    likedBy: []
  },
  {
    id: 4,
    name: 'Garden Villa',
    type: 'Villa',
    status: 'Available',
    shortDescription: 'A freestanding villa opening directly onto the estate gardens, with a private courtyard.',
    description: 'The Garden Villa is a world of its own. Set apart from the main building, this freestanding 120-square-metre villa opens directly onto the estate\'s curated gardens through a sequence of arched doors. A private stone courtyard — planted with jasmine, lavender, and old roses — creates an enclosed sanctuary that smells of another era. Interiors combine antique furniture with modern comforts: a canopied four-poster bed, a deep copper bathtub, and a sunken living space with full library shelves. The villa is especially favoured by guests seeking genuine solitude and the pleasure of private outdoor living.',
    image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop'
    ],
    pricePerNight: 980,
    maxGuests: 3,
    sizeSqm: 120,
    floor: 1,
    view: 'Garden',
    features: ['Garden View', 'Private Courtyard', 'Four-Poster Bed'],
    amenities: ['Canopied Four-Poster King Bed', 'Private Stone Courtyard', 'Copper Soaking Tub', 'Butler Service', 'Fireplace', 'Private Library', 'Nespresso Machine', 'Complimentary Minibar', '60" Smart TV', 'Outdoor Shower', 'Rain Shower', 'Curated Fragrance Collection'],
    likes: 55,
    likedBy: []
  },
  {
    id: 5,
    name: 'Coastal Studio',
    type: 'Studio',
    status: 'Available',
    shortDescription: 'A refined studio for the solo traveller or couple — understated, complete, and ocean-facing.',
    description: 'The Coastal Studio distils the Grand Azure ethos to its most essential form. At 55 square metres, it is deliberately intimate — every element chosen for its quality rather than its scale. The king bed faces a full-width window framing the coastline; mornings here are a private performance of light, sea, and sky. The bathroom is finished in pale marble with a walk-in rainfall shower. For guests who believe that a room should feel like a well-composed essay — not a word wasted — the Coastal Studio offers everything necessary and nothing superfluous.',
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&auto=format&fit=crop'
    ],
    pricePerNight: 450,
    maxGuests: 2,
    sizeSqm: 55,
    floor: 3,
    view: 'Ocean',
    features: ['Ocean View', 'Marble Bathroom', 'Rainfall Shower'],
    amenities: ['King Bed', 'Ocean-facing Window Wall', 'Walk-in Rainfall Shower', 'Marble Bathroom', 'Nespresso Machine', 'Minibar', '55" Smart TV', 'Curated Artwork', 'Heated Floors', 'Premium Linens', 'Complimentary Toiletries'],
    likes: 29,
    likedBy: []
  },
  {
    id: 6,
    name: 'Grand Presidential Suite',
    type: 'Presidential',
    status: 'Available',
    shortDescription: 'Our most prestigious address — a 250sqm suite with full estate views and a private staff team.',
    description: 'The Grand Presidential Suite represents the pinnacle of what Grand Azure offers. At 250 square metres across two floors, it is less a room than a private residence. Three bedrooms, a formal dining room, a study, two full bathrooms, and a private spa treatment room are arranged around a sweeping central salon. The wraparound terrace surveys the entire estate — mountains, gardens, and sea in a single unbroken panorama. A private staff team of four — butler, chef, driver, and wellness attendant — is assigned exclusively to Presidential Suite guests for the duration of their stay.',
    image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop'
    ],
    pricePerNight: 2200,
    maxGuests: 6,
    sizeSqm: 250,
    floor: 11,
    view: 'Panoramic',
    features: ['Full Estate View', 'Private Staff Team', 'Private Spa'],
    amenities: ['3 King Bedrooms', 'Formal Dining Room', 'Private Study', 'In-Suite Spa Treatment Room', 'Wraparound Terrace', 'Private Chef', 'Butler Service', 'Private Driver', 'Wellness Attendant', 'Home Cinema', 'Grand Piano', 'Wine Cellar Access'],
    likes: 73,
    likedBy: []
  },
  {
    id: 7,
    name: 'Forest Hideaway',
    type: 'Cottage',
    status: 'Available',
    shortDescription: 'Tucked into the woodland edge of the estate — a private cottage for total disconnection.',
    description: 'The Forest Hideaway is our most secluded offering: a standalone cottage set at the wooded edge of the Grand Azure estate, a five-minute walk from the main building along a lantern-lit path. At 75 square metres, it is deliberately compact — a nest rather than a suite. The living space is wrapped in warm timber, natural stone, and textiles in the colours of moss and bark. A wood-fired hot tub sits in a private clearing behind the cottage, open to the sky and the tree canopy. No neighbours. No foot traffic. Just the sound of the forest, the light through the trees, and the knowledge that everything you need is within reach.',
    image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&auto=format&fit=crop'
    ],
    pricePerNight: 680,
    maxGuests: 2,
    sizeSqm: 75,
    floor: 1,
    view: 'Forest',
    features: ['Forest View', 'Wood-fired Hot Tub', 'Private Clearing'],
    amenities: ['King Bed', 'Wood-fired Outdoor Hot Tub', 'Fireplace', 'Private Forest Clearing', 'Kitchenette', 'Butler on-call', 'Nespresso Machine', 'Record Player & Vinyl Collection', 'Complimentary Minibar', 'Heated Floors', 'Rainfall Shower', 'Complimentary Forest Hamper'],
    likes: 62,
    likedBy: []
  },
  {
    id: 8,
    name: 'The Observatory',
    type: 'Suite',
    status: 'Available',
    shortDescription: 'A suite built around a professional-grade telescope and the darkest skies in the region.',
    description: 'The Observatory is unique in our collection — and perhaps in the world of luxury hospitality. Built around a professional-grade Schmidt-Cassegrain telescope mounted on the private terrace, it was designed for guests who wish to experience the night sky in its full, unfiltered magnificence. The estate sits within a UNESCO Dark Sky Reserve, and the Observatory terrace offers zero light pollution across a 180-degree arc of the horizon. Each evening, our resident astronomer visits to guide guests through the visible celestial objects. The suite itself — 110 square metres of deep blues, brushed steel, and hand-painted star maps — is as beautiful in daylight as it is beneath the stars.',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1436891678271-9c672565d8f6?w=800&auto=format&fit=crop'
    ],
    pricePerNight: 1100,
    maxGuests: 2,
    sizeSqm: 110,
    floor: 9,
    view: 'Panoramic',
    features: ['Dark Sky Reserve', 'Professional Telescope', 'Resident Astronomer'],
    amenities: ['King Bed', 'Professional Telescope', 'Resident Astronomer Sessions', 'Retractable Glass Ceiling', 'Wraparound Terrace', 'Butler Service', 'Nespresso Machine', 'Astronomy Library', 'Complimentary Minibar', '70" Smart TV', 'Rain Shower', 'Heated Floors'],
    likes: 84,
    likedBy: []
  }
]

function loadRooms() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : null
  } catch { return null }
}

function saveRooms(rooms) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms))
}

export const useRoomsStore = defineStore('rooms', () => {
  const saved = loadRooms()
  const rooms = ref(saved || JSON.parse(JSON.stringify(SEED_ROOMS)))

  if (!saved) saveRooms(rooms.value)

  function toggleLike(roomId, userId) {
    const room = rooms.value.find(r => r.id === roomId)
    if (!room || !userId) return
    const idx = room.likedBy.indexOf(userId)
    if (idx === -1) {
      room.likedBy.push(userId)
      room.likes++
    } else {
      room.likedBy.splice(idx, 1)
      room.likes--
    }
    saveRooms(rooms.value)
  }

  function isLikedBy(roomId, userId) {
    const room = rooms.value.find(r => r.id === roomId)
    return room ? room.likedBy.includes(userId) : false
  }

  function getRoom(id) {
    return rooms.value.find(r => r.id === Number(id))
  }

  function createRoom(data) {
    const newRoom = {
      ...data,
      id: Date.now(),
      likes: 0,
      likedBy: [],
      gallery: data.gallery || [],
      amenities: data.amenities || [],
      features: data.features || []
    }
    rooms.value.push(newRoom)
    saveRooms(rooms.value)
    return newRoom
  }

  function updateRoom(id, data) {
    const idx = rooms.value.findIndex(r => r.id === Number(id))
    if (idx === -1) return false
    rooms.value[idx] = { ...rooms.value[idx], ...data }
    saveRooms(rooms.value)
    return true
  }

  function deleteRoom(id) {
    const idx = rooms.value.findIndex(r => r.id === Number(id))
    if (idx === -1) return false
    rooms.value.splice(idx, 1)
    saveRooms(rooms.value)
    return true
  }

  return { rooms, getRoom, toggleLike, isLikedBy, createRoom, updateRoom, deleteRoom }
})
