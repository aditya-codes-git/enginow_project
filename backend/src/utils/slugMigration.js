import Event, { slugify } from '../models/Event.js';

export const migrateSlugs = async () => {
  try {
    const events = await Event.find({
      $or: [
        { slug: { $exists: false } },
        { slug: null },
        { slug: '' }
      ]
    });

    if (events.length === 0) {
      console.log('✅ Slug migration: No events need slug migration.');
      return;
    }

    console.log(`🚀 Slug migration: Found ${events.length} events without a slug. Starting migration...`);

    for (const event of events) {
      const baseSlug = slugify(event.title || 'event');
      let uniqueSlug = baseSlug;
      let counter = 1;
      let slugExists = true;

      while (slugExists) {
        const checkSlug = counter === 1 ? uniqueSlug : `${baseSlug}-${counter}`;
        const existingEvent = await Event.findOne({ slug: checkSlug });
        if (!existingEvent || (existingEvent._id.toString() === event._id.toString())) {
          uniqueSlug = checkSlug;
          slugExists = false;
        } else {
          counter++;
        }
      }

      event.slug = uniqueSlug;
      // Use validateBeforeSave: false to bypass other validations during migration
      await event.save({ validateBeforeSave: false });
      console.log(`   - Generated slug "${uniqueSlug}" for event "${event.title}"`);
    }

    console.log('✅ Slug migration completed successfully.');
  } catch (error) {
    console.error('❌ Slug migration failed:', error);
  }
};
