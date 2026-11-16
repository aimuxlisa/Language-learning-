import { db } from "./index";
import { cards as cardsTable, exercises, levels } from "./schema";
import { allLevels, cards } from "../../content";

async function seed() {
  // Перезаливаем контент целиком (идемпотентно)
  await db.delete(exercises);
  await db.delete(levels);
  await db.delete(cardsTable);

  await db.insert(cardsTable).values(cards);

  for (const lvl of allLevels) {
    await db.insert(levels).values({
      id: lvl.id,
      track: lvl.track,
      orderIndex: lvl.orderIndex,
      title: lvl.title,
      subtitle: lvl.subtitle,
      difficulty: lvl.difficulty,
      theoryMd: lvl.theoryMd,
      cardId: lvl.cardId ?? null,
      language: lvl.language ?? "en",
    });
    await db.insert(exercises).values(
      lvl.exercises.map((e, i) => ({
        id: `${lvl.id}-e${i + 1}`,
        levelId: lvl.id,
        orderIndex: i + 1,
        type: e.type,
        skill: e.skill,
        prompt: e.prompt,
        dataJson: JSON.stringify(e.data),
        answerJson: JSON.stringify(e.answer),
      })),
    );
  }

  const nLevels = allLevels.length;
  const nEx = allLevels.reduce((s, l) => s + l.exercises.length, 0);
  console.log(`Seeded: ${nLevels} levels, ${nEx} exercises, ${cards.length} cards`);
}

seed().then(() => process.exit(0));
