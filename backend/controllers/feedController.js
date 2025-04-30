// controllers/feedController.js
// const { fetchTweets } = require('./twitterController');
const { fetchRedditPosts } = require('./redditController');
// const { fetchLinkedInPosts } = require('./linkedinController');
const { normalizeFeed } = require('../utils/feedNormalizer');
// const redis = require('../config/redisClient');
const asyncHandler = require('express-async-handler');
const SavedContent = require('../models/savedContentModel');
const ReportedContent = require('../models/reportedContentModel');

const AGGREGATOR_CACHE_TTL = 300; // 5 minutes

const getAggregatedFeed = async (req, res) => {
  const cacheKey = 'aggregated_feed';
  
  try {
    // Check cache
    // const cachedFeed = await redis.get(cacheKey);
    // if (cachedFeed) return JSON.parse(cachedFeed);

    // Fetch from all sources
    // [tweets, redditPosts, linkedinPosts] 
    const [redditPosts] = await Promise.allSettled([
      // fetchTweets('#education'),
      fetchRedditPosts('learnprogramming'),
      // fetchLinkedInPosts(process.env.LINKEDIN_COMPANY_ID)
    ]);

    // Handle API errors gracefully
    const normalizedFeed = [
      // ...normalizeFeed(tweets.status === 'fulfilled' ? tweets.value : [], 'twitter'),
      ...normalizeFeed(redditPosts.status === 'fulfilled' ? redditPosts.value : [], 'reddit'),
      // ...normalizeFeed(linkedinPosts.status === 'fulfilled' ? linkedinPosts.value : [], 'linkedin')
    ].sort((a, b) => b.metadata.timestamp - a.metadata.timestamp);

    // Cache results
    // await redis.setex(cacheKey, AGGREGATOR_CACHE_TTL, JSON.stringify(normalizedFeed));
    res.json(normalizedFeed);
    return normalizedFeed;
  } catch (error) {
    console.error('Feed aggregation error:', error);
    throw new Error('Failed to aggregate feed');
  }
};

const getMockedAggregatedFeed = async (req, res) => {
  const mockPosts = [
    {
      "id": "reddit_1kb8x54",
      "title": "Place to convert your idea into something real",
      "content": "Most of users here are beginner, and there are two types of learner, first is one who wants to learn theorotically everything before building anything and second is dive and learn.\n\nSo i am just curious, if learners would be interested in the platform to generate customised boilerplate for there project. Skip all boring repetitive work and focus on your main features. You will get a point to get started instead of building everything from zero.\n\nThis is not just a marketing of my app, i really want to know if its helpful for beginners  \nApp: [http://thecodersbakery.com/](http://thecodersbakery.com/)",
      "source": "reddit",
      "url": "https://reddit.com/r/learnprogramming/comments/1kb8x54/place_to_convert_your_idea_into_something_real/",
      "metadata": {
        "author": "Wooden-Attempt-6509",
        "timestamp": 1745990890,
        "thumbnail": null
      }
    },
    {
      "id": "reddit_1kazugj",
      "title": "Software Engineering for Personal App use",
      "content": "Hey, thanks for reading\n\nBackground: I work as a pricing analyst and primarily use SQL,Excel and Python (Pandas,Numpy, etc). Not sure if this is relevant but I am in my early 20s.\n\nLike the title says, I would like to learn software engineering to make apps that I would like to use. For example, I use a couple of subscription on my phone and am getting tired of paying every month just to use the app or there is a specific feature that I would like that many other people might not want so it doesn’t make sense for the creators to make the feature. Plus I think it would be a good skill to have.\n\nIs it possible for me to learn enough to be able to make apps (don’t particularly care about how it looks at the beginning more so just the function, but down the line would like to have it look neat and nice) and also I know Python can be used for backend stuff, can it also be used for frontend or would I need to learn syntax of a different language.\n\nThanks for the help in advance.\n\nNote: I am not looking to become a software engineer at the moment, maybe if I enjoy the app creation I might think about that in the future but my current job is quite easy and pays decent.",
      "source": "reddit",
      "url": "https://reddit.com/r/learnprogramming/comments/1kazugj/software_engineering_for_personal_app_use/",
      "metadata": {
        "author": "PastTechnician7",
        "votes": 6,
        "timestamp": 1745962949,
        "thumbnail": null
      }
    },
    {
      "id": "reddit_1kazu8c",
      "title": "Built this site that mocks Instagram",
      "content": "I made this site called InstaVoid,it’s basically a parody of Instagram, but instead of showing off likes and followers, it tracks how much time you're wasting scrolling, watching reels, liking posts, and lurking on profiles.\n\nI built it as a fun side project because I thought it would be hilarious to actually see those numbers in real time. \n\n",
      "source": "reddit",
      "url": "https://reddit.com/r/learnprogramming/comments/1kazu8c/built_this_site_that_mocks_instagram/",
      "metadata": {
        "author": "MarktheGuerrilla",
        "votes": 8,
        "timestamp": 1745962933,
        "thumbnail": null
      }
    },
    {
      "id": "reddit_1kayd6i",
      "title": "What is the best Linux distribution for someone coming from Windows?",
      "content": "Hi guys, I'm currently using Windows but want to switch to Linux.  Which distro is suitable for first time users of Linux.",
      "source": "reddit",
      "url": "https://reddit.com/r/learnprogramming/comments/1kayd6i/what_is_the_best_linux_distribution_for_someone/",
      "metadata": {
        "author": "Party-Ad-2931",
        "votes": 23,
        "timestamp": 1745959278,
        "thumbnail": null
      }
    },
    {
      "id": "reddit_1kay1y1",
      "title": "Can we please stop telling people learning programming is just like learning a language? In reality it is like learning a language concurrently with extremely complex logic puzzles embedded in the language. Like taking a college level class on logic in your non-native language.",
      "content": "Learning a language is just syntax, vocabulary and grammar and such. Pretty straightforward, almost entirely memorization. Virtually anyone can learn a language. All it takes is a normal ability to remember words and rules.\n\nLearning programming is learning complex logic AND syntax and such. Not in any way straightforward. Memorization alone will get you almost nowhere. You could have the best memory in the world, but if you can't understand complex logic, you will never succeed.",
      "source": "reddit",
      "url": "https://reddit.com/r/learnprogramming/comments/1kay1y1/can_we_please_stop_telling_people_learning/",
      "metadata": {
        "author": "261c9h38f",
        "votes": 249,
        "timestamp": 1745958492,
        "thumbnail": null
      }
    },
    {
      "id": "reddit_1kav18h",
      "title": "Is it normal to feel slow and discouraged in your first years as a software engineer?",
      "content": "I've been working in software development for about 2 years now. I've never been a programming genius, but I genuinely enjoy what I do—well, at least until I hit certain types of problems.\n\nWhat frustrates me is that I often get stuck on issues that others around me (sometimes with similar experience levels) seem to solve quickly, even if they're complex. When it's someone with many years of experience, I get it—but it's not always the case.\n\nI notice that I’m especially slow when dealing with new technologies. I sometimes feel like my colleagues judge me for this. Maybe they underestimate the work involved, or maybe it really is easier for them. Either way, I can’t help but wonder if they're right to think I’m just... slow.\n\nWhat hits me hardest is that after spending days stuck on something, once I finally figure it out, I look back and think: “That really shouldn't have taken me so long.” Of course things seem easier in hindsight, but I can’t shake the feeling that maybe I am the problem and should be improving faster.\n\nI’d love to hear from other software engineers: did you go through this too? Does it get better? Do you have any tips?\nI still enjoy coding, but these moments really make me question if I'm cut out for this.",
      "source": "reddit",
      "url": "https://reddit.com/r/learnprogramming/comments/1kav18h/is_it_normal_to_feel_slow_and_discouraged_in_your/",
      "metadata": {
        "author": "Inevitable-Race8518",
        "votes": 54,
        "timestamp": 1745950933,
        "thumbnail": null
      }
    },
  ]
  // const mockPosts = [
  //   {
  //     title: 'How I learned JavaScript in 30 days',
  //     content: 'I focused on building small projects every day and used resources like freeCodeCamp and MDN.',
  //     url: 'https://reddit.com/r/learnprogramming/post1',
  //     source: 'reddit',
  //     metadata: {
  //       timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
  //     },
  //   },
  //   {
  //     title: 'Tips for mastering DSA',
  //     content: 'Consistency > everything. Practice 2 problems daily on LeetCode and revisit failed ones.',
  //     url: 'https://reddit.com/r/learnprogramming/post2',
  //     source: 'reddit',
  //     metadata: {
  //       timestamp: Date.now() - 1000 * 60 * 60 * 5, // 5 hours ago
  //     },
  //   },
  //   {
  //     title: 'Just got my first backend dev internship!',
  //     content: 'Built a personal project with Node.js and MongoDB. Shared it on GitHub and got noticed!',
  //     url: 'https://reddit.com/r/learnprogramming/post3',
  //     source: 'reddit',
  //     metadata: {
  //       timestamp: Date.now() - 1000 * 60 * 30, // 30 minutes ago
  //     },
  //   },
  // ];

  res.json(mockPosts);
};


