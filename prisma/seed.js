import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const dummyPassword = await bcrypt.hash("password", 10);

const usersData = [
  {
    name: "John",
    email: "john@fake.com",
    password: dummyPassword,
    phone: "123456789",
    birthDate: new Date("1990-1-1"),
    gender: "male",
    country: "Egypt",
    imagePaths: "https://i.ibb.co/WkmL46Q/profile.png",
  },
  {
    name: "Emma",
    email: "emma@fake.com",
    password: dummyPassword,
    phone: "234567891",
    birthDate: new Date("1998-8-16"),
    gender: "female",
    country: "Egypt",
    city: "Alexandria",
  },
  {
    name: "Nancy",
    email: "nancy@fake.com",
    password: dummyPassword,
    phone: "345678912",
    birthDate: new Date("1990-1-1"),
    gender: "female",
    country: "Egypt",
    city: "Cairo",
  },
  {
    name: "Nour",
    email: "nour@fake.com",
    password: dummyPassword,
    phone: "456789123",
    birthDate: new Date("2005-2-16"),
    gender: "female",
    country: "Egypt",
    city: "Tanta",
  },
  {
    name: "Ahemd",
    email: "ahmed@fake.com",
    password: dummyPassword,
    phone: "567891234",
    birthDate: new Date("1999-10-1"),
    gender: "male",
    country: "Egypt",
    city: "Mansoura",
  },
];

async function createBidAndUpdateWinner(bidData) {
  return await prisma.$transaction(async (prisma) => {
    // Create the new bid
    const newBid = await prisma.bid.create({
      data: bidData,
    });

    // Find the current highest bid for the item
    const highestBid = await prisma.bid.findFirst({
      where: { itemId: bidData.itemId },
      orderBy: { amount: "desc" },
    });

    // If the new bid is the highest, update the item's winningBidId and winnerId
    if (highestBid && newBid.amount >= highestBid.amount) {
      await prisma.item.update({
        where: { id: bidData.itemId },
        data: {
          winningBidId: newBid.id,
          winnerId: newBid.userId,
        },
      });
    }

    return newBid;
  });
}

