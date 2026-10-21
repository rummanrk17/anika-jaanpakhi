// ─────────────────────────────────────────────────────────────
//  Everything you might want to edit lives in this file.
//  Text, captions, letters, photos, the secret question.
// ─────────────────────────────────────────────────────────────

export default {
  name: 'Anika',
  from: 'Rumman',
  age: 23,

  // Her birthday, midnight Dhaka time. Before this moment she sees the countdown.
  unlockAt: '2026-10-21T00:00:00+06:00',

  lock: {
    question: 'Name of your first baby boy?',
    // cyrb53 hash of the lower-cased answer, so the answer isn’t sitting in the page source.
    // To change it: run  node tools/hash.mjs "newanswer"
    hash: 'e1gbpvpu7u',
    hint: 'R _ _ _ _ _ — our little future. You know him already.',
  },

  hero: {
    kicker: 'a letter, sealed for',
    sealed: 'Not yet, my love…',
    sealedSub: 'Some letters can only be opened on the right day.',
    sealedFoot: '23 years of you, almost. Come back at midnight.',
    lockedTitle: 'It’s your day.',
    lockedSub: 'Before the seal breaks, one question only you can answer —',
    readyTitle: 'Welcome back, birthday girl.',
    readySub: 'The letter is still here, waiting for you.',
  },

  letter: {
    place: '21 October 2026',
    greeting: 'My dearest Anika,',
    paragraphs: [
      'Happy birthday, my love. Twenty-three years ago today the world got a little softer, a little brighter, though neither of us knew it yet but my life got its favourite person.',
      'I hate that I can’t be next to you today. I can’t hand you a rose, or watch you and just keep watching you givng all my love and attention. I miss you even now laughing at my terrible jokes in person. Situation, timing and everything else keep us apart for now... so I made you this instead. A letter you can open, re-read, and come back to whenever you want me close.',
      'I’ll be away and offline today, but please don’t read that as absence. Every part of this was made thinking of you: every photo chosen, every line rewritten until it felt right. If you’re reading this, I’m right here with you, just in a different way.',
      'Thank you for your patience with me, for a kindness that makes everything easier, and for the way you turn an ordinary canteen afternoon into the best part of my week. Thank you for choosing me, again and again.',
      'Today is all about you. Eat something sweet, wear something pretty, enjoy your day my Jaan. And when the day gets quiet, keep scrolling. I left you a few more things.',
    ],
    signoff: 'Forever yours,',
    signature: 'Rumman',
  },

  story: {
    title: 'Our story, in pieces',
    sub: 'A few of my favourite frames — of you, and of us.',
  },

  // Each chapter: a title card, then its photos.
  // src = file name in assets/photos (without .webp). tag = little typed label on the polaroid.
  chapters: [
    {
      title: 'Uni days',
      note: 'Somewhere between classes and canteen tea, you became my favourite part of every day.',
      photos: [
        { src: 'bus', tag: 'the uni bus', caption: 'AC bus, window seat, you. Best commute of my life.' },
        { src: 'class-selfie', tag: 'in class', caption: 'Supposed to be paying attention in class. Was paying attention to you.' },
        { src: 'canteen-1', tag: 'the canteen', caption: 'Peace sign, canteen lights, my whole heart.', wide: true },
        { src: 'canteen-2', tag: 'same table', caption: 'Same table, same smile. Never gets old.', wide: true },
      ],
    },
    {
      title: 'The first rose',
      note: 'The first flower I ever gave you. The rose wilted. What I felt never did.',
      photos: [
        { src: 'first-rose', tag: 'no. 1', caption: 'One rose, a hundred nervous heartbeats.' },
      ],
    },
    {
      title: 'Yamcha dates',
      note: 'Our booth. Our food going cold. Our far-too-many selfies.',
      photos: [
        { src: 'yamcha-1', tag: 'take one', caption: 'Take one…', wide: true },
        { src: 'yamcha-2', tag: 'take two', caption: '…take two…', wide: true },
        { src: 'yamcha-3', tag: 'take three', caption: '…okay, one more. (I’d take a thousand.)', wide: true },
      ],
    },
    {
      title: 'Pohela Boishakh',
      note: 'The whole campus was celebrating. I was just looking at you.',
      photos: [
        { src: 'boishakh', tag: 'shubho noboborsho', caption: 'The prettiest girl at the whole mela.' },
      ],
    },
    {
      title: 'Neon night',
      note: 'Some lights try very hard. You don’t even have to.',
      photos: [
        { src: 'neon', tag: 'after dark', caption: 'The neon did its best. You were still the brightest thing in the room.' },
      ],
    },
    {
      title: 'Auto-rickshaw Comedy',
      note: 'A tragedy in one act: the girl who married an auto driver.',
      photos: [
        { src: 'auto', tag: 'just married?', caption: 'Your face: “how did I end up with an auto driver?” Mine: luckiest driver in town.' },
      ],
    },
    {
      title: 'Last Birthday in a Saree',
      note: '21 October 2025. A saree, a smile, and me forgetting how to breathe.',
      photos: [
        { src: 'bday-saree-1', tag: '21 · 10 · 25', caption: 'Green saree, soft light, you.' },
        { src: 'bday-saree-2', tag: 'birthday girl', caption: 'I said “one photo”. Then I took twenty.' },
      ],
    },
    {
      title: 'Us',
      note: 'My favourite place in the world.',
      photos: [
        { src: 'us-arms', tag: 'home', caption: 'Wherever your face is resting on my arm — that’s home.' },
      ],
    },
  ],
  storyEnd: 'To be continued… for a very, very long time.',

  openWhen: {
    title: 'Open when…',
    sub: 'I can’t be beside you every day — yet. So I left a little of me in these. Open one whenever you need me.',
    letters: [
      {
        label: 'you miss me',
        tint: 'blush',
        body: [
          'I love you too my shona maybe jaan. i miss you soo soo much umwah umwah umwah umwahhh!',
          'More umwaah umwah umwaah umwaah! umwaaaaah!',
          'I miss you so much my baby! InshAllah! We’ll be together and I’ll be the BEST Husband for you!',
        ],
      },
      {
        label: 'you can’t sleep',
        tint: 'kraft',
        body: [
          'Nishchoi phone e Big Boss dekhtesila? :V',
          'Phone rekhe ghumaoo jaan! I love you sooo much! Soo soo soo much babyygirl!',
          'Please try to sleep my jaan, I don’t want you to be tired tomorrow morning... Ghumu koro baby, Goodnight!',
        ],
      },
      {
        label: 'you’re sad',
        tint: 'sage',
        body: [
          'I wanna give you a very biiiiiig hug my jaan! Let this letter be that hug',
          'You’re allowed to feel sad. You don’t have to be strong all the time when you’re not with me. But please remember: you are so deeply loved, you’re doing better than you think, and this feeling is a visitor, not a home.',
          'Cry if you need to. Then drink some water, eat something, and text me when you can. I’m always, always on your side loving you!',
        ],
      },
      {
        label: 'you need a laugh',
        tint: 'cream',
        body: [
          'Auto-Rickshaw driver er shate biye hoise etto hashte hobena. Ki acting dukkher! muhauhauha. Oscar winning performance!',
          'You know my brain is short on memories, but yours is full with them! Please share a few of our funny memories next time we meet!',
          'Now smile, will you please?. Yes, that one. That’s my favourite.',
        ],
      },
      {
        label: 'you’re angry at me',
        tint: 'wax',
        body: [
          'Okay. Deep breath. I probably deserved it.',
          'I’m sorry for whatever I said or didn’t say, did or forgot to do. Being right will never matter more to me than being yours. Take the space you need, and when you’re ready, tell me what hurt, I’ll listen properly, without getting defensive. Don’t behave harshly with me jaan, it breaks my heart',
          'We’re partners! We fight, we makeup, we also makeout hehehe  (Also, you’re still cute when you’re angry. Sorry. Not sorry.)',
        ],
      },
      {
        label: 'you doubt us',
        tint: 'blue',
        body: [	
          'Read this slowly: I chose you. I choose you. And I’ll keep choosing you.',
          'Not because it’s easy, because it’s you. We have our obstacles; every story worth telling does. Families, distance, timing, all the “not yet”s. But I’m not going anywhere.',
          'InShaAllah! I’m building a future, and in every single version of it, you’re in it. Rushad’s mother, remember? ;)',
        ],
      },
      {
        label: 'you’re proud of yourself',
        tint: 'gold',
        body: [
          'YES. I want to support you though everything you want to do and pray for your success.',
          'You work really hard Jaan! Being good is just about practice, practice and give your best! Celebrate your hard work properly, doesnt matter the results! Treat yourself, tell someone, write it down so you remember. You work so hard and never give yourself enough credit, so let me give it to you my jaan',
          'I am so, so proud of you. I believe in you, with just a bit of practice you can do anything! Just proud of how much you changed academically too just by trying in such a small time.',
        ],
      },
      {
        label: 'it’s your next birthday',
        tint: 'rose',
        body: [
          'Happy 24th, love. If you’re opening this a year from now, I hope we’re closer than we were when I made this — in distance, in plans, in everything.',
          'I hope it was a beautiful year. And I hope this time I get to say it to your face, holding a cake and giving you a kiss.',
          'If not yet, then soon. Either way: I love you one whole year more than I did today.',
        ],
      },
    ],
  },

  closing: {
    lines: [
      'I’m offline today, but I’m not away.',
      'Every word here is me holding your hand.',
      'Happy 23rd birthday, Anika.',
      'Until the day I can say it in person — every year, for the rest of our lives.',
    ],
    signature: '— Rumman',
    again: 'Read it all again',
    footer: 'made with all my love · 21.10.2026',
  },
};
