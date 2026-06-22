import bcrypt from 'bcryptjs';
import { query } from './db.js';

export const seedDemoData = async () => {
  const demoEmail = 'demo@casewatch.in';
  const demoPasswordPlain = 'Demo@1234';

  try {
    // 1. Check if demo user already exists
    const userResult = await query('SELECT id FROM users WHERE email = $1', [demoEmail]);
    let userId;

    if (userResult.rows.length === 0) {
      console.log(`Demo user '${demoEmail}' not found. Seeding new demo user...`);
      
      // Hash the demo password using bcryptjs
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(demoPasswordPlain, salt);

      // Insert new demo user
      const insertResult = await query(
        'INSERT INTO users (email, password, name, is_demo) VALUES ($1, $2, $3, $4) RETURNING id',
        [demoEmail, hashedPassword, 'Demo User', true]
      );
      
      userId = insertResult.rows[0].id;
      console.log(`Demo user created with ID: ${userId}`);
    } else {
      userId = userResult.rows[0].id;
      console.log(`Demo user '${demoEmail}' already exists (ID: ${userId}).`);
    }

    // 2. Check if cases exist for this demo user
    const casesResult = await query('SELECT id FROM cases WHERE user_id = $1', [userId]);

    if (casesResult.rows.length === 0) {
      console.log(`No case records found for demo user. Seeding 3 realistic cases...`);
      
      // Fake cases linked to demo user's ID
      const fakeCases = [
        {
          case_number: 'WP(C) 1240/2026',
          court_name: 'Supreme Court of India',
          status: 'Hearing Stage',
          next_hearing_date: '2026-07-20'
        },
        {
          case_number: 'CR(A) 402/2025',
          court_name: 'Delhi High Court',
          status: 'Under Review',
          next_hearing_date: '2026-06-25'
        },
        {
          case_number: 'OS 98/2024',
          court_name: 'Patiala House District Court',
          status: 'Interim Orders',
          next_hearing_date: '2026-08-05'
        }
      ];

      for (const c of fakeCases) {
        await query(
          'INSERT INTO cases (user_id, case_number, court_name, status, next_hearing_date) VALUES ($1, $2, $3, $4, $5)',
          [userId, c.case_number, c.court_name, c.status, c.next_hearing_date]
        );
      }

      console.log('Seeding of 3 case records completed successfully.');
    } else {
      console.log(`Demo user already has ${casesResult.rows.length} cases seeded in DB.`);
    }

  } catch (err) {
    console.error('Error during demo user & case seeding:', err.message);
  }
};
