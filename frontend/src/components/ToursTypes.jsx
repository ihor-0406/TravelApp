import React from 'react';
import '../styles/TourTypes.css'; 

const types = [
  {
    title: 'Self-drives tour',
    description: 'Take the wheel and uncover top sights and hidden gems at your own pace.',
    imageUrl: 'https://images.actiontourguide.com/wp-content/uploads/2021/09/16093336/Action-Tour-Guide-Self-Guided-tour-scaled.jpg',
  },
  {
    title: 'Small group packages',
    description: 'Join like-minded travellers and let an expert local guide lead the way.',
    imageUrl: 'https://images.ctfassets.net/a68ipajj4t9l/5TZKTx0ww2RHZ6SA3ikpzT/6b24d15c0a03399ca54d1a581959e426/PrivateGroups-progressive-min.jpeg?w=2400&q=60',
  },
  {
    title: 'Private trips',
    description: 'Experience an exclusive, personalised tour with your own private guide.',
    imageUrl: 'https://thumbs.dreamstime.com/b/wonderful-high-huge-skogarfoss-waterfall-compass-han-wonderful-high-huge-skogarfoss-waterfall-compass-hand-123326396.jpg',
  },
  {
    title: 'Multi-day tours',
    description: 'Explore independently and take guided day trips when you want to.',
    imageUrl: 'https://images.ctfassets.net/a68ipajj4t9l/30KfVDKlUz185yTfvoQkwV/97cb80080d80bdcb5bcac41838284ae2/snaefellsnes_peninsula_blog-8.jpg?w=686&h=400&q=60',
  },
];

export default function TourTypes() {
  return (
    <div className="container py-5">
      <div className="row g-4">
        {types.map((type, idx) => (
          <div className="col-12 col-sm-6 col-lg-3" key={idx}>
            <div className="tour-type-card" style={{ backgroundImage: `url(${type.imageUrl})` }}>
              <div className="overlay"></div>
              <div className="content">
                <h5 className='inter-medium'>{type.title}</h5>
                <p className='inter-medium'>{type.description}</p>
              </div>
              <div className="icon">
                <i class="fa-solid fa-arrow-right arrow"></i>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
