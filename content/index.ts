import { levelsA } from "./levels-a";
import { levelsB } from "./levels-b";
import { levelsC } from "./levels-c";
import { levelsD } from "./levels-d";
import { examLevels } from "./exams";

export { cards } from "./cards";
import { starterLevels } from "./starter";

export const allLevels = [...levelsA, ...levelsB, ...levelsC, ...levelsD, ...examLevels, ...starterLevels];
