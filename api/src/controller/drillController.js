const cache = require('../service/cache');
const Drill = require('../models/drill');

const getAllDrills = async (req, res, next) => {
  try {
    const cachedDrills = cache.get('allDrills');
    if (cachedDrills) {
      return res.json(cachedDrills);
    }

    const drills = await Drill.find({}).select('-questions');
    cache.set('allDrills', drills, 60); // Cache for 60 seconds
    res.json(drills);
  } catch (err) {
    next(err);
  }
};

const getDrillById = async (req, res, next) => {
  try {
    const drill = await Drill.findById(req.params.id);
    if (!drill) {
      return res.status(404).json({ error: 'Drill not found' });
    }
    res.json(drill);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllDrills,
  getDrillById
};