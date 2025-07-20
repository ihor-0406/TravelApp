import React, {useEffect} from 'react'
import '../styles/Home.css' 
import NavBar from '../components/NavBar'
import image1 from '../image/1.jpg';
import image2  from '../image/2.jpg';
import image3 from '../image/image3.jpg';
import { Link } from 'react-router-dom';
import ToursCarousel from '../components/ToursCarousel';
import TourTypes from '../components/ToursTypes';
import ReviewsCarousel from '../components/ReviewCarousel';
import BlogCards from '../components/BlogCarts';
import Footer from '../components/Footer';



const Home = () => {

  useEffect(() => {
        document.title = 'Home | Travellins';
    }, []);

  return (
    <>
    <header className='icelandBackgraund'>
      <NavBar/>

      <div className=' d-flex justify-content-center align-items-center flex-column '>
        <div className='textFollow '>
        <p className='inter-small '>Follow the - We`ll take care of the details</p>
      </div>
      <div className='btn-exploreTours'>
        <Link to={'/tours'} className='btN inter-small '>Explore Tours</Link>
      </div>
      <div className='btn-wrapper my-3'>
        <div className='circle1'>
          <div className='circle2'>
            <div className='circle3'>
              <a href="#tours-section">SCROLL <br /> DOWN</a>
            </div>
          </div>
        </div>
      </div>
      
      </div>
    </header>
    <section className='section-info'>
      <div className="about-section">
  <div className="about-text">
    <div className="post-block">
      <h2 className='paytone-one-large'>Who We Are</h2>
      <p className='inter-medium'>
        We are a team of passionate explorers and travelers, deeply inspired<br />
        by Iceland's unique nature and its enchanting, mystical atmosphere.<br />
        We don't just offer tours – we guide you through the hidden wonders<br />
        and untold stories of one of the most fascinating and otherworldly<br />
        countries on Earth.
      </p>
    </div>
    <div className="post-block">
      <h2 className='paytone-one-large'>Why Us</h2>
      <p className='inter-medium'>
        We turn Iceland trips into unforgettable adventures.<br />
        With us, you won’t just see famous landmarks – you’ll feel the spirit<br />
        of this magical land. We focus on every detail to make your<br />
        experience seamless and truly memorable.
      </p>
    </div>
    <div className=" stats">
      <div className='text-start border-top'>
        <h1 className='pt-2 paytone-one-large'>30+</h1>
        <p className='inter-small'>carefully crafted tour</p>
      </div>
      <div className='text-start border-top'>
        <h1 className='pt-2 paytone-one-large'>100+</h1>
        <p className='inter-small'>unforgettable location</p>
      </div>
      <div className='text-start border-top'>
        <h1 className='pt-2 paytone-one-large'>600+</h1>
        <p className='inter-small'>happy travelers this year</p>
      </div>
    </div>
  </div>

  <div className="about-images">
    <img src={image1} alt="1" />
    <img src={image2} alt="2" />
    <img src={image3} alt="3" />
  </div>
</div>
    </section>
    <section  id="tours-section">
      <div className=''>
        <div className='d-flex justify-content-between align-items-center  flex-column flex-md-row   p-4 mx-5'>
           <div className='d-flex flex-column flex-md-row align-items-md-end align-items-sm-center'>
            <div className='px-4 fw-bolder fs-2 mt-5'>
              <h1 className='paytone-one-large'>
                Must-See <br />
                Adventures
             </h1>
           </div>
           <div className='ps-md-3 pt-3'>
            <p className='inter-very-small'>
              From breathtaking glaciers to hidden hot springs — <br />
              these are the tours that capture the spirit of Iceland. <br />
              <span className='fw-bolder'>
                Handpicked based on real traveler experiences <br />
                and expert recommendations.
             </span>
           </p>
         </div>
       </div>
       <div className='mt-5'>
         <Link to="/tours" className="btn btn-outline-dark rounded-pill px-4 py-2 inter-small">
         See More Tours 
         </Link>
       </div>
    </div>

      </div>
      <div className='border-bottom border-black pb-5'>
        <ToursCarousel/>
      </div>
      <div className='d-flex justify-content-between align-items-center  flex-column flex-md-row   p-4 mx-5'>
           <div className='d-flex flex-column flex-md-row align-items-md-end align-items-sm-center'>
            <div className='px-4 fw-bolder fs-2 mt-5'>
              <h1 className='paytone-one-large'>
                 Wals to travel <br /> in Iceland
             </h1>
           </div>
           <div className='ps-md-3 pt-3'>
            <p className='inter-very-small'>
             Whether you`re traveling with a partner. <br />
              or in group - we`re got the perfect tour for you.
           </p>
         </div>
       </div>
       <div className='mt-5'>
         <Link to="/tours" className="btn btn-outline-dark rounded-pill px-4 py-2 inter-small">
         See More Tours 
         </Link>
       </div>
    </div>
    <div className='border-bottom border-black pb-5'>
      <TourTypes/>
    </div>
    

     <div className='d-flex justify-content-between align-items-center  flex-column flex-md-row   p-4 mx-5'>
           <div className='d-flex flex-column flex-md-row align-items-md-end align-items-sm-center'>
            <div className='px-4 fw-bolder fs-2 mt-5'>
              <h1 className='paytone-one-large'>
                Traveler`s <br />
                Experiences
             </h1>
           </div>
           <div className='ps-md-3 pt-3'>
            <p className='inter-very-small'>
              Read what fellow travelers are saying their <br />
              journeys - 
              <span className='fw-bolder'>
               honest reviews, unforgettable moments, <br />
               and why they`d choose out tours again.
             </span>
           </p>
         </div>
       </div>
    </div>
    <div className='mb-5'>
      <ReviewsCarousel/>
    </div>
    <div className='bgr-contacts'>
      <div className='d-flex justify-content-between align-items-center flex-column m-auto py-5 px-auto'>
        <h1 className=' inter-large '>
          Need help planning your adventure?
        </h1>
        <p className='inter-small py-2'>
          Contact us and we`ll make your Iceland trip unforgettable.
        </p>
         <Link  className="btn btn-outline-light rounded-pill px-4 py-2 inter-small">
         Contact us
         </Link>
      </div>
    </div>

     <div className='d-flex justify-content-between align-items-center  flex-column flex-md-row   p-4 mx-5'>
           <div className='d-flex flex-column flex-md-row align-items-md-end align-items-sm-center'>
            <div className='px-4 fw-bolder fs-2 mt-5'>
              <h1 className='paytone-one-large'>
                News & <br />
                Articles
             </h1>
           </div>
           <div className='ps-md-3 pt-3'>
            <p className='inter-very-small'>
              Get inspired for your next adventure with in-depth travel <br />
              <span className='fw-bolder'>
               guides, local stories, cultural insights, and the latest <br />
               updates -
             </span>
             everything you need to explore iceland like never before.
           </p>
         </div>
         
       </div>
       <div>
        <Link className="btn btn-outline-dark rounded-pill px-4 py-2 inter-small">
         More Articles
         </Link>
       </div>
    </div>
    <div className='mb-5'>
      <BlogCards/>
    </div>
    </section>
    <footer>
      <Footer/>
    </footer>
    </>
    
  )
}

export default Home