import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from './firebase';

export default function App() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const studentsRef = ref(db, '/students');
    const unsubscribe = onValue(studentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Single-student setup: show the first (only) student found under /students
        const first = Object.values(data)[0];
        setStudent({
          name: first.name || 'Student',
          stars: first.stars || 0,
          level: first.level || 'Bronze',
          progress: first.progress || {},
          badges: first.badges || []
        });
      } else {
        setStudent(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const levels = {
    'Bronze': { threshold: 0, next: 100, nextLevel: 'Silver', emoji: '🥉' },
    'Silver': { threshold: 100, next: 300, nextLevel: 'Gold', emoji: '🥈' },
    'Gold': { threshold: 300, next: 500, nextLevel: 'Platinum', emoji: '🥇' },
    'Platinum': { threshold: 500, next: null, nextLevel: null, emoji: '💎' }
  };

  if (loading) {
    return (
      <div style={{ fontFamily: 'Arial, sans-serif', background: '#f5f7fa', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#666' }}>Loading progress...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div style={{ fontFamily: 'Arial, sans-serif', background: '#f5f7fa', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center' }}>
        <div>
          <h2 style={{ color: '#333' }}>📚 No progress yet</h2>
          <p style={{ color: '#666' }}>Once a quiz is submitted on the Telegram bot, progress will show up here automatically.</p>
        </div>
      </div>
    );
  }

  const currentLevelInfo = levels[student.level] || levels['Bronze'];
  const levelOrder = ['Bronze', 'Silver', 'Gold', 'Platinum'];
  const topicsDone = Object.keys(student.progress).length;

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', background: '#f5f7fa', minHeight: '100vh', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '30px', borderRadius: '10px', marginBottom: '30px' }}>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '32px' }}>📚 My Pals Tutor Dashboard</h1>
          <p style={{ margin: 0, fontSize: '16px' }}>Welcome back, <strong>{student.name}</strong>!</p>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>

          {/* Stars */}
          <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>⭐ Your Stars</h3>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#FFD700', marginBottom: '10px' }}>{student.stars}</div>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
              {currentLevelInfo.next ? `${currentLevelInfo.next - student.stars} more to reach ${currentLevelInfo.nextLevel}` : 'Top level reached! 🎉'}
            </p>
          </div>

          {/* Level */}
          <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>🏅 Current Level</h3>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>{currentLevelInfo.emoji}</div>
            <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#667eea' }}>{student.level}</p>
          </div>

          {/* Topics */}
          <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>📚 Topics Tried</h3>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#FF6B6B', marginBottom: '10px' }}>
              {topicsDone}
            </div>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Keep it up!</p>
          </div>
        </div>

        {/* Progress */}
        <div style={{ background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
          <h2 style={{ margin: '0 0 20px 0', color: '#333' }}>📊 Progress by Topic</h2>

          {topicsDone === 0 && (
            <p style={{ color: '#999' }}>No quizzes attempted yet.</p>
          )}

          {Object.entries(student.progress).map(([topic, data]) => (
            <div key={topic} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 'bold', color: '#333', textTransform: 'capitalize' }}>{topic.replace('_', ' ')}</span>
                <span style={{ color: '#667eea', fontWeight: 'bold' }}>{data.attempts} attempt{data.attempts === 1 ? '' : 's'}</span>
              </div>

              <div style={{ background: '#e0e0e0', height: '8px', borderRadius: '4px', marginBottom: '8px', overflow: 'hidden' }}>
                <div style={{
                  background: 'linear-gradient(90deg, #667eea, #764ba2)',
                  height: '100%',
                  width: `${Math.min(data.best || 0, 100)}%`
                }}></div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#666' }}>
                <span>Best score: {Math.round(data.best || 0)}%</span>
                <span>Last score: {data.last_score !== undefined ? Math.round(data.last_score) + '%' : '—'}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Badges */}
        <div style={{ background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
          <h2 style={{ margin: '0 0 20px 0', color: '#333' }}>🎖️ Badges</h2>

          {student.badges.length === 0 ? (
            <p style={{ color: '#999' }}>No badges earned yet. Keep practicing!</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px' }}>
              {student.badges.map((badge, idx) => (
                <div key={idx} style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  padding: '20px',
                  borderRadius: '10px',
                  textAlign: 'center',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  {badge}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Level Progression */}
        <div style={{ background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h2 style={{ margin: '0 0 20px 0', color: '#333' }}>🚀 Level Progression</h2>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {levelOrder.map((lvl, idx) => (
              <React.Fragment key={lvl}>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: '32px', marginBottom: '5px' }}>{levels[lvl].emoji}</div>
                  <p style={{
                    margin: 0,
                    fontSize: '12px',
                    color: lvl === student.level ? '#667eea' : '#999',
                    fontWeight: lvl === student.level ? 'bold' : 'normal'
                  }}>
                    {lvl}{lvl === student.level ? ' (NOW)' : lvl !== 'Bronze' ? ` (${levels[lvl].threshold}⭐)` : ''}
                  </p>
                </div>
                {idx < levelOrder.length - 1 && (
                  <div style={{ flex: 1, height: '4px', background: '#e0e0e0', margin: '0 10px' }}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '40px', color: '#999', fontSize: '12px' }}>
          <p>My Pals Tutor Bot © 2026 | Keep learning! 📚</p>
        </div>
      </div>
    </div>
  );
}
