const Subscription = require('../models/Subscription');

exports.list = async (req, res) => {
  try {
    // Only return subscriptions for the authenticated user
    const filter = { userId: req.user.id }
    const subs = await Subscription.find(filter).populate('category').lean();
    return res.json(subs);
  } catch (e) {
    return res.status(500).json({ message: 'Failed to fetch subscriptions' });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, category, price, billingCycle, startDate, nextBillingDate, notes, isActive } = req.body;
    const doc = await Subscription.create({
      userId: req.user.id, // Associate subscription with authenticated user
      name,
      category: category || undefined,
      price,
      billingCycle,
      startDate,
      nextBillingDate,
      notes,
      isActive,
    });
    return res.status(201).json(doc);
  } catch (e) {
    console.log(e);

    return res.status(400).json({ message: 'Failed to create subscription' });
  }
};

exports.update = async (req, res) => {
  try {
    console.log(req.params);
    const { id } = req.params;
    const updates = req.body || {};
    // Only allow updating own subscriptions
    const query = { _id: id, userId: req.user.id }
    const doc = await Subscription.findOneAndUpdate(query, updates, { new: true });
    if (!doc) return res.status(404).json({ message: 'Subscription not found' });
    return res.json(doc);
  } catch (e) {
    return res.status(400).json({ message: 'Failed to update subscription' });
  }
};

exports.remove = async (req, res) => {
  try {
    console.log(req.params);
    const { id } = req.params;
    // Only allow deleting own subscriptions
    const query = { _id: id, userId: req.user.id }
    const doc = await Subscription.findOneAndDelete(query);
    if (!doc) return res.status(404).json({ message: 'Subscription not found' });
    return res.json({ success: true });
  } catch (e) {
    return res.status(400).json({ message: 'Failed to delete subscription' });
  }
};
