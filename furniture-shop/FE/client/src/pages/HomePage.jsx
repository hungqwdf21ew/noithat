import Header from '../components/Header'
import HeroSection from '../components/HeroSection'
import ServiceBar from '../components/ServiceBar'
import FeaturedCollections from '../components/FeaturedCollections'
import FeatureActions from '../components/FeatureActions'
import InspirationRooms from '../components/InspirationRooms'
import Testimonials from '../components/Testimonials'
import ContactShowroom from '../components/ContactShowroom'
import Footer from '../components/Footer'
import '../index.css'

const HomePage = () => {
  return (
    <div className="lavish-root">
      <Header />

      <main>
        <HeroSection />

        <ServiceBar />

        <section className="collections-section container">
          <div className="collections-header">
            <h2>BỘ SƯU TẬP NỔI BẬT</h2>
            <a className="link-all" href="#">XEM TẤT CẢ BỘ SƯU TẬP →</a>
          </div>
          <FeaturedCollections />
        </section>

        <FeatureActions />

        <section className="inspiration-section container">
          <h2>KHÔNG GIAN TRUYỀN CẢM HỨNG</h2>
          <InspirationRooms />
        </section>

        <Testimonials />

        <ContactShowroom />
      </main>

      <Footer />
    </div>
  )
}

export default HomePage
