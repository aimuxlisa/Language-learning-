import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { user } from "@/db/schema";
import { requireSession } from "@/lib/session";
import { BOARD_SIZE, LEAGUES, getLeagueBoard } from "@/lib/leagues";
import { Avatar } from "@/components/Avatar";

export const metadata = { title: "Рейтинг — 4 your learning" };

function timeLeft(to: Date, now: Date) {
  const ms = Math.max(0, to.getTime() - now.getTime());
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  return d > 0 ? `${d} д ${h} ч` : `${h} ч`;
}

export default async function LeaderboardPage() {
  const session = await requireSession();
  const now = new Date();
  const board = await getLeagueBoard(session.user.id, now);

  const top = await db
    .select({ id: user.id, name: user.name, username: user.username, image: user.image, xp: user.xp, streakCount: user.streakCount })
    .from(user)
    .orderBy(desc(user.xp))
    .limit(10);

  const me = await db.select().from(user).where(eq(user.id, session.user.id));
  const myName = me[0]?.username ? `@${me[0].username}` : me[0]?.name;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 fade-up flex flex-col gap-10">
      {/* Лига этой недели */}
      <section>
        <p className="mono-label mb-2">Рейтинг · лига</p>
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <span
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-semibold text-bg"
              style={{ background: board.league.color }}
            >
              {board.tier + 1}
            </span>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Лига «{board.league.name}»</h1>
              <p className="text-dim text-sm mt-1">
                Неделя заканчивается через {timeLeft(board.endsAt, now)} · ваш XP: {board.myXp}
              </p>
            </div>
          </div>
          <p className="text-dim text-sm">
            Топ-10 переходят в «{LEAGUES[Math.min(board.tier + 1, LEAGUES.length - 1)].name}»
            {board.memberCount >= 15 && <>, последние 5 — вниз</>}
          </p>
        </div>

        {board.rows.length === 0 ? (
          <p className="text-dim">В вашей лиге пока никого нет. Заходите на уроки!</p>
        ) : (
          <ol className="rounded-2xl border border-line card-solid divide-y divide-line overflow-hidden">
            {board.rows.map((row) => {
              const isMe = row.id === session.user.id;
              const shown = row.username ? `@${row.username}` : row.name;
              return (
                <li
                  key={row.id}
                  className={`flex items-center gap-4 px-5 py-3 ${isMe ? "bg-violet/10" : ""} ${
                    row.zone === "promote" ? "border-l-4 border-l-agreen" : row.zone === "demote" ? "border-l-4 border-l-ared" : "border-l-4 border-l-transparent"
                  }`}
                >
                  <span className="font-mono w-7 text-dim">{row.rank}</span>
                  <Avatar image={row.image} name={row.name} size={32} />
                  <span className="flex-1 min-w-0 truncate">
                    {shown}
                    {isMe && <span className="mono-label ml-2 text-violet">вы</span>}
                  </span>
                  <span className="font-mono font-semibold w-20 text-right">{row.xp} XP</span>
                </li>
              );
            })}
          </ol>
        )}
        <p className="text-faint text-xs mt-3">
          В лиге {board.memberCount} человек. Показаны первые {BOARD_SIZE}.
        </p>
      </section>

      {/* Общий топ (как было) */}
      <section>
        <p className="mono-label mb-2">Всего</p>
        <h2 className="text-2xl font-semibold tracking-tight mb-5">Топ-10 по опыту</h2>
        {top.length === 0 ? (
          <p className="text-dim">Пока никто не набрал опыт. Станьте первым!</p>
        ) : (
          <ol className="rounded-2xl border border-line card-solid divide-y divide-line overflow-hidden">
            {top.map((row, i) => {
              const me = row.id === session.user.id;
              const shown = row.username ? `@${row.username}` : row.name;
              return (
                <li key={row.id} className={`flex items-center gap-4 px-5 py-3 ${me ? "bg-violet/10" : ""}`}>
                  <span className="font-mono w-8 text-dim">{String(i + 1).padStart(2, "0")}</span>
                  <Avatar image={row.image} name={row.name} size={32} />
                  <span className="flex-1 min-w-0 truncate">
                    {shown}
                    {me && <span className="mono-label ml-2 text-violet">вы</span>}
                  </span>
                  <span className="font-mono text-sm text-dim">{row.streakCount} дн.</span>
                  <span className="font-mono font-semibold w-24 text-right">{row.xp} XP</span>
                </li>
              );
            })}
          </ol>
        )}
        {myName && <p className="text-faint text-xs mt-3">Ваш никнейм можно поменять в настройках.</p>}
      </section>
    </div>
  );
}
