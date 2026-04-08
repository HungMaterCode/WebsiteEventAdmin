'use client';

import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import ArtistSection from '@/components/sections/ArtistSection';
import CinematicExperience from '@/components/sections/CinematicExperience';
import HeritageArtSection from '@/components/sections/HeritageArtSection';
import GallerySection from '@/components/sections/GallerySection';
import TimelineSection from '@/components/sections/TimelineSection';
import SocialFeed from '@/components/sections/SocialFeed';
import ProductSection from '@/components/sections/ProductSection';
import TicketSection from '@/components/sections/TicketSection';
import FAQSection from '@/components/sections/FAQSection';
import TravelStaySection from '@/components/sections/TravelStaySection';
import MapSection from '@/components/sections/MapSection';
import ContactSection from '@/components/sections/ContactSection';
import NewsletterSection from '@/components/sections/NewsletterSection';
import PartnersSection from '@/components/sections/PartnersSection';
import NewsSection from '@/components/sections/NewsSection';
import ScrollProgress, { BackToTop, FloatingDecorations, Preloader } from '@/components/ui/ScrollEffects';
import { VideoModal, ArtistDetailModal, ProductDetailModal } from '@/components/modals/Modals';
import BookingStatusModal from '@/components/modals/BookingStatusModal';
import BookingModal from '@/components/modals/BookingModal';
import MyTicketsModal from '@/components/modals/MyTicketsModal';

const defaultArtists = [
  { id: 1, name: "Hồ Ngọc Hà", genre: "Pop / Dance", image: "https://picsum.photos/seed/hongocha/600/800", performanceTime: "22:30 - 23:15" },
  { id: 2, name: "Tùng Dương", genre: "Contemporary Folk", image: "https://picsum.photos/seed/tungduong/600/800", performanceTime: "21:00 - 21:45" },
  { id: 3, name: "Hoàng Thùy Linh", genre: "Folktronica", image: "https://picsum.photos/seed/hoangthuylinh/600/800", performanceTime: "20:15 - 21:00" },
  { id: 4, name: "Double2T", genre: "Rap / Hip Hop", image: "https://picsum.photos/seed/double2t/600/800", performanceTime: "23:15 - 00:00" },
];

const defaultFaqs = [
  { id: 1, question: "Sự kiện diễn ra ở đâu và khi nào?", answer: "Sự kiện diễn ra tại Thung Nham, Ninh Bình vào đêm 31/12/2024, từ 20:00 đến 00:30 sáng hôm sau." },
  { id: 2, question: "Làm thế nào để nhận vé sau khi thanh toán?", answer: "Sau khi thanh toán thành công, vé điện tử (E-ticket) sẽ được gửi trực tiếp đến email của bạn." },
  { id: 3, question: "Vé VIP có những quyền lợi gì đặc biệt?", answer: "Vé VIP bao gồm vị trí sát sân khấu, lối đi riêng, set sản phẩm độc quyền và quyền truy cập khu vực F&B cao cấp." },
  { id: 4, question: "Tôi có thể hoàn vé hoặc đổi vé không?", answer: "Theo quy định, vé đã mua không được hoàn trả. Tuy nhiên, bạn có thể chuyển nhượng vé cho người khác thông qua mã QR." },
  { id: 5, question: "Trẻ em có được tham gia sự kiện không?", answer: "Sự kiện dành cho khán giả từ 12 tuổi trở lên. Trẻ em dưới 12 tuổi cần có người giám hộ đi cùng." },
];

export default function HomePage() {
  const { data: session } = useSession();
  const [bookingState, setBookingState] = React.useState<{isOpen: boolean, type: 'GA' | 'VIP' | null}>({ isOpen: false, type: null });
  const [isLoginModalOpen, setIsLoginModalOpen] = React.useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = React.useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = React.useState(false);
  const [isMyTicketsOpen, setIsMyTicketsOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const [selectedArtist, setSelectedArtist] = React.useState<any>(null);

  const [artists, setArtists] = React.useState<any[]>(defaultArtists);
  const [products, setProducts] = React.useState<any[]>([]);
  const [faqs, setFaqs] = React.useState<any[]>(defaultFaqs);
  const [posts, setPosts] = React.useState<any[]>([]);

  React.useEffect(() => {
    // Fetch from API (with fallback to defaults)
    fetch('/api/artists').then(r => r.ok ? r.json() : []).then(data => { if (data.length > 0) setArtists(data); }).catch(() => {});
    fetch('/api/products').then(r => r.ok ? r.json() : []).then(data => { if (data.length > 0) setProducts(data); }).catch(() => {});
    fetch('/api/faqs').then(r => r.ok ? r.json() : []).then(data => { if (data.length > 0) setFaqs(data); }).catch(() => {});
    fetch('/api/posts').then(r => r.ok ? r.json() : []).then(data => { 
      if (Array.isArray(data)) {
        const published = data.filter((p: any) => p.published).slice(0, 3);
        setPosts(published);
      }
    }).catch(() => {});
  }, []);

  const openBooking = (type: 'GA' | 'VIP' | null) => {
    if (!session) {
      setIsLoginModalOpen(true);
      return;
    }
    setBookingState({ isOpen: true, type });
  };
  const closeBooking = () => setBookingState({ ...bookingState, isOpen: false });

  return (
    <div className="min-h-screen bg-midnight text-silver font-sans selection:bg-magenta selection:text-white">
      <Preloader />
      <ScrollProgress />
      <BackToTop />
      <FloatingDecorations />
      <Navbar 
        onOpenBooking={openBooking} 
        onOpenStatus={() => setIsStatusModalOpen(true)} 
        onOpenMyTickets={() => setIsMyTicketsOpen(true)}
        isLoginModalOpen={isLoginModalOpen} 
        setIsLoginModalOpen={setIsLoginModalOpen} 
      />

      <main className="relative z-10">
        <HeroSection onOpenBooking={openBooking} />
        <ArtistSection artists={artists} onOpenArtist={(a) => setSelectedArtist(a)} />
        <CinematicExperience onOpenVideo={() => setIsVideoModalOpen(true)} />
        <HeritageArtSection />
        <GallerySection />
        <TimelineSection />
        <SocialFeed />
        <NewsSection posts={posts} />
        <ProductSection products={products} onOpenProduct={(p) => setSelectedProduct(p)} />
        <TicketSection onOpenBooking={openBooking} />
        <FAQSection faqs={faqs} />
        <TravelStaySection />
        <MapSection />
        <ContactSection />
        <NewsletterSection />
        <PartnersSection />
      </main>

      <Footer />

      <AnimatePresence>
        <BookingModal key="booking-modal" isOpen={bookingState.isOpen} onClose={closeBooking} selectedType={bookingState.type} />
        <BookingStatusModal key="status-modal" isOpen={isStatusModalOpen} onClose={() => setIsStatusModalOpen(false)} />
        <MyTicketsModal key="my-tickets-modal" isOpen={isMyTicketsOpen} onClose={() => setIsMyTicketsOpen(false)} />
        <VideoModal key="video-modal" isOpen={isVideoModalOpen} onClose={() => setIsVideoModalOpen(false)} />
        <ProductDetailModal key="product-modal" isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} product={selectedProduct} />
        <ArtistDetailModal key="artist-modal" isOpen={!!selectedArtist} onClose={() => setSelectedArtist(null)} artist={selectedArtist} />
      </AnimatePresence>
    </div>
  );
}
