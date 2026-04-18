import React from 'react';
import './App.css';

const GROUP_NUMBER = 2;
const TEAM_MEMBERS = [
  'Tom',
];

function App() {
  return (
    <div className="app">
      <main className="card">
        <h1 className="course">TECH2102 &mdash; Enterprise Computing</h1>
        <h2 className="group">Group {GROUP_NUMBER}</h2>
        <h3 className="subtitle">Team Members</h3>
        <ul className="members" data-testid="members-list">
          {TEAM_MEMBERS.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
        <p className="footer">
          React + Jenkins + Docker CI/CD Pipeline Project
        </p>
      </main>
    </div>
  );
}

export default App;
