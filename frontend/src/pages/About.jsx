import React from "react";

const teamMembers = [
  {
    name: "Hadi Clero",
    role: "CEO",
    avatar: "https://i.pravatar.cc/150?img=56",
  },
  {
    name: "Christine Lupin",
    role: "CTO",
    avatar: "https://i.pravatar.cc/150?img=44",
  },
  {
    name: "Mostapha Mitude",
    role: "COO",
    avatar: "https://i.pravatar.cc/150?img=65",
  },
];

export default function About() {
  return (
    <>
      <style>{`
        .about-container {
          max-width: 900px;
          margin: 2rem auto;
          padding: 2rem 1.5rem;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #1b2a1f;
          user-select: text;
          text-align: center;
        }
        h1, h2 {
          color: #4caf50;
          margin-bottom: 1rem;
        }
        p {
          max-width: 700px;
          margin: 0 auto 1.5rem auto;
          font-size: 1.1rem;
          line-height: 1.6;
          color: #2f3b2e;
        }
        .team-section {
          display: flex;
          gap: 2rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 3rem;
        }
        .team-member {
          text-align: center;
          max-width: 140px;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border-radius: 8px;
          padding: 0.3rem;
          user-select: none;
          box-shadow: 0 2px 5px rgb(0 0 0 / 0.1);
        }
        .team-member:hover {
          transform: scale(1.12);
          box-shadow: 0 6px 15px rgb(129 199 132 / 0.7);
          border: 2px solid #81c784;
          background: transparent;
        }
        .team-avatar {
          width: 130px;
          height: 130px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #81c784;
          margin-bottom: 0.5rem;
          box-shadow: 0 0 10px #81c784aa;
          transition: box-shadow 0.3s ease;
        }
        .team-member:hover .team-avatar {
          box-shadow: 0 0 18px #4caf50;
        }
        .team-name {
          font-weight: 700;
          font-size: 1.15rem;
          margin-bottom: 0.2rem;
        }
        .team-role {
          font-weight: 500;
          font-size: 0.95rem;
          color: #3c593f;
        }
      `}</style>

      <div className="about-container">
        <h1>About Waste Buster</h1>

        <section className="vision">
          <h2>Our Vision</h2>
          <p>
            To efficiently connect food surplus with those in need by building a reliable and easy-to-use platform,
            thus reducing food waste, promoting social equity, and protecting our planet for future generations.
          </p>
        </section>

        <section className="mission">
          <h2>Our Mission</h2>
          <p>
            To empower individuals and organizations to donate and receive surplus food effortlessly,
            supporting local communities and encouraging sustainable consumption habits through innovative technology.
          </p>
        </section>

        <section className="story">
          <h2>Our Story</h2>
          <p>
            Waste Buster was founded with a strong commitment to combat the massive problem of food waste worldwide.
            We leverage technology to connect donors and recipients in real-time, making it simple and impactful to save edible food.
            Our passionate team works every day to grow this community-driven platform that fosters responsibility, transparency, and environmental care.
          </p>
        </section>

        <section>
          <h2>Our Team</h2>
          <div className="team-section" role="list">
            {teamMembers.map(({ name, role, avatar }) => (
              <div
                key={name}
                className="team-member"
                role="listitem"
                tabIndex={0}
                aria-label={`${name}, ${role}`}
              >
                <img src={avatar} alt={`${name} avatar`} className="team-avatar" />
                <div className="team-name">{name}</div>
                <div className="team-role">{role}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
