
import { Category, Worker, Job, Notification, Message } from './types';

export const CATEGORIES: Category[] = [
  // Column 1
  { id: 'contractor', name: 'Contractor', icon: 'contractor', color: 'bg-sky-50 text-sky-600', column: 1 },
  { id: 'air-conditioning', name: 'Air conditioning', icon: 'airconditioning', color: 'bg-sky-50 text-sky-600', column: 1 },
  { id: 'alarm-systems', name: 'Alarm systems', icon: 'alarmsystems', color: 'bg-sky-50 text-sky-600', column: 1 },
  { id: 'architect', name: 'Architect', icon: 'architect', color: 'bg-sky-50 text-sky-600', column: 1 },
  { id: 'asbestos', name: 'Asbestos', icon: 'asbestos', color: 'bg-sky-50 text-sky-600', column: 1 },
  { id: 'pavement', name: 'Pavement', icon: 'pavement', color: 'bg-sky-50 text-sky-600', column: 1 },
  { id: 'central-heating-boilers', name: 'Central heating boilers', icon: 'centralheatingboilers', color: 'bg-sky-50 text-sky-600', column: 1 },

  // Column 2
  { id: 'roofing', name: 'Roofing', icon: 'roofing', color: 'bg-sky-50 text-sky-600', column: 2 },
  { id: 'electrician', name: 'Electrician', icon: 'electrician', color: 'bg-yellow-50 text-yellow-600', column: 2 },
  { id: 'facade-works', name: 'Facade works', icon: 'facadeworks', color: 'bg-sky-50 text-sky-600', column: 2 },
  { id: 'glass', name: 'Glass', icon: 'glass', color: 'bg-sky-50 text-sky-600', column: 2 },
  { id: 'fencing', name: 'Fencing', icon: 'fencing', color: 'bg-sky-50 text-sky-600', column: 2 },
  { id: 'gardener', name: 'Gardener', icon: 'gardener', color: 'bg-green-50 text-green-600', column: 2 },
  { id: 'insulation', name: 'Insulation', icon: 'insulation', color: 'bg-sky-50 text-sky-600', column: 2 },

  // Column 3
  { id: 'plumber', name: 'Plumber', icon: 'plumber', color: 'bg-sky-50 text-sky-600', column: 3 },
  { id: 'mason', name: 'Mason', icon: 'mason', color: 'bg-sky-50 text-sky-600', column: 3 },
  { id: 'windows', name: 'Windows', icon: 'windows', color: 'bg-sky-50 text-sky-600', column: 3 },
  { id: 'roller-shutters', name: 'Roller shutters', icon: 'rollershutters', color: 'bg-sky-50 text-sky-600', column: 3 },
  { id: 'painter', name: 'Painter', icon: 'painter', color: 'bg-rose-50 text-rose-600', column: 3 },
  { id: 'joiner', name: 'Joiner', icon: 'joiner', color: 'bg-sky-50 text-sky-600', column: 3 },
  { id: 'plasterer', name: 'Plasterer', icon: 'plasterer', color: 'bg-sky-50 text-sky-600', column: 3 },

  // Column 4
  { id: 'tiler', name: 'Tiler', icon: 'tiler', color: 'bg-sky-50 text-sky-600', column: 4 },
  { id: 'floors', name: 'Floors', icon: 'floors', color: 'bg-sky-50 text-sky-600', column: 4 },
  { id: 'moisture-control', name: 'Moisture control', icon: 'moisturecontrol', color: 'bg-sky-50 text-sky-600', column: 4 },
  { id: 'heat-pump', name: 'Heat pump', icon: 'heatpump', color: 'bg-sky-50 text-sky-600', column: 4 },
  { id: 'solar-panels', name: 'Solar panels', icon: 'solarpanels', color: 'bg-amber-50 text-amber-600', column: 4 },
  { id: 'sun-protection', name: 'Sun protection', icon: 'sunprotection', color: 'bg-sky-50 text-sky-600', column: 4 },

  // General service categories for form selection & broad filtering
  { id: 'cat-plumbing', name: 'Plumbing', icon: 'plumbing', color: 'bg-sky-50 text-sky-600' },
  { id: 'cat-electrical', name: 'Electrical', icon: 'electrical', color: 'bg-yellow-50 text-yellow-600' },
  { id: 'cat-construction', name: 'Construction', icon: 'construction', color: 'bg-orange-50 text-orange-600' },
  { id: 'cat-design', name: 'Design', icon: 'design', color: 'bg-purple-50 text-purple-600' },
  { id: 'cat-cleaning', name: 'Cleaning', icon: 'cleaning', color: 'bg-emerald-50 text-emerald-600' },
  { id: 'cat-beauty', name: 'Beauty', icon: 'beauty', color: 'bg-pink-50 text-pink-600' },
  { id: 'cat-painting', name: 'Painting', icon: 'painting', color: 'bg-rose-50 text-rose-600' },
  { id: 'cat-gardening', name: 'Gardening', icon: 'gardening', color: 'bg-green-50 text-green-600' },
  { id: 'cat-tech', name: 'Tech & IT', icon: 'tech', color: 'bg-indigo-50 text-indigo-600' },
];