// @desc    Save content
// @route   POST /api/feed/save
const saveContent = asyncHandler(async (req, res) => {
  const { contentId, contentType, metadata } = req.body;
  
  const existing = await SavedContent.findOne({
    user: req.user._id,
    contentId,
    contentType
  });
  
  if (existing) {
    res.status(400);
    throw new Error('Content already saved');
  }
  
  const savedContent = await SavedContent.create({
    user: req.user._id,
    contentId,
    contentType,
    metadata
  });
  
  res.status(201).json(savedContent);
});

// @desc    Unsave content
// @route   DELETE /api/feed/unsave
// @access  Private
const unsaveContent = asyncHandler(async (req, res) => {
  const { contentId, contentType } = req.body;

  // find the saved record
  const existing = await SavedContent.findOne({
    user: req.user._id,
    contentId,
    contentType
  });

  // remove it
  await existing.deleteOne(); 

  res.status(200).json({ message: 'Content unsaved successfully' });
});

// @desc    Report content
// @route   POST /api/feed/report
const reportContent = asyncHandler(async (req, res) => {
  const { contentId, contentType, reason } = req.body;
  
  const report = await ReportedContent.create({
    contentId,
    contentType,
    reportedBy: req.user._id,
    reason
  });
  
  res.status(201).json(report);
});

const getSavedContent = asyncHandler(async (req, res) => {
  const saved = await SavedContent.find({ user: req.user._id })
    .sort('-createdAt');
  res.json(saved);
});

// @desc    Check if a piece of content is saved
// @route   GET /api/feed/saved/check
// @access  Private
const checkSaved = asyncHandler(async (req, res) => {
  const { contentId, contentType } = req.query;

  const exists = await SavedContent.exists({
    user: req.user._id,
    contentId,
    contentType
  });

  res.json({ isSaved: Boolean(exists) });
});

module.exports = {
  getAggregatedFeed,
  saveContent,
  unsaveContent,
  reportContent,
  getSavedContent,
  getMockedAggregatedFeed,
  checkSaved
};

