import React from 'react'
import '../styles/Home.css' 
import NavBar from '../components/NavBar'
import image1 from '../image/image1.jpg';
import image2  from '../image/image2.jpg';
import image3 from '../image/image3.jpg';
import { Link } from 'react-router-dom';
import ToursCarousel from '../components/ToursCarousel';


const Home = () => {
  return (
    <>
    <header className='icelandBackgraund'>
      <NavBar/>
      <div className='textFollow'>
        <p>Follow the - We`ll take care of the details</p>
      </div>
      <div className='btn-exploreTours'>
        <Link to={'/tours'} className='btn'>Explore Tours</Link>
      </div>
      <div className='btn-wrapper'>
        <div className='circle1'>
          <div className='circle2'>
            <div className='circle3'>
              <a href="#">SCROLL <br /> DOWN</a>
            </div>
          </div>
        </div>
      </div>
{/* <div className="about-section">
  <div className="about-text">
    <div className="post-block">
      <h2>Who We Are</h2>
      <p>
        We are a team of passionate explorers and travelers, deeply inspired<br />
        by Iceland's unique nature and its enchanting, mystical atmosphere.<br />
        We don't just offer tours – we guide you through the hidden wonders<br />
        and untold stories of one of the most fascinating and otherworldly<br />
        countries on Earth.
      </p>
    </div>
    <div className="post-block">
      <h2>Why Us</h2>
      <p>
        We turn Iceland trips into unforgettable adventures.<br />
        With us, you won’t just see famous landmarks – you’ll feel the spirit<br />
        of this magical land. We focus on every detail to make your<br />
        experience seamless and truly memorable.
      </p>
    </div>
    <div className="stats">
      <div>
        <h1>30+</h1>
        <p>carefully crafted tour</p>
      </div>
      <div>
        <h1>100+</h1>
        <p>unforgettable location</p>
      </div>
      <div>
        <h1>600+</h1>
        <p>happy travelers this year</p>
      </div>
    </div>
  </div>

  <div className="about-images">
    <img src={image1} alt="1" />
    <img src={image2} alt="2" />
    <img src={image3} alt="3" />
  </div>
</div> */}
    </header>
    <section className='section-info'>
      <div className="about-section">
  <div className="about-text">
    <div className="post-block">
      <h2>Who We Are</h2>
      <p>
        We are a team of passionate explorers and travelers, deeply inspired<br />
        by Iceland's unique nature and its enchanting, mystical atmosphere.<br />
        We don't just offer tours – we guide you through the hidden wonders<br />
        and untold stories of one of the most fascinating and otherworldly<br />
        countries on Earth.
      </p>
    </div>
    <div className="post-block">
      <h2>Why Us</h2>
      <p>
        We turn Iceland trips into unforgettable adventures.<br />
        With us, you won’t just see famous landmarks – you’ll feel the spirit<br />
        of this magical land. We focus on every detail to make your<br />
        experience seamless and truly memorable.
      </p>
    </div>
    <div className="stats">
      <div>
        <h1>30+</h1>
        <p>carefully crafted tour</p>
      </div>
      <div>
        <h1>100+</h1>
        <p>unforgettable location</p>
      </div>
      <div>
        <h1>600+</h1>
        <p>happy travelers this year</p>
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
    <section>
      <div className=''>
        <div className='d-flex justify-content-start align-items-end p-2 mx-5'>
          <div className='px-4 fw-bolder fs-2 mt-5 '>
            <h1>
              Must-See <br />
              Adventures
            </h1>
          </div>
          <div>
            <p className='fs-6 ps-3'>
              From breathtakinf glaciers to hidden hot springs - <br />
              these are the tours that capture the spirit of Iceland. <br />
              <span className='fw-bolder'>Handpicked based on real traveler experiences <br />
              and expert recommendations.</span>
            </p>
          </div>
        </div>
      </div>
      <div className='border-bottom pb-5'>
        <ToursCarousel/>
      </div>

       <div className='mt-5'>
        <div className='d-flex justify-content-start align-items-end p-2 mx-5'>
          <div className='px-4 fw-bolder  '>
            <h1 className='fs-2'>
              Wals to travel <br /> in Iceland
            </h1>
          </div>
          <div className=' fs-3 ps-3'>
            <p>
              Whether you`re traveling with a partner. <br />
              or in group - we`re got the perfect tour for you.
            </p>
          </div>
        </div>
      </div>
    </section>
    </>
    
  )
}

export default Home