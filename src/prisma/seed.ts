import { Prisma, PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export const recipes: Prisma.RecipeCreateInput[] = [
  {
    title: "Sunset Saffron Risotto",
    description:
      "Creamy Arborio rice infused with fragrant saffron and a hint of citrus, served warm with parmesan and fresh herbs.",
  },
  {
    title: "Firecracker Chicken Bites",
    description:
      "Crispy chicken chunks tossed in a sweet and spicy chili glaze, garnished with sesame seeds and scallions.",
  },
  {
    title: "Ocean Breeze Tacos",
    description:
      "Soft tortillas filled with grilled mahi-mahi, tangy slaw, and a drizzle of zesty lime crema.",
  },
  {
    title: "Garden Harvest Flatbread",
    description:
      "A crispy flatbread topped with roasted seasonal vegetables, goat cheese, and a balsamic reduction.",
  },
  {
    title: "Savannah Peach Cobbler",
    description:
      "Juicy peaches baked beneath a golden, buttery biscuit crust, served hot with a scoop of vanilla ice cream.",
  },
  {
    title: "Midnight Truffle Pasta",
    description:
      "Black squid ink linguine tossed in a rich truffle cream sauce with wild mushrooms and shaved parmesan.",
  },
  {
    title: "Blazing Maple Ribs",
    description:
      "Fall-off-the-bone pork ribs glazed with smoky maple barbecue sauce and charred to perfection.",
  },
  {
    title: "Crimson Beet Hummus Bowl",
    description:
      "A vibrant beet and chickpea hummus served with crunchy pita chips, olives, and fresh cucumber.",
  },
  {
    title: "Alpine Melt Burger",
    description:
      "Juicy beef patty layered with caramelized onions, Gruyère cheese, and garlic aioli on a toasted brioche bun.",
  },
  {
    title: "Coconut Cloud Pudding",
    description:
      "Light and fluffy coconut milk pudding topped with toasted coconut flakes and a splash of passionfruit syrup.",
  },
  {
    title: "Spicy Mango Salsa",
    description:
      "A refreshing blend of ripe mango, red onion, cilantro, and jalapeño, perfect for dipping or topping grilled fish.",
  },
  {
    title: "Lavender Lemonade Spritzer",
    description:
      "A refreshing drink combining fresh lemonade with a hint of lavender syrup and sparkling water.",
  },
  {
    title: "Maple Pecan Granola",
    description:
      "Crunchy oats and pecans sweetened with maple syrup, perfect for breakfast or as a snack.",
  },
  {
    title: "Crispy Brussels Sprouts Salad",
    description:
      "Roasted Brussels sprouts tossed with crispy bacon, dried cranberries, and a tangy apple cider vinaigrette.",
  },
  {
    title: "Chocolate Lava Cake",
    description:
      "Decadent chocolate cake with a molten center, served warm with a scoop of vanilla ice cream.",
  },
];

async function main() {
  console.log("Start seeding...");

  try {
    // Clear existing recipes
    await prisma.recipe.deleteMany({});

    // Insert recipes in batches to avoid potential memory issues
    const batchSize = 5;
    for (let i = 0; i < recipes.length; i += batchSize) {
      const batch = recipes.slice(i, i + batchSize);
      await Promise.all(
        batch.map((recipe) =>
          prisma.recipe.create({
            data: recipe,
          }),
        ),
      );
      console.log(`Seeded recipes ${i + 1} to ${i + batch.length}`);
    }

    console.log(`Seeding finished. Added ${recipes.length} recipes.`);
  } catch (error) {
    console.error("Seeding error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
