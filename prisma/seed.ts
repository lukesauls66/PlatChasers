import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function seedUsers() {
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: "luke.sauls279@gmail.com" },
      update: {},
      create: {
        firstName: "Luke",
        lastName: "Sauls",
        image: null,
        email: "luke.sauls279@gmail.com",
        username: "HallowedSoul",
        hashedPassword:
          "$2b$12$ooegb9cDAKSFosIPjiL9MeOYAXmhc2e0yvncGijVngpFr6LmP7UJi",
        underReview: false,
        isAdmin: true,
      },
    }),
    prisma.user.upsert({
      where: { email: "demo-good@example.com" },
      update: {},
      create: {
        firstName: "Demo",
        lastName: "Good",
        image: null,
        email: "demo-good@example.com",
        username: "demo-good",
        hashedPassword:
          "$2b$12$ydLI.LG8rl2kAU5gJBc46OQZlAdQbAGf0lUNLqDS9K8JfigC/3HNe",
        underReview: false,
        isAdmin: false,
      },
    }),
    prisma.user.upsert({
      where: { email: "demo-bad@example.com" },
      update: {},
      create: {
        firstName: "Demo",
        lastName: "Bad",
        image: null,
        email: "demo-bad@example.com",
        username: "demo-bad",
        hashedPassword:
          "$2b$12$2S0KtrS1c3YMY4.44HrytuQa45dJi8EwJv5WecJ9LzKroONfsHd56",
        underReview: true,
        isAdmin: false,
      },
    }),
    prisma.user.upsert({
      where: { email: "demo-admin@example.com" },
      update: {},
      create: {
        firstName: "Demo",
        lastName: "Admin",
        image: null,
        email: "demo-admin@example.com",
        username: "demo-admin",
        hashedPassword:
          "$2b$12$kzUumz8EKE4hFuwkcu9UzuL9Oq18TTaheDCGXW/PO1IBrQYFQR4X6",
        underReview: false,
        isAdmin: true,
      },
    }),
    prisma.user.upsert({
      where: { email: "john-smith@example.com" },
      update: {},
      create: {
        firstName: "John",
        lastName: "Smith",
        image: null,
        email: "john-smith@example.com",
        username: "john-smith",
        hashedPassword:
          "$2b$12$LM9ZitYlg8NcyCyGFJn.juHj/TwhyCCufuYjfgHlliRBHQPYKYZmi",
        underReview: false,
        isAdmin: false,
      },
    }),
    prisma.user.upsert({
      where: { email: "jane-doe@example.com" },
      update: {},
      create: {
        firstName: "Jane",
        lastName: "Doe",
        image: null,
        email: "jane-doe@example.com",
        username: "jane-doe",
        hashedPassword:
          "$2b$12$rLCY.h1Bru6svGKX4fitHegCrD96TqYQ5Or0mmHgGcHbxdTgwrjEW",
        underReview: false,
        isAdmin: false,
      },
    }),
    prisma.user.upsert({
      where: { email: "scott-peterson@example.com" },
      update: {},
      create: {
        firstName: "Scott",
        lastName: "Peterson",
        image: null,
        email: "scott-peterson@example.com",
        username: "scott-peterson",
        hashedPassword:
          "$2b$12$kCz0kCbwVd9oN6fV5urd0.E2Xi8sysR3sefsHzJJC6Hm/flkA9KNG",
        underReview: false,
        isAdmin: false,
      },
    }),
    prisma.user.upsert({
      where: { email: "hailey-anderson@example.com" },
      update: {},
      create: {
        firstName: "Hailey",
        lastName: "Anderson",
        image: null,
        email: "hailey-anderson@example.com",
        username: "hailey-anderson",
        hashedPassword:
          "$2b$12$vyJRQCFTWXcYv681SF9iS.LvrafWSWvmotsDz21oTSN/EuLxP6XVi",
        underReview: false,
        isAdmin: false,
      },
    }),
  ]);

  return users;
}

