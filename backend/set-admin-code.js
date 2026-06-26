const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config({ path: '.env' });

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const adminEmail = 'jone@college.edu';
    const code = 'COLLEGEADMIN2026';

    const result = await User.updateOne(
      { email: adminEmail },
      {
        $set: {
          role: 'admin',
          adminCode: code.toLowerCase(),
          isActive: true,
        },
      }
    );

    const updated = await User.findOne({ email: adminEmail }).lean();
    console.log(JSON.stringify({
      matched: result.matchedCount,
      modified: result.modifiedCount,
      storedCode: updated && updated.adminCode,
      role: updated && updated.role,
      email: updated && updated.email,
    }, null, 2));
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
})();
