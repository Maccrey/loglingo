const fs = require('fs');
const path = require('path');
const msgsPath = path.join(__dirname, '../messages');
const files = fs.readdirSync(msgsPath).filter(f => f.endsWith('.json'));

files.forEach(f => {
  const p = path.join(msgsPath, f);
  const data = JSON.parse(fs.readFileSync(p, 'utf8'));
  
  if (!data.trial) {
    data.trial = {};
  }
  
  if (!data.trial.try_it_out) {
    if (f === 'ko.json') {
      data.trial.try_it_out = '체험하기';
    } else {
      data.trial.try_it_out = 'Try it out';
    }
    fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
    console.log('Added trial.try_it_out to ' + f);
  }
});
console.log('Done checking trial.try_it_out');
