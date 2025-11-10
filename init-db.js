const { getDatabase, initDatabase } = require('./database');

// Initialize database first
initDatabase();

// Participant data from participants-online.xlsx
const participants = [
  {"name": "Abdul Minhaj", "phone": "8076374618"},
  {"name": "Ahenjeeta Ghosh", "phone": "8509227248"},
  {"name": "Akhouri Rishabh", "phone": "7479930115"},
  {"name": "Akshansh Walimbe", "phone": "9599128483"},
  {"name": "Akshita kashyap", "phone": "8959258759"},
  {"name": "Aman Sharma", "phone": "9873365928"},
  {"name": "Anant Sharma", "phone": "8668384910"},
  {"name": "Anita", "phone": "8930069465"},
  {"name": "Anuj", "phone": "8210012830"},
  {"name": "Arnav soni", "phone": "7829175183"},
  {"name": "Asheem Goswami", "phone": "9569058513"},
  {"name": "Ashlesha", "phone": "8360766890"},
  {"name": "Ashwani Swami", "phone": "9315221798"},
  {"name": "ASHWIN MANOJ", "phone": "7306031842"},
  {"name": "Avni Jain", "phone": "6267159319"},
  {"name": "Ayush", "phone": "8529325648"},
  {"name": "Ayush Maurya", "phone": "6392860716"},
  {"name": "AYUSH MISHRA", "phone": "9455008687"},
  {"name": "Bhavana Peri", "phone": "9885979739"},
  {"name": "Bhavishya Tepan", "phone": "8799697184"},
  {"name": "Bodhibrata narayan", "phone": "9707882161"},
  {"name": "Deepanshi Singh", "phone": "919548327245"},
  {"name": "Dhanashree rahul pitale", "phone": "917841881643"},
  {"name": "Diksha", "phone": "8882380448"},
  {"name": "Divyanshu Chaudhary", "phone": "7518573008"},
  {"name": "Gauri umesh chavan", "phone": "7558527228"},
  {"name": "Gourav Choudhary", "phone": "8128252929"},
  {"name": "GULAM SUBHANI", "phone": "9341599412"},
  {"name": "Hari Om Pathak", "phone": "9555080140"},
  {"name": "Harsh", "phone": "7988996057"},
  {"name": "Harsh Agarwal", "phone": "9725234775"},
  {"name": "Harshit Prabhu Reshmi", "phone": "17631540422"},
  {"name": "Iaman", "phone": "6005119236"},
  {"name": "JERO RABIN J", "phone": "6385317162"},
  {"name": "Jincy bharatbhai goswami", "phone": "9586362625"},
  {"name": "Jitesh Sundaray", "phone": "8309439504"},
  {"name": "Kamal Raj", "phone": "9779199104"},
  {"name": "KANTHARIYA PRANAVKUMAR DHARMESHBHAI", "phone": "9638594449"},
  {"name": "Kapadia Dhwaneel Prashant", "phone": "7490011857"},
  {"name": "Karampreet", "phone": "7678354732"},
  {"name": "Khushboo", "phone": "8901204141"},
  {"name": "Kunal Choudhury", "phone": "7099029125"},
  {"name": "Kushal Thakkar", "phone": "7096277307"},
  {"name": "Laxmi Yogesh Chouthramani", "phone": "7249564519"},
  {"name": "Manohar", "phone": "7357554769"},
  {"name": "Mohd Musab", "phone": "7982048291"},
  {"name": "Mohith Nigam", "phone": "8904679647"},
  {"name": "Nandhana Shaiju", "phone": "7510192560"},
  {"name": "Nidhi Kumar", "phone": "9560717502"},
  {"name": "Nikhil Kumar Singh", "phone": "6395105591"},
  {"name": "Ningaraj dayamani", "phone": "9036448054"},
  {"name": "Palak Sharma", "phone": "9257621517"},
  {"name": "Parv Shah", "phone": "9953993360"},
  {"name": "Payal umesh chavan", "phone": "8010696715"},
  {"name": "Piyush kumar", "phone": "8840446563"},
  {"name": "Preeti kumari", "phone": "8882483765"},
  {"name": "Prerna madan", "phone": "9394739727"},
  {"name": "Priyanshu Jaiswal", "phone": "9170043494"},
  {"name": "Purvanshi Sharma", "phone": "7011493867"},
  {"name": "R SHIVA SHANKARAN", "phone": "8610956773"},
  {"name": "Raghav Gupta", "phone": "9813334139"},
  {"name": "Reva Rushikesh Khatoo", "phone": "9930398807"},
  {"name": "Reyyan Abdul Sathar Puyuveettil", "phone": "9383467343"},
  {"name": "Ritik Baliyan", "phone": "9457512846"},
  {"name": "Sahibjit Singh", "phone": "9646707611"},
  {"name": "Samir Raj", "phone": "6207174199"},
  {"name": "Sanket Chavan", "phone": "9974237047"},
  {"name": "Saumya Pal", "phone": "7991778772"},
  {"name": "Shashank Mishra", "phone": "7011074788"},
  {"name": "Shashwat Srivastava", "phone": "8303557130"},
  {"name": "Shikhar Kumar", "phone": "9045833762"},
  {"name": "SHUBHANGI AGARWAL", "phone": "9548731167"},
  {"name": "Shyam singh", "phone": "9899098789"},
  {"name": "Siddhi sanjay Thorat", "phone": "9970194194"},
  {"name": "Sonam", "phone": "7206380556"},
  {"name": "Sweatha G Kumar", "phone": "9495724368"},
  {"name": "Tanisha Choudhary", "phone": "9468650073"},
  {"name": "Uddipa Pal", "phone": "917044087535"},
  {"name": "Ullas JS", "phone": "8951127643"},
  {"name": "Uttara", "phone": "9256571809"},
  {"name": "Vaibhav Kumar", "phone": "6287663121"},
  {"name": "Vaishnavi singh", "phone": "7703023183"},
  {"name": "Vamika", "phone": "6284850631"},
  {"name": "Vivek kundu", "phone": "9306862202"},
  {"name": "yagyasha rastogi", "phone": "9910574649"},
  {"name": "Yaman", "phone": "8569835862"},
  {"name": "Yashdeep Podder", "phone": "9096865219"},
  {"name": "Yasir Abbas", "phone": "9328597897"},
  {"name": "Zulfiqar Hassnain", "phone": "7051237541"},
  {"name": "Meryl", "phone": "9256214535"}
];

function populateDatabase() {
  const db = getDatabase();
  
  const insert = db.prepare(
    'INSERT OR IGNORE INTO users (username, full_name, password, phone) VALUES (?, ?, ?, ?)'
  );
  
  let added = 0;
  
  for (const participant of participants) {
    // Extract first name as username (case-insensitive)
    const firstName = participant.name.trim().split(' ')[0].toLowerCase();
    const fullName = participant.name.trim();
    const phone = participant.phone.replace(/\D/g, ''); // Clean phone number
    
    try {
      insert.run(firstName, fullName, phone, phone);
      added++;
    } catch (err) {
      console.log(`Skipping duplicate: ${firstName}`);
    }
  }
  
  console.log(`✅ Added ${added} participants to database`);
  console.log(`📊 Total participants: ${participants.length}`);
}

// Run the population
populateDatabase();

console.log('✅ Database initialization complete!');
console.log('📝 You can now start the server with: npm start');