async function main() {
  await prisma.bid.deleteMany();
  await prisma.item.deleteMany();
  await prisma.user.deleteMany();
  await prisma.notification.deleteMany();

  console.log("\n\n\nOUTPUT");

  // Users
  console.log("USERS");

  const users = await prisma.user.createMany({
    data: usersData,
  });
  console.log(users);

  const createdUsers = await prisma.user.findMany();

  const createdUsersIds = createdUsers.map((user) => user.id);
  console.log("Created Users:", createdUsersIds);

  // Items
  console.log("ITEMS");

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  const tenDaysAgo = new Date();
  tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
  const monthAgo = new Date();
  monthAgo.setDate(monthAgo.getDate() - 30);
  const sevenDaysLater = new Date();
  sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
  const threeDaysLater = new Date();
  threeDaysLater.setDate(threeDaysLater.getDate() + 3);
  const elevenDaysLater = new Date();
  elevenDaysLater.setDate(elevenDaysLater.getDate() + 11);
  const seventeenDaysLater = new Date();
  seventeenDaysLater.setDate(seventeenDaysLater.getDate() + 17);
  const oneDayLater = new Date();
  oneDayLater.setDate(oneDayLater.getDate() + 1);

  const items = await prisma.item.createMany({
    data: [
      {
        name: "2019 Tesla Model 3",
        category: "cars",
        description:
          "A well-maintained, low-mileage electric car with autopilot features.",
        startingPrice: 35000.0,
        reservedPrice: 40000.0,
        buyNowPrice: 50000.0,
        startDate: twoDaysAgo,
        endDate: sevenDaysLater,
        status: "ongoing",
        imagePaths:
          "https://i.ibb.co/QmJdnJ5/tesla-model3-front.jpg https://i.ibb.co/94C6NcN/tesla-model3-back.jpg",
        sellerId: createdUsersIds[0],
      },
      {
        name: "Samsung Galaxy S22",
        category: "electronics",
        description: "Brand new Samsung Galaxy S22 with 128GB storage.",
        startingPrice: 700.0,
        reservedPrice: 750,
        buyNowPrice: 1000.0,
        startDate: monthAgo,
        endDate: twoDaysAgo,
        status: "ended",
        imagePaths:
          "https://i.ibb.co/RBtf33r/galaxy-s22-front.jpg https://i.ibb.co/njpZ06L/galaxy-s22-back.png",
        sellerId: createdUsersIds[1],
      },
      {
        name: 'Apple MacBook Pro 16" 2021',
        category: "electronics",
        description:
          "High-performance laptop with M1 Pro chip, 16GB RAM, and 1TB SSD.",
        startingPrice: 2000.0,
        reservedPrice: 2100.0,
        buyNowPrice: 2600.0,
        startDate: sevenDaysAgo,
        endDate: threeDaysLater,
        status: "ongoing",
        imagePaths:
          "https://i.ibb.co/mSy4KzP/macbook-pro-front.jpg https://i.ibb.co/LdDhJTg/macbook-pro-back.jpg",
        sellerId: createdUsersIds[0],
      },
      {
        name: "2018 BMW 3 Series",
        category: "cars",
        description:
          "A luxury sedan with a powerful engine and premium features.",
        startingPrice: 25000.0,
        reservedPrice: 28000.0,
        buyNowPrice: 30000.0,
        startDate: twoDaysAgo,
        endDate: elevenDaysLater,
        status: "ongoing",
        imagePaths:
          "https://i.ibb.co/Pc8kgJT/bmw.jpg https://i.ibb.co/qpbng5z/BMW-3.jpg",
        sellerId: createdUsersIds[3],
      },
      {
        name: "Sony PlayStation 5",
        category: "electronics",
        description:
          "Next-gen gaming console with 825GB SSD and ultra-high-speed SSD.",
        startingPrice: 500.0,
        reservedPrice: 600.0,
        buyNowPrice: 700.0,
        startDate: new Date(),
        endDate: seventeenDaysLater,
        status: "ongoing",
        imagePaths:
          "https://i.ibb.co/8sVrMZQ/sony.jpg https://i.ibb.co/PZWgSZj/sony2.jpg",
        sellerId: createdUsersIds[3],
      },
      {
        name: "2020 Audi A4",
        category: "cars",
        description:
          "Compact executive car with advanced tech and a comfortable interior.",
        startingPrice: 30000.0,
        reservedPrice: 33000.0,
        buyNowPrice: 35000.0,
        startDate: twoDaysAgo,
        endDate: sevenDaysLater,
        status: "ongoing",
        imagePaths:
          "https://i.ibb.co/yV58f5h/a4.jpg https://i.ibb.co/K523DHp/a4.jpg",
        sellerId: createdUsersIds[2],
      },
      {
        name: "Microsoft Surface Pro 8",
        category: "electronics",
        description:
          "2-in-1 laptop with a 13-inch touchscreen, Intel i7, 16GB RAM, and 512GB SSD.",
        startingPrice: 1200.0,
        reservedPrice: 1400.0,
        buyNowPrice: 1500.0,
        startDate: tenDaysAgo,
        endDate: oneDayLater,
        status: "ongoing",
        imagePaths:
          "https://i.ibb.co/thDn3dS/micro.jpg https://i.ibb.co/ftYPXzK/micro.jpg",
        sellerId: createdUsersIds[2],
      },
    ],
  });
  console.log(items);
  const createdItemsIds = (await prisma.item.findMany()).map((item) => item.id);
  console.log(createdItemsIds);

  // Bid
  const bidData = [
    {
      itemId: createdItemsIds[0],
      userId: createdUsersIds[1],
      amount: 36000.0,
      placedAt: new Date(),
    },
    {
      itemId: createdItemsIds[1],
      userId: createdUsersIds[2],
      amount: 750.0,
      placedAt: new Date("2024-06-13T09:00:00Z"),
    },
    {
      itemId: createdItemsIds[2],
      userId: createdUsersIds[2],
      amount: 2100.0,
      placedAt: new Date(),
    },
    {
      itemId: createdItemsIds[2],
      userId: createdUsersIds[1],
      amount: 2200.0,
      placedAt: new Date(),
    },
    {
      itemId: createdItemsIds[0],
      userId: createdUsersIds[3],
      amount: 40000.0,
      placedAt: new Date(),
    },
    {
      itemId: createdItemsIds[2],
      userId: createdUsersIds[3],
      amount: 2300.0,
      placedAt: new Date(),
    },
    {
      itemId: createdItemsIds[6],
      userId: createdUsersIds[3],
      amount: 1400.0,
      placedAt: new Date(),
    },
  ];

  console.log("BIDS");
  for (const bid of bidData) {
    const createdBid = await createBidAndUpdateWinner(bid);
    console.log("Created Bid: ", createdBid.id);
  }
}

main()
  .catch((e) => {
    console.error(e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
