import React from 'react';
import '../styles/BlogCards.css';

const posts = [
  {
    title: "Exploring Iceland’s Unique Wildlife:",
    subtitle: "From Puffins to Icelandic Horses",
    category: "Iceland’s Wildlife",
    date: "Jun 6, 2025",
    image: "https://a.d-cd.net/6fb6f8cs-960.jpg", 

  },
  {
    title: "How to choose the perfect Iceland tour",
    subtitle: "based on the season",
    category: "Seasonal Adventure",
    date: "Jun 6, 2025",
    image: "https://images.unsplash.com/photo-1520475178495-a8d5b36f1782?q=80&w=1156&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
  },
  {
    title: "Solo travel in Iceland:",
    subtitle: "Tips for exploring alone",
    category: "Solo Travel",
    date: "Jun 6, 2025",
    image: "https://img.freepik.com/premium-photo/portrait-girl-mountains-clouds-fog-dawn-shadows-silhouettes_693749-294.jpg", 
  }
];

export default function BlogCards() {
  return (
    <div className="container py-5">
      <div className="row g-4">
        {posts.map((post, idx) => (
          <div className="col-12 col-md-4" key={idx}>
            <div className="blog-card position-relative rounded-4 overflow-hidden" style={{ backgroundImage: `url(${post.image})`,}}>
              <div className="blog-overlay"></div>
              <div className="blog-content text-white position-absolute bottom-0 p-4">
                <h6 className="fw-normal inter-medium ">{post.title}<br /><strong>{post.subtitle}</strong></h6>
                <p className="small text-white-50 mb-0 inter-small ">{post.category} | {post.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