async function seedGames(users: any[]) {
  const games = await Promise.all([
    prisma.game.upsert({
      where: { title: "Elden Ring" },
      update: {
        description:
          "Elden Ring is an expansive action RPG set in a vast open world, where players explore dark landscapes, battle formidable foes, and uncover a deep, lore-rich story. With its challenging combat and stunning visuals, it offers a unique blend of exploration, strategy, and fantasy in true FromSoftware fashion.",
      },
      create: {
        title: "Elden Ring",
        description:
          "Elden Ring is a critically acclaimed action role-playing game developed by FromSoftware and published by Bandai Namco Entertainment. Set in the sprawling and visually breathtaking open world of the Lands Between, the game invites players to explore a richly detailed fantasy realm shaped by the collaborative storytelling of Hidetaka Miyazaki and George R.R. Martin.",
        image: "https://i.ibb.co/mTXXGjp/elden-pic-preview.jpg",
        gamePosts: {
          create: [
            {
              body: "I'm stuck in Nokron, the Eternal City! Every time I think I'm close to the next area, more enemies appear. Anyone got tips on surviving the area?",
              userId: users[4].id,
            },
            {
              body: "I recommend picking off the enemies one at a time to preserve your healing flasks, since a lot of the enemies there hurt too much to fight at once",
              userId: users[5].id,
            },
            {
              body: "I made it out, finally!! Thank you so much, i was definitely aggroing too many at once.",
              userId: users[4].id,
            },
          ],
        },
        achievements: {
          create: [
            {
              title: "Elden Ring",
              description: "Obtained all achievements",
              image: "https://i.ibb.co/5nmHdJR/elden-ring.webp",
            },
            {
              title: "Elden Lord",
              description: "Achieved the 'Elden Lord' ending",
              image: "https://i.ibb.co/WWV45Z0/elden-lord.webp",
              achievementPosts: {
                create: [
                  {
                    body: "I'm almost done, i just need to beat: Maliketh, Hoarah Loux, and then Radagon/Elden Beast. I should grind a about 15 more levels so I can use the giant-crusher, get some more health and try to get some more endurance so I can wear heavier armor.",
                    private: true,
                    userId: users[7].id,
                  },
                ],
              },
            },
            {
              title: "Age of the Stars",
              description: "Achieved the 'Age of the Stars' ending",
              image: "https://i.ibb.co/7Xrwg5c/age-of-stars.webp",
            },
            {
              title: "Lord of Frenzied Flame",
              description: "Achieved the 'Lord of Frenzied Flame' ending",
              image: "https://i.ibb.co/QmGXyTY/lord-of-frenzied-flame.webp",
            },
            {
              title: "Shardbearer Godrick",
              description: "Defeated Shardbearer Godrick",
              image: "https://i.ibb.co/G9h5qKz/shardbearer-godrick.jpg",
            },
            {
              title: "Shardbearer Radahn",
              description: "Defeated Shardbearer Radahn",
              image: "https://i.ibb.co/R29n2p8/shardbearer-radahn.webp",
            },
            {
              title: "Shardbearer Morgott",
              description: "Defeated Shardbearer Morgott",
              image: "https://i.ibb.co/4MpnDdH/shardbearer-morgott.jpg",
            },
            {
              title: "Shardbearer Rykard",
              description: "Defeated Shardbearer Rykard",
              image: "https://i.ibb.co/85TjCf7/shardbearer-rykard.jpg",
            },
            {
              title: "Shardbearer Malenia",
              description: "Defeated Shardbearer Malenia",
              image: "https://i.ibb.co/1JZs88J/shardbearer-malenia.webp",
            },
            {
              title: "Shardbearer Mohg",
              description: "Defeated Shardbearer Mohg",
              image: "https://i.ibb.co/Snf5QCL/shardbearer-mohg.jpg",
            },
            {
              title: "Maliketh the Black Blade",
              description: "Defeated Maliketh the Black Blade",
              image: "https://i.ibb.co/87BJC8h/maliketh-the-black-blade.webp",
            },
            {
              title: "Hoarah Loux the Warrior",
              description: "Defeated Hoarah Loux the Warrior",
              image: "https://i.ibb.co/j8kWZj6/hoarah-loux.webp",
            },
            {
              title: "Dragonlord Placidusax",
              description: "Defeated Dragonlord Placidusax",
              image: "https://i.ibb.co/17w6Hf2/placidusax.jpg",
            },
            {
              title: "God-Slaying Armament",
              description: "Upgraded any armament to its highest stage",
              image: "https://i.ibb.co/k32F2J9/god-slayer-armament.webp",
            },
            {
              title: "Legendary Armaments",
              description: "Acquired all legendary armaments",
              image: "https://i.ibb.co/KhkfzS4/legendary-armaments.webp",
            },
            {
              title: "Legendary Ashen Remains",
              description: "Acquired all legendary ashen remains",
              image: "https://i.ibb.co/wSHD9V0/legendary-ashen-remains.webp",
            },
            {
              title: "Legendary Sorceries and Incantations",
              description: "Acquired all legendary sorceries and incantations",
              image: "https://i.ibb.co/TYg13NT/legendary-sorc-and-incans.webp",
            },
            {
              title: "Legendary Talismans",
              description: "Acquired all legendary talismans",
              image: "https://i.ibb.co/m8BG9Ds/legendary-talisman.webp",
            },
            {
              title: "Rennala, Queen of the Full Moon",
              description: "Defeated Rennala, Queen of the Full Moon",
              image: "https://i.ibb.co/g74bRD7/rennala.webp",
            },
            {
              title: "Lichdragon Fortissax",
              description: "Defeated Lichdragon Fortissax",
              image: "https://i.ibb.co/3YPvw77/fortissax.webp",
            },
            {
              title: "Godskin Duo",
              description: "Defeated Godskin Duo",
              image: "https://i.ibb.co/6YhCB9p/godskin-duo.jpg",
            },
            {
              title: "Fire Giant",
              description: "Defeated Fire Giant",
              image: "https://i.ibb.co/dK90ykT/fire-giant.webp",
            },
            {
              title: "Dragonkin Soldier of Nokstella",
              description: "Defeated Dragonkin Soldier of Nokstella",
              image: "https://i.ibb.co/6YvJr3t/dragonkin-nokstella.webp",
            },
            {
              title: "Regal Ancestor Spirit",
              description: "Defeated Regal Ancestor Spirit",
              image: "https://i.ibb.co/nBnFB2q/regal-spirit.webp",
            },
            {
              title: "Valiant Gargoyle",
              description: "Defeated Valiant Gargoyle",
              image: "https://i.ibb.co/pdR76sR/valiant-gargoyle.webp",
            },
            {
              title: "Margit, the Fell Omen",
              description: "Defeated Margit, the Fell Omen",
              image: "https://i.ibb.co/18jLd2w/margit-fell-omen.webp",
            },
            {
              title: "Red Wolf of Radagon",
              description: "Defeated the Red Wolf of Radagon",
              image: "https://i.ibb.co/5MxhfqH/red-wolf.webp",
            },
            {
              title: "Godskin Noble",
              description: "Defeated Godskin Noble",
              image: "https://i.ibb.co/tMZzsJc/godskin-noble.webp",
            },
            {
              title: "Magma Wyrm Makar",
              description: "Defeated Magma Wyrm Makar",
              image: "https://i.ibb.co/BCgZ7Dk/magma-wyrm-makar.webp",
            },
            {
              title: "Godfrey the First Lord",
              description: "Defeated Godfrey the First Lord",
              image: "https://i.ibb.co/fMtzkLq/godfrey-the-first-lord.webp",
            },
            {
              title: "Mohg, the Omen",
              description: "Defeated Mohg, the Omen",
              image: "https://i.ibb.co/7WdCDRX/mohg-the-omen.webp",
            },
            {
              title: "Mimic Tear",
              description: "Defeated Mimic Tear",
              image: "https://i.ibb.co/HgBh8RN/mimic-tear.webp",
            },
            {
              title: "Loretta, Knight of the Haligtree",
              description: "Defeated Loretta, Knight of the Haligtree",
              image: "https://i.ibb.co/1LQT6dK/loretta-haligtree.webp",
            },
            {
              title: "Astel, Naturalborn of the Void",
              description: "Defeated Astel, Naturalborn of the Void",
              image: "https://i.ibb.co/B2kTgyj/astel-of-the-void.webp",
            },
            {
              title: "Leonine Misbegotten",
              description: "Defeated the Leonine Misbegotten",
              image: "https://i.ibb.co/1dQh7s1/leonine-misbegotten.webp",
            },
            {
              title: "Royal Knight Loretta",
              description: "Defeated Royal Knight Loretta",
              image: "https://i.ibb.co/25ws7fB/royal-loretta.webp",
            },
            {
              title: "Elemer of the Briar",
              description: "Defeated Elemer of the Briar",
              image: "https://i.ibb.co/4gM4HWz/elemer-the-briar.webp",
            },
            {
              title: "Ancestor Spirit",
              description: "Defeated Ancestor Spirit",
              image: "https://i.ibb.co/LPQgsy0/ancestor-spirit.webp",
            },
            {
              title: "Commander Niall",
              description: "Defeated Commander Niall",
              image: "https://i.ibb.co/71cb5Jp/commander-niall.webp",
            },
            {
              title: "Roundtable Hold",
              description: "Arrived at Roundtable Hold",
              image: "https://i.ibb.co/tZ95Ycv/roundtable-hold.webp",
            },
            {
              title: "Great Rune",
              description: "Restored the power of a Great Rune",
              image: "https://i.ibb.co/Bw2WG4Z/great-rune.webp",
            },
            {
              title: "Erdtree Aflame",
              description: "Used kindling to set the Erdtree aflame",
              image: "https://i.ibb.co/dmZ79kN/erdtree-aflame.webp",
            },
          ],
        },
      },
    }),
    prisma.game.upsert({
      where: { title: "Dark Souls" },
      update: {},
      create: {
        title: "Dark Souls",
        description:
          "Dark Souls is a critically acclaimed action role-playing game known for its challenging combat, intricate world design, and deep lore. Set in a dark, atmospheric fantasy universe, players must battle relentless enemies and uncover hidden secrets while mastering the balance between risk and reward.",
        image: "https://i.ibb.co/5rQdhNK/dark-souls-preview.webp",
        achievements: {
          create: [
            {
              title: "The Dark Soul",
              description: "All achievements completed. Congratulations!",
              image: "https://i.ibb.co/YkHBpL0/the-dark-soul.webp",
            },
          ],
        },
      },
    }),
    prisma.game.upsert({
      where: { title: "Hollow Knight: Voidheart Edition" },
      update: {},
      create: {
        title: "Hollow Knight: Voidheart Edition",
        description:
          "Hollow Knight is a captivating action-adventure game set in the mysterious, hand-drawn world of Hallownest. Players explore sprawling, interconnected environments, face challenging enemies, and unravel a haunting story of decay, resilience, and discovery.",
        image: "https://i.ibb.co/ykGft7Y/hollow-knight.webp",
        achievements: {
          create: [
            {
              title: "Charmed",
              description: "Acquire your first Charm",
              image: "https://i.ibb.co/VmvcsMd/hk-charmed.jpg",
            },
          ],
        },
      },
    }),
    prisma.game.upsert({
      where: { title: "Disney Dreamlight Valley" },
      update: {},
      create: {
        title: "Disney Dreamlight Valley",
        description:
          "Disney Dreamlight Valley is a life-simulation adventure game where players restore a magical world alongside beloved Disney and Pixar characters. With activities like farming, fishing, and questing, it combines cozy gameplay with enchanting storytelling in a vibrant, ever-evolving universe.",
        image: "https://i.ibb.co/QkfHHjN/dreamlight-valley-preview.jpg",
        achievements: {
          create: [
            {
              title: "Angler",
              description: "Catch 1,800 fish",
              image: "https://i.ibb.co/4SfPD5G/dv-angler.webp",
            },
          ],
        },
      },
    }),
    prisma.game.upsert({
      where: { title: "Cult of the Lamb" },
      update: {},
      create: {
        title: "Cult of the Lamb",
        description:
          "Cult of the Lamb is a darkly charming roguelike where players build and lead their own cult in a whimsical, sinister world. Combining dungeon crawling with base-building mechanics, it offers a unique blend of action, strategy, and dark humor.",
        image: "https://i.ibb.co/cLz5hd4/cult-lamb-preview.jpg",
        achievements: {
          create: [
            {
              title: "First Follower",
              description: "The first devotee to the Cult of the Lamb",
              image: "https://i.ibb.co/gP3nxPL/cult-lamb-first-follower.webp",
            },
          ],
        },
      },
    }),
    prisma.game.upsert({
      where: { title: "Minecraft" },
      update: {},
      create: {
        title: "Minecraft",
        description:
          "Minecraft is a sandbox game that lets players unleash their creativity by building, exploring, and surviving in infinite, blocky worlds. With modes ranging from peaceful creation to intense survival, it offers endless adventures and a thriving community for all ages.",
        image: "https://i.ibb.co/GHw3HLb/minecraft-preview.jpg",
        achievements: {
          create: [
            {
              title: "Acquire Hardware",
              description: "Smelt an iron ingot",
              image: "https://i.ibb.co/3yDDyjs/minecraft-acquire-hardware.webp",
            },
          ],
        },
      },
    }),
    prisma.game.upsert({
      where: { title: "Marvel Rivals" },
      update: {},
      create: {
        title: "Marvel Rivals",
        description:
          "Marvel Rivals is a free-to-play, team-based PvP shooter that lets players assemble squads of iconic Marvel heroes and villains. Developed by NetEase Games, it features dynamic battlefields and unique team-up skills, offering an engaging experience for fans of the Marvel universe.",
        image: "https://i.ibb.co/DQ0p4Bz/marvel-rivals.jpg",
        achievements: {
          create: [
            {
              title: "Rising Star",
              description: "Reach level 20",
              image: "https://i.ibb.co/SBZtSY7/marvel-rivals-rising-star.webp",
            },
          ],
        },
      },
    }),
    prisma.game.upsert({
      where: { title: "Stardew Valley" },
      update: {},
      create: {
        title: "Stardew Valley",
        description:
          "Stardew Valley is a charming farming simulation game where players escape to the countryside to build their dream farm, forge relationships, and uncover the secrets of a quaint village. With its relaxing gameplay, pixel-art style, and endless activities, it offers a heartwarming blend of creativity and adventure.",
        image: "https://i.ibb.co/ZVLydfQ/stardew-valley-preview.webp",
        achievements: {
          create: [
            {
              title: "Greenhorn",
              description: "Earn 15,000g",
              image: "https://i.ibb.co/ypDxjY2/stardew-greenhorn.webp",
            },
          ],
        },
      },
    }),
  ]);

  return games;
}

async function seedUserFavoriteGames(users: any[], games: any[]) {
  const userFavoriteGames = [
    {
      userId: users[7].id,
      gameId: games[0].id,
    },
    {
      userId: users[0].id,
      gameId: games[0].id,
    },
    {
      userId: users[0].id,
      gameId: games[1].id,
    },
    {
      userId: users[0].id,
      gameId: games[2].id,
    },
    {
      userId: users[0].id,
      gameId: games[4].id,
    },
    {
      userId: users[0].id,
      gameId: games[6].id,
    },
  ];

  await prisma.userFavoriteGame.createMany({
    data: userFavoriteGames,
  });
}

async function main() {
  await prisma.achievementPost.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.gamePost.deleteMany();
  await prisma.game.deleteMany();
  await prisma.userFavoriteGame.deleteMany();
  await prisma.user.deleteMany();

  const users = await seedUsers();
  const games = await seedGames(users);

  await seedUserFavoriteGames(users, games);

  return { users, games };
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