export const MOCK_WORKERS: Worker[] = [
  {
    id: 'w1',
    name: 'Ahmed Khan',
    email: 'ahmed.khan@example.com',
    password: 'password123',
    isEmailVerified: true,
    rating: 4.8,
    reviews: 124,
    completedProjects: 110,
    isVerified: true,
    isAvailable: true,
    distance: '1.2 km',
    location: { lat: 34.1688, lng: 73.2215 }, // Abbottabad
    formattedAddress: 'Mandian, Abbottabad',
    preferredRadius: 15,
    specialties: ['Plumbing'],
    avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=600&q=80',
    hourlyRate: 35,
    bio: "Certified Master Plumber with 8+ years of residential & commercial service experience. Expert in pipe fitting, emergency leak repair, boiler maintenance, and fixture installations.",
    skills: ['Pipe Fitting', 'Leak Repair', 'Installation', 'Water Heaters'],
    portfolio: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'w2',
    name: 'Zeeshan Ali',
    email: 'zeeshan.ali@example.com',
    password: 'password123',
    isEmailVerified: true,
    rating: 4.7,
    reviews: 98,
    completedProjects: 85,
    isVerified: true,
    isAvailable: true,
    distance: '2.5 km',
    location: { lat: 34.1528, lng: 73.214 }, // Abbottabad
    formattedAddress: 'Supply Bazaar, Abbottabad',
    preferredRadius: 25,
    specialties: ['Construction'],
    avatar: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
    hourlyRate: 40,
    bio: "Civil contractor and renovation specialist with 10+ years experience leading residential remodels, structural concrete works, and flooring projects.",
    skills: ['Construction', 'Renovation', 'Flooring', 'Masonry'],
    portfolio: [
      'https://images.unsplash.com/photo-1503387762-592dec5832f2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'w3',
    name: 'Bilal Ahmad',
    email: 'bilal.ahmad@example.com',
    password: 'password123',
    isEmailVerified: true,
    rating: 4.9,
    reviews: 76,
    completedProjects: 92,
    isVerified: true,
    isAvailable: true,
    distance: '3.1 km',
    location: { lat: 34.148, lng: 73.23 }, // Abbottabad
    formattedAddress: 'Jinnahabad, Abbottabad',
    preferredRadius: 30,
    specialties: ['Design'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    hourlyRate: 55,
    bio: "Senior brand identity and product designer. Creating impactful logos, commercial print collateral, and interactive user experiences for top brands.",
    skills: ['Graphic Design', 'Logo', 'UI/UX', 'Print Design'],
    portfolio: [
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'w4',
    name: 'Sana Iqbal',
    email: 'sana.iqbal@example.com',
    password: 'password123',
    isEmailVerified: true,
    rating: 4.6,
    reviews: 62,
    completedProjects: 140,
    isVerified: true,
    isAvailable: true,
    distance: '1.8 km',
    location: { lat: 34.161, lng: 73.218 }, // Abbottabad
    formattedAddress: 'Kakul Road, Abbottabad',
    preferredRadius: 10,
    specialties: ['Cleaning'],
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    hourlyRate: 30,
    bio: "Professional eco-friendly home & office cleaning service. Thorough deep cleans, post-renovation sanitation, and reliable recurring visits.",
    skills: ['Home Cleaning', 'Office Cleaning', 'Deep Sanitization'],
    portfolio: [
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'w5',
    name: 'Usman Raza',
    email: 'usman.raza@example.com',
    password: 'password123',
    isEmailVerified: true,
    rating: 4.8,
    reviews: 91,
    completedProjects: 115,
    isVerified: true,
    isAvailable: true,
    distance: '2.3 km',
    location: { lat: 34.175, lng: 73.229 }, // Abbottabad
    formattedAddress: 'Pine View, Abbottabad',
    preferredRadius: 20,
    specialties: ['Tech & IT'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    hourlyRate: 48,
    bio: "Systems and network engineer. On-site computer repair, high-speed WiFi installation, CCTV security, server maintenance, and IT support.",
    skills: ['Computer Repair', 'Networking', 'Support', 'CCTV Setup'],
    portfolio: [
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'w6',
    name: 'Aisha Malik',
    email: 'aisha.malik@example.com',
    password: 'password123',
    isEmailVerified: true,
    rating: 4.9,
    reviews: 84,
    completedProjects: 78,
    isVerified: true,
    isAvailable: true,
    distance: '1.5 km',
    location: { lat: 34.162, lng: 73.224 },
    formattedAddress: 'Murree Road, Abbottabad',
    preferredRadius: 15,
    specialties: ['Beauty'],
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    hourlyRate: 42,
    bio: "Certified beauty stylist and esthetician providing in-home bridal makeup, professional hair treatments, and organic skincare services.",
    skills: ['Bridal Makeup', 'Hairstyling', 'Skin Care', 'Manicure'],
    portfolio: [
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'w7',
    name: 'Tariq Mehmood',
    email: 'tariq.m@example.com',
    password: 'password123',
    isEmailVerified: true,
    rating: 4.8,
    reviews: 110,
    completedProjects: 130,
    isVerified: true,
    isAvailable: true,
    distance: '2.0 km',
    location: { lat: 34.155, lng: 73.218 },
    formattedAddress: 'City Center, Abbottabad',
    preferredRadius: 20,
    specialties: ['Electrical'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    hourlyRate: 38,
    bio: "Licensed electrician with expertise in complete house wiring, solar hybrid inverter connections, short circuit diagnosis, and panel upgrades.",
    skills: ['Wiring', 'Circuit Breakers', 'Solar Inverter', 'Smart Lighting'],
    portfolio: [
      'https://images.unsplash.com/photo-1621905252507-b35242f8df49?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'w8',
    name: 'Farhan Zaidi',
    email: 'farhan.z@example.com',
    password: 'password123',
    isEmailVerified: true,
    rating: 4.7,
    reviews: 54,
    completedProjects: 65,
    isVerified: true,
    isAvailable: true,
    distance: '2.8 km',
    location: { lat: 34.17, lng: 73.21 },
    formattedAddress: 'College Road, Abbottabad',
    preferredRadius: 18,
    specialties: ['Painting'],
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
    hourlyRate: 32,
    bio: "Decorative and protective wall painting specialist. Smooth plaster finish, damp sealing, exterior weather-resistant coatings, and interior accents.",
    skills: ['Wall Painting', 'Waterproofing', 'Texture Finish', 'Wood Polish'],
    portfolio: [
      'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'w9',
    name: 'Sarah Miller',
    email: 'sarah.m@example.com',
    password: 'password123',
    isEmailVerified: true,
    rating: 4.9,
    reviews: 79,
    completedProjects: 88,
    isVerified: true,
    isAvailable: true,
    distance: '1.4 km',
    location: { lat: 34.164, lng: 73.22 },
    formattedAddress: 'Kakul Road, Abbottabad',
    preferredRadius: 15,
    specialties: ['Design', 'Interior'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    hourlyRate: 52,
    bio: "Interior designer and home staging consultant. Space optimization, modern lighting themes, 3D renderings, and personalized material sourcing.",
    skills: ['Interior Design', '3D Modeling', 'Staging', 'Color Consulting'],
    portfolio: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'w10',
    name: 'Kamran Baig',
    email: 'kamran.b@example.com',
    password: 'password123',
    isEmailVerified: true,
    rating: 4.8,
    reviews: 104,
    completedProjects: 112,
    isVerified: true,
    isAvailable: true,
    distance: '3.0 km',
    location: { lat: 34.158, lng: 73.235 },
    formattedAddress: 'Supply Bazaar, Abbottabad',
    preferredRadius: 20,
    specialties: ['Contractor', 'Roofing'],
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    hourlyRate: 45,
    bio: "General contractor and structural roofing expert with 12+ years experience in roof trusses, leak prevention, tiles, and gutters.",
    skills: ['Roofing', 'Structural Framing', 'Gutter Repair', 'Waterproofing'],
    portfolio: [
      'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'w11',
    name: 'Daniyal Shah',
    email: 'daniyal.s@example.com',
    password: 'password123',
    isEmailVerified: true,
    rating: 4.7,
    reviews: 48,
    completedProjects: 56,
    isVerified: true,
    isAvailable: true,
    distance: '1.9 km',
    location: { lat: 34.167, lng: 73.228 },
    formattedAddress: 'Mandian, Abbottabad',
    preferredRadius: 15,
    specialties: ['Tech & IT', 'Security'],
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80',
    hourlyRate: 46,
    bio: "Smart home automation specialist, CCTV security cameras, high-speed mesh networks, and IoT device integration.",
    skills: ['Smart Home', 'CCTV Cameras', 'Mesh WiFi', 'Home Audio'],
    portfolio: [
      'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80'
    ]
  }
];

export const MOCK_NEARBY_JOBS: Job[] = [
  { id: 'nj1', title: 'Mount 65" TV on Wall', category: 'Electrician', status: 'ACTIVE', date: '2h ago', budget: 85, distance: '0.5 km', location: { lat: 37.785, lng: -122.406 }, description: 'Need someone to mount a large TV on a drywall. I have the bracket ready.' },
  { id: 'nj2', title: 'Garden Trimming & Weeding', category: 'Gardening', status: 'PENDING', date: '4h ago', budget: 120, distance: '1.8 km', location: { lat: 37.772, lng: -122.425 }, description: 'Backyard needs some love. Trimming hedges and clearing weeds from flower beds.' },
  { id: 'nj3', title: 'Install Kitchen Faucet', category: 'Plumber', status: 'COMPLETED', date: 'Yesterday', budget: 150, distance: '2.4 km', location: { lat: 37.795, lng: -122.394 }, description: 'Old faucet is leaking. Have a new Moen faucet to install.' },
  { id: 'nj4', title: 'Fix Living Room Light', category: 'Electrician', status: 'PENDING', date: '1h ago', budget: 45, distance: '1.2 km', location: { lat: 37.780, lng: -122.410 }, description: 'Dimmer switch stopped working. Need it replaced.' },
  { id: 'nj5', title: 'Deep Clean Apartment', category: 'Cleaning', status: 'COMPLETED', date: '2 days ago', budget: 200, distance: '3.1 km', location: { lat: 37.760, lng: -122.430 }, description: 'Move-out cleaning for a 2-bedroom apartment.' },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'JOB_ALERT', title: 'New Job Nearby', message: 'A new Electrician job was posted 0.5km away from you.', timestamp: '2 mins ago', read: false },
  { id: 'n2', type: 'BID_RECEIVED', title: 'New Bid Received', message: 'You received a $40 offer for your "Leaking Sink" job.', timestamp: '1 hour ago', read: false },
  { id: 'n3', type: 'SYSTEM', title: 'Account Verified', message: 'Your worker profile has been verified successfully!', timestamp: '1 day ago', read: true },
];

export const MOCK_CHAT: Message[] = [
  { id: 'm1', senderId: 'u1', text: 'Hi Sarah, are you available tomorrow morning?', timestamp: '10:00 AM', isMe: false },
  { id: 'm2', senderId: 'me', text: 'Hello! Yes, I can be there at 9 AM. Does that work?', timestamp: '10:05 AM', isMe: true },
  { id: 'm3', senderId: 'u1', text: 'Perfect. See you then!', timestamp: '10:06 AM', isMe: false },
];
