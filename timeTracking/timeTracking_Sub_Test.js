const QUALITY_STANDARDS = {
  '1': 8,
  '2': 4,
  '3': 2,
  '4': 1,
  '5': 0,
};
const ACTIVE_STANDARD = QUALITY_STANDARDS['1'];
const NAME_MAP = {
  'Carlos Z.': 'Carlos Zamboni',
  'Carlos Zam': 'Carlos Zamboni',
  'Maria S.': 'Maria Souza',
  'j graves': 'J Graves', 
  'J Graves': 'J Graves', 
  's yi': 'S Yi',
  'S Yi': 'S Yi',
  'h lin': 'H Lin', 
  'H Lin': 'H Lin', 
  'k karwal': 'K Karwal', 
  'K Karwal': 'K Karwal',
  'd burnett': 'D Burnett', 
  'D Burnett': 'D Burnett', 
  'D BURNETT': 'D Burnett',
  'h adya': 'H Adya', 
  'H Adya': 'H Adya'
};

function calculateHours(timeIn, timeOut) {
  try {
    const start = new Date(timeIn);
    const end = new Date(timeOut);
    const diff = end.getTime() - start.getTime();
    return diff > 0 ? diff / (1000 * 60 * 60) : 0;
  } catch {
    return 0;
  }
}

function isValidSession(duration, notes) {
  if (duration <= 0) return false;
  if (duration > ACTIVE_STANDARD && (!notes || notes.trim() === '')) return false;
  return true;
}

function getFilterReason(duration, notes) {
  if (duration <= 0) return 'Invalid or missing time';
  if (duration > ACTIVE_STANDARD && (!notes || notes.trim() === '')) {
    return `Exceeds ${ACTIVE_STANDARD}h without notes`;
  }
  return '';
}

function processVolunteerData(tsvData) {
  const rows = tsvData
    .split('\n')
    .map((row) => row.trim())
    .filter((row) => row && !row.startsWith('System'))
    .map((row) => row.split('\t'));

  const headers = rows[0];
  const dataRows = rows.slice(1);
  const entries = dataRows.map((cols) => {
    const entry = {};
    headers.forEach((header, i) => {
      entry[header] = cols[i] || '';
    });
    return entry;
  });

  const volunteers = {};

  for (const entry of entries) {
    const userId = entry['UserID'];
    const nameRaw = entry['Name'];
    const name = NAME_MAP[nameRaw] || nameRaw;
    if (!volunteers[userId]) {
      volunteers[userId] = {
        name,
        sessions: [],
      };
    }

    volunteers[userId].sessions.push({
      timeIn: entry['Clock In'],
      timeOut: entry['Clock Out'],
      notes: entry['Notes'],
    });
  }

  const now = new Date();
  const weekAgo = new Date();
  weekAgo.setDate(now.getDate() - 7);

  const stats = {
    totalVolunteers: 0,
    totalSessions: 0,
    totalHours: 0,
    filteredSessions: [],
    ranking: [],
    activeVolunteers: [],
  };

  for (const userId in volunteers) {
    const volunteer = volunteers[userId];
    const mergedSessions = [];
    const sortedSessions = volunteer.sessions
      .map((s) => ({
        timeIn: new Date(s.timeIn),
        timeOut: new Date(s.timeOut),
        notes: s.notes,
      }))
      .sort((a, b) => a.timeIn - b.timeIn);

    for (let i = 0; i < sortedSessions.length; i++) {
      const current = sortedSessions[i];
      if (!current.timeOut || isNaN(current.timeOut.getTime())) {
        for (let j = i + 1; j < sortedSessions.length; j++) {
          const next = sortedSessions[j];
          if (next.timeOut && next.timeOut > current.timeIn) {
            current.timeOut = next.timeOut;
            sortedSessions.splice(j, 1);
            break;
          }
        }
      }

      const duration = calculateHours(current.timeIn, current.timeOut);
      const valid = isValidSession(duration, current.notes);

      const session = {
        timeIn: current.timeIn.toISOString(),
        timeOut: current.timeOut.toISOString(),
        duration,
        notes: current.notes,
        valid,
        reason: valid ? '' : getFilterReason(duration, current.notes),
      };

      if (valid) {
        mergedSessions.push(session);
      } else {
        stats.filteredSessions.push({
          name: volunteer.name,
          ...session,
        });
      }
    }

    const totalHours = mergedSessions.reduce((sum, s) => sum + s.duration, 0);
    const lastWeekHours = mergedSessions
      .filter((s) => new Date(s.timeIn) >= weekAgo)
      .reduce((sum, s) => sum + s.duration, 0);

    if (totalHours > 0) {
      stats.totalVolunteers++;
      stats.totalSessions += mergedSessions.length;
      stats.totalHours += totalHours;
    }

    if (lastWeekHours > 0) {
      stats.activeVolunteers.push({
        name: volunteer.name,
        hours: lastWeekHours,
      });
    }
  }

  stats.ranking = stats.activeVolunteers
    .sort((a, b) => b.hours - a.hours)
    .map((v, i) => ({
      rank: i + 1,
      name: v.name,
      hours: v.hours,
    }));

  return stats;
}

function exportRankingCSV(ranking, filename = 'volunteer_ranking.csv') {
  if (!Array.isArray(ranking) || ranking.length === 0) return;
  const header = 'Rank,Name,Hours\n';
  const rows = ranking
    .map((r) => `${r.rank},${r.name.replace(/,/g, '')},${r.hours.toFixed(2)}`)
    .join('\n');
  
  const fs = require('fs'); 
  const filePath = require('path').join(__dirname, filename);
  
  fs.writeFileSync(filePath, header + rows, 'utf8');
  console.log(`\n  Ranking exportado`); 
}

const inputData = `UserID\tName\tClock In\tClock Out\tNotes
1\tCarlos Z.\t2025-06-23T08:00:00\t2025-06-23T12:00:00\tTranslated a blog post
1\tCarlos Z.\t2025-06-25T09:00:00\t2025-06-25T13:30:00\tAttended a team call
2\tMaria S.\t2025-06-27T14:00:00\t2025-06-27T18:00:00\t
`;

const analysis = processVolunteerData(inputData);
console.log('\n--- Volunteer Report ---');
console.log(`Total volunteers: ${analysis.totalVolunteers}`);
console.log(`Total sessions: ${analysis.totalSessions}`);
console.log(`Total hours: ${analysis.totalHours.toFixed(2)}`);

console.log('\n--- Active Volunteers This Week ---');
analysis.ranking.forEach((v) =>
  console.log(`#${v.rank} - ${v.name}: ${v.hours.toFixed(2)}h`)
);

if (analysis.filteredSessions.length > 0) {
  console.log('\n--- Filtered Sessions ---');
  analysis.filteredSessions.forEach((s) =>
    console.log(
      `${s.name} | ${s.timeIn} → ${s.timeOut} | ${s.duration.toFixed(
        2
      )}h | Reason: ${s.reason}`
    )
  );
}

exportRankingCSV(analysis.ranking);
