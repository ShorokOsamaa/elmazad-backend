import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const usersData = [
  {
    name: "John",
    email: "john@fake.com",
    password: "somerandompassword",
    phone: "123456789",
    birthDate: new Date("1990-1-1"),
    gender: "male",
    country: "Egypt",
    imagePaths:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    name: "Emma",
    email: "emma@fake.com",
    password: "anotherrandompassword",
    phone: "234567891",
    birthDate: new Date("1998-8-16"),
    gender: "female",
    country: "Egypt",
    city: "Alexandria",
    imagePaths:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
  {
    name: "Nancy",
    email: "nancy@fake.com",
    password: "supersecurepassword",
    phone: "345678912",
    birthDate: new Date("1990-1-1"),
    gender: "female",
    country: "Egypt",
    city: "Cairo",
    imagePaths:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
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
  const items = await prisma.item.createMany({
    data: [
      {
        name: "2019 Tesla Model 3",
        category: "Cars",
        description:
          "A well-maintained, low-mileage electric car with autopilot features.",
        startingPrice: 35000.0,
        reservedPrice: 40000.0,
        buyNowPrice: 50000.0,
        startDate: new Date("2024-06-01T08:00:00Z"),
        endDate: new Date("2024-06-15T08:00:00Z"),
        status: "ongoing",
        imagePaths:
          "https://i.ibb.co/QmJdnJ5/tesla-model3-front.jpg https://i.ibb.co/94C6NcN/tesla-model3-back.jpg",
        sellerId: createdUsersIds[0],
      },
      {
        name: "Samsung Galaxy S22",
        category: "Electronics",
        description: "Brand new Samsung Galaxy S22 with 128GB storage.",
        startingPrice: 700.0,
        reservedPrice: 750,
        buyNowPrice: 1000.0,
        startDate: new Date("2024-06-05T10:00:00Z"),
        endDate: new Date("2024-06-09T10:00:00Z"),
        status: "ended",
        imagePaths:
          "https://i.ibb.co/RBtf33r/galaxy-s22-front.jpg https://i.ibb.co/njpZ06L/galaxy-s22-back.png",
        sellerId: createdUsersIds[1],
      },
      {
        name: 'Apple MacBook Pro 16" 2021',
        category: "Electronics",
        description:
          "High-performance laptop with M1 Pro chip, 16GB RAM, and 1TB SSD.",
        startingPrice: 2000.0,
        reservedPrice: 2100.0,
        buyNowPrice: 2600.0,
        startDate: new Date("2024-06-03T09:00:00Z"),
        endDate: new Date("2024-06-17T09:00:00Z"),
        status: "ongoing",
        imagePaths:
          "https://i.ibb.co/mSy4KzP/macbook-pro-front.jpg https://i.ibb.co/LdDhJTg/macbook-pro-back.jpg",
        sellerId: createdUsersIds[0],
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
      placedAt: new Date(),
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
